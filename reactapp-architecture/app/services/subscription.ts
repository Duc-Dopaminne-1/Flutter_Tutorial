import Realm from 'realm'
import { BehaviorSubject } from 'rxjs'
import { AsyncStorage } from 'react-native'
import { sendDataToDownloadScreen } from '@/services/global'
import { downloadTeamStore } from '@/stores/downloadTeamStore'

export class AppSubscription<T> {
  private __realm: Realm
  private __className: string = ''
  private __results: Realm.Results<T> | undefined
  private __beSubject = new BehaviorSubject<number>(
    Realm.Sync.SubscriptionState.Pending
  )

  private static __teamId: string = ''

  constructor(realm: Realm, className: string) {
    this.__realm = realm
    this.__className = className
  }

  static injectTeamId(teamId: string) {
    AppSubscription.__teamId = teamId
  }

  set className(value: string) {
    this.__className = value
  }

  set realmValue(value: Realm) {
    this.__realm = value
  }

  get subscriptionKey() {
    return `@ss:col/${this.__className + AppSubscription.__teamId}`
  }

  private _callback = (sub: any, state: number) => {
    switch (state) {
      case Realm.Sync.SubscriptionState.Creating:
        // The subscription has not yet been written to the Realm
        // console.log('Creating', this.__className)
        break
      case Realm.Sync.SubscriptionState.Pending:
        // console.log('Pending', this.__className)
        // The subscription has been written to the Realm and is waiting
        // to be processed by the server
        break
      case Realm.Sync.SubscriptionState.Complete:
        AsyncStorage.setItem(this.subscriptionKey, '1').then(() => {})

        /**
         * Alert to DownloadScreen
         */
        sendDataToDownloadScreen.next({
          downloadClassName: this.__className,
          isFinish: true,
        })

        // console.log('Complete')
        // The subscription has been processed by the server and all objects
        // matching the query are in the local Realm
        break
      case Realm.Sync.SubscriptionState.Invalidated:
        // console.log('Invalidated', this.__className)
        // The subscription has been removed
        break
      case Realm.Sync.SubscriptionState.Error:
        // console.log('Error', sub.error, this.__className)
        break
    }

    if (state !== Realm.Sync.SubscriptionState.Error) {
      this.__beSubject.next(state)
      return
    }

    if (state === Realm.Sync.SubscriptionState.Error && sub.error) {
      // console.log('An error occurred: ', sub.error)
      this.__beSubject.error(sub.error)
      return
    }
  }

  sync = (
    { descriptor = 'creationDate', reverse = true, deleted = true } = {},
    realm?: Realm
  ) => {
    if (!this.__className) return this.__beSubject
    AsyncStorage.getItem(this.subscriptionKey).then(value => {
      if (realm) {
        this.__realm = realm
      }

      if (!this.__realm) {
        return null
      }

      if (value === '1') {
        /**
         * Alert to DownloadScreen
         */
        sendDataToDownloadScreen.next({
          downloadClassName: this.__className,
          isFinish: true,
        })

        this.__beSubject.next(Realm.Sync.SubscriptionState.Complete)
        return
      }

      if (value !== '1') {
        // this.__beSubject.next(Realm.Sync.SubscriptionState.Complete)
        if (deleted) {
          this.__results = this.__realm
            .objects<T>(this.__className)
            .filtered('deleted = false')
            .sorted(descriptor, reverse)
        } else {
          this.__results = this.__realm
            .objects<T>(this.__className)
            .sorted(descriptor, reverse)
        }
        // download from server
        this.__results.subscribe(this.__className).addListener(this._callback)
      }
    })

    return this.__beSubject
  }

  subject = () => {
    return this.__beSubject
  }

  unsubscribe = () => {
    if (this.__results) {
      this.__results.subscribe().unsubscribe()
    }
  }
}
