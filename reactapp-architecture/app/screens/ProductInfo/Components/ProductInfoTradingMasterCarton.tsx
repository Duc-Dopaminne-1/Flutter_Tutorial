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
  openMasterUnit: false,
  openMasterWeightUnit: false,
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
export class ProductInfoTradingMasterCarton extends React.PureComponent<
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
      const { openMasterUnit, openMasterWeightUnit }: any = data

      this.setState({
        openMasterUnit,
        openMasterWeightUnit,
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
    const { master } = carton

    this.setState({
      width: this.convertZeroToEmptyText(master.width.toString()),
      height: this.convertZeroToEmptyText(master.height.toString()),
      length: this.convertZeroToEmptyText(master.length.toString()),
      itemsQuantity: this.convertZeroToEmptyText(
        master.itemsQuantityString.toString()
      ),
      weight: this.convertZeroToEmptyText(master.weight.toString()),
    })
  }

  updateProductInfo = () => {
    this._subscriptionUpdateProductInfo = updateProductInfo.subscribe(
      product => {
        if (!product) return

        const { carton } = new SafeProduct(product)
        const { master } = carton

        this.setState({
          width: this.convertZeroToEmptyText(master.width.toString()),
          height: this.convertZeroToEmptyText(master.height.toString()),
          length: this.convertZeroToEmptyText(master.length.toString()),
          itemsQuantity: this.convertZeroToEmptyText(
            master.itemsQuantityString.toString()
          ),
          weight: this.convertZeroToEmptyText(master.weight.toString()),
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
    const { productFactory, product, safeProduct } = this.props
    const { carton } = safeProduct
    const cartonPackaging = carton.getCarton('masterCarton')
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
        masterCarton: {
          id: cartonPackaging.data.id,
          [key]: value,
        },
      })
      .subscribe(() => {})
  }

  get data() {
    const { carton } = this.props.safeProduct
    const { master } = carton
    const { isEdit, width, height, length, itemsQuantity, weight } = this.state

    return {
      width: isEdit ? width : master.width.toString(),
      height: isEdit ? height : master.height.toString(),
      length: isEdit ? length : master.length.toString(),
      itemsQuantity: isEdit ? itemsQuantity : master.itemsQuantity.toString(),
      weight: isEdit ? weight : master.weight.toString(),
      unit: carton.master.unit,
      weightUnit: carton.master.weightUnit,
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

    const { openMasterUnit, openMasterWeightUnit } = this.state

    return (
      <ProductInfoTradingForm title={I18n.t('masterCarton')}>
        <ARow>
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.MasterWith, nodeRef)
            }}
            value={width}
            title={I18n.t('width').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('width')}
            onEndEditing={this.onSubmit('width')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.MasterWith
            }}
          />
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.MasterHeight, nodeRef)
            }}
            value={height}
            title={I18n.t('height').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('height')}
            onEndEditing={this.onSubmit('height')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.MasterHeight
            }}
          />
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.MasterDepth, nodeRef)
            }}
            value={length}
            title={I18n.t('depth').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('length')}
            onEndEditing={this.onSubmit('length')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.MasterDepth
            }}
          />
          <AInput
            value={unit}
            title={I18n.t('unit').toUpperCase()}
            editable={false}
            modalIsOn={openMasterUnit}
            containerStyle={styles.input}
            onPress={() => {
              productNavigation.open(ProductRef.MasterUnit)
            }}
          />
        </ARow>

        <ARow>
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.MasterQuality, nodeRef)
            }}
            value={itemsQuantity}
            title={I18n.t('quantity').toUpperCase()}
            keyboardType={'number-pad'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('itemsQuantity')}
            onEndEditing={this.onSubmit('itemsQuantity')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.MasterQuality
            }}
          />
          <AInput
            ref={nodeRef => {
              productNavigation.setRef(ProductRef.MasterWeight, nodeRef)
            }}
            value={weight}
            title={I18n.t('weight').toUpperCase()}
            keyboardType={'numeric'}
            containerStyle={styles.input}
            onChangeText={this.onChangeText('weight')}
            onEndEditing={this.onSubmit('weight')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.MasterWeight
            }}
          />
          <AInput
            value={weightUnit}
            title={I18n.t('weightUnit').toUpperCase()}
            editable={false}
            modalIsOn={openMasterWeightUnit}
            containerStyle={styles.input}
            onPress={() => {
              productNavigation.open(ProductRef.MasterWeightUnit)
            }}
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
