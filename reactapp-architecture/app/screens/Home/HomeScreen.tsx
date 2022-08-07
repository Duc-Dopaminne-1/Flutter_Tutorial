import { NavigationService } from '@/services/navigation'
import { colors } from '@/vars'
import * as React from 'react'
import { AppState, AppStateStatus, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { safeLocation } from '@/shared/location'
import { HomeContent } from '@/screens/Home/Components/HomeContent'

// init state
const initialState = {
  appState: AppState.currentState,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> &
  NavigationInjectedProps<{}> &
  DefaultProps &
  AppContextState

export type State = Readonly<{}> & Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class HomeScreen extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)

  readonly state: State = initialState

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
    this._navListener.setBarStyle('light-content')
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange)
    this._navListener.removeListener()
  }

  handleAppStateChange = (nextAppState: AppStateStatus) => {
    const { appState } = this.state
    if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      !safeLocation.denyLocation
    ) {
      safeLocation.checkPermission()
    }
    this.setState({ appState: nextAppState })
  }

  onPressOpenMenu = () => {
    this.props.navigation.toggleDrawer()
  }

  render() {
    return (
      <View style={styles.container}>
        <HomeContent onPressOpenMenu={this.onPressOpenMenu} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background_gray,
  },
})
