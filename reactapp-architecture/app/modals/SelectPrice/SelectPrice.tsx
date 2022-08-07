import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, devices, fonts, metrics } from '@/vars'
import I18n from '@/i18n'
import { getCurrencySymbol } from '@/shared/format'
import { AInput } from '@/components/AInput/AInput'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { navigation } from '@/navigation/navigation'
import Modal from 'react-native-modal'
import { Toast } from '@/services/global'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import validate from 'validate.js'
import { CustomAlert } from '@/shared/alert'

// init state
const initialState = {
  price: '',
  isModalVisible: true,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      productId: string[]
    }>
  >

export type State = Readonly<typeof initialState> &
  Partial<{
    price: string
    isModalVisible: boolean
  }>

@withContext(AppContext.Consumer)
export class SelectPrice extends React.PureComponent<Props, State> {
  currency = 'USD'
  productId = []
  countClick = false

  readonly state = initialState

  async componentDidMount() {
    this.productId = this.props.navigation.getParam('productId', [])
  }

  onChangeTextPrice = text => {
    this.setState({ price: text })
  }

  textInput = () => {
    const currency = getCurrencySymbol(this.currency) || this.currency
    return (
      <AInput
        ref={nodeRef => {
          productNavigation.setRef(ProductRef.Price, nodeRef)
        }}
        value={this.state.price}
        inputContainerStyle={styles.modalInputContainer}
        inputStyle={styles.inputPrice}
        title={I18n.t('price').toUpperCase()}
        keyboardType={'numeric'}
        containerStyle={{ marginLeft: 20, marginRight: 14 }}
        onChangeText={this.onChangeTextPrice}
        onFocusTextInput={() => {
          productNavigation.current = ProductRef.Price
        }}
        textFieldProps={{
          prefix: currency,
          affixTextStyle: {
            color: colors.dark_blue_grey,
          },
        }}
      />
    )
  }

  selectPriceMulti = (currency: string) => {
    this.currency = currency
    this.setState({ isModalVisible: true })
  }

  renderCurrencyTitle = () => {
    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            this.setState({ isModalVisible: false })
            devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()
            this.props.navigation.navigate('SelectCurrencyPicker', {
              productIds: this.productId,
              selectPriceMultiCurrency: this.currency,
              selectPriceMulti: this.selectPriceMulti,
              hideUpDownClear: true,
            })
          }}
        >
          <Text style={styles.money}>{this.currency}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  checkPrice = () => {
    const { price } = this.state

    if (!price) {
      this.onChangeTextPrice('')
      CustomAlert.alertTimeout(I18n.t('enterNumber'))
      return false
    }

    const convertToNumber = Number(price.toString().replace(',', '.'))
    if (!validate.isNumber(convertToNumber)) {
      this.onChangeTextPrice('')
      CustomAlert.alertTimeout(I18n.t('notANumber'))
      return false
    }

    return {
      value: convertToNumber * 10000,
      currency: this.currency,
    }
  }

  updatePrice = () => {
    if (!this.countClick) {
      this.countClick = true
      const { productFactory } = this.props
      const price = this.checkPrice()

      if (!price) {
        this.countClick = false
        return
      }

      productFactory
        .updatePriceMultiProduct(this.productId, price)
        .subscribe(() => {})

      this.hideModal()
    }
  }

  hideModal() {
    Toast.next({
      message: I18n.t('totalProductUpdate', {
        total: this.productId.length,
        isMany: this.productId.length === 1 ? '' : 's',
      }),
    })
    navigation.goBack(null)
  }

  cancelModal = () => {
    if (!this.countClick) {
      this.setState({ isModalVisible: false })
      navigation.goBack(null)
    }
  }

  modalButton = () => {
    return (
      <View style={styles.modalWrapButton}>
        <TouchableOpacity
          onPress={() => {
            this.cancelModal()
          }}
          style={[styles.modalButtonCancel, { backgroundColor: colors.white }]}
        >
          <Text
            style={[styles.modalButtonText, { color: colors.blue_light_grey }]}
          >
            {I18n.t('cancel')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.updatePrice}
          style={[
            styles.modalButtonCancel,
            { backgroundColor: colors.primary_blue },
          ]}
        >
          <Text style={[styles.modalButtonText, { color: colors.white }]}>
            {I18n.t('save')}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  title = () => {
    return (
      <View style={styles.wrapTitle}>
        <Text style={styles.title}>{I18n.t('productPrice')}</Text>
      </View>
    )
  }

  render() {
    return (
      <Modal
        isVisible={this.state.isModalVisible}
        animationOutTiming={500}
        useNativeDriver
      >
        <View style={styles.container}>
          {this.title()}
          <View style={styles.wrapInput}>
            {this.textInput()}
            {this.renderCurrencyTitle()}
          </View>
          {this.modalButton()}
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapInput: {
    flexDirection: 'row',
  },
  container: {
    height: 192,
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  wrapTitle: {
    marginTop: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: fonts.size.xxl,
    color: colors.black,
    fontWeight: '600',
  },
  modalInputContainer: {
    height: 59,
    marginLeft: -16,
  },
  wrapButton: {
    justifyContent: 'center',
    position: 'absolute',
    right: 9,
    marginTop: 25,
  },
  wrapMoney: {
    backgroundColor: colors.background,
    paddingHorizontal: metrics.base,
    paddingVertical: metrics.small_base,
    marginRight: metrics.base,
  },
  modalWrapButton: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButtonCancel: {
    width: 126,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
  },
  money: {
    fontSize: fonts.size.m,
    fontWeight: '600',
    color: colors.blue_light_grey,
  },
  modalButtonText: {
    fontSize: fonts.size.m,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputPrice: {
    marginRight: 20,
  },
})
