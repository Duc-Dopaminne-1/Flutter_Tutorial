import { Team } from '@/models/common'
import { User } from '@/models/user'
import { ProfileContext } from '@/screens/Profile/ProfileContext'
import { SafeUser } from '@/shared/user'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  userInfo?: User
  team?: Team
}> &
  DefaultProps

export type State = Readonly<typeof initialState>

@withContext(ProfileContext.Consumer)
export class ProfileInfoLogo extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  get userName() {
    const { logoPlaceholder } = new SafeUser(this.props.userInfo)

    return logoPlaceholder
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.firstLayer}>
          <View style={styles.secondLayer}>
            <View style={styles.finalLayer}>
              <Text style={styles.text}>{this.userName}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -(metrics.profile_logo_name_size / 2),
    zIndex: 99,
    alignItems: 'center',
  },
  firstLayer: {
    height: metrics.profile_logo_name_size,
    width: metrics.profile_logo_name_size,
    backgroundColor: colors.product_info_camera_btn_top,
    borderRadius: metrics.profile_logo_name_size,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondLayer: {
    height: metrics.profile_logo_name_size - 7,
    width: metrics.profile_logo_name_size - 7,
    backgroundColor: colors.white,
    borderRadius: metrics.profile_logo_name_size,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finalLayer: {
    height: metrics.profile_logo_name_size - 14,
    width: metrics.profile_logo_name_size - 14,
    backgroundColor: colors.primary_blue,
    borderRadius: metrics.profile_logo_name_size,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
})
