import { AIcon } from '@/components/AIcon/AIcon'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { Connection } from '@/services/connection'
import { isIphoneX } from '@/shared/devices'
import { withContext } from '@/shared/withContext'
import { colors, images } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Subscription } from 'rxjs'

type ANetworkStatusProps = {
  fillAbsolute?: boolean
  connectedBgColor?: string
} & AppContextState

@withContext(AppContext.Consumer)
export class ANetworkStatus extends React.PureComponent<ANetworkStatusProps> {
  _subscription: Subscription = null

  readonly state = {
    networkState: Connection.CONNECTED,
  }

  static defaultProps = {
    connectedBgColor: colors.white,
    safeArea: true,
  }

  componentDidMount(): void {
    this._subscription = this.props.connection.observer().subscribe(value => {
      this.setState({
        networkState: value.state,
      })
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
  }

  renderContent = () => {
    const isStable = Connection.isStable(this.state.networkState)

    return (
      <View style={styles.wrapper}>
        <AIcon
          source={images.wifiError}
          iconStyle={{
            tintColor: isStable ? colors.warning : colors.wifi_unstable,
          }}
        />
        <Text style={styles.text}>
          {I18n.t(isStable ? 'uAreOffline' : 'unstableConn')}
        </Text>
      </View>
    )
  }

  render(): React.ReactNode {
    const { fillAbsolute, connectedBgColor } = this.props

    const isConnected = Connection.isConnected(this.state.networkState)

    if (!isIphoneX() && isConnected) {
      return null
    }

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: isConnected
              ? connectedBgColor
              : colors.black_blue_text,
            height: isIphoneX() ? 35 : 20,
          },
          fillAbsolute && {
            ...StyleSheet.absoluteFillObject,
            top: 'auto',
          },
        ]}
      >
        {isConnected ? (
          <View style={styles.placeholder} />
        ) : (
          this.renderContent()
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black_blue_text,
  },
  placeholder: {
    height: 20,
  },
  wrapper: {
    height: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.white,
    marginLeft: 4,
  },
})
