import I18n from '@/i18n'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

// init state
const initialState = {
  imageData: [{ uri: '' }],
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  safeProduct?: SafeProduct
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(ProductInfoContext.Consumer)
export class ProductInfoHeaderNumberPicture extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  get numberOfPicture() {
    const {
      images: { numberOfImages },
    } = this.props.safeProduct

    const picture = I18n.t(numberOfImages < 2 ? 'picture' : 'pictures')

    return numberOfImages + ' ' + picture.toUpperCase() + ' |'
  }

  get percentLike() {
    const { votePercent } = this.props.safeProduct

    return votePercent + '%'
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.numberOfPicture}</Text>

        <Image
          source={images.like}
          style={styles.icon}
          resizeMode={'contain'}
        />

        <Text style={styles.text}>{this.percentLike}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    zIndex: 99,
    top: -45,
    left: 0,
    backgroundColor: colors.medium_gray,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: metrics.slide_detail_padding,
    paddingHorizontal: 8,
    marginLeft: metrics.slide_detail_margin,
    opacity: 0.8,
    borderRadius: metrics.number_picture_border_radius,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.s,
  },
  icon: {
    tintColor: colors.light_green,
    height: metrics.product_info_image_icon_like_size,
    width: metrics.product_info_image_icon_like_size,
    marginHorizontal: 5,
  },
})
