import { Subject } from 'rxjs'
import { PermissionsAndroid } from 'react-native'
import geolib from 'geolib'
import Geolocation from 'react-native-geolocation-service'
import { devices } from '@/vars'
import AndroidOpenSettings from 'react-native-android-open-settings'
import { CustomAlert } from '@/shared/alert'

export class SafeLocation {
  private _currentLocation: any = null
  private _denyLocation: boolean = false
  private _subjectCurrentLocation = new Subject()
  private _lengthToEvent = 10000
  private _countShowError: number = 0
  private _showErrorDialog: boolean = true

  constructor() {}

  get currentLocation() {
    return this._currentLocation
  }

  get subjectCurrentLocation() {
    return this._subjectCurrentLocation
  }

  get lengthToEvent() {
    return this._lengthToEvent
  }

  get denyLocation() {
    return this._denyLocation
  }

  checkPermission = (isRequireAgain = false) => {
    if (devices.isAndroid) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(allowed => {
        allowed
          ? this.requestCurrentLocation()
          : this.requestPermission(isRequireAgain)
      })
    } else {
      this.requestCurrentLocation()
    }
  }

  statusPermission = () => {
    if (devices.isAndroid) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then(allowed => {
        allowed ? (this._denyLocation = false) : (this._denyLocation = true)
      })
    }
  }

  requestPermission = (isRequireAgain = false) => {
    if (this._denyLocation && !isRequireAgain) return

    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    ).then(status => {
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        this._denyLocation = false
        this.requestCurrentLocation()
      } else {
        this._denyLocation = true
      }
    })
  }

  requestCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        this._currentLocation = position.coords
        this._subjectCurrentLocation.next({
          position: position.coords,
          type: 'Get',
        })
      },
      error => {
        if (error.code === 5 && this._countShowError > 1) {
          this.openAndroidLocationSetting()
          return
        }
        if (error.code === 5) {
          this._countShowError = this._countShowError + 1
          this._showErrorDialog = this._countShowError <= 1
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
        showLocationDialog: this._showErrorDialog,
      }
    )
  }

  openAndroidLocationSetting = () => {
    devices.isAndroid &&
      CustomAlert.alertYesNo({
        message:
          'Your location mode is not appropriate for the current' +
          ' request. Please go to location setting, turn on location and change' +
          ' location mode to' +
          ' high accuracy.',
        onPressYes: () => {
          AndroidOpenSettings.locationSourceSettings()
        },
      })
  }

  calculateDistance = ({ latitude, longitude }) => {
    return geolib.getDistance(this._currentLocation as any, {
      latitude,
      longitude,
    })
  }

  detectEvent = eventList => {
    if (!eventList || !this._currentLocation) return []

    const detectedEventList = eventList.filter(event => {
      const { latitude, longitude } = event.description.venue

      if (latitude && longitude) {
        const meters = this.calculateDistance({ latitude, longitude })

        return meters <= this._lengthToEvent
      }

      return false
    })

    return detectedEventList.sort((a, b) => {
      const kmA = this.calculateDistance({
        latitude: a.description.venue.latitude,
        longitude: a.description.venue.longitude,
      })

      const kmB = this.calculateDistance({
        latitude: b.description.venue.latitude,
        longitude: b.description.venue.longitude,
      })

      return kmA - kmB
    })
  }
}

export const safeLocation = new SafeLocation()
