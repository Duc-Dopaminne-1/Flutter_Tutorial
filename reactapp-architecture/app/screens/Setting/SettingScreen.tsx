import { colors, metrics } from '@/vars'
import * as React from 'react'
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import I18n from '@/i18n'
import { DrawerActions, NavigationScreenProp } from 'react-navigation'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { SettingGeneral } from '@/screens/Setting/Components/SettingGeneral'
import { SettingAppInfo } from '@/screens/Setting/Components/SettingAppInfo'
import { SettingSyncStatus } from '@/screens/Setting/Components/SettingSyncStatus'

// init state
const initialState = {
  userInfo: null,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  DefaultProps

export type State = Partial<{}> & Readonly<typeof initialState>

export class SettingScreen extends React.PureComponent<Props, State> {
  readonly state: State = initialState

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
          title={I18n.t('setting')}
          onPressBack={this.goBackAndCloseMenu}
        />
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <SettingGeneral />
          <SettingAppInfo />
          <SettingSyncStatus />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingBottom: 100,
  },
})
