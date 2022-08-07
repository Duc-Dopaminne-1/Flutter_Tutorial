import { ATextCategory } from '@/components/AText/ATextCategory'
import { Product } from '@/models/team'
import { SafeProduct } from '@/shared/product'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Subscription } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'
import { LImage } from '@/libs/LImage'
import { isIpad } from '@/shared/devices'
import { productStore } from '@/stores/productStore'
import { NavigationInjectedProps } from 'react-navigation'
import { navigation } from '@/navigation/navigation'
import { debounce } from 'lodash'

type ProductCardProps = {
  product?: Product
  currentIndex: number
  selected?: boolean
  onPress?: () => void
  fromProductList?: boolean
  fromMultiSearchAll?: boolean
} & Partial<NavigationInjectedProps<{}>>

type ProductCardState = Readonly<{}>

export class ProductCard extends React.PureComponent<
  ProductCardProps,
  ProductCardState
> {
  _subscription: Subscription | undefined
  _results: Realm.Results<CacheResult> | undefined

  static defaultProps = {
    onPress: () => {},
    fromProductList: false,
  }

  readonly state: ProductCardState = {}

  componentDidMount(): void {
    const { images } = new SafeProduct(this.props.product)
    images.preload()
  }



  onPressCard = debounce(() => {

  }, 250)

  render() {
    const { product, selected, fromMultiSearchAll } = this.props
    const {
      priceValue,
      supplierName,
      categoryName,
      MOQ,
      favorite,
      safeStatus,
      images: { uri, first },
      name,
    } = new SafeProduct(product)

    const formattedPrice = priceValue.formatted
    const minimumOrderQuantity = MOQ.minimumOrderQuantity.toString()
    const statusNumber = safeStatus.number
    const statusLabel = safeStatus.formattedLabel
    const statusDotColor = safeStatus.color
    const cardStyle = fromMultiSearchAll ? styles.multiSearchCard : styles.card
    const thumbnailStyle = fromMultiSearchAll
      ? styles.multiSearchThumbnail
      : styles.thumbnail

    return (
      <TouchableHighlight
        style={[
          cardStyle,
          {
            backgroundColor: selected ? colors.primary_blue : colors.white,
          },
        ]}
        underlayColor={colors.light_grey}
        onPress={() => this.onPressCard()}
      >
        <>
          <View
            style={[
              thumbnailStyle,
              {
                overflow: 'hidden',
              },
            ]}
          >
            <LImage
              source={{
                uri,
                id: first.id,
                downsampling: 200,
              }}
              // Find another way to render the image when the app is offline.
              // Even if placeholder (base64 string) is not used it makes the app so slow.
              // placeholder={placeholder}
              style={thumbnailStyle}
            />
          </View>



          <View style={styles.content}>
            <Text style={styles.title}>{name}</Text>
          </View>
        </>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create<any>({
  card: {
    flexDirection: 'row',
    paddingVertical: metrics.prod_card_content_padding_vertical,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  multiSearchCard: {
    flexDirection: 'row',
    paddingVertical: metrics.prod_card_content_padding_vertical,
    paddingHorizontal: metrics.keylines_screen_edge_margin_multi_search,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  thumbnail: {
    width: metrics.prod_card_img_size,
    height: metrics.prod_card_img_size,
    borderRadius: metrics.prod_card_border_radius,
    marginRight: metrics.prod_card_padding_btw_content_and_img,
    overflow: 'hidden',
  },
  multiSearchThumbnail: {
    width: metrics.prod_card_img_size_multi_search,
    height: metrics.prod_card_img_size_multi_search,
    borderRadius: metrics.prod_card_border_radius_multi_search,
    marginRight: metrics.prod_card_padding_btw_content_and_img_multi_search,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 27,
    marginTop: -2,
  },
  title: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
    marginBottom: 5,
  },
  price: {
    fontSize: fonts.size.m,
    color: colors.text_price,
    marginBottom: 2,
  },
  min100pcs: {
    color: colors.text_light_grey,
    fontSize: fonts.size.m,
  },
  category: {
    color: colors.text_flower_pot,
    paddingTop: 0,
    marginBottom: 7,
  },
  company: {
    color: colors.text_grey,
  },
  wrapperSample: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: metrics.prod_card_dot_size,
    height: metrics.prod_card_dot_size,
    borderRadius: metrics.prod_card_dot_size / 2,
    backgroundColor: colors.dot,
  },
  sample: {
    fontSize: fonts.size.s,
    marginLeft: 4,
    color: colors.text_grey,
  },
  wrapHeartIcon: {
    position: 'absolute',
    left: 18,
    top: 19,
  },
})
