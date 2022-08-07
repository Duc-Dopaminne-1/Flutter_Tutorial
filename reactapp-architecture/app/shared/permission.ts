import { CameraRoll, PermissionsAndroid } from 'react-native'
import { devices } from '@/vars'

export class Permission {
  private _isCheckSaveImage: boolean = false

  checkPermissionSaveImage = uri => {
    if (devices.isAndroid && !this._isCheckSaveImage) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ).then(allowed => {
        if (allowed) {
          this._isCheckSaveImage = true
          this.saveImage(uri)
        } else {
          this.requestPermissionSaveImage(uri)
        }
      })

      return
    }

    this.saveImage(uri)
  }

  requestPermissionSaveImage = uri => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ).then(status => {
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        this.saveImage(uri)
      } else {
        this._isCheckSaveImage = false
      }
    })
  }

  saveImage = uri => {
    try {
      CameraRoll.saveToCameraRoll(uri).then(() => {})
    } catch (e) {
      console.log('error save image', e)
    }
  }
}

export const permission = new Permission()
