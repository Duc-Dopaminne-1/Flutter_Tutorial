import { Platform } from 'react-native'

type PlatformsOptions = {
  v24?: any
  android: any
  ios: any
}

export class Platforms {
  static shared() {
    return platforms
  }

  get version() {
    return Platform.Version
  }

  get os() {
    return Platform.OS
  }

  get isAndroid() {
    return this.os === 'android'
  }

  get isIOS() {
    return this.os === 'ios'
  }

  select(options: PlatformsOptions) {
    if (this.isAndroid) {
      if (this.version === 24) {
        return options.v24
      }

      return options.android
    }

    return options.ios
  }
}

const platforms = new Platforms()
