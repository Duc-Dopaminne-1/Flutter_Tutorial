import { ConnectionInfo, ConnectionType, NetInfo } from 'react-native'
import { Observable } from 'rxjs'

export type NetworkState = ConnectionInfo | ConnectionType | any

export class Network {
  static getConnectInfo = () => {
    return NetInfo.getConnectionInfo()
  }

  static connectionChange = (): Observable<NetworkState> => {
    return new Observable<NetworkState>(observer => {
      NetInfo.getConnectionInfo().then(info => {
        observer.next(info)
      })

      NetInfo.addEventListener('connectionChange', (info: NetworkState) => {
        observer.next(info)
      })
    })
  }

  static isConnected(state) {
    return state && (state.type === 'wifi' || state.type === 'cellular')
  }
}
