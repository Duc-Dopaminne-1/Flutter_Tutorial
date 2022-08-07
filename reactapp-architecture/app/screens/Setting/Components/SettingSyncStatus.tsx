import { AProgressBar } from '@/components/AProgressBar/AProgressBar'
import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { Connection } from '@/services/connection'
import { ProgressResult } from '@/services/progress'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import bytes from 'bytes'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { Subscription } from 'rxjs'

type Props = Readonly<{}> & AppContextState

export type State = Readonly<{
  networkState: number
  progressResult: ProgressResult
}>

@withContext(AppContext.Consumer)
export class SettingSyncStatus extends React.PureComponent<Props, State> {
  _connSubscription: Subscription = null
  _uploadSubscription: Subscription = null

  readonly state: State = {
    networkState: Connection.UNKNOWN,
    progressResult: {
      transferred: 0,
      transferable: 0,
      percentage: 0,
      done: true,
    },
  }

  componentDidMount() {
    const { connection, progress } = this.props

    this._connSubscription = connection.observer().subscribe(value => {
      this.setState({
        networkState: value.state,
      })
    })

    this._uploadSubscription = progress.upload().subscribe(value => {
      this.setState({
        progressResult: value,
      })
    })
  }

  componentWillUnmount() {
    this._connSubscription && this._connSubscription.unsubscribe()
    this._uploadSubscription && this._uploadSubscription.unsubscribe()
  }

  get renderImage() {
    const { networkState } = this.state

    switch (networkState) {
      case Connection.CONNECTED:
        return images.wifi
      case Connection.UNSTABLE:
        return images.wifiError
      default:
        return images.wifiError
    }
  }

  get tintColorForIcon() {
    const { networkState } = this.state

    switch (networkState) {
      case Connection.DISCONNECTED:
        return { tintColor: colors.warning }
      case Connection.UNSTABLE:
        return { tintColor: colors.wifi_unstable }
      default:
        return {}
    }
  }

  get renderConnectionText() {
    const { networkState } = this.state

    switch (networkState) {
      case Connection.CONNECTED:
        return I18n.t('connection')
      case Connection.UNSTABLE:
        return I18n.t('connectionNotStable')
      default:
        return I18n.t('connectionError')
    }
  }

  get renderConnectionDescription() {
    const { networkState, progressResult } = this.state

    switch (networkState) {
      case Connection.CONNECTED:
        return I18n.t('connectionDescription')
      case Connection.UNSTABLE:
        return I18n.t('pleaseConnectToAnotherNetwork')
      default:
        return I18n.t('numberToTransfer', {
          number: bytes(
            progressResult.transferable - progressResult.transferred,
            { unitSeparator: ' ' }
          ),
        })
    }
  }

  renderSyncStatus = () => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Image
          source={this.renderImage}
          style={[styles.icon, this.tintColorForIcon]}
          resizeMode={'contain'}
        />

        <View style={styles.wrapText}>
          <Text style={styles.connectTitle} numberOfLines={1}>
            {this.renderConnectionText}
          </Text>

          <Text style={styles.connectDescription} numberOfLines={1}>
            {this.renderConnectionDescription}
          </Text>
        </View>
      </View>
    )
  }

  renderProgressBar = () => {
    const { progressResult } = this.state
    return (
      <>
        <AProgressBar value={progressResult.percentage} />
        <Text style={styles.text}>
          {bytes(progressResult.transferred, { unitSeparator: ' ' })} /{' '}
          {bytes(progressResult.transferable, { unitSeparator: ' ' })}{' '}
          {I18n.t('transferred')}
        </Text>
      </>
    )
  }

  render() {
    const { networkState, progressResult } = this.state

    const isConnected = Connection.isConnected(networkState)

    return (
      <View style={styles.container}>
        <ATitle title={I18n.t('syncStatus')} />

        <View style={styles.wrapper}>
          {!isConnected || progressResult.done
            ? this.renderSyncStatus()
            : this.renderProgressBar()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.setting_screen_margin_top,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  wrapper: {
    marginVertical: metrics.profile_sync_status_margin_top,
  },
  icon: {
    height: metrics.profile_wifi_size,
    width: metrics.profile_wifi_size,
  },
  wrapText: {
    marginLeft: metrics.keylines_screen_edge_margin,
  },
  connectTitle: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
  connectDescription: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
  text: {
    marginTop: 8,
    color: colors.blue_light_grey,
  },
})
