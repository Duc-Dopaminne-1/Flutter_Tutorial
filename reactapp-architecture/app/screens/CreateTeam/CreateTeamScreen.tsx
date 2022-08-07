import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInputOne } from '@/components/AInput/AInputOne'
import I18n from '@/i18n'
import { Company, Team } from '@/models/common'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { Connection } from '@/services/connection'
import { withContext } from '@/shared/withContext'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import {
  Keyboard,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { AViewIpad } from '@/components/AView/AViewIpad'
import { NavigationService } from '@/services/navigation'
import { findIndex } from 'lodash'
import Realm from 'realm'
import { selectTeamStore } from '@/stores/selectTeamStore'
import { eventStore } from '@/stores/eventStore'

// init state
const initialState = {
  teamName: '',
  loading: false,
  networkState: Connection.UNKNOWN,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type CreateTeamScreenProps = Partial<{}> &
  DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      companyData: Company
      hasAtLeastOneTeam: boolean
    }>
  >

export type CreateTeamScreenState = Partial<{}> & Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class CreateTeamScreen extends React.PureComponent<
  CreateTeamScreenProps,
  CreateTeamScreenState
> {
  _connSubscription: Subscription
  _teamSubscription: Subscription
  _navigation: NavigationService = new NavigationService(this.props.navigation)
  _teams: Team[] = []

  readonly state: CreateTeamScreenState = initialState

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

  navigationData = () => {
    const { navigation } = this.props
    const { networkState } = this.state

    const hasAtLeastOneTeam = navigation.getParam('hasAtLeastOneTeam', false)
    const company = navigation.getParam('companyData', null)
    const isConnected = Connection.isConnected(networkState)

    return {
      hasAtLeastOneTeam,
      company,
      isConnected,
    }
  }

  fetchTeams = () => {
    const { teamFactory } = this.props
    const [teamSubscription] = teamFactory.fetch()

    this._teamSubscription = teamSubscription.subscribe(teams => {
      this._teams = teams as any

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

  validator = (teamName: string, company: any, userRealm: Realm) => {
    if (teamName.length === 0) {
      alert(I18n.t('emptyTeamName'))
      return false
    }

    /**
     * Check teamName has exist or not
     */
    const index = findIndex(this._teams, item => item.name === teamName)
    if (index !== -1) {
      alert(I18n.t('teamNameAlreadyExist'))
      return false
    }

    if (!userRealm) {
      alert(I18n.t('userRealmIsNull'))
      return false
    }

    if (!company) {
      alert(I18n.t('companyIsNull'))
      return false
    }

    return true
  }

  createTeam = async () => {
    const { userRealm, teamFactory } = this.props
    const { teamName } = this.state
    const { company, isConnected } = this.navigationData()

    if (!isConnected) {
      alert(I18n.t('plsCheckNetworkConnCreateTeam'))
      return
    }

    if (!this.validator(teamName.trim(), company, userRealm)) return

    this.setState({
      loading: true,
    })

    teamFactory.create({ teamName, company }).subscribe(createdTeam => {
      if (createdTeam.realmPath) {
        this.selectTeam(createdTeam)
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

  onChangeText = (teamName: string) => {
    this.setState({
      teamName,
    })
  }

  render() {
    const { teamName, loading } = this.state
    const { navigation } = this.props
    const { hasAtLeastOneTeam } = this.navigationData()

    return (
      <AViewIpad>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss()
          }}
          style={{ flex: 1 }}
        >
          <>
            <AHeaderOne
              title={I18n.t('createYourTeam')}
              onPressBack={() => {
                navigation.goBack(null)
              }}
              visibleLeftButton={hasAtLeastOneTeam}
            />

            <KeyboardAwareScrollView
              style={styles.wrapInput}
              keyboardShouldPersistTaps={'always'}
              extraScrollHeight={metrics.triple_base}
              enableOnAndroid={true}
              bounces={false}
            >
              <AInputOne
                title={I18n.t('teamName')}
                value={teamName}
                onChangeText={this.onChangeText}
                textInputProps={{
                  placeholder: I18n.t('yourTeamName'),
                  placeholderTextColor: colors.text_light_grey,
                }}
              />

              <View style={styles.wrapButton}>
                <AButtonGradient
                  title={I18n.t('createYourTeam')}
                  loading={loading}
                  onPress={this.createTeam}
                />
              </View>
            </KeyboardAwareScrollView>
          </>
        </TouchableWithoutFeedback>
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
})
