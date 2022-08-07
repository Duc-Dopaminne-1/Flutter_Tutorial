import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { colors, fonts, metrics } from '@/vars'
import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import validate from 'validate.js'
import { getCurrencySymbol } from '@/shared/format'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { SafeStatusType } from '@/shared/statusType'
import { CustomAlert } from '@/shared/alert'
import { SafeEvent } from '@/shared/event'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  inputRefs?: React.RefObject<any>
  setValue?: (data, key) => void
  openModal?: (key) => void
  setCurrentRefAndAllowKeyboardAware?: (currentRef, allowKeyboardAware) => void
  price?: string
  currency?: string
  moq?: string
  moqDescription?: string
  name?: string
  status?: any
  event?: any
  isBack?: boolean
  harbour?: string
  incoTerm?: string
} & DefaultProps

export type State = Readonly<typeof initialState>

@DelayRender({ delay: 200 })
@withContext(CreateProductContext.Consumer)
export class CreateProductDetails extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  checkNumber = key => () => {
    const { setValue, isBack } = this.props
    const value = this.props[key] ? this.props[key].toString() : ''

    // check if value is empty or not
    if (!value || value.length <= 0) {
      setValue('', key)
      return
    }

    // Check value is number or not
    const convertNumber = Number(value.replace(',', '.'))
    if (!validate.isNumber(convertNumber)) {
      !isBack && CustomAlert.alertTimeout('Not a number, please type again')
      setValue('', key)
      return
    }

    // check MOQ is an integer or not
    if (key === 'moq') {
      const floor = Math.floor(convertNumber)
      setValue(floor, key)
      return
    }

    setValue(convertNumber, key)
  }

  checkText = key => () => {
    const { setValue } = this.props
    const value = this.props[key] ? this.props[key].toString() : ''

    if (!value || value.length <= 0 || value.trim().length <= 0) {
      setValue('', key)
      return
    }

    setValue(value.trim(), key)
  }

  onFocusTextInput = indexRef => () => {
    this.props.setCurrentRefAndAllowKeyboardAware(indexRef, true)
  }

  onChangeText = key => _text => {
    const text: string = key === 'moq' ? _text.replace(/\D/g, '') : _text
    this.props.setValue(text, key)
  }

  get status() {
    const { status } = this.props
    const label = status && status.name ? status.name : ''

    return SafeStatusType.getName(label)
  }

  get renderCurrency() {
    const { currency } = this.props

    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            const isCurrency = {
              currency,
              isPrice: true,
            }
            createProductNavigation.open(
              CreateProductRef.SelectCurrency,
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
    const {
      price,
      currency,
      moq,
      moqDescription,
      name,
      event,
      harbour,
      incoTerm,
    } = this.props
    const safeEvent = new SafeEvent(event)
    const symbolCurrency = getCurrencySymbol(currency) || currency

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('productDetail')}</Text>

        {/* Price */}
        <AInput
          ref={nodeRef => {
            createProductNavigation.setRef(CreateProductRef.Price, nodeRef)
          }}
          value={price}
          inputStyle={styles.inputPrice}
          title={I18n.t('price').toUpperCase()}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText('price')}
          onEndEditing={this.checkNumber('price')}
          onFocusTextInput={() => {
            createProductNavigation.current = CreateProductRef.Price
          }}
          customRightIcon={this.renderCurrency}
          textFieldProps={{
            prefix: symbolCurrency,
            affixTextStyle: {
              color: colors.dark_blue_grey,
            },
          }}
        />

        {/* MOQ */}
        <AInput
          ref={nodeRef => {
            createProductNavigation.setRef(CreateProductRef.MOQ, nodeRef)
          }}
          value={moq}
          title={I18n.t('moq').toUpperCase()}
          keyboardType={'number-pad'}
          onChangeText={this.onChangeText('moq')}
          onEndEditing={this.checkNumber('moq')}
          onFocusTextInput={() => {
            createProductNavigation.current = CreateProductRef.MOQ
          }}
        />

        {/* MOQ Description */}
        <AInput
          ref={nodeRef => {
            createProductNavigation.setRef(
              CreateProductRef.MOQDescription,
              nodeRef
            )
          }}
          value={moqDescription}
          title={I18n.t('moqDescription').toUpperCase()}
          onChangeText={this.onChangeText('moqDescription')}
          onEndEditing={this.checkText('moqDescription')}
          onFocusTextInput={() => {
            createProductNavigation.current = CreateProductRef.MOQDescription
          }}
        />

        {/* Name */}
        <AInput
          ref={nodeRef => {
            createProductNavigation.setRef(CreateProductRef.Name, nodeRef)
          }}
          defaultValue={name}
          value={name}
          title={I18n.t('name').toUpperCase()}
          onChangeText={this.onChangeText('name')}
          onEndEditing={this.checkText('name')}
          onFocusTextInput={() => {
            createProductNavigation.current = CreateProductRef.Name
          }}
        />

        {/* Status */}
        <AInput
          value={this.status}
          title={I18n.t('status').toUpperCase()}
          editable={false}
          onPress={() => {
            createProductNavigation.open(CreateProductRef.SelectStatus)
          }}
        />

        {/* Harbour */}
        <AInput
          value={harbour}
          title={I18n.t('harbour').toUpperCase()}
          editable={false}
          onPress={() => {
            createProductNavigation.open(CreateProductRef.SelectHarbour)
          }}
        />

        {/* IncoTerm */}
        <AInput
          value={incoTerm}
          title={I18n.t('incoTerm').toUpperCase()}
          editable={false}
          onPress={() => {
            createProductNavigation.open(CreateProductRef.SelectIncoTerm)
          }}
        />

        {/* Event */}
        <AInput
          value={safeEvent.eventName}
          title={I18n.t('event').toUpperCase()}
          editable={false}
          onPress={() => {
            createProductNavigation.open(CreateProductRef.SelectEvent)
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 32,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
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
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.blue_light_grey,
  },
  inputPrice: {
    marginRight: 65,
  },
})
