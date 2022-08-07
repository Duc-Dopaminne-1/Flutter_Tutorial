import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import I18n from '@/i18n'
import { NavigationScreenProp } from 'react-navigation'
import { AInput } from '@/components/AInput/AInput'
import DeviceInfo from 'react-native-device-info'

// init state
const initialState = {
  version: '',
  buildNumber: '',
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

export class SettingAppInfo extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  componentDidMount() {
    Promise.all([DeviceInfo.getBuildNumber(), DeviceInfo.getVersion()]).then(
      deviceInfos => {
        this.setState({
          buildNumber: deviceInfos[0],
          version: deviceInfos[1],
        })
      }
    )
  }

  render() {
    const { version, buildNumber } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('applicationInfo')}</Text>

        <AInput
          title={I18n.t('appVersion').toUpperCase()}
          value={version + ' - ' + buildNumber}
          editable={false}
          containerStyle={styles.customTextInputContainer}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.setting_screen_margin_top,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  customTextInputContainer: {
    flex: 0,
  },
  wrapSwitch: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
})
