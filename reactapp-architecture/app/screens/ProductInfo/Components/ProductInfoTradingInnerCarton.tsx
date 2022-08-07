import { AInput } from '@/components/AInput/AInput'
import { ARow } from '@/components/ARow/ARow'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ProductInfoTradingForm } from '@/screens/ProductInfo/Components/ProductInfoTradingForm'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import validate from 'validate.js'
import { Subscription } from 'rxjs'
import { updateProductInfo } from '@/services/global'

// init state
const initialState = {
  isEdit: false,

  width: '',
  height: '',
  length: '',
  itemsQuantity: '',
  weight: '',

  openInnerUnit: false,
  openInnerWeightUnit: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product?: Product
  safeProduct?: SafeProduct
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> &
  Readonly<{
    [key: string]: any
  }>

@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
export class ProductInfoTradingInnerCarton extends React.PureComponent<
  Props,
  State
> {
  _subscription: Subscription
  _subscriptionUpdateProductInfo: Subscription

  readonly state: State = initialState

  componentDidMount() {
    this.init()
    this.updateProductInfo()

    this._subscription = productNavigation.subjectCarton.subscribe(data => {
      const { openInnerUnit, openInnerWeightUnit }: any = data

      this.setState({
        openInnerUnit,
        openInnerWeightUnit,
      })
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._subscriptionUpdateProductInfo &&
      this._subscriptionUpdateProductInfo.unsubscribe()
  }

  init = () => {
    const { safeProduct } = this.props
    const { carton } = safeProduct
    const { inner } = carton

    this.setState({
      width: this.convertZeroToEmptyText(inner.width.toString()),
      height: this.convertZeroToEmptyText(inner.height.toString()),
      length: this.convertZeroToEmptyText(inner.length.toString()),
      itemsQuantity: this.convertZeroToEmptyText(
        inner.itemsQuantityString.toString()
      ),
      weight: this.convertZeroToEmptyText(inner.weight.toString()),
    })
  }

  updateProductInfo = () => {
    this._subscriptionUpdateProductInfo = updateProductInfo.subscribe(
      product => {
        if (!product) return

        const { carton } = new SafeProduct(product)
        const { inner } = carton

        this.setState({
          width: this.convertZeroToEmptyText(inner.width.toString()),
          height: this.convertZeroToEmptyText(inner.height.toString()),
          length: this.convertZeroToEmptyText(inner.length.toString()),
          itemsQuantity: this.convertZeroToEmptyText(
            inner.itemsQuantityString.toString()
          ),
          weight: this.convertZeroToEmptyText(inner.weight.toString()),
        })
      }
    )
  }

  convertZeroToEmptyText = (text: string) => {
    if (text === '0') return ''

    return text
  }

  onChangeText = (key: string) => (_text: string) => {
    const text: string =
      key === 'itemsQuantity' ? _text.replace(/\D/g, '') : _text
    this.setState({
      [key]: text,
      isEdit: true,
    })
  }

  checkValue = key => {
    const value = this.state[key].toString()

    if (!value || value.length === 0) {
      return 0
    }

    const number = Number(value.replace(',', '.'))
    if (!validate.isNumber(number)) {
      alert(I18n.t('notANumber'))
      return null
    }

    if (key === 'itemsQuantity') {
      const convertFloor = Math.floor(number)
      this.setState({
        [key]: convertFloor,
      })

      return convertFloor
    }

    // set convertToNumber value to state
    this.setState({
      [key]: number,
    })

    return number
  }

  onSubmit = (key: string) => () => {
    const { productFactory, safeProduct, product } = this.props
    const { carton } = safeProduct
    const cartonPackaging = carton.getCarton('innerCarton')
    const value = this.checkValue(key)

    if (value === null || value === undefined) {
      this.setState({
        [key]: '',
      })
      return
    }

    productFactory
      .update(product.id, {
        // @ts-ignore
        innerCarton: {
          id: cartonPackaging.data.id,
          [key]: value,
        },
      })
      .subscribe(() => {})
  }

  get data() {
    const { carton } = this.props.safeProduct
    const { inner } = carton
    const { isEdit, width, height, length, itemsQuantity, weight } = this.state

    return {
      width: isEdit ? width : inner.width.toString(),
      height: isEdit ? height : inner.height.toString(),
      length: isEdit ? length : inner.length.toString(),
      itemsQuantity: isEdit ? itemsQuantity : inner.itemsQuantity.toString(),
      weight: isEdit ? weight : inner.weight.toString(),
      unit: carton.inner.unit,
      weightUnit: carton.inner.weightUnit,
    }
  }

  render() {
    const {
      width,
      height,
      length,
      itemsQuantity,
      weight,
      unit,
      weightUnit,
    } = this.data

    const { openInnerUnit, openInnerWeightUnit } = this.state

    return (
      <ProductInfoTradingForm title={I18n.t('innerCarton')}>
        <ARow>
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.InnerWith, nodeRef)
            }}
            value={width}
            title={I18n.t('width').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('width')}
            onEndEditing={this.onSubmit('width')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.InnerWith
            }}
          />

          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.InnerHeight, nodeRef)
            }}
            value={height}
            title={I18n.t('height').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('height')}
            onEndEditing={this.onSubmit('height')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.InnerHeight
            }}
          />

          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.InnerDepth, nodeRef)
            }}
            value={length}
            title={I18n.t('depth').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('length')}
            onEndEditing={this.onSubmit('length')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.InnerDepth
            }}
          />

          <AInput
            value={unit}
            title={I18n.t('unit').toUpperCase()}
            editable={false}
            onPress={() => {
              productNavigation.open(ProductRef.InnerUnit)
            }}
            modalIsOn={openInnerUnit}
            containerStyle={styles.input}
          />
        </ARow>

        <ARow>
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.InnerQuality, nodeRef)
            }}
            value={itemsQuantity}
            title={I18n.t('quantity').toUpperCase()}
            keyboardType={'number-pad'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('itemsQuantity')}
            onEndEditing={this.onSubmit('itemsQuantity')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.InnerQuality
            }}
          />

          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.InnerWeight, nodeRef)
            }}
            value={weight}
            title={I18n.t('weight').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('weight')}
            onEndEditing={this.onSubmit('weight')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.InnerWeight
            }}
          />

          <AInput
            title={I18n.t('weightUnit').toUpperCase()}
            value={weightUnit}
            editable={false}
            onPress={() => {
              productNavigation.open(ProductRef.InnerWeightUnit)
            }}
            modalIsOn={openInnerWeightUnit}
            containerStyle={styles.input}
          />

          <View style={{ flex: 1 }} />
        </ARow>
      </ProductInfoTradingForm>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    marginRight: 3,
  },
})
