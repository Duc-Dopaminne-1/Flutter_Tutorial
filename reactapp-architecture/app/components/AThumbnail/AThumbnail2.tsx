import { colors, fonts, images, metrics } from '@/vars/index'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
  Image as RNImage,
  ImageSourcePropType,
} from 'react-native'
import { ARibbon } from '@/components/ARibbon/ARibbon'

export type AThumbnail2Props = {
  favorite?: boolean
  name?: string
  containerStyle?: any
  textStyle?: any
  image?: any
}

export class AThumbnail2 extends React.PureComponent<AThumbnail2Props> {
  static defaultProps = {
    favorite: false,
    name: '',
  }
  state = {
    loading: false,
  }

  renderNameLogo = () => {
    const { name, containerStyle, textStyle } = this.props

    return (
      <View style={[styles.thumbnail, containerStyle]}>
        <Text style={[styles.text, textStyle]}>{name}</Text>
      </View>
    )
  }

  renderImageLogo = () => {
    const { image } = this.props

    return (
      <View style={styles.wrapImage}>
        <Image
          source={{ uri: image }}
          defaultSource={images.missingImage}
          style={styles.image}
        />
      </View>
    )
  }

  render() {
    const { favorite, image } = this.props

    return (
      <React.Fragment>
        {image === images.supplier || !image
          ? this.renderNameLogo()
          : this.renderImageLogo()}
        {favorite && <ARibbon />}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create<any>({
  thumbnail: {
    height: metrics.thumbnail_size,
    width: metrics.thumbnail_size,
    borderRadius: metrics.small_base,
    marginRight: metrics.supplier_card_padding_btw_content_and_img,
    backgroundColor: colors.background_violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPBold,
    color: colors.white,
  },
  wrapImage: {
    height: metrics.thumbnail_size,
    width: metrics.thumbnail_size,
    borderRadius: metrics.small_base,
    marginRight: metrics.supplier_card_padding_btw_content_and_img,
    backgroundColor: colors.background_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    borderRadius: metrics.small_base,
    height: metrics.thumbnail_size,
    width: metrics.thumbnail_size,
  },
})
