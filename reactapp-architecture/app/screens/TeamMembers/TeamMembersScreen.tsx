import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { colors } from '@/vars'
import * as React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { DrawerActions, NavigationInjectedProps } from 'react-navigation'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { Network } from '@/services/network'
import { TeamMembersList } from '@/screens/TeamMembers/Components/TeamMembersList'
import { TeamMembersInvitationsList } from '@/screens/TeamMembers/Components/TeamMembersInvitationsList'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<NavigationInjectedProps<{}>> &
  DefaultProps &
  AppContextState

export type State = Partial<{}> & Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class TeamMembersScreen extends React.PureComponent<Props, State> {
  _networkInfo = null

  readonly state: State = initialState

  componentDidMount() {
    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  goBackAndCloseMenu = () => {
    this.props.navigation.navigate(
      'HomeScreen',
      {},
      this.props.navigation.dispatch(DrawerActions.toggleDrawer()) as any
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <AHeaderOne
          title={I18n.t('myTeam')}
          onPressBack={this.goBackAndCloseMenu}
          containerStyle={styles.customHeaderOneContainer}
        />
        <ScrollView bounces={false}>
          <TeamMembersList />
          <TeamMembersInvitationsList />
        </ScrollView>

        <ANetworkStatus fillAbsolute />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  customHeaderOneContainer: {
    marginBottom: 22,
  },
})
