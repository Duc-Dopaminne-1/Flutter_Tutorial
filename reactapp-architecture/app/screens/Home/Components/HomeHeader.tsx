import { Company, Team } from '@/models/common'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { colors, images } from '@/vars'
import { fonts } from '@/vars/fonts'
import * as React from 'react'
import { get } from 'lodash'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Keyboard,
  ImageBackground,
} from 'react-native'
import { Subscription } from 'rxjs'
import LinearGradient from 'react-native-linear-gradient'
import { AHeader3 } from '@/components/AHeader/AHeader3'
import I18n from '@/i18n'
import { navigation } from '@/navigation/navigation'
import { SafeCompany } from '@/shared/company'

type Props = {
  isShowDot?: boolean
  onPressOpenMenu: () => void
} & AppContextState

type State = Readonly<{
  keyword: string
  isFocus: boolean
  team: Team
  company: Company
  errMsg: string
  keyTextInput: number
}>

@withContext(AppContext.Consumer)
export class HomeHeader extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _companySubscription: Subscription

  readonly state: State = {
    keyword: '',
    isFocus: false,
    team: null,
    company: null,
    errMsg: '',
    keyTextInput: 0,
  }

  componentDidMount() {
    this.fetchTeam()
    this.fetchCompany()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._companySubscription && this._companySubscription.unsubscribe()
  }

  fetchTeam = () => {
    const { teamRealmFactory, selectedTeamId } = this.props
    const [subscription] = teamRealmFactory.fetchTeamById(selectedTeamId)

    this._subscription = subscription.subscribe(team => {
      this.setState({ team })
    })
  }

  fetchCompany = () => {
    const { teamCompanyFactory } = this.props
    const [subscription] = teamCompanyFactory.fetch()

    this._companySubscription = subscription.subscribe(company => {
      this.setState({ company: company[0] })
    })
  }

  onChangeText = (text: string) => {
    this.setState({
      keyword: text,
    })
  }

  onPressIcon = () => {
    const { isFocus } = this.state
    const { onPressCreate } = this.props

    if (isFocus) {
      Keyboard.dismiss()
      setTimeout(() => {
        this.onChangeText('')
      }, 0)
      return
    }

    onPressCreate()
  }

  onFocus = (isFocus: boolean) => {
    this.setState({
      isFocus,
    })

    if (!isFocus) {
      this.setState({
        keyTextInput: this.state.keyTextInput + 1,
      })
    }
  }

  onSubmitEditing = () => {
    navigation.navigate('MultiSearchScreen', {
      keyword: this.state.keyword,
      onPressBack: this.onPressBack,
    })
  }

  onPressBack = () => {
    this.setState({ keyword: '' })
  }

  render() {
    const { onPressOpenMenu, isShowDot } = this.props
    const { team, keyword, keyTextInput, company } = this.state
    const teamName = team && team.name ? team.name : ''
    const companyName = new SafeCompany(company).name

    return (
      <LinearGradient
        start={{ x: 0, y: 0.1 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 1]}
        style={styles.container}
        colors={[colors.primary_blue, colors.pink_blue]}
      >
        <ImageBackground
          style={styles.imageBackground}
          source={images.dashboardHeaderImage}
        >
          <View style={styles.wrapContent}>
            <View style={styles.wrapIcon}>
              <TouchableOpacity onPress={onPressOpenMenu}>
                <Image
                  source={images.menu}
                  style={styles.customHeaderIconLeft}
                />
              </TouchableOpacity>
              <View>
                <Image
                  source={images.bell}
                  style={styles.customHeaderIconLeft}
                />
                {isShowDot ? <View style={styles.dotAboveIcon} /> : null}
              </View>
            </View>
            <View style={styles.wrapTextCompany}>
              <Text style={styles.textCompany}>{companyName}</Text>
              <Text style={styles.textTeam}>{teamName}</Text>
            </View>
            <AHeader3
              keyTextInput={keyTextInput}
              fromHome={true}
              placeholder={I18n.t('multiSearchPlaceholder')}
              focusPlaceholder={I18n.t('searchText')}
              value={keyword}
              onPressIcon={this.onPressIcon}
              onChangeText={this.onChangeText}
              onFocus={this.onFocus}
              onSubmitEditing={this.onSubmitEditing}
              textInputProps={{
                returnKeyType: 'search',
              }}
            />
          </View>
        </ImageBackground>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: 237,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  },
  wrapContent: {
    paddingHorizontal: 24,
    paddingTop: 45,
  },
  wrapIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotAboveIcon: {
    width: 8,
    height: 8,
    position: 'absolute',
    right: -1,
    top: -4,
    backgroundColor: colors.warning,
    borderRadius: 10,
  },
  wrapTextCompany: {
    marginTop: 21,
    alignItems: 'center',
    marginBottom: 20,
  },
  textCompany: {
    fontSize: fonts.size.xxxlxl,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.family.SSPBold,
  },
  textTeam: {
    fontSize: fonts.size.m,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: fonts.family.SSPBold,
  },
  customHeaderContainer: {
    height: 63,
    backgroundColor: colors.primary_blue,
    paddingTop: 0,
  },
  customHeaderTitle: {
    color: colors.white,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
  customHeaderWrapIconLeft: {
    justifyContent: 'center',
  },
  customHeaderIconLeft: {
    height: 24,
    width: 24,
    tintColor: colors.white,
  },
})
