import { AIndicator } from '@/components/AIndicator/AIndicator'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { AButton } from '@/components/AButton/AButton'
import { AInput } from '@/components/AInput/AInput'
import { Network } from '@/services/network'
import { Invitation } from '@/models/team'
import { SafeInvitation } from '@/shared/invitations'

// init state
const initialState = {
  invitations: [] as any,
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
export class TeamMembersInvitationsList extends React.PureComponent<
  Props,
  State
> {
  _flatList: React.RefObject<FlatList<Invitation>> = React.createRef()
  _invitationsResults: Realm.Results<Invitation>
  _invitationsSubscription: Subscription
  _networkInfo = null

  readonly state: State = initialState

  componentDidMount() {
    this.fetchInvitations()

    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  componentWillUnmount() {
    this._invitationsResults && this._invitationsResults.removeAllListeners()
    this._invitationsSubscription && this._invitationsSubscription.unsubscribe()
  }

  fetchInvitations = () => {
    const { invitationFactory } = this.props
    const [subscription, results] = invitationFactory.fetch()

    this._invitationsResults = results

    this._invitationsSubscription = subscription.subscribe(invitations => {
      this.setState(
        {
          invitations,
          loading: false,
        },
        () => {
          this.forceUpdate()
        }
      )
    })
  }

  renderHeader = () => {
    const { navigate } = this.props.navigation

    return (
      <View style={styles.wrapHeader}>
        <Text style={styles.headerText}>{I18n.t('invitations')}</Text>

        <TouchableOpacity
          onPress={() => {
            navigate('InviteTeamMembersScreen')
          }}
        >
          <Text style={styles.headerButtonText}>
            {I18n.t('inviteTeamMember')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderFooter = () => {
    const { navigate } = this.props.navigation

    return (
      <AButton
        onPress={() => {
          navigate('InviteTeamMembersScreen')
        }}
        title={I18n.t('inviteTeamMember')}
        containerStyle={styles.customContainerButton}
        titleStyle={styles.customTitleButton}
      />
    )
  }

  renderItem = ({ item }) => {
    const { email } = new SafeInvitation(item)

    return (
      <View style={styles.wrapItem}>
        <AInput
          title={I18n.t('invitationPending').toUpperCase()}
          value={email}
          editable={false}
          containerStyle={styles.customTextInputContainer}
        />
      </View>
    )
  }

  renderFlatList = () => {
    const { invitations } = this.state

    return (
      <>
        {this.renderHeader()}
        <FlatList
          ref={this._flatList}
          data={invitations}
          extraData={this.state}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          ListFooterComponent={this.renderFooter}
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
    paddingBottom: 20,
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
  customContainerButton: {
    height: metrics.button_height,
    marginTop: 36,
  },
  customTitleButton: {
    fontSize: fonts.size.m,
  },
  customTextInputContainer: {
    flex: 0,
  },
})
