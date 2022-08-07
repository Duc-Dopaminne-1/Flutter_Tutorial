import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { getCurrencySymbol } from '@/shared/format'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import validate from 'validate.js'
import { Subscription } from 'rxjs'
import { SafeProduct } from '@/shared/product'
import { AppContextState } from '@/screens/App/AppContainer'

type Props = {
  data: any
  index: number
  onSubmit: (idRow: string, key: string, data: any) => void
} & AppContextState

@withContext(ProductInfoContext.Consumer)
export class ProductInfoTradingListItem extends React.PureComponent<Props> {
  _subscription: Subscription

  static defaultProps = {}

  state = {
    label: '',
    price: '',
    isEdit: false,
  }

  componentDidMount() {
    const { label, price } = this.props.data

    this.setState({
      label,
      price: price.value ? (price.value / 10000).toString() : '',
    })

    this._subscription = productNavigation.subject.subscribe(data => {
      // @ts-ignore
      const { isClear, index } = data

      if (isClear) {
        if (index === this.labelIndex) {
          this.setState({
            label: '',
            isEdit: true,
          })
        } else if (index === this.priceIndex) {
          this.setState({
            price: '',
            isEdit: true,
          })
        }

        productNavigation.subject.next({ index, isClear: false })
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  checkValueNumber = value => {
    if (!value) {
      return 0
    }

    const convertToString = value.toString()

    const number = Number(convertToString.replace(',', '.'))
    if (!validate.isNumber(number)) {
      alert(I18n.t('notANumber'))
      return 0
    }

    return number
  }

  onSubmit = (key: string) => () => {
    const { data, onSubmit } = this.props
    let updateData = null

    if (key === 'label') {
      updateData = {
        label: this.state[key],
      }
    } else {
      const { id, currency } = data.price
      const priceValue = this.checkValueNumber(this.state[key])

      // set convertToNumber data to price
      this.setState({
        [key]: priceValue,
      })

      updateData = {
        price: {
          id,
          currency,
          value: priceValue * 10000,
        },
      }
    }

    // this.setState({ isEdit: false })
    onSubmit(data.id, key, updateData)
  }

  onChangeText = (key: string) => (text: string) => {
    this.setState({
      [key]: text,
      isEdit: true,
    })
  }

  get data() {
    const { data } = this.props
    const { label, price, isEdit } = this.state
    const { currencyPriceMatrix } = new SafeProduct(this.props.product)

    const priceSymbol =
      getCurrencySymbol(data.price.currency) || data.price.currency || '$'
    const convertPriceProps = data.price.value
      ? (data.price.value / 10000).toString()
      : ''

    return {
      currencyPriceMatrix,
      priceSymbol,
      label: isEdit ? label : data.label,
      price: isEdit ? price : convertPriceProps,
    }
  }

  renderTitle(title) {
    const { index } = this.props
    if (index > 0) return null

    return <Text style={styles.title}>{title}</Text>
  }

  get labelIndex() {
    const { index } = this.props
    return index * 3 + 1
  }

  get priceIndex() {
    const { index } = this.props
    return index * 3 + 2
  }

  get currencyIndex() {
    const { index } = this.props
    return index * 3 + 3
  }

  renderCurrencyTitle = (currency: string[], currencyIndex: number) => {
    const { index } = this.props
    const currencyMain = currency[index]
    const isCurrency = {
      isMatrixPrice: true,
      indexMatrixPrice: index,
    }

    return (
      <View
        ref={nodeRef => {
          productNavigation.setIndexPriceMatrixRef(currencyIndex, nodeRef)
          productNavigation.setPriceMatrixRefTotal(currencyIndex)
        }}
        style={styles.wrapButton}
      >
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            productNavigation.current = ProductRef.PriceMatrix
            productNavigation.currentPriceMatrix = currencyIndex
            productNavigation.open(ProductRef.PriceMatrix, isCurrency)
          }}
        >
          <Text style={styles.money}>{currencyMain}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { index } = this.props
    const { priceSymbol, label, price, currencyPriceMatrix } = this.data

    const labelIndex = this.labelIndex
    const priceIndex = this.priceIndex
    const currencyIndex = this.currencyIndex

    return (
      <View style={styles.container} key={index}>
        <View style={styles.column}>
          {this.renderTitle(I18n.t('label').toUpperCase())}
          <AInput
            ref={nodeRef => {
              productNavigation.setPriceMatrixRef(labelIndex, nodeRef)
              // productNavigation.setRef(ProductRef.MasterWeight, nodeRef)
            }}
            value={label}
            placeholder={I18n.t('addLabel')}
            placeholderTextColor={colors.light_blue_grey}
            italicPlaceholder={true}
            useMaterial={false}
            containerStyle={styles.inputContainer}
            onChangeText={this.onChangeText('label')}
            onEndEditing={this.onSubmit('label')}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.PriceMatrix
              productNavigation.currentPriceMatrix = labelIndex
            }}
          />
        </View>

        <View style={styles.column}>
          {this.renderTitle(I18n.t('price').toUpperCase())}
          <AInput
            ref={nodeRef => {
              productNavigation.setPriceMatrixRef(priceIndex, nodeRef)
              // productNavigation.setRef(ProductRef.MasterWeight, nodeRef)
            }}
            value={price}
            inputStyle={styles.inputPrice}
            prefix={priceSymbol}
            useMaterial={false}
            keyboardType={'numeric'}
            turnOnActiveTextInput={false}
            containerStyle={styles.inputContainer}
            onChangeText={this.onChangeText('price')}
            onEndEditing={this.onSubmit('price')}
            customRightIcon={this.renderCurrencyTitle(
              currencyPriceMatrix,
              currencyIndex
            )}
            onFocusTextInput={() => {
              productNavigation.current = ProductRef.PriceMatrix
              productNavigation.currentPriceMatrix = priceIndex
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  title: {
    fontSize: fonts.size.xs,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.light_blue_grey,
    marginTop: 6,
  },
  column: {
    flex: 1,
    marginRight: 27,
  },
  input: {
    paddingBottom: 0,
  },
  inputContainer: {
    height: 40,
    borderBottomWidth: 0.7,
    borderColor: colors.light_blue_grey,
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
