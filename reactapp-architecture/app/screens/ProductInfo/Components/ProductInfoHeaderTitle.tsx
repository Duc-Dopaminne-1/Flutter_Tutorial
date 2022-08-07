import I18n from '@/i18n'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import ActionSheet from 'react-native-actionsheet'
import { debounce } from 'lodash'
import { navigation } from '@/navigation/navigation'
import {
  Image,
  ImageRequireSource,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { SafeSupplier } from '@/shared/supplier'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  safeProduct?: SafeProduct
} & DefaultProps

// Type of information
enum Information {
  Supplier,
  Category,
}

export type State = Readonly<typeof initialState>

@withContext(ProductInfoContext.Consumer)
export class ProductInfoHeaderTitle extends React.PureComponent<Props, State> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  readonly state: State = initialState

  renderInformation = (
    icon: ImageRequireSource,
    background: string,
    text: string,
    type: Information
  ) => {
    if (text.length <= 0) return null

    const isSupplier = type === Information.Supplier

    return (
      <View style={styles.wrapItem}>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onShowActionSheet}
          disabled={!isSupplier}
        >
          <View style={[styles.wrapIcon, { backgroundColor: background }]}>
            <Image
              source={icon}
              // @ts-ignore
              resizeMode={'contain'}
              style={styles.icon}
            />
          </View>

          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  minimumOrderQuantity = value => {
    return value.length <= 0 ? '0' : value
  }

  onShowActionSheet = () => {
    this._actionSheet.current.show()
  }

  onPress = debounce((index: number) => {
    const { safeProduct } = this.props
    const { supplier } = safeProduct
    const { id } = new SafeSupplier(supplier)

    switch (index) {
      case 0:
        navigation.navigate('SupplierInfoScreen', { supplierId: id })
        return
      case 1:
        productNavigation.open(ProductRef.SelectSupplier, {}, false, true)
        return
      default:
        return
    }
  }, 100)

  render() {
    const {
      name,
      supplierName,
      MOQ,
      categoryName,
      currency,
      priceValue,
    } = this.props.safeProduct

    const priceWithSymbol = currency.symbol(priceValue.formatted, '')
    const formatPrice =
      priceWithSymbol === '' ? currency.symbol('0.00') : priceWithSymbol

    return (
      <View style={styles.container}>
        <Text style={styles.titleText} numberOfLines={2}>
          {name}
        </Text>

        <View style={styles.wrapPriceAndMOQ}>
          <Text style={styles.priceText} numberOfLines={1}>
            {formatPrice}
          </Text>
          <Text style={styles.minText} numberOfLines={1}>
            {I18n.t('min')}{' '}
            {this.minimumOrderQuantity(MOQ.minimumOrderQuantity)}{' '}
            {I18n.t('pcs')}
          </Text>
        </View>

        <View>
          {this.renderInformation(
            images.supplier,
            colors.background_violet,
            supplierName,
            Information.Supplier
          )}

          {this.renderInformation(
            images.product,
            colors.category_orange_yellow,
            categoryName,
            Information.Category
          )}
        </View>

        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('more').capitalize()}
          options={[
            I18n.t('viewSupplier'),
            I18n.t('changeSupplier'),
            I18n.t('cancel'),
          ]}
          cancelButtonIndex={2}
          onPress={this.onPress}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
  },
  titleText: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
    marginTop: metrics.base,
  },
  wrapPriceAndMOQ: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  priceText: {
    color: colors.primary_blue,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.xxxl,
    marginRight: metrics.base,
  },
  minText: {
    color: colors.text_light_grey,
    fontSize: fonts.size.l,
    marginBottom: 3,
    alignSelf: 'flex-end',
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.base,
    paddingRight: metrics.keylines_screen_edge_margin,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapIcon: {
    height: 17,
    width: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: metrics.base,
  },
  icon: {
    height: 10,
    width: 10,
    tintColor: colors.white,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
})
