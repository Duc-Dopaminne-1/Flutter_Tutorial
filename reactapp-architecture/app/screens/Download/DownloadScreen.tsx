import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { NavigationInjectedProps, NavigationScreenProp } from 'react-navigation'
import { sendDataToDownloadScreen } from '@/services/global'
import { findIndex } from 'lodash'
import { Subscription } from 'rxjs'
import { downloadTeamStore } from '@/stores/downloadTeamStore'
import LinearGradient from 'react-native-linear-gradient'
import Slider from 'react-native-slider'
import I18n from '@/i18n'
import { DownloadAlert } from '@/screens/Download/Components/DownloadAlert'
import { clone } from 'ramda'

// init state
const initialState = {
  numberHaveFinished: 0,
  numberTotal: 0,
  displayAlert: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  DefaultProps &
  NavigationInjectedProps<{
    teamId: string
  }> &
  AppContextState

export type State = Partial<{
  numberHaveFinished: number
  numberTotal: number
  displayAlert: boolean
}> &
  Readonly<typeof initialState>

const data = [
  { name: 'Team', isFinish: false },
  { name: 'Product', isFinish: false },
  { name: 'ProductVote', isFinish: false },
  { name: 'TeamUser', isFinish: false },
  { name: 'Invitation', isFinish: false },
  { name: 'Task', isFinish: false },
  { name: 'Sample', isFinish: false },
  { name: 'ExtendedField', isFinish: false },
  { name: 'ExtendedFieldDefinition', isFinish: false },
  { name: 'Supplier', isFinish: false },
  { name: 'Contact', isFinish: false },
  { name: 'Category', isFinish: false },
  { name: 'Comment', isFinish: false },
  { name: 'Event', isFinish: false },
  { name: 'Tag', isFinish: false },
  { name: 'Project', isFinish: false },
  { name: 'ProductStatus', isFinish: false },
  { name: 'SampleStatus', isFinish: false },
  { name: 'SupplierStatus', isFinish: false },
  { name: 'Harbour', isFinish: false },
  { name: 'Incoterm', isFinish: false },
]

@withContext(AppContext.Consumer)
export class DownloadScreen extends React.PureComponent<Props, State> {
  subscription: Subscription
  timer: any
  listDataNeedToDownload = []

  readonly state: State = initialState

  constructor(props) {
    super(props)

    this.listDataNeedToDownload = clone(data)
  }

  componentDidMount() {
    this.initData()
    this.listeningData()
  }

  navigationData = () => {
    const { navigation } = this.props
    const teamId = navigation.getParam('teamId', '')

    return {
      teamId,
    }
  }

  startSyncTeam = () => {
    const { selectTeam } = this.props
    const { teamId } = this.navigationData()

    selectTeam(teamId)

    /**
     * Set time out for display alert if wait longer that 10 sec
     */
    this.timer = setTimeout(() => {
      this.setState({
        displayAlert: true,
      })
    }, 10000)
  }

  initData = () => {
    const listLength = this.listDataNeedToDownload.length

    /**
     * Set value for harbour
     */
    this.listDataNeedToDownload[listLength - 2].isFinish =
      downloadTeamStore.isDownloadHarbour

    /**
     * Set value for incoterm
     */
    this.listDataNeedToDownload[listLength - 1].isFinish =
      downloadTeamStore.isDownloadIncoterm
  }

  listeningData = () => {
    this.subscription = sendDataToDownloadScreen.subscribe(data => {
      const { downloadClassName, isFinish } = data

      const index = findIndex(
        this.listDataNeedToDownload,
        item => item.name.toLowerCase() === downloadClassName.toLowerCase()
      )

      if (index !== -1 && !this.listDataNeedToDownload[index].isFinish) {
        this.listDataNeedToDownload[index].isFinish = isFinish
      }

      /**
       * Because harbour and incoterm is only download one time. So we'll
       * save check value it to local store
       * When load another team. We'll get the check value and set it to the
       * array
       */
      if (
        downloadClassName.toLowerCase() === 'habour' ||
        downloadClassName.toLowerCase() === 'incoterm'
      ) {
        downloadTeamStore.saveHabourIncoterm(
          downloadClassName.toLowerCase() as 'habour' | 'incoterm',
          isFinish
        )
      }

      const numberHaveFinished = this.calculatePercentFinish(
        this.listDataNeedToDownload
      )
      const numberTotal = this.listDataNeedToDownload.length

      this.setState({
        numberHaveFinished,
        numberTotal,
      })

      if (numberHaveFinished === numberTotal) {
        /**
         * Add time out for smooth animation
         */
        setTimeout(() => {
          downloadTeamStore.saveTeam(this.navigationData().teamId)
          this.goToScreen('HomeScreen')
        }, 300)
      }
    })

    /**
     * after finish init listen function. Start download data
     */
    this.startSyncTeam()
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe()
    clearTimeout(this.timer)
  }

  calculatePercentFinish = listData => {
    const listHasFinished = listData.filter(item => item.isFinish)

    return listHasFinished.length
  }

  goToScreen = (routeName: string, params: any = {}) => {
    this.props.navigation.navigate(routeName, params)
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  renderTitle = () => {
    return (
      <>
        <Text style={styles.title}>{I18n.t('welcome')}</Text>

        <Text style={styles.description}>
          {I18n.t('weAreLoadingYourTeamData')}
        </Text>
      </>
    )
  }

  renderSlider = () => {
    const { numberHaveFinished, numberTotal } = this.state

    return (
      <>
        <Slider
          value={numberHaveFinished}
          maximumValue={numberTotal}
          disabled={true}
          animateTransitions={true}
          trackStyle={styles.track}
          thumbStyle={styles.thumb}
          minimumTrackTintColor={colors.white}
          style={styles.customSlider}
        />
        <Text style={styles.percent}>
          {numberHaveFinished + ' / ' + numberTotal}
        </Text>
      </>
    )
  }

  renderAlert = () => {
    const { displayAlert } = this.state

    if (!displayAlert) return null

    return <DownloadAlert />
  }

  renderButtonCancel = () => {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={this.goBack}>
        <Text style={styles.cancel}>{I18n.t('cancel')}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <LinearGradient
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 1]}
        style={styles.container}
        colors={[colors.primary_blue, colors.pink_blue]}
      >
        <View style={styles.wrapContent}>
          {this.renderTitle()}

          {this.renderSlider()}

          {this.renderAlert()}
        </View>

        <View style={styles.wrapFooter}>{this.renderButtonCancel()}</View>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapContent: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fonts.size.xxlxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
  description: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPRegular,
    color: colors.white,
    textAlign: 'center',
    marginTop: metrics.base,
    marginBottom: metrics.download_description_text_margin_bottom,
  },
  customSlider: {
    width: '50%',
    height: metrics.download_slider_height,
  },
  track: {
    height: 8,
    borderRadius: 6,
    backgroundColor: colors.light_50,
  },
  thumb: {
    width: 0,
    height: 18,
    borderRadius: 1,
  },
  percent: {
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPRegular,
    color: colors.white,
    textAlign: 'center',
  },
  cancel: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
})
