import * as React from 'react'
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Switch,
  View,
  Text,
} from 'react-native'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { Sample } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { SampleInfoContext } from '../SampleInfoContext'
import { withNavigation } from 'react-navigation'
import { colors, fonts, metrics } from '@/vars'
import { Subscription } from 'rxjs'
import { findIndex } from 'lodash'
import { isDecimal, isInt, isPrice, isPriceJson } from '@/shared/validator'
import { AInput } from '@/components/AInput/AInput'
import { AInput2 } from '@/components/AInput/AInput2'
import {
  SampleData,
  sampleNavigation,
  SampleRef,
} from '@/navigation/sampleNavigation'
import { SafeSample } from '@/shared/sample'

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
  sample?: Sample
  safeSample?: SafeSample
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
@withContext(SampleInfoContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SampleInfoDetailCustomField extends React.PureComponent<
  Props,
  State
> {
  _subscriptionExtendFieldDefinition: Subscription
  _subscriptionUpdateExtendField: Subscription
  _resultCustomField: Realm.Results<Sample>
  listIndexCustomField = []
  valuePrice = []

  _subscriptionSample: Subscription
  _resultSample: Realm.Results<Sample>
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

    this._resultSample && this._resultSample.removeAllListeners()
    this._subscriptionSample && this._subscriptionSample.unsubscribe()
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

    sampleNavigation.setData(SampleData.totalPriceOfCustomField, isPrice)
  }

  fetchExtendFieldDefinition = () => {
    const { extendedFieldDefinitionFactory } = this.props

    const [subscription, results] = extendedFieldDefinitionFactory.fetch(
      'sample.extendedFields-put-back-later' // Temporarly set wrong name to not fetch from the realm
    )

    this._resultCustomField = results

    this._subscriptionExtendFieldDefinition = subscription.subscribe(
      listExtendFieldDefinition => {
        sampleNavigation.setData(
          SampleData.hasCustomField,
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
              this.fetchSample()
            }
          }
        )
      }
    )
  }

  fetchSample = () => {
    const { sampleFactory, sample } = this.props

    const [subscription, results] = sampleFactory.fetchById(sample.id)

    this._firstTimeInitData = false
    this._resultSample = results

    this._subscriptionSample = subscription.subscribe(sample => {
      if (sample) {
        this.initExtendFieldData(sample)
      }
    })
  }

  initExtendFieldData = (sample: Sample) => {
    const { extendedFields } = new SafeSample(sample)
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
    sampleNavigation.current = SampleRef.CustomField
    sampleNavigation.currentCustomField = indexCurrency

    const customField = {
      isCustomField: true,
      movePickerList: false,
      indexOfField: index,
      indexOfFieldToUpDow: indexCurrency,
      setValue: this.onChangePriceCurrency,
      currency: priceObject.currency,
    }
    sampleNavigation.onMoveUpDow(SampleRef.CustomField, null, customField)
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
    const { extendedFieldFactory, sample } = this.props
    const { extendedFields, listExtendFieldDefinition } = this.state
    // @ts-ignore
    const { value, idExtendFieldData } = extendedFields[index]
    const extendFieldDefinition = listExtendFieldDefinition[index]
    const updateValue = this.getValueToSubmit(value, index, type)

    this._subscriptionUpdateExtendField = extendedFieldFactory
      .updateSample(
        idExtendFieldData,
        extendFieldDefinition,
        updateValue,
        sample
      )
      .subscribe(data => {
        if (sample.id === data.id) {
          this.initExtendFieldData(data)
        }
      })
  }

  renderTextInput = (label, index) => {
    const value = this.state.extendedFields[index].value
    return (
      <AInput
        ref={nodeRef => {
          sampleNavigation.setCustomFieldRef(
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
          sampleNavigation.current = SampleRef.CustomField
          sampleNavigation.currentCustomField = this.listIndexCustomField[index]
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
          sampleNavigation.setCustomFieldRef(
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
          sampleNavigation.current = SampleRef.CustomField
          sampleNavigation.currentCustomField = this.listIndexCustomField[index]
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

    sampleNavigation.setData(SampleData.indexOfField, this.listIndexCustomField)
    sampleNavigation.setData(SampleData.setValue, this.onChangePriceCurrency)
    sampleNavigation.setData(SampleData.currencyExtendField, this.valuePrice)
    const infoSetRef = {
      indexCurrency,
      product: false,
    }

    return (
      <AInput2
        forwardedRef={nodeRef => {
          sampleNavigation.setCustomFieldRef(
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
          sampleNavigation.current = SampleRef.CustomField
          sampleNavigation.currentCustomField = this.listIndexCustomField[index]
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
    const { createdByName, lastUpdatedByName } = this.props.safeSample

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
        <View style={styles.footer}>
          <Text style={styles.footerText}>{createdByName}</Text>
          <Text style={styles.footerText}>{lastUpdatedByName}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
  footer: {
    paddingTop: 12,
    paddingBottom: 36,
  },
  footerText: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
  },
})
