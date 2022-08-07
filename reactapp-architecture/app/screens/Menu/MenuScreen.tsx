import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import I18n from '@/i18n'
import { NavigationScreenProp } from 'react-navigation'
import { MenuUserName } from './Components/MenuUserName'
import { MenuTeam } from './Components/MenuTeam'
import { MenuActions } from './Components/MenuActions'
import { AButton2 } from '@/components/AButton/AButton2'
import { auth2 } from '@/services/auth2'
import { confirmDialog } from '@/shared/dialog'

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

export class MenuScreen extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  confirmLogout = () => {
    confirmDialog({
      message: I18n.t('areYouWantToLogout'),
      onPressRight: this.logout,
    })
  }

  logout = async () => {
    await auth2.logout()
    this.props.navigation.navigate('LoadingStack')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MenuUserName />
        <MenuTeam />
        <MenuActions />

        <View style={styles.wrapBottom}>
          <AButton2
            title={I18n.t('logout')}
            iconLeft={images.logout}
            onPress={this.confirmLogout}
            iconStyle={styles.customIcon}
            textStyle={styles.customText}
          />
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
  },
  wrapBottom: {
    marginHorizontal: metrics.keylines_screen_sign_in_margin,
    paddingVertical: metrics.keylines_screen_edge_margin,
    borderTopWidth: 1,
    borderColor: colors.background_gray,
  },
  customIcon: {
    tintColor: colors.pink_red,
  },
  customText: {
    color: colors.pink_red,
  },
})
