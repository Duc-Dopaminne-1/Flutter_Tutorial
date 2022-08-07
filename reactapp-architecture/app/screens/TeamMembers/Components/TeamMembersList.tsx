import { AIndicator } from '@/components/AIndicator/AIndicator'
import I18n from '@/i18n'
import { Team } from '@/models/common'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  NetInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { AInput } from '@/components/AInput/AInput'
import { SafeUser } from '@/shared/user'
import { Network, NetworkState } from '@/services/network'
import { SafeTeamUser } from '@/shared/teamUser'

// init state
const initialState = {
  teamMember: [],
  loading: true,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<NavigationInjectedProps<{}>> &
  DefaultProps &
  AppContextState

export type State = Partial<{}> & Readonly<typeof initialState>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class TeamMembersList extends React.Component<Props, State> {
  _flatList: React.RefObject<FlatList<Team>> = React.createRef()
  _teamMembersResults: Realm.Results<Team>
  _teamMembersSubscription: Subscription
  _networkInfo = null
  _isFetching = false

  readonly state: State = initialState

  componentDidMount() {
    this.fetchTeamMembers()

    Network.getConnectInfo().then(info => {
      this._networkInfo = info
    })

    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  componentWillUnmount() {
    this._teamMembersResults && this._teamMembersResults.removeAllListeners()
    this._teamMembersSubscription && this._teamMembersSubscription.unsubscribe()
  }

  fetchTeamMembers = () => {
    const { teamUserFactory } = this.props
    const [subscription, results] = teamUserFactory.fetch()

    this._teamMembersResults = results

    this._teamMembersSubscription = subscription.subscribe(teamMember => {
      this.setState({
        teamMember,
        loading: false,
      })
    })
  }

  onChangeTeam = () => {
    if (this._isFetching) {
      return
    }

    // Network.getConnectInfo().then(info => {
    //   this._isFetching = false
    //   this._networkInfo = info
    //   if (this._networkInfo && Network.isConnected(this._networkInfo)) {
    //     this.props.navigation.navigate('SelectTeamScreen', {
    //       isChangeTeam: true,
    //     })
    //     return
    //   }
    //
    //   alert(I18n.t('youNeedConnected'))
    // })

    this.props.navigation.navigate('SelectTeamScreen', {
      isChangeTeam: true,
    })
  }

  renderHeader = () => {
    return (
      <View style={styles.wrapHeader}>
        <Text style={styles.headerText}>{I18n.t('teamMembers')}</Text>

        <TouchableOpacity onPress={this.onChangeTeam}>
          <Text style={styles.headerButtonText}>{I18n.t('changeTeam')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderItem = ({ item }) => {
    const { user } = new SafeTeamUser(item)
    const { fullName, email } = new SafeUser(user)

    return (
      <View style={styles.wrapItem}>
        <AInput
          title={fullName.toUpperCase()}
          value={email}
          editable={false}
          containerStyle={styles.customTextInputContainer}
        />
      </View>
    )
  }

  renderFlatList = () => {
    const { teamMember } = this.state

    return (
      <>
        {this.renderHeader()}
        <FlatList
          ref={this._flatList}
          data={teamMember}
          extraData={this.state}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          style={styles.flatList}
          contentContainerStyle={styles.flatListContainer}
          bounces={false}
        />
      </>
    )
  }

  render() {
    const { loading } = this.state

    if (!loading) {
      setTimeout(() => {
        this._flatList.current && this._flatList.current.recordInteraction()
      }, 50)
    }

    return <>{loading ? <AIndicator full /> : this.renderFlatList()}</>
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: 53,
  },
  wrapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    marginBottom: metrics.keylines_screen_profile_title_margin,
  },
  headerText: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  headerButtonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.primary_blue,
  },
  wrapItem: {
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  customTextInputContainer: {
    flex: 0,
  },
})
