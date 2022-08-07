import { AButton } from '@/components/AButton/AButton'
import I18n from '@/i18n'
import { colors, devices, fonts, metrics, normalize } from '@/vars'
import * as React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Image } from '@/models/common'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { LImage } from '@/libs/LImage'
import { SafeImage } from '@/shared/image'
import { pathOr } from 'ramda'
import { Source } from '@/stores/imageStore3'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'

type Props = Readonly<{
  onPress?(): void
  onPressChooseImage?(): void
  thumbnail: Source
  image: Image
  id: string
  isContactSelectImage: boolean
}> &
  Partial<NavigationInjectedProps<{}>>

type State = Readonly<{
  cacheImage: string
  thumbnail: string
}>

@DelayRender({ delay: 100 })
@(withNavigation as any)
export class CreateContactCover extends React.PureComponent<Props, State> {
  readonly state = {
    cacheImage: '',
    thumbnail: '',
  }

  static readonly defaultProps = {
    businessCardImage: '',
  }

  renderCover = () => {
    const { onPress, thumbnail, image } = this.props

    if (image && image.id !== '') {
      const { id, uri } = new SafeImage(image)
      return (
        <ReactNativeZoomableView minZoom={1} style={styles.image}>
          <TouchableOpacity
            style={styles.image}
            onPress={onPress}
            activeOpacity={1}
          >
            <LImage
              source={{
                id,
                uri,
              }}
              style={styles.image}
            />
          </TouchableOpacity>
        </ReactNativeZoomableView>
      )
    }

    if (thumbnail && thumbnail[0]) {
      const id = pathOr('', ['id'], thumbnail[0])

      return (
        <ReactNativeZoomableView minZoom={1} style={styles.image}>
          <TouchableOpacity
            style={styles.image}
            onPress={onPress}
            activeOpacity={1}
          >
            <LImage
              source={{
                id,
                uri: '',
              }}
              style={styles.image}
            />
          </TouchableOpacity>
        </ReactNativeZoomableView>
      )
    }

    return null
  }

  renderButton = () => {
    const { onPress } = this.props

    return (
      <AButton
        onPress={onPress}
        title={I18n.t('snapBusinessCard')}
        titleStyle={{
          fontSize: fonts.size.m,
          color: colors.blue_light_grey,
        }}
        containerStyle={styles.button}
      />
    )
  }

  renderContent = () => {
    const { isContactSelectImage } = this.props
    const { id } = this.props
    return id !== '' || isContactSelectImage === true
      ? this.renderCover()
      : this.renderButton()
  }

  render() {
    return <View style={styles.container}>{this.renderContent()}</View>
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: metrics.contact_image_cover_height,
    backgroundColor: colors.background,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.snap_business_card_btn,
    width: normalize(150),
    alignSelf: 'center',
  },
  image: {
    height: metrics.contact_image_cover_height,
    width: metrics.screen_width,
  },
})
