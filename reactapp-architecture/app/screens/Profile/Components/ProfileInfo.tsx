import { colors, metrics } from '@/vars'
import * as React from 'react'
import { AsyncStorage, StyleSheet, View } from 'react-native'
import { ProfileInfoLogo } from './ProfileInfoLogo'
import { ProfileInfoUserInfo } from './ProfileInfoUserInfo'
import { ProfileInfoTitle } from '@/screens/Profile/Components/ProfileInfoTitle'
import { AButton } from '@/components/AButton/AButton'
import Realm from 'realm'
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import { Platforms } from '@/shared/platforms'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> & DefaultProps

export type State = Readonly<typeof initialState>

export class ProfileInfo extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <ProfileInfoLogo />
        <ProfileInfoTitle />
        <ProfileInfoUserInfo />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    ...Platforms.shared().select({
      android: {
        borderRadius: 8,
      },
      ios: {
        borderRadius: 8,
      },
    }),
    marginTop: -8,
    zIndex: 99,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
  },
})
