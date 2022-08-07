import { AIndicator } from '@/components/AIndicator/AIndicator'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { LocalStorage } from '@/services/storage'
import { withContext } from '@/shared/withContext'
import { colors } from '@/vars'
import * as React from 'react'
import { AsyncStorage, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps, NavigationScreenProp } from 'react-navigation'
import Realm from 'realm'
import { RealmEnum } from '@/common/constants/RealmEnum'
import { auth2 } from '@/services/auth2'
import { downloadTeamStore } from '@/stores/downloadTeamStore'

// init state
const initialState = {
  loading: false,
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
    isSignUp?: boolean
  }> &
  AppContextState

export type State = Partial<{
  [key: string]: any
}> &
  Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class LoadingScreen extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  async componentDidMount() {
    await this.checkStateUser()
  }

  checkStateUser = async () => {
    try {
      const isSignUp = this.props.navigation.getParam('isSignUp', false)
      const user = Realm.Sync.User.current
      if (user) {
        this.setState({ loading: true })

        const selectedTeamId = await AsyncStorage.getItem(
          LocalStorage.SELECTED_TEAM_ID
        )

        const userRealm = await auth2.signIn()

        this.props.initTeamAndCompany()

        this.props.addRealm(RealmEnum.UserRealm, userRealm)

        this.setState({ loading: false })

        if (selectedTeamId) {
          /**
           * Check team has already download or not
           */
          const isAlreadyDownload = downloadTeamStore.isAlreadyDownload(
            selectedTeamId
          )

          if (isAlreadyDownload) {
            this.props.selectTeam(selectedTeamId, () => {
              this.goToScreen('HomeScreen')
            })
          } else {
            this.goToScreen('DownloadScreen', { teamId: selectedTeamId })
          }
        } else {
          this.goToScreen('SelectTeamScreen', { isSignUp })
        }
      } else {
        this.goToScreen('OpenScreen')
      }
    } catch (e) {}
  }

  goToScreen = (routeName: string, params: any = {}) => {
    // resetScreen(routeName, this.props.navigation)
    this.props.navigation.navigate(routeName, params)
  }

  render() {
    return (
      <View style={styles.container}>
        <AIndicator full />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
})
