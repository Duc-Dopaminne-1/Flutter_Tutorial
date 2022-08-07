import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import I18n from '@/i18n'
import { Company, Team } from '@/models/common'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { Connection } from '@/services/connection'
import { withContext } from '@/shared/withContext'
import { colors } from '@/vars'
import * as React from 'react'
import {
  AsyncStorage,
  BackHandler,
  FlatList,
  StyleSheet,
  View,
} from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { AViewIpad } from '@/components/AView/AViewIpad'
import { auth2 } from '@/services/auth2'
import { LocalStorage } from '@/services/storage'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { copyProductStore } from '@/stores/copyProductStore'
import { CustomAlert } from '@/shared/alert'
import { selectTeamStore } from '@/stores/selectTeamStore'
import { eventStore } from '@/stores/eventStore'
import { downloadTeamStore } from '@/stores/downloadTeamStore'
import { SelectTeamList } from '@/screens/SelectTeam/Components/SelectTeamList'
import { SelectTeamContext } from '@/screens/SelectTeam/SelectTeamContext'

// init state
const initialState = {
  teams: [] as any,
  company: null,
  errMsg: '',
  networkState: Connection.UNKNOWN,
  loading: true,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<
  NavigationInjectedProps<{
    isChangeTeam?: boolean
    isSignUp: boolean
  }>
> &
  DefaultProps &
  AppContextState

export type State = Partial<{
  [key: string]: any
}> &
  Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class SelectTeamScreen extends React.PureComponent<Props, State> {
  _flatList: React.RefObject<FlatList<Team>> = React.createRef()
  _connSubscription: Subscription

  _teamSubscription: Subscription
  _teamSubSubscription: Subscription

  _companySubscription: Subscription

  _backHandler: any

  readonly state: State = initialState

  componentDidMount() {
    const { navigation } = this.props
    const { isSignUp } = this.navigationData()

    /**
     * If come from SignUpScreen continue navigate user to CreateCompanyScreen
     */
    isSignUp &&
      navigation.navigate('CreateCompanyScreen', {
        hasAtLeastOneTeam: false,
      })

    this.fetchNetworkConnection()
    this.fetchTeams()
    this.fetchCompanies()

    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    )
  }

  componentWillUnmount() {
    this._teamSubscription && this._teamSubscription.unsubscribe()
    this._companySubscription && this._companySubscription.unsubscribe()
    this._teamSubSubscription && this._teamSubSubscription.unsubscribe()
    this._connSubscription && this._connSubscription.unsubscribe()
    this._backHandler && this._backHandler.remove()
  }

  navigationData = () => {
    const { navigation } = this.props
    const { networkState } = this.state

    const isSignUp = navigation.getParam('isSignUp', false)
    const isChangeTeam = navigation.getParam('isChangeTeam', false)
    const isConnected = Connection.isConnected(networkState)

    return {
      isSignUp,
      isChangeTeam,
      isConnected,
    }
  }

  fetchNetworkConnection = () => {
    const { connection } = this.props

    this._connSubscription = connection.observer().subscribe(value => {
      this.setState({
        networkState: value.state,
      })
    })
  }

  fetchCompanies = () => {
    const { companyFactory } = this.props

    const [companySubscription] = companyFactory.fetch()

    this._companySubscription = companySubscription.subscribe(companies => {
      this.setState({
        company: companies[0],
      })
    })
  }

  fetchTeams = () => {
    const { teamFactory } = this.props
    const [teamSubscription] = teamFactory.fetch()

    this._teamSubscription = teamSubscription.subscribe(teams => {
      this.setState({
        teams,
      })
    })

    this._teamSubSubscription = teamFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({
          loading: false,
        })
      } else {
        this.setState({
          loading: true,
        })
      }
    })
  }

  selectTeam = async (selectedTeam: Team) => {
    const { selectTeam, navigation } = this.props
    const { isChangeTeam, isConnected } = this.navigationData()

    if (!isConnected) {
      this.selectTeamOffline(selectedTeam)
      return
    }

    if (!selectedTeam.realmPath) {
      alert(I18n.t('cantSelectPendingTeam'))
      return
    }

    /**
     * Change team
     */
    if (isChangeTeam) {
      copyProductStore.clear().catch(() => {})
      await AsyncStorage.setItem(LocalStorage.SELECTED_TEAM_ID, selectedTeam.id)
      selectTeamStore.saveData(selectedTeam.id)
      eventStore.clearAll()
      navigation.navigate('LoadingScreen')
      return
    }

    selectTeamStore.saveData(selectedTeam.id)
    eventStore.clearAll()

    /**
     * Check team has already download or not
     */
    const isAlreadyDownload = downloadTeamStore.isAlreadyDownload(
      selectedTeam.id
    )

    if (isAlreadyDownload) {
      selectTeam(selectedTeam.id, () => {
        navigation.navigate('PrivateStack')
      })
    } else {
      navigation.navigate('DownloadScreen', { teamId: selectedTeam.id })
    }
  }

  selectTeamOffline = async (selectedTeam: Team) => {
    const { selectTeam, navigation } = this.props

    if (selectTeamStore.checkTeam(selectedTeam.id)) {
      selectTeam(selectedTeam.id, () => {
        navigation.navigate('PrivateStack')
      })
    } else {
      alert(I18n.t('plsCheckNetworkConnSelectTeam'))
    }
  }

  createTeam = () => {
    const { company, teams } = this.state

    this.checkTeam(teams, company)
  }

  /**
   * If user just create account then navigate them to create team else
   * don't do anything
   */
  checkTeam = (_teams: Team[], company: Company) => {
    const { navigation } = this.props
    const { isSignUp, isConnected } = this.navigationData()

    if (!isConnected) {
      return CustomAlert.error({
        title: I18n.t('alert'),
        message: I18n.t('plsCheckNetworkConnCreateTeam'),
        onPress: () => {},
      })
    }

    if (company) {
      navigation.navigate('CreateTeamScreen', {
        hasAtLeastOneTeam: !isSignUp,
        companyData: company,
      })
    } else {
      navigation.navigate('CreateCompanyScreen', {
        hasAtLeastOneTeam: !isSignUp,
      })
    }
  }

  goBack = async () => {
    const { navigation } = this.props
    const { isChangeTeam } = this.navigationData()

    if (isChangeTeam) {
      navigation.navigate('HomeScreen')
    } else {
      await auth2.logout()
      navigation.navigate('LoadingStack')
    }
  }

  renderFlatList = () => {
    const { teams, errMsg, loading } = this.state

    if (loading) return <AIndicator full />

    return <SelectTeamList teamData={teams} errorMessage={errMsg} />
  }

  render() {
    const { isSignUp } = this.navigationData()

    if (isSignUp) return null

    return (
      <SelectTeamContext.Provider
        value={{
          selectTeam: this.selectTeam,
          createTeam: this.createTeam,
        }}
      >
        <AViewIpad>
          <AHeaderOne title={I18n.t('selectTeam')} onPressBack={this.goBack} />

          <View style={styles.wrapFlatList}>{this.renderFlatList()}</View>

          <ANetworkStatus fillAbsolute />
        </AViewIpad>
      </SelectTeamContext.Provider>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapFlatList: {
    flex: 1,
  },
  loading: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: colors.light_80,
  },
})
