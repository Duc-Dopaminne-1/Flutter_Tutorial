import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, Switch, View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { colors, fonts } from '@/vars'
import { Subscription } from 'rxjs'
import { isDecimal, isInt, isPrice } from '@/shared/validator'
import { AInput } from '@/components/AInput/AInput'
import { AInput2 } from '@/components/AInput/AInput2'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import {
  CreateProductData,
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { clone } from 'ramda'

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
  extendedFields?: []
  setValue?: (data, key) => void
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

@DelayRender({ delay: 200 })
@withContext(CreateProductContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class CreateProductCustomField extends React.PureComponent<
  Props,
  State
> {
  _subscriptionExtendFieldDefinition: Subscription
  _subscriptionUpdateExtendField: Subscription
  _extendFieldDefinitionResults: Realm.Results<any>
  listIndexCustomField = []
  valuePrice = []

  readonly state: State = initialState

  componentDidMount() {
    this.fetchExtendFieldDefinition()
  }

  componentWillUnmount() {
    this._subscriptionExtendFieldDefinition &&
      this._subscriptionExtendFieldDefinition.unsubscribe()
    this._extendFieldDefinitionResults &&
      this._extendFieldDefinitionResults.removeAllListeners()
    this._subscriptionUpdateExtendField &&
      this._subscriptionUpdateExtendField.unsubscribe()
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
    createProductNavigation.setData(
      CreateProductData.totalPriceOfCustomField,
      isPrice
    )
  }

  isEmpty = obj => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) return false
    }
    return true
  }

  fetchExtendFieldDefinition = () => {
    const { extendedFieldDefinitionFactory, setValue } = this.props

    const [subscription, results] = extendedFieldDefinitionFactory.fetch(
      'Product'
    )

    this._extendFieldDefinitionResults = results

    this._subscriptionExtendFieldDefinition = subscription.subscribe(
      listExtendFieldDefinition => {
        if (this.isEmpty(listExtendFieldDefinition)) {
          createProductNavigation.setData(
            CreateProductData.isCustomField,
            false
          )
        } else {
          createProductNavigation.setData(CreateProductData.isCustomField, true)
        }
        this.addListIndexCustomField(listExtendFieldDefinition)
        const _extendedFields = listExtendFieldDefinition.reduce(
          (acc, data) => {
            const priceValue = {
              id: '',
              currency: 'USD',
              value: '',
              __typename: 'Price',
            }

            const _tmp = {
              extendFieldDefinition: data,
              idExtendFieldData: '',
            }

            acc[0] = acc[0].concat({
              ..._tmp,
              value: data.type === 'price' ? JSON.stringify(priceValue) : '',
            })

            acc[1] = acc[1].concat({
              ..._tmp,
              value: data.type === 'price' ? priceValue : '',
            })

            return acc
          },
          [[], []]
        )

        this.setState({
          listExtendFieldDefinition,
          extendedFields: clone(_extendedFields[1]),
        })

        setValue && setValue(clone(_extendedFields[0]), 'extendedFields')
      }
    )
  }

  convertPriceJSON = (value: string) => {
    const data = JSON.parse(value)
    data.value = data.value / 10000

    return data
  }

  onChangeText = (index: string | number) => (value: string) => {
    const _extendedFields = clone(this.state.extendedFields)
    _extendedFields[index].value = value

    this.setState({
      extendedFields: _extendedFields,
    })
  }

  onChangeBooleanValue = (index: string | number) => (value: boolean) => {
    const _extendedFields = clone(this.state.extendedFields)
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
    const _extendedFields = clone(this.state.extendedFields)

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
    const _extendedFields = clone(this.state.extendedFields)

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

    createProductNavigation.current = CreateProductRef.CustomField
    createProductNavigation.currentCustomField = indexCurrency

    const customField = {
      isCustomField: true,
      movePickerList: false,
      indexOfField: index,
      indexOfFieldToUpDow: indexCurrency,
      setValue: this.onChangePriceCurrency,
      currency: priceObject.currency,
    }
    createProductNavigation.onMoveUpDow(
      CreateProductRef.CustomField,
      null,
      customField
    )
    // this.props.navigation.navigate('SelectCurrencyPicker', {
    //   isCustomField: true,
    //   indexOfField: index,
    //   setValue: this.onChangePriceCurrency,
    //   currency: priceObject.currency,
    // })
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
    const { setValue } = this.props
    const { extendedFields } = this.state
    // @ts-ignore
    const { value } = extendedFields[index]

    const updateValue = this.getValueToSubmit(value, index, type)

    const cloneData = clone(this.props.extendedFields)
    cloneData[index].value = updateValue
    setValue && setValue(cloneData, 'extendedFields')
  }

  renderTextInput = (label, index) => {
    const value = this.state.extendedFields[index].value

    return (
      <AInput
        ref={nodeRef => {
          createProductNavigation.setCustomFieldRef(
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
          createProductNavigation.current = CreateProductRef.CustomField
          createProductNavigation.currentCustomField = this.listIndexCustomField[
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
          createProductNavigation.setCustomFieldRef(
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
          createProductNavigation.current = CreateProductRef.CustomField
          createProductNavigation.currentCustomField = this.listIndexCustomField[
            index
          ]
        }}
      />
    )
  }

  setDataPriceInput = (index, priceObject) => {
    this.listIndexCustomField.map(data => {
      if (this.listIndexCustomField.indexOf(data) === index) {
        this.valuePrice[index] = priceObject.currency
      }
    })

    createProductNavigation.setData(
      CreateProductData.indexOfField,
      this.listIndexCustomField
    )
    createProductNavigation.setData(
      CreateProductData.setValue,
      this.onChangePriceCurrency
    )
    createProductNavigation.setData(
      CreateProductData.currencyExtendField,
      this.valuePrice
    )
  }

  renderPriceInput = (label, index) => {
    const indexCurrency = this.listIndexCustomField[index] + 1
    const priceObject = this.state.extendedFields[index].value

    this.setDataPriceInput(index, priceObject)
    const infoSetRef = {
      indexCurrency,
      isCreateProduct: true,
    }

    return (
      <AInput2
        forwardedRef={nodeRef => {
          createProductNavigation.setCustomFieldRef(
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
          createProductNavigation.current = CreateProductRef.CustomField
          createProductNavigation.currentCustomField = this.listIndexCustomField[
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
  container: {},
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
