import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Team, User } from '@/models/common'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ProfileContent } from '@/screens/Profile/Components/ProfileContent'
import { ProfileCoverBackground } from '@/screens/Profile/Components/ProfileCoverBackground'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import * as React from 'react'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { NavigationScreenProp } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { ProfileContext } from './ProfileContext'

// init state
const initialState = {
  userInfo: null,
  team: null,
  teamMember: null,
  loading: true,
  errMsg: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<any, any>
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class ProfileScreen extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)
  _teamSubscription: Subscription
  _teamSubSubscription: Subscription
  _teamResults: Realm.Results<Team>

  _userSubscription: Subscription
  _userSubSubscription: Subscription
  _userResults: Realm.Results<User>

  _membersSubscription: Subscription
  _membersResults: Realm.Results<User>

  readonly state: State = initialState

  async componentDidMount() {
    const { userFactory } = this.props
    this._navListener.setBarStyle('light-content')

    this.fetchTeam()
    this.fetchMembers()
    this.fetchUser()
    this.setState({
      userInfo: userFactory.info,
    })
  }

  fetchUser = () => {
    const { userFactory } = this.props

    const [subscription, results] = userFactory.fetchFromUser()

    this._userResults = results

    this._userSubscription = subscription.subscribe(userInfo => {
      this.setState({
        userInfo,
      })
    })
  }

  fetchTeam = () => {
    const { teamFactory, selectedTeamId } = this.props

    const [subscription, results] = teamFactory.fetchById(selectedTeamId)

    this._teamResults = results

    this._teamSubscription = subscription.subscribe(team => {
      this.setState({
        team,
      })
    })

    this._teamSubSubscription = teamFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({
          loading: false,
        })
      }
    })
  }

  fetchMembers = () => {
    const { teamMemberFactory } = this.props
    const [subscription, results] = teamMemberFactory.fetch()

    this._membersResults = results

    this._userSubscription = subscription.subscribe(teamMember => {
      this.setState({
        teamMember,
        loading: false,
      })
    })

    this._userSubSubscription = teamMemberFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({
          loading: false,
        })
      }
    })
  }

  async componentWillUnmount() {
    this._navListener.removeListener()
    this._teamSubscription && this._teamSubscription.unsubscribe()
    this._membersSubscription && this._membersSubscription.unsubscribe()
    this._userSubscription && this._userSubscription.unsubscribe()

    this._teamResults && this._teamResults.removeAllListeners()
    this._membersResults && this._membersResults.removeAllListeners()
    this._userResults && this._userResults.removeAllListeners()

    this._teamSubSubscription && this._teamSubSubscription.unsubscribe()
    this._userSubSubscription && this._userSubSubscription.unsubscribe()
  }

  onCloseConn = () => {
    this.props.realm.close()
  }

  render() {
    const { loading, userInfo, team, teamMember } = this.state

    if (loading) return <AIndicator full />

    return (
      <ProfileContext.Provider
        value={{
          userInfo,
          team,
          teamMember,
        }}
      >
        <ParallaxScrollView
          backgroundScrollSpeed={100}
          parallaxHeaderHeight={metrics.profile_header_height}
          renderBackground={() => <ProfileCoverBackground />}
          // @ts-ignore
          showsVerticalScrollIndicator={false}
        >
          <ProfileContent onCloseConn={this.onCloseConn} />
        </ParallaxScrollView>
      </ProfileContext.Provider>
    )
  }
}
