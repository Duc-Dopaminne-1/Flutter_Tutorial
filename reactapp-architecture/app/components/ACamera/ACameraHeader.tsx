import { AHeader } from '@/components/AHeader/AHeader'
import I18n from '@/i18n'
import { colors, devices, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ImagePicker, {
  Image as ImageResponse,
} from 'react-native-image-crop-picker'

export type Props = Readonly<{
  flashMode?: keyof Readonly<{ on: any; off: any; torch: any; auto: any }>
  maxFiles: number
  isAddContactPicture?: boolean

  onOpenGalleryStart?(): void
  onOpenGalleryEnd?(response: ImageResponse[]): void
  onChangeFlash(): void
  onPressClose: () => void
}>

export type State = Readonly<{}>

export class ACameraHeader extends React.PureComponent<Props, State> {
  get flashModeState() {
    const { flashMode } = this.props

    const mode = flashMode ? 'modeOn' : 'modeOff'

    return `${I18n.t('flashMode').toLocaleUpperCase()}: ${I18n.t(
      mode
    ).toLocaleUpperCase()}`
  }

  renderLeftHeader = () => {
    const { flashMode, onPressClose } = this.props

    return (
      <View style={styles.wrapLeftHeader}>
        <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
          <Image
            source={images.closeIcon}
            style={styles.iconLeft}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flashButton}
          onPress={this.props.onChangeFlash}
        >
          <Text style={[styles.text, flashMode && { color: colors.yellow }]}>
            {this.flashModeState}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderRightHeader = () => {
    return (
      <View style={styles.wrapRightHeader}>
        <TouchableOpacity
          style={styles.chooseImageButton}
          onPress={this.onOpenGallery}
        >
          <Text style={[styles.text, { textAlign: 'center' }]}>
            {I18n.t('selectPhotoLabel').toLocaleUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  onOpenGallery = () => {
    const { onOpenGalleryStart, onOpenGalleryEnd, maxFiles } = this.props

    onOpenGalleryStart && onOpenGalleryStart()

    StatusBar.setBarStyle('dark-content', true)

    const width = devices.isIOS ? 4 : 1000
    const height = devices.isIOS ? 2.5 : 500

    ImagePicker.openPicker({
      maxFiles,
      width,
      height,
      mediaType: 'photo',
      multiple: maxFiles !== 1,
      cropping: true,
      compressImageMaxWidth: 1080,
      compressImageMaxHeight: 1080,
    })
      .then(response => {
        onOpenGalleryEnd &&
          onOpenGalleryEnd(
            Array.isArray(response) ? response : ([response] as ImageResponse[])
          )
        StatusBar.setBarStyle('light-content', true)
      })
      .catch(() => {
        onOpenGalleryEnd && onOpenGalleryEnd([])
        StatusBar.setBarStyle('light-content', true)
      })
  }

  render() {
    return (
      <AHeader
        removeTitle={true}
        renderLeft={this.renderLeftHeader}
        renderRight={this.renderRightHeader}
        wrapIconLeftStyle={styles.customWrapIconLeftStyle}
        containerStyle={styles.customHeaderContainerStyle}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.dark_grey,
  },
  customHeaderContainerStyle: {
    height: Platform.select({
      ios: 60,
      android: 100,
    }),
    paddingTop: Platform.select({
      ios: 0,
      android: 20,
    }),
  },
  customWrapIconLeftStyle: {
    paddingTop: 0,
  },
  closeButton: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: metrics.keylines_screen_edge_margin,
  },
  wrapLeftHeader: {
    flex: 1,
    flexDirection: 'row',
  },
  iconLeft: {
    tintColor: colors.white,
    height: metrics.icon_close,
    width: metrics.icon_close,
  },
  flashButton: {
    flex: 2,
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.s,
  },
  wrapRightHeader: {
    flex: 1,
  },
  chooseImageButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: metrics.keylines_screen_edge_margin,
  },
})
