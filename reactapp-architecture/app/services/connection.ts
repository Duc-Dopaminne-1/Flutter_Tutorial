import { Network, NetworkState } from '@/services/network'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export type NetworkStatus = -1 | 0 | 1 | 2 | 3

type ConnectionState = {
  state: NetworkStatus
}

type SyncState = 'disconnected' | 'connecting' | 'connected'

export class Connection {
  private _networkState = null
  private _syncState = null
  private _realm: Realm = null

  static readonly UNKNOWN = -1
  static readonly DISCONNECTED = 0
  static readonly CONNECTING = 1
  static readonly CONNECTED = 2
  static readonly UNSTABLE = 3

  static isConnected = (networkState: number) => {
    return networkState === Connection.CONNECTED
  }

  static isStable = (networkState: number) => {
    return networkState !== Connection.UNSTABLE
  }

  private _currentState = Connection.CONNECTING

  private _subject = new BehaviorSubject<ConnectionState>({
    state: Connection.UNSTABLE,
  })

  constructor(realm: Realm) {
    this._realm = realm

    combineLatest<NetworkState, SyncState>(
      Network.connectionChange(),
      this.syncSessionChange$()
    )
      .pipe(
        map(values => {
          this._networkState = values[0]
          this._syncState = values[1]
          return {
            networkState: this._networkState,
            syncState: this._syncState,
          }
        }),
        map(() => {
          if (!this.networkConnected) {
            return Connection.DISCONNECTED
          }

          if (this.isConnected) {
            return Connection.CONNECTED
          }

          if (!this.syncConnected) {
            return Connection.UNSTABLE
          }

          return Connection.UNKNOWN
        })
      )
      .subscribe(state => {
        this._currentState = state

        this._subject.next({
          state,
        })
      })
  }

  private syncSessionChange$ = () => {
    return new Observable<SyncState>(observer => {
      // FIXME: Fix later, sometimes didn't work or can caused crash
      const syncSession = this._realm.syncSession
      if (syncSession) {
        if (syncSession.state === 'active') {
          observer.next('connected')
        }

        syncSession.addConnectionNotification(state => {
          observer.next(state)
        })
      }
    })
  }

  observer() {
    return this._subject
  }

  get isConnected() {
    return this.networkConnected && this.syncConnected
  }

  get networkConnected() {
    return Network.isConnected(this._networkState)
  }

  get syncConnected() {
    return this._syncState === 'connected'
  }
}
