import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import { getCurrencySymbol } from '@/shared/format'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import validate from 'validate.js'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { Subscription } from 'rxjs'

type Props = {
  data: any
  index: number
  submit: (indexRow: number, key: string, data: any) => void
  currency?: string
  setValue?: (data, key) => void
  setCurrentRefAndAllowKeyboardAware?: (index, allow) => void
  inputRefs?: any
  isClear?: boolean
  currentRef?: any
  priceMatrix?: any
}

@withContext(CreateProductContext.Consumer)
export class CreateProductPriceMatrixListItem extends React.PureComponent<
  Props
> {
  _subscription: Subscription
  static defaultProps = {}

  state = {
    label: '',
    price: '',
  }

  componentDidMount() {
    const { label, price } = this.props.data

    this.setState({
      label,
      price: price.value ? price.value.toString() : '',
    })

    this._subscription = createProductNavigation.subject.subscribe(data => {
      // @ts-ignore
      const { isClear, index } = data

      if (isClear) {
        if (index === this.labelIndex) {
          this.setState({
            label: '',
          })
        } else if (index === this.priceIndex) {
          this.setState({
            price: '',
          })
        }

        createProductNavigation.subject.next({ index, isClear: false })
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  checkNumber = key => {
    const value = this.state[key]
    if (!value) {
      return 0
    }

    const convertToString = value.toString()

    const number = Number(convertToString.replace(',', '.'))
    if (!validate.isNumber(number)) {
      alert(I18n.t('notANumber'))
      this.setState({
        [key]: '',
      })
      return 0
    }

    this.setState({
      [key]: number.toString(),
    })

    return number
  }

  focusTextInput = key => () => {
    const { setCurrentRefAndAllowKeyboardAware } = this.props

    setCurrentRefAndAllowKeyboardAware(key, true)
  }

  onChangeText = (key: string) => (text: string) => {
    this.setState({
      [key]: text,
    })
  }

  get data() {
    const { label, price } = this.state
    const { index, priceMatrix } = this.props
    const priceSymbol =
      getCurrencySymbol(priceMatrix.rows[index].price.currency) ||
      priceMatrix.rows[index].price.currency

    return {
      priceSymbol,
      label,
      price,
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

  onSubmit = (key: string) => () => {
    const { index, submit, priceMatrix } = this.props

    if (key === 'price') {
      const data = this.checkNumber('price')

      // set convertToNumber data to price
      this.setState({
        [key]: data,
      })

      const updateData = {
        currency: priceMatrix.rows[index].price.currency,
        value: data,
      }
      submit(index, key, updateData)
      return
    }

    submit(index, key, this.state[key].trim())
  }

  renderCurrencyTitle = (currencyIndex: number) => {
    const { index, priceMatrix } = this.props

    const isCurrency = {
      isMatrixPrice: true,
      indexMatrixPrice: index,
    }

    return (
      <View
        style={styles.wrapButton}
        ref={nodeRef => {
          createProductNavigation.setIndexPriceMatrixRef(currencyIndex, nodeRef)
          createProductNavigation.setPriceMatrixRefTotal(currencyIndex)
        }}
      >
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            createProductNavigation.current = CreateProductRef.PriceMatrix
            createProductNavigation.currentPriceMatrix = currencyIndex
            createProductNavigation.open(
              CreateProductRef.PriceMatrix,
              isCurrency,
              priceMatrix
            )
          }}
        >
          <Text style={styles.money}>
            {priceMatrix.rows[index].price.currency}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { index } = this.props
    const { priceSymbol, label, price } = this.data
    const labelIndex = this.labelIndex
    const priceIndex = this.priceIndex
    const currencyIndex = this.currencyIndex

    return (
      <View style={styles.container} key={index}>
        <View style={styles.column}>
          {this.renderTitle(I18n.t('label').toUpperCase())}
          <AInput
            ref={nodeRef => {
              createProductNavigation.setPriceMatrixRef(labelIndex, nodeRef)
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
              createProductNavigation.current = CreateProductRef.PriceMatrix
              createProductNavigation.currentPriceMatrix = labelIndex
            }}
          />
        </View>

        <View style={styles.column}>
          {this.renderTitle(I18n.t('price').toUpperCase())}
          <AInput
            ref={nodeRef => {
              createProductNavigation.setPriceMatrixRef(priceIndex, nodeRef)
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
            customRightIcon={this.renderCurrencyTitle(currencyIndex)}
            onFocusTextInput={() => {
              createProductNavigation.current = CreateProductRef.PriceMatrix
              createProductNavigation.currentPriceMatrix = priceIndex
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
  inputContainer: {
    height: 35,
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
