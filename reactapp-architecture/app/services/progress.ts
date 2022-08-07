import { BehaviorSubject } from 'rxjs'

export type ProgressResult = {
  transferred: number
  transferable: number
  percentage: number
  done: boolean
}

export class Progress {
  private readonly _realm: Realm
  private readonly _defaultValue = {
    transferred: 0,
    transferable: 0,
    percentage: 0,
    done: true,
  }
  private readonly _uploadSubject = new BehaviorSubject<ProgressResult>(
    this._defaultValue
  )
  private readonly _downloadSubject = new BehaviorSubject<ProgressResult>(
    this._defaultValue
  )

  constructor(realm: Realm) {
    this._realm = realm
  }

  private progressCallback = (subject: BehaviorSubject<ProgressResult>) => (
    transferred,
    transferable
  ) => {
    const percentage = (transferred / transferable) * 100

    subject.next({
      transferred,
      transferable,
      percentage,
      done: percentage === 100,
    })
  }

  run = () => {
    this._realm.syncSession.addProgressNotification(
      'upload',
      'reportIndefinitely',
      this.progressCallback(this._uploadSubject)
    )

    this._realm.syncSession.addProgressNotification(
      'download',
      'forCurrentlyOutstandingWork',
      this.progressCallback(this._downloadSubject)
    )
  }

  upload = () => {
    return this._uploadSubject
  }

  download = () => {
    return this._downloadSubject
  }
}
