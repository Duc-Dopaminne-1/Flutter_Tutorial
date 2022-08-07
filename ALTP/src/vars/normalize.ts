import { Dimensions, PixelRatio } from 'react-native'
import { isIpad } from '@/shared/devices'

const pixelRatio = PixelRatio.get()
export const deviceHeight = Dimensions.get('window').height
export const deviceWidth = Dimensions.get('window').width

const isSmallPhone = () => {
  return deviceWidth <= 360
}

export const normalize = size => {
  if (!isIpad() && !isSmallPhone()) return size

  if (pixelRatio >= 2 && pixelRatio < 3) {
    // iphone 5s and older Androids
    if (deviceWidth <= 360) {
      return size * 0.85
    }
    // iphone 6-6s
    if (deviceHeight <= 667) {
      return size * 0.95
    }
    if (deviceHeight > 667 && deviceHeight <= 735) {
      return size
    }

    // older phablets
    return size * 1.15
  }
  if (pixelRatio >= 3 && pixelRatio < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size * 0.85
    }
    // Catch other weird android width sizings
    if (deviceHeight <= 667) {
      return size * 0.95
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }
    if (deviceHeight > 667 && deviceHeight <= 735) {
      return size
    }
    // catch larger devices
    // ie iphone 6s plus / 7 plus / mi note 等等
    return size * 1.2
  }
  if (pixelRatio >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (deviceWidth <= 360) {
      return size * 0.85
      // Catch other smaller android height sizings
    }
    if (deviceHeight <= 667) {
      return size * 0.95
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }
    if (deviceHeight > 667 && deviceHeight <= 735) {
      return size
    }
    // catch larger phablet devices
    return size * 1.25
  }
}
