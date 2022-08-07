import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, Switch, View } from 'react-native'
import { ProductInfoContext } from '../ProductInfoContext'
import { withNavigation } from 'react-navigation'
import { colors, fonts, metrics } from '@/vars'
import { Subscription } from 'rxjs'
import { SafeProduct } from '@/shared/product'
import { findIndex } from 'lodash'
import { isDecimal, isInt, isPrice, isPriceJson } from '@/shared/validator'
import { AInput } from '@/components/AInput/AInput'
import { AInput2 } from '@/components/AInput/AInput2'
import {
  ProductData,
  productNavigation,
  ProductRef,
} from '@/navigation/productNavigation'

// init state
const initialState = {
  listExtendFieldDefinition: [],
  extendedFields: [],
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product?: Product
  isBack?: boolean
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

const extendFieldType = {
  text: 'text',
  price: 'price',
  decimal: 'decimal',
  int: 'int',
  tel: 'tel',
  boolean: 'boolean',
}

@DelayRender({ delay: 300 })
@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ProductInfoDetailCustomField extends React.PureComponent<
  Props,
  State
> {
  _subscriptionExtendFieldDefinition: Subscription
  _subscriptionUpdateExtendField: Subscription
  _resultCustomField: Realm.Results<Product>
  listIndexCustomField = []
  valuePrice = []

  _subscriptionProduct: Subscription
  _resultProduct: Realm.Results<Product>
  _firstTimeInitData: boolean = true

  readonly state: State = initialState

  componentDidMount() {
    this.fetchExtendFieldDefinition()
  }

  componentWillUnmount() {
    this._resultCustomField && this._resultCustomField.removeAllListeners()
    this._subscriptionExtendFieldDefinition &&
      this._subscriptionExtendFieldDefinition.unsubscribe()
    this._subscriptionUpdateExtendField &&
      this._subscriptionUpdateExtendField.unsubscribe()

    this._resultProduct && this._resultProduct.removeAllListeners()
    this._subscriptionProduct && this._subscriptionProduct.unsubscribe()
  }

  addListIndexCustomField = listExtendFieldDefinition => {
    let i = 0
    let isPrice = 0
    let isBoolean = 0
    for (i; i < listExtendFieldDefinition.length; i++) {
      if (listExtendFieldDefinition[i].type === 'price') {
        this.listIndexCustomField.push(i + 1 + isPrice - isBoolean)
        isPrice++
      } else if (i > 0 && listExtendFieldDefinition[i].type === 'boolean') {
        isBoolean++
        this.listIndexCustomField.push(100)
      } else {
        this.listIndexCustomField.push(i + 1 + isPrice - isBoolean)
      }
    }
    this.listIndexCustomField.map(data => {
      this.valuePrice.push(data)
    })

    productNavigation.setData(ProductData.totalPriceOfCustomField, isPrice)
  }

  fetchExtendFieldDefinition = () => {
    const { extendedFieldDefinitionFactory } = this.props

    const [subscription, results] = extendedFieldDefinitionFactory.fetch(
      'Product'
    )

    this._resultCustomField = results

    this._subscriptionExtendFieldDefinition = subscription.subscribe(
      listExtendFieldDefinition => {
        productNavigation.setData(
          ProductData.hasCustomField,
          listExtendFieldDefinition.length > 0
        )

        this.addListIndexCustomField(listExtendFieldDefinition)

        const extendedFields = listExtendFieldDefinition.map(data => {
          const priceValue = {
            id: '',
            currency: 'USD',
            value: '',
            __typename: 'Price',
          }

          return {
            idExtendFieldDefinition: data.id,
            idExtendFieldData: '',
            value: data.type === 'price' ? priceValue : '',
          }
        })

        this.setState(
          {
            listExtendFieldDefinition,
            extendedFields,
          },
          () => {
            if (this._firstTimeInitData) {
              // this.initExtendFieldData(this.props.product)
              this.fetchProduct()
            }
          }
        )
      }
    )
  }

  fetchProduct = () => {
    const { productFactory, product } = this.props

    const [subscription, results] = productFactory.fetchById(product.id)

    this._firstTimeInitData = false
    this._resultProduct = results

    this._subscriptionProduct = subscription.subscribe(product => {
      if (product) {
        this.initExtendFieldData(product)
      }
    })
  }

  initExtendFieldData = (product: Product) => {
    const { extendedFields } = new SafeProduct(product)
    const _extendedFields = [...this.state.extendedFields]

    extendedFields.forEach(item => {
      const { definition, value } = item
      const index = findIndex(this.state.extendedFields, data => {
        // @ts-ignore
        return data.idExtendFieldDefinition === definition.id
      })

      if (index === -1) return

      _extendedFields[index].value = isPriceJson(value)
        ? this.convertPriceJSON(value)
        : value
      _extendedFields[index].idExtendFieldData = item.id
    })

    this.setState({
      extendedFields: _extendedFields,
    })
  }

  convertPriceJSON = (value: string) => {
    const data = JSON.parse(value)
    data.value = data.value / 10000

    return data
  }

  onChangeText = (index: string | number) => (value: string) => {
    const _extendedFields = [...this.state.extendedFields]
    _extendedFields[index].value = value

    this.setState({
      extendedFields: _extendedFields,
    })
  }

  onChangeBooleanValue = (index: string | number) => (value: boolean) => {
    const _extendedFields = [...this.state.extendedFields]
    _extendedFields[index].value = value ? 'Yes' : 'No'

    this.setState(
      {
        extendedFields: _extendedFields,
      },
      () => {
        this.submit(index, extendFieldType.boolean)
      }
    )
  }

  onChangePriceValue = (index: string | number) => (value: string) => {
    const _extendedFields = [...this.state.extendedFields]

    if (
      _extendedFields[index].value.__typename &&
      _extendedFields[index].value.__typename === 'Price'
    ) {
      _extendedFields[index].value.value = value
    }

    this.setState({
      extendedFields: _extendedFields,
    })
  }

  onChangePriceCurrency = (value: string, index: string | number) => {
    const _extendedFields = [...this.state.extendedFields]

    if (
      _extendedFields[index].value.__typename &&
      _extendedFields[index].value.__typename === 'Price'
    ) {
      _extendedFields[index].value.currency = value
    }

    this.setState(
      {
        extendedFields: _extendedFields,
      },
      () => {
        this.submit(index, extendFieldType.price)
      }
    )
  }

  openCurrencyPicker = (index: number, indexCurrency: number) => () => {
    const priceObject = this.state.extendedFields[index].value
    productNavigation.current = ProductRef.CustomField
    productNavigation.currentCustomField = indexCurrency

    const customField = {
      isCustomField: true,
      movePickerList: false,
      indexOfField: index,
      indexOfFieldToUpDow: indexCurrency,
      setValue: this.onChangePriceCurrency,
      currency: priceObject.currency,
    }
    productNavigation.onMoveUpDow(ProductRef.CustomField, null, customField)
  }

  checkNumber = ({
    index,
    typeCheck = extendFieldType.int,
    typeData = 'none',
  }) => {
    const { isBack } = this.props
    const { extendedFields } = this.state
    const { value } = extendedFields[index]

    if (value.length <= 0) {
      this.submit(index, typeData)
      return
    }
    if (typeCheck === extendFieldType.int && isInt(value, isBack)) {
      this.submit(index, typeData)
      return
    }
    if (typeCheck === extendFieldType.decimal && isDecimal(value, isBack)) {
      // Change to dot
      const convert = value.toString().replace(',', '.')
      this.onChangeText(index)(convert)

      this.submit(index, typeData)
      return
    }

    this.onChangeText(index)('')
  }

  checkPrice = index => {
    const { isBack } = this.props
    const { extendedFields } = this.state
    const { value } = extendedFields[index]

    if (value && value.value.length <= 0) {
      this.submit(index, extendFieldType.price)
      return
    }
    if (value && value.value && isPrice(value.value, isBack)) {
      // Change to dot
      const convert = value.value.toString().replace(',', '.')
      this.onChangePriceValue(index)(convert)

      this.submit(index, extendFieldType.price)
      return
    }

    this.onChangePriceValue(index)('')
  }

  convertPriceWhenSubmit = (priceData, index) => {
    const convertData = {
      ...priceData,
      value: '',
    }
    const convert2Number = Number(priceData.value.toString().replace(',', '.'))

    if (convert2Number) {
      const calculate = convert2Number * 10000
      convertData.value = calculate.toString()
      this.onChangePriceValue(index)(convert2Number.toString())
    } else {
      this.onChangePriceValue(index)('')
    }

    return JSON.stringify(convertData)
  }

  convertTelWhenSubmit = (value, index) => {
    const convert2String = value.toString()
    const convert2Number = Number(convert2String)

    if (convert2Number === 0) {
      this.onChangeText(index)('')
      return ''
    }

    return value
  }

  removeZeroFromValue = (value, index) => {
    const convert2String = value.toString()
    const convert2Dot = convert2String.replace(',', '.')
    const convert2Number = Number(convert2Dot)

    if (convert2Number === 0) {
      this.onChangeText(index)('')
      return ''
    }

    this.onChangeText(index)(convert2Number.toString())
    return convert2Number.toString()
  }

  getValueToSubmit = (value, index, type) => {
    if (type === extendFieldType.text || type === extendFieldType.boolean) {
      return value.trim()
    }

    if (type === extendFieldType.tel) {
      return this.convertTelWhenSubmit(value, index)
    }

    if (type === extendFieldType.price) {
      return this.convertPriceWhenSubmit(value, index)
    }

    return this.removeZeroFromValue(value, index)
  }

  submit = (index: string | number, type = 'none') => {
    const { extendedFieldFactory, product } = this.props
    const { extendedFields, listExtendFieldDefinition } = this.state
    // @ts-ignore
    const { value, idExtendFieldData } = extendedFields[index]
    const extendFieldDefinition = listExtendFieldDefinition[index]
    const updateValue = this.getValueToSubmit(value, index, type)

    this._subscriptionUpdateExtendField = extendedFieldFactory
      .update(idExtendFieldData, extendFieldDefinition, updateValue, product)
      .subscribe(data => {
        if (product.id === data.id) {
          this.initExtendFieldData(data)
        }
      })
  }

  renderTextInput = (label, index) => {
    const value = this.state.extendedFields[index].value
    return (
      <AInput
        ref={nodeRef => {
          productNavigation.setCustomFieldRef(
            this.listIndexCustomField[index],
            nodeRef
          )
        }}
        title={label.toUpperCase()}
        value={value}
        onChangeText={this.onChangeText(index)}
        onEndEditing={() => {
          this.submit(index, extendFieldType.text)
        }}
        onFocusTextInput={() => {
          productNavigation.current = ProductRef.CustomField
          productNavigation.currentCustomField = this.listIndexCustomField[
            index
          ]
        }}
      />
    )
  }

  renderNumberInput = (label, index, type) => {
    const value = this.state.extendedFields[index].value
    const typeCheck =
      type === extendFieldType.decimal ? type : extendFieldType.int

    return (
      <AInput
        ref={nodeRef => {
          productNavigation.setCustomFieldRef(
            this.listIndexCustomField[index],
            nodeRef
          )
        }}
        title={label.toUpperCase()}
        value={value}
        onChangeText={this.onChangeText(index)}
        keyboardType={'numeric'}
        onEndEditing={() => {
          this.checkNumber({
            index,
            typeCheck,
            typeData: type,
          })
        }}
        onFocusTextInput={() => {
          productNavigation.current = ProductRef.CustomField
          productNavigation.currentCustomField = this.listIndexCustomField[
            index
          ]
        }}
      />
    )
  }

  renderPriceInput = (label, index) => {
    const indexCurrency = this.listIndexCustomField[index] + 1
    const priceObject = this.state.extendedFields[index].value

    this.listIndexCustomField.map(data => {
      if (this.listIndexCustomField.indexOf(data) === index) {
        this.valuePrice[index] = priceObject.currency
      }
    })

    productNavigation.setData(
      ProductData.indexOfField,
      this.listIndexCustomField
    )
    productNavigation.setData(ProductData.setValue, this.onChangePriceCurrency)
    productNavigation.setData(ProductData.currencyExtendField, this.valuePrice)
    const infoSetRef = {
      indexCurrency,
      product: true,
    }

    return (
      <AInput2
        forwardedRef={nodeRef => {
          productNavigation.setCustomFieldRef(
            this.listIndexCustomField[index],
            nodeRef
          )
        }}
        value={priceObject.value}
        label={label}
        infoSetRef={infoSetRef}
        currency={priceObject.currency}
        onChangeText={this.onChangePriceValue(index)}
        onPressCurrency={this.openCurrencyPicker(index, indexCurrency)}
        onEndEditing={() => {
          this.checkPrice(index)
        }}
        onFocusTextInput={() => {
          productNavigation.current = ProductRef.CustomField
          productNavigation.currentCustomField = this.listIndexCustomField[
            index
          ]
        }}
      />
    )
  }

  renderSwitchCustom = index => {
    const value = this.state.extendedFields[index].value
    const convertToTF = value.toLowerCase() === 'yes'

    return (
      <View style={styles.wrapSwitch}>
        <Switch
          value={convertToTF}
          onValueChange={this.onChangeBooleanValue(index)}
        />
      </View>
    )
  }

  renderSwitch = (label, index) => {
    return (
      <AInput
        title={label.toUpperCase()}
        value={label}
        editable={false}
        customRightIcon={this.renderSwitchCustom(index)}
      />
    )
  }

  renderItem = ({ item, index }) => {
    const { label, type } = item

    if (type === extendFieldType.text) {
      return this.renderTextInput(label, index)
    }
    if (type === extendFieldType.price) {
      return this.renderPriceInput(label, index)
    }
    if (type === extendFieldType.boolean) {
      return this.renderSwitch(label, index)
    }
    return this.renderNumberInput(label, index, type)
  }

  render() {
    const { listExtendFieldDefinition } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          data={listExtendFieldDefinition}
          extraData={this.state}
          keyExtractor={(_, index) => index.toString()}
          listKey={'ProductInfoDetailCustomField'}
          renderItem={this.renderItem}
          onScrollBeginDrag={Keyboard.dismiss}
          keyboardShouldPersistTaps={'always'}
          onEndReachedThreshold={0.5}
          bounces={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingBottom: 61,
    marginHorizontal: metrics.keylines_screen_product_info_margin,
  },
  title: {
    marginTop: 10,
    marginBottom: 5,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.s,
    color: colors.light_blue_grey,
  },
  wrapSwitch: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
})
