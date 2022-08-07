import * as React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { colors, fonts, metrics, normalize } from '@/vars'
import { AInput } from '@/components/AInput/AInput'
import { getCurrencySymbol } from '@/shared/format'
import { productNavigation } from '@/navigation/productNavigation'
import { createProductNavigation } from '@/navigation/createProductNavigation'

// init state
const initialState = {}

type AInput2Props = {
  value: string
  label: string
  currency: any
  infoSetRef: {
    product?: boolean
    isCreateProduct?: boolean
    indexCurrency: number
  }
  onChangeText: (text) => void
  onPressCurrency: () => void
  onEndEditing: () => void
  forwardedRef: any
  onFocusTextInput?: any
}

export class AInput2 extends React.PureComponent<AInput2Props> {
  static defaultProps = {
    indexCurrency: 0,
  }

  readonly state = initialState

  renderCurrency = () => {
    const { currency, onPressCurrency, infoSetRef } = this.props

    return (
      <View
        ref={nodeRef => {
          if (infoSetRef && infoSetRef.isCreateProduct) {
            createProductNavigation.setIndexCurrencyExtenddRefs(
              infoSetRef.indexCurrency,
              nodeRef
            )
          }
          if (infoSetRef && infoSetRef.product) {
            productNavigation.setIndexCurrencyExtenddRefs(
              infoSetRef.indexCurrency,
              nodeRef
            )
          }
        }}
        style={styles.wrapButtonCurrency}
      >
        <TouchableOpacity style={styles.wrapMoney} onPress={onPressCurrency}>
          <Text style={styles.money}>{currency}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {
      value,
      label,
      currency,
      onChangeText,
      onEndEditing,
      forwardedRef,
      onFocusTextInput,
    } = this.props

    const currencySymbol = getCurrencySymbol(currency) || currency

    return (
      <AInput
        ref={forwardedRef}
        value={value}
        title={label.toUpperCase()}
        onChangeText={onChangeText}
        keyboardType={'numeric'}
        customRightIcon={this.renderCurrency()}
        inputContainerStyle={styles.textInput}
        onEndEditing={onEndEditing}
        onFocusTextInput={onFocusTextInput}
        textFieldProps={{
          prefix: currencySymbol,
          affixTextStyle: {
            color: colors.dark_blue_grey,
          },
        }}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {},
  textInput: {
    paddingRight: 70,
  },
  wrapButtonCurrency: {
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
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.blue_light_grey,
  },
})
