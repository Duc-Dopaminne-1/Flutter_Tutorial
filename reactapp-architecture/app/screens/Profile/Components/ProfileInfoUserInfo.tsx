import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { withContext } from '@/shared/withContext'
import { ProfileContext } from '@/screens/Profile/ProfileContext'
import { SafeUser } from '@/shared/user'
import { User } from '@/models/user'
import I18n from '@/i18n'
import { Team } from '@/models/common'

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
export class ProfileInfoUserInfo extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    const { team, userInfo } = this.props
    const { fullName, email } = new SafeUser(userInfo)

    const teamName = team && team.name ? team.name : ''

    return (
      <View style={styles.container}>
        <Text style={styles.name} numberOfLines={2}>
          {fullName}
        </Text>

        <Text style={styles.email} numberOfLines={2}>
          {email}
        </Text>

        <View style={styles.wrapTeam}>
          <Text style={styles.team} numberOfLines={2}>
            {I18n.t('team')}
          </Text>
          <Text style={styles.teamName} numberOfLines={2}>
            {teamName}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: 69,
  },
  name: {
    fontSize: fonts.size.mxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.black,
    textAlign: 'center',
  },
  email: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
    textAlign: 'center',
    marginTop: 4,
  },
  team: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
    textAlign: 'center',
  },
  teamName: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPRegular,
    color: colors.primary_blue,
    textAlign: 'center',
    marginTop: 4,
  },
  wrapTeam: {
    marginVertical: 24,
  },
})
