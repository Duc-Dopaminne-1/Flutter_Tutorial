import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInputOne } from '@/components/AInput/AInputOne'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { Connection } from '@/services/connection'
import { withContext } from '@/shared/withContext'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { AViewIpad } from '@/components/AView/AViewIpad'
import { findIndex } from 'lodash'
import { Team } from '@/models/common'
import { selectTeamStore } from '@/stores/selectTeamStore'
import { eventStore } from '@/stores/eventStore'
import { NavigationService } from '@/services/navigation'

// init state
const initialState = {
  companyName: '',
  teamName: '',
  loading: false,
  networkState: Connection.UNKNOWN,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> &
  DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      hasAtLeastOneTeam: boolean
    }>
  >

export type State = Partial<{
  [key: string]: any
}> &
  Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class CreateCompanyScreen extends React.PureComponent<Props, State> {
  _connSubscription: Subscription
  _teamSubscription: Subscription
  _navigation: NavigationService = new NavigationService(this.props.navigation)
  _hasAtLeastOneTeam: boolean = this.props.navigation.getParam(
    'hasAtLeastOneTeam',
    false
  )

  readonly state: State = initialState

  static navigationOptions = {
    gesturesEnabled: false,
  }

  componentDidMount() {
    this.fetchNetworkConnection()
    this.fetchTeams()
  }

  componentWillUnmount() {
    this._connSubscription && this._connSubscription.unsubscribe()
    this._teamSubscription && this._teamSubscription.unsubscribe()
  }

  fetchTeams = () => {
    const { teamFactory } = this.props
    const [teamSubscription] = teamFactory.fetch()

    this._teamSubscription = teamSubscription.subscribe(teams => {
      if (teams.length > 0) {
        const index = findIndex(
          teams,
          team => team.name === this.state.teamName
        )

        if (index !== -1 && teams[index].status === 'active') {
          this.selectTeam(teams[index])
        }
      }
    })
  }

  fetchNetworkConnection = () => {
    const { connection } = this.props

    this._connSubscription = connection.observer().subscribe(value => {
      this.setState({
        networkState: value.state,
      })
    })
  }

  validator = (userRealm: Realm) => {
    const { companyName, teamName } = this.state
    const trimCompanyName = companyName.trim()
    const trimTeamName = teamName.trim()

    if (trimCompanyName.length === 0) {
      alert(I18n.t('emptyCompanyName'))
      return false
    }
    if (trimTeamName.length === 0) {
      alert(I18n.t('emptyTeamName'))
      return false
    }
    if (!userRealm) {
      alert(I18n.t('userRealmIsNull'))
      return false
    }

    return true
  }

  createCompany = async () => {
    const { userRealm, companyFactory } = this.props
    const { companyName, teamName, networkState } = this.state
    const trimCompanyName = companyName.trim()
    const trimTeamName = teamName.trim()
    const isConnected = Connection.isConnected(networkState)

    if (!isConnected) {
      alert(I18n.t('plsCheckNetworkConnCreateTeam'))
      return
    }

    if (!this.validator(userRealm)) return

    this.setState({
      loading: true,
    })

    companyFactory
      .create(trimCompanyName, trimTeamName)
      .subscribe(createdTeam => {
        if (!createdTeam.isValid()) {
          alert(I18n.t('somethingWentWrong'))
          this.setState({
            loading: false,
          })
        }
      })
  }

  selectTeam = (team: Team) => {
    const { selectTeam } = this.props

    selectTeam(team.id, () => {
      this.setState({
        loading: false,
      })

      selectTeamStore.saveData(team.id)
      eventStore.clearAll()

      this._navigation.replace('DownloadScreen', { teamId: team.id })
    })
  }

  onChangeText = (key: string) => (value: string) => {
    this.setState({
      [key]: value,
      teamName: this.populateTeamName(key, value),
    })
  }

  populateTeamName = (key: string, value: string) => {
    const formattedVal = value.trim()
    if (!formattedVal) {
      return ''
    }
    return key === 'companyName' ? `${formattedVal}'s Team` : value
  }

  render() {
    const { companyName, teamName, loading } = this.state
    const { navigation } = this.props

    return (
      <AViewIpad>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss()
          }}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <AHeaderOne
            title={I18n.t('createYourTeam')}
            onPressBack={() => {
              navigation.goBack(null)
            }}
            visibleLeftButton={this._hasAtLeastOneTeam}
          />

          <KeyboardAwareScrollView
            style={styles.wrapInput}
            keyboardShouldPersistTaps={'always'}
            extraScrollHeight={metrics.triple_base}
            enableOnAndroid={true}
          >
            <AInputOne
              title={I18n.t('companyName')}
              value={companyName}
              onChangeText={this.onChangeText('companyName')}
              textInputProps={{
                placeholder: I18n.t('yourCompanyName'),
                placeholderTextColor: colors.text_light_grey,
              }}
            />

            <AInputOne
              title={I18n.t('teamName')}
              value={teamName}
              onChangeText={this.onChangeText('teamName')}
              containerStyle={styles.customContainer}
              textInputProps={{
                placeholder: I18n.t('yourTeamName'),
                placeholderTextColor: colors.text_light_grey,
              }}
            />

            <View style={styles.wrapButton}>
              <AButtonGradient
                title={I18n.t('createYourTeam')}
                loading={loading}
                onPress={this.createCompany}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </AViewIpad>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapInput: {
    flex: 1,
    paddingTop: metrics.triple_base,
    paddingHorizontal: metrics.keylines_screen_sign_in_margin,
  },
  wrapButton: {
    paddingTop: metrics.margin_btw_button_text_input,
  },
  customContainer: {
    marginTop: metrics.keylines_screen_product_info_margin,
  },
})
