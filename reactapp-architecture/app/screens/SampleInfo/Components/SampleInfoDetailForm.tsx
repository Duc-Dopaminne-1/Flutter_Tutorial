import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import { Sample } from '@/models/team'
import {
  SampleData,
  sampleNavigation,
  SampleRef,
} from '@/navigation/sampleNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { getCurrencySymbol } from '@/shared/format'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import validate from 'validate.js'
import { SampleInfoContext } from '../SampleInfoContext'
import { withNavigation } from 'react-navigation'
import { CustomAlert } from '@/shared/alert'
import { Subscription } from 'rxjs'
import { updateSampleInfo } from '@/services/global'
import { SafeSample } from '@/shared/sample'
import { User } from '@/models/user'

// init state
const initialState = {
  isEdit: false,
  name: '',
  reference: '',
  price: '',
  currency: '',
  paid: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  sample?: Sample
  safeSample?: SafeSample
  isBack?: boolean
  onUserSelect?: Function
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@DelayRender({ delay: 300 })
@withContext(SampleInfoContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SampleInfoDetailForm extends React.PureComponent<Props, State> {
  _subscription: Subscription

  readonly state: State = initialState

  componentDidMount() {
    const { safeSample } = this.props
    const { name, reference, priceValue, currency, paid } = safeSample

    const formatPrice = priceValue.formatted === '0' ? '' : priceValue.formatted

    this.setState({
      paid,
      name,
      reference,
      price: formatPrice,
      currency: currency.currency,
    })

    this.updateSampleInfo()
    sampleNavigation.setData(SampleData.AssigneeSelect, this.onAssigneeSelect)
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  onAssigneeSelect = (user: User) => {
    if (!user) {
      return
    }
    this.props.sampleFactory
      .update(this.props.sample.id, { assignee: user })
      .subscribe(() => {})
  }

  updateSampleInfo = () => {
    this._subscription = updateSampleInfo.subscribe(sample => {
      const { name, priceValue, currency, paid, reference } = new SafeSample(
        sample
      )

      const formatPrice =
        priceValue.formatted === '0' ? '' : priceValue.formatted

      this.setState({
        paid,
        name,
        reference,
        price: formatPrice,
        currency: currency.currency,
      })
    })
  }

  onChangeText = (key: string) => (text: string) => {
    // @ts-ignore
    this.setState({
      [key]: text,
      isEdit: true,
    })
  }

  checkValueText = ({ value, key = 'none' }) => {
    if (!value || value.trim().length <= 0) {
      if (key === 'name' || key === 'reference') {
        return null
      }

      return ''
    }

    return value.trim()
  }

  checkValueNumber = ({ value, key = 'none' }) => {
    if (!value && key !== 'price') {
      return 0
    }

    const { isBack } = this.props
    const number = Number(value.replace(',', '.'))
    if (!validate.isNumber(number)) {
      !isBack && CustomAlert.alertTimeout('Not a number, please type again')
      return null
    }

    if (key === 'price') {
      const { price, currency } = this.props.safeSample

      // @ts-ignore
      this.setState({
        [key]: number,
      })

      return {
        id: price.id,
        value: number * 10000,
        currency: currency.currency,
      }
    }

    return number
  }

  getValue = (key: string) => {
    if (key === 'name' || key === 'reference') {
      return this.checkValueText({
        key,
        value: this.state[key],
      })
    }
    if (key === 'price') {
      return this.checkValueNumber({
        key,
        value: this.state[key].toString(),
      })
    }

    return null
  }

  onSubmit = (key: string) => () => {
    const { sample, sampleFactory } = this.props
    const value = this.getValue(key)

    if (value === null || value === undefined) {
      // @ts-ignore
      this.setState({
        [key]: '',
      })
      return
    }

    sampleFactory
      .update(sample.id, {
        [key]: value,
      })
      .subscribe(() => {
        sampleNavigation.setData(SampleData.Sample, this.props.sample)
      })
  }

  get data() {
    const { isEdit } = this.state
    const {
      currency,
      safeStatus,
      name,
      reference,
      priceValue,
      createdByName,
      lastUpdatedByName,
      assignedTo,
    } = this.props.safeSample
    const formatPrice = priceValue.formatted === '0' ? '' : priceValue.formatted
    const symbolCurrency =
      getCurrencySymbol(currency.currency) || currency.currency

    return {
      symbolCurrency,
      safeStatus,
      createdByName,
      lastUpdatedByName,
      assignedTo,
      reference: isEdit ? this.state.reference : reference,
      name: isEdit ? this.state.name : name,
      price: isEdit ? this.state.price : formatPrice,
      currency: currency.currency,
    }
  }

  onUserSelect = () => {
    sampleNavigation.open(SampleRef.Assignee)
  }

  onChangeBooleanValue = (value: boolean) => {
    const { sampleFactory, sample } = this.props
    this.setState({ paid: value })
    sampleFactory
      .update(sample.id, {
        paid: value,
      })
      .subscribe(
        () => {
          this.setState({ paid: sample.paid })
          // sampleNavigation.setData(SampleData.Sample, this.props.sample)
        },
        () => {
          this.setState({ paid: sample.paid })
        }
      )
  }

  renderSwitchCustom = () => {
    const {
      sample: { paid },
    } = this.props
    return (
      <View style={styles.wrapSwitch}>
        <Switch
          value={this.state.paid || paid}
          onValueChange={this.onChangeBooleanValue}
        />
      </View>
    )
  }

  renderCurrencyTitle = (currency: string) => {
    const isCurrency = {
      isPrice: true,
    }
    return (
      <View style={styles.wrapButton}>
        <TouchableOpacity
          style={styles.wrapMoney}
          onPress={() => {
            sampleNavigation.open(SampleRef.SelectCurrency, isCurrency)
          }}
        >
          <Text style={styles.money}>{currency}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {
      symbolCurrency,
      name,
      reference,
      price,
      currency,
      assignedTo,
    } = this.data

    return (
      <View style={styles.container}>
        {/* Name */}
        <AInput
          ref={nodeRef => {
            sampleNavigation.setRef(SampleRef.Reference, nodeRef)
          }}
          defaultValue={reference}
          value={reference}
          title={I18n.t('reference').toUpperCase()}
          onChangeText={this.onChangeText('reference')}
          onEndEditing={this.onSubmit('reference')}
          onFocusTextInput={() => {
            sampleNavigation.current = SampleRef.Reference
          }}
        />

        {/* Name */}
        <AInput
          ref={nodeRef => {
            sampleNavigation.setRef(SampleRef.Name, nodeRef)
          }}
          defaultValue={name}
          value={name}
          title={I18n.t('sampleName').toUpperCase()}
          onChangeText={this.onChangeText('name')}
          onEndEditing={this.onSubmit('name')}
          onFocusTextInput={() => {
            sampleNavigation.current = SampleRef.Name
          }}
        />

        {/* Price */}
        <AInput
          ref={nodeRef => {
            sampleNavigation.setRef(SampleRef.Price, nodeRef)
          }}
          value={price}
          inputStyle={styles.inputPrice}
          title={I18n.t('samplePrice').toUpperCase()}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText('price')}
          onEndEditing={this.onSubmit('price')}
          onFocusTextInput={() => {
            sampleNavigation.current = SampleRef.Price
          }}
          customRightIcon={this.renderCurrencyTitle(currency)}
          textFieldProps={{
            prefix: symbolCurrency,
            affixTextStyle: {
              color: colors.dark_blue_grey,
            },
          }}
        />

        {/* Assigned To */}
        <AInput
          ref={nodeRef => {
            sampleNavigation.setRef(SampleRef.Assignee, nodeRef)
          }}
          title={I18n.t('assignedTo').toUpperCase()}
          value={assignedTo}
          editable={false}
          iconRight={images.rightChevron}
          onPress={this.onUserSelect}
        />
        <AInput
          title={'PAID'}
          value={'YES / NO'}
          editable={false}
          customRightIcon={this.renderSwitchCustom()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: metrics.keylines_screen_product_info_margin,
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
  wrapButton: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
  inputPrice: {
    marginRight: 65,
  },
  inputSupplier: {
    marginRight: 50,
  },
  wrapSwitch: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
})
