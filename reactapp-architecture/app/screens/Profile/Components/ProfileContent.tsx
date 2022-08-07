import { AButton } from '@/components/AButton/AButton'
import { ProfileInfo } from '@/screens/Profile/Components/ProfileInfo'
import { ProfileSyncStatus } from '@/screens/Profile/Components/ProfileSyncStatus'
import { ProfileTeamMember } from '@/screens/Profile/Components/ProfileTeamMember'
import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Config from 'react-native-config'
import DeviceInfo from 'react-native-device-info'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { auth2 } from '@/services/auth2'
import { User } from '@/models/user'
import { withContext } from '@/shared/withContext'
import { ProfileContext } from '@/screens/Profile/ProfileContext'
import { confirmDialog } from '@/shared/dialog'
import I18n from '@/i18n'

// init state
const initialState = {
  buildNumber: '',
  version: '',
  bundleId: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  onCloseConn(): void
  userInfo?: User
}> &
  Partial<NavigationInjectedProps<{}>> &
  DefaultProps

export type State = Readonly<typeof initialState>

@withContext(ProfileContext.Consumer)
@(withNavigation as any)
export class ProfileContent extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  componentDidMount() {
    Promise.all([
      DeviceInfo.getBuildNumber(),
      DeviceInfo.getVersion(),
      DeviceInfo.getBundleId(),
    ]).then(deviceInfos => {
      this.setState({
        buildNumber: deviceInfos[0],
        version: deviceInfos[1],
        bundleId: deviceInfos[2],
      })
    })
  }

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
    const { buildNumber, version, bundleId } = this.state

    return (
      <View style={styles.container}>
        <ProfileInfo />
        <ProfileSyncStatus />
        <ProfileTeamMember />

        <View style={styles.wrapButton}>
          <AButton
            containerStyle={styles.button}
            onPress={this.confirmLogout}
            title={I18n.t('logout')}
          />
          <TouchableOpacity
            onPress={() => {
              //              this.props.navigation.navigate('Test1')
            }}
            disabled={true}
          >
            <Text style={styles.deviceInfo}>{bundleId}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onCloseConn} disabled={true}>
            <Text style={styles.deviceInfo}>
              {version} - {buildNumber}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} disabled={true}>
            <Text style={styles.server}>{Config.SERVER_URL}</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.border_gray,
  },
  button: {
    height: 50,
    width: 200,
    borderRadius: 10,
  },
  wrapButton: {
    marginTop: 150,
    marginBottom: 20,
    alignItems: 'center',
  },
  deviceInfo: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.medium_dark_grey,
  },
  server: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.medium_dark_grey,
  },
})
