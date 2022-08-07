import { Product } from '@/models/team'
import { SafeProduct } from '@/shared/product'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { Subscription } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'
import { LImage } from '@/libs/LImage'

type Props = {
  product: Product
  currentIndex: number
} & TouchableOpacityProps

type State = Readonly<{}>

export class HomeListProductCard extends React.PureComponent<Props, State> {
  _productChangeSubscription: Subscription | undefined
  _subscription: Subscription | undefined
  _results: Realm.Results<CacheResult> | undefined

  readonly state: State = {}

  componentDidMount(): void {
    const { images } = new SafeProduct(this.props.product)
    images.preload()
  }

  componentWillUnmount(): void {
    this._productChangeSubscription &&
      this._productChangeSubscription.unsubscribe()
  }

  renderPrice(formattedPrice: string) {
    const { currency } = new SafeProduct(this.props.product)
    return formattedPrice === '0' ? '' : currency.symbol(formattedPrice)
  }

  render() {
    const { product, onPress, ...rest } = this.props
    const { name, priceValue, images } = new SafeProduct(product)

    return (
      <TouchableOpacity style={styles.item} onPress={onPress} {...rest}>
        <LImage
          source={{
            uri: images.uri,
            id: images.first.id,
            downsampling: 200,
          }}
          style={styles.thumbnail}
        />
        <Text style={styles.textName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.textValue} numberOfLines={1}>
          {this.renderPrice(priceValue.formatted)}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  item: {
    width: metrics.home_latest_product_image_size,
    overflow: 'hidden',
    paddingBottom: metrics.home_screen_products_item_padding_bottom,
    marginHorizontal: metrics.home_screen_products_item_margin_horizontal,
  },
  thumbnail: {
    height: metrics.home_latest_product_image_size,
    width: metrics.home_latest_product_image_size,
    borderRadius: metrics.home_screen_product_card_border_radius,
    overflow: 'hidden',
  },
  textName: {
    color: colors.black,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPRegular,
    marginTop: metrics.home_screen_product_card_name_product_margin_top,
  },
  textValue: {
    color: colors.primary_blue,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPRegular,
  },
})
