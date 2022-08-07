import { Dimensions, Platform, StatusBar } from 'react-native'

export function isIphoneX() {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    // @ts-ignore
    !Platform.isPad &&
    // @ts-ignore
    !Platform.isTVOS &&
    (dimen.height >= 812 ||
      dimen.width >= 812 ||
      (dimen.height >= 896 || dimen.width >= 896))
  )
}

export function isIpad() {
  const dimen = Dimensions.get('window')
  return (
    Platform.OS === 'ios' &&
    // @ts-ignore
    Platform.isPad &&
    // @ts-ignore
    !Platform.isTVOS &&
    (dimen.height >= 812 ||
      dimen.width >= 812 ||
      (dimen.height >= 896 || dimen.width >= 896))
  )
}

interface Specifics<T> {
  ios?: T
  android?: T
  iPad?: T
  iPhoneX?: T
  default?: T
}

export function selectPlatform<T>(
  specifics: Specifics<T>,
  active: boolean = true
): T {
  if (specifics.iPad && isIpad() && active) {
    return specifics.iPad
  }

  if (specifics.iPhoneX && isIphoneX()) {
    return specifics.iPhoneX
  }

  if (specifics.android && Platform.OS === 'android') {
    return specifics.android
  }

  if (specifics.ios && Platform.OS === 'ios') {
    return specifics.ios
  }

  return specifics.default
}

export function ifIphoneX(iphoneXStyle = {}, regularStyle = {}) {
  if (isIphoneX()) {
    return iphoneXStyle
  }

  return regularStyle
}

export function statusBarHeight(skipAndroid: boolean = false) {
  if (Platform.OS === 'ios') {
    return isIphoneX() ? 44 : 20
  }

  if (skipAndroid) {
    return 0
  }

  return StatusBar.currentHeight
}
