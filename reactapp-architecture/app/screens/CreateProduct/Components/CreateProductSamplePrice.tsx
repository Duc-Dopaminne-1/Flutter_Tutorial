import I18n from '@/i18n'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { AInput } from '@/components/AInput/AInput'
import { getCurrencySymbol } from '@/shared/format'
import validate from 'validate.js'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { ProductRef } from '@/navigation/productNavigation'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  samplePrice?: any
  currency?: string
  currencySamplePrice?: string
  inputRefs?: React.RefObject<any>[]
  samplePriceInputRef?: React.RefObject<any>
  setValue?: (data, key) => void
  setCurrentRefAndAllowKeyboardAware?: (currentRef, allowKeyboardAware) => void
} & DefaultProps

export type State = Readonly<typeof initialState>

@DelayRender({ delay: 350 })
@withContext(CreateProductContext.Consumer)
export class CreateProductSamplePrice extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  checkNumber = key => () => {
    const { setValue } = this.props
    const value = this.props[key] ? this.props[key].toString() : ''

    if (!value || value.length <= 0) {
      setValue('', key)
      return
    }

    const convertNumber = Number(value.replace(',', '.'))
    if (!validate.isNumber(convertNumber)) {
      alert('Not a number, please type again')
      setValue('', key)
      return
    }

    setValue(convertNumber, key)
  }

  onFocusTextInput = indexRef => () => {
    this.props.setCurrentRefAndAllowKeyboardAware(indexRef, true)
  }

  onChangeText = data => {
    this.props.setValue(data, 'samplePrice')
  }

  renderCurrencyTitle = (currency: string) => {
    const isCurrency = {
      currency,
      isSamplePrice: true,
    }

    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            createProductNavigation.current = ProductRef.CurrencySamplePrice
            createProductNavigation.currentPriceMatrix =
              createProductNavigation.PriceMatrixRefTotal +
              (CreateProductRef.CurrencySamplePrice -
                CreateProductRef.PriceMatrix)
            createProductNavigation.open(
              CreateProductRef.CurrencySamplePrice,
              isCurrency
            )
          }}
        >
          <Text style={styles.money}>{currency}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { samplePrice, currencySamplePrice } = this.props

    const symbolCurrency =
      getCurrencySymbol(currencySamplePrice) || currencySamplePrice

    return (
      <View style={styles.container}>
        {/* Price */}
        <AInput
          ref={nodeRef => {
            createProductNavigation.setRef(
              CreateProductRef.SamplePrice,
              nodeRef
            )
          }}
          value={samplePrice}
          inputStyle={styles.inputPrice}
          title={I18n.t('samplePrice').toUpperCase()}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText}
          onEndEditing={this.checkNumber('samplePrice')}
          customRightIcon={this.renderCurrencyTitle(currencySamplePrice)}
          onFocusTextInput={() => {
            createProductNavigation.current = CreateProductRef.SamplePrice
            createProductNavigation.currentPriceMatrix =
              createProductNavigation.PriceMatrixRefTotal +
              (CreateProductRef.SamplePrice - CreateProductRef.PriceMatrix)
          }}
          textFieldProps={{
            prefix: symbolCurrency,
            affixTextStyle: {
              color: colors.dark_blue_grey,
            },
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 261,
  },
  wrapButton: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
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
  inputPrice: {
    marginRight: 65,
  },
})
