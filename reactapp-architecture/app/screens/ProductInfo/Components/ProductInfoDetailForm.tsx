import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import {
  ProductData,
  productNavigation,
  ProductRef,
} from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { getCurrencySymbol } from '@/shared/format'
import { SafeProduct } from '@/shared/product'
import { SafeStatusType } from '@/shared/statusType'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import validate from 'validate.js'
import { ProductInfoContext } from '../ProductInfoContext'
import { withNavigation } from 'react-navigation'
import { CustomAlert } from '@/shared/alert'
import { Subscription } from 'rxjs'
import { updateProductInfo } from '@/services/global'

// init state
const initialState = {
  isEdit: false,

  // Product Info
  name: '',
  price: '',
  minimumOrderQuantity: '',
  moqDescription: '',
  currency: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product?: Product
  safeProduct?: SafeProduct
  isBack?: boolean
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ProductInfoDetailForm extends React.PureComponent<Props, State> {
  _subscription: Subscription

  readonly state: State = initialState

  componentDidMount() {
    const { safeProduct } = this.props
    const { name, MOQ, priceValue, currency } = safeProduct

    const formatPrice = priceValue.formatted === '0' ? '' : priceValue.formatted

    this.setState({
      name,
      price: formatPrice,
      minimumOrderQuantity: MOQ.minimumOrderQuantity,
      moqDescription: MOQ.moqDescription,
      currency: currency.currency,
    })

    this.updateProductInfo()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  updateProductInfo = () => {
    this._subscription = updateProductInfo.subscribe(product => {
      if (!product) return

      const { name, MOQ, priceValue, currency } = new SafeProduct(product)

      const formatPrice =
        priceValue.formatted === '0' ? '' : priceValue.formatted

      this.setState({
        name,
        price: formatPrice,
        minimumOrderQuantity: MOQ.minimumOrderQuantity,
        moqDescription: MOQ.moqDescription,
        currency: currency.currency,
      })
    })
  }

  onChangeText = (key: string) => (_text: string) => {
    const text: string =
      key === 'minimumOrderQuantity' ? _text.replace(/\D/g, '') : _text
    // @ts-ignore
    this.setState({
      [key]: text,
      isEdit: true,
    })
  }

  checkValueText = ({ value, key = 'none' }) => {
    if (!value || value.trim().length <= 0) {
      if (key === 'name') {
        return null
      }

      return ''
    }

    return value.trim()
  }

  checkValueNumber = ({ value, key = 'none' }) => {
    if (!value && key !== 'price') {
      return 0
    }

    const { isBack } = this.props
    const number = Number(value.replace(',', '.'))
    if (!validate.isNumber(number)) {
      !isBack && CustomAlert.alertTimeout('Not a number, please type again')
      return null
    }

    if (key === 'price') {
      const { price, currency } = this.props.safeProduct

      // @ts-ignore
      this.setState({
        [key]: number,
      })

      return {
        id: price.id,
        value: number * 10000,
        currency: currency.currency,
      }
    }

    if (key === 'minimumOrderQuantity') {
      const floor = Math.floor(number)

      // @ts-ignore
      this.setState({
        [key]: floor,
      })
      return floor
    }

    return number
  }

  getValue = (key: string) => {
    if (key === 'name' || key === 'moqDescription') {
      return this.checkValueText({
        key,
        value: this.state[key],
      })
    }
    if (key === 'price' || key === 'minimumOrderQuantity') {
      return this.checkValueNumber({
        key,
        value: this.state[key].toString(),
      })
    }

    return null
  }

  onSubmit = (key: string) => () => {
    const { product, productFactory } = this.props
    const value = this.getValue(key)

    if (value === null || value === undefined) {
      // @ts-ignore
      this.setState({
        [key]: '',
      })
      return
    }

    productFactory
      .update(product.id, {
        [key]: value,
      })
      .subscribe(() => {
        productNavigation.setData(ProductData.Product, this.props.product)
        // this.setState({
        //   isEdit: false,
        // })
      })
  }

  get data() {
    const { isEdit } = this.state
    const {
      supplierName,
      categoryName,
      currency,
      safeStatus,
      name,
      MOQ,
      priceValue,
      safeEvent,
      harbour,
      incoTerm,
      createdByName,
      lastUpdatedByName,
      assignedName,
    } = this.props.safeProduct
    const formatPrice = priceValue.formatted === '0' ? '' : priceValue.formatted
    const symbolCurrency =
      getCurrencySymbol(currency.currency) || currency.currency

    return {
      symbolCurrency,
      supplierName,
      categoryName,
      safeStatus,
      harbour,
      incoTerm,
      createdByName,
      lastUpdatedByName,
      assignedName,
      name: isEdit ? this.state.name : name,
      price: isEdit ? this.state.price : formatPrice,
      minimumOrderQuantity: isEdit
        ? this.state.minimumOrderQuantity
        : MOQ.minimumOrderQuantity,
      moqDescription: isEdit ? this.state.moqDescription : MOQ.moqDescription,
      foundAt: safeEvent.eventName,
      currency: currency.currency,
    }
  }

  renderCurrencyTitle = (currency: string) => {
    const isCurrency = {
      isPrice: true,
    }
    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            productNavigation.open(ProductRef.SelectCurrency, isCurrency)
          }}
        >
          <Text style={styles.money}>{currency}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {
      symbolCurrency,
      supplierName,
      categoryName,
      safeStatus,
      name,
      price,
      minimumOrderQuantity,
      moqDescription,
      foundAt,
      currency,
      harbour,
      incoTerm,
      createdByName,
      lastUpdatedByName,
      assignedName,
    } = this.data

    return (
      <View style={styles.container}>
        {/* Supplier */}
        <AInput
          title={I18n.t('supplier').toUpperCase()}
          inputStyle={styles.inputSupplier}
          value={supplierName}
          // iconRight={images.search}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectSupplier)
          }}
        />

        {/* Category */}
        <AInput
          title={I18n.t('category').toUpperCase()}
          value={categoryName}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectCategory)
          }}
        />

        {/* Status */}
        <AInput
          title={I18n.t('status').toUpperCase()}
          value={SafeStatusType.getName(safeStatus.name)}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectStatus)
          }}
        />

        {/* Name */}
        <AInput
          ref={nodeRef => {
            productNavigation.setRef(ProductRef.Name, nodeRef)
          }}
          defaultValue={name}
          value={name}
          title={I18n.t('name').toUpperCase()}
          onChangeText={this.onChangeText('name')}
          onEndEditing={this.onSubmit('name')}
          onFocusTextInput={() => {
            productNavigation.current = ProductRef.Name
          }}
        />

        {/* Price */}
        <AInput
          ref={nodeRef => {
            productNavigation.setRef(ProductRef.Price, nodeRef)
          }}
          value={price}
          inputStyle={styles.inputPrice}
          title={I18n.t('price').toUpperCase()}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText('price')}
          onEndEditing={this.onSubmit('price')}
          onFocusTextInput={() => {
            productNavigation.current = ProductRef.Price
          }}
          customRightIcon={this.renderCurrencyTitle(currency)}
          textFieldProps={{
            prefix: symbolCurrency,
            affixTextStyle: {
              color: colors.dark_blue_grey,
            },
          }}
        />

        {/* MOQ */}
        <AInput
          ref={nodeRef => {
            productNavigation.setRef(ProductRef.MOQ, nodeRef)
          }}
          value={minimumOrderQuantity}
          keyboardType={'number-pad'}
          title={I18n.t('moq').toUpperCase()}
          onChangeText={this.onChangeText('minimumOrderQuantity')}
          onEndEditing={this.onSubmit('minimumOrderQuantity')}
          onFocusTextInput={() => {
            productNavigation.current = ProductRef.MOQ
          }}
        />

        {/* MOQ Description */}
        <AInput
          ref={nodeRef => {
            productNavigation.setRef(ProductRef.MOQDescription, nodeRef)
          }}
          value={moqDescription}
          title={I18n.t('moqDescription').toUpperCase()}
          onChangeText={this.onChangeText('moqDescription')}
          onEndEditing={this.onSubmit('moqDescription')}
          onFocusTextInput={() => {
            productNavigation.current = ProductRef.MOQDescription
          }}
        />

        {/* Harbour */}
        <AInput
          title={I18n.t('harbour').toUpperCase()}
          value={harbour}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectHarbour)
          }}
        />

        {/* Incoterm */}
        <AInput
          title={I18n.t('incoTerm').toUpperCase()}
          value={incoTerm}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectIncoTerm)
          }}
        />

        {/* Found At */}
        <AInput
          title={I18n.t('event').toUpperCase()}
          value={foundAt}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectEvent)
          }}
        />

        {/* Assigned To */}
        <AInput
          title={I18n.t('assignedTo').toUpperCase()}
          value={assignedName}
          editable={false}
          onPress={() => {
            productNavigation.open(ProductRef.SelectAssignee)
          }}
        />

        {/* Created By */}
        <AInput
          title={I18n.t('createdBy').toUpperCase()}
          value={createdByName}
          editable={false}
        />

        {/* Last Updated By */}
        <AInput
          title={I18n.t('lastUpdatedBy').toUpperCase()}
          value={lastUpdatedByName}
          editable={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: metrics.keylines_screen_product_info_margin,
  },
  wrapMoney: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.base,
    paddingVertical: metrics.small_base,
    marginRight: metrics.base,
  },
  money: {
    fontSize: fonts.size.m,
    fontWeight: '600',
    color: colors.blue_light_grey,
  },
  wrapButton: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
  inputPrice: {
    marginRight: 65,
  },
  inputSupplier: {
    marginRight: 50,
  },
})
