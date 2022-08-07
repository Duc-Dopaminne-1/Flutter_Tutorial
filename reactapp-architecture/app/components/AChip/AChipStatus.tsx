import * as React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TouchableOpacity,
} from 'react-native'
import { ProductStatus, Supplier, SupplierStatus } from '@/models/team'
import { colors, devices, fonts, metrics } from '@/vars'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { sampleNavigation, SampleRef } from '@/navigation/sampleNavigation'
import { SafeStatusType } from '@/shared/statusType'
import { navigation } from '@/navigation/navigation'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { SafeSample } from '@/shared/sample'

// init state
const initialState = {}

// default props
const defaultProps = {
  supplier: null,
  fromSupplier: false,
  fromSample: false,
  safeSample: null,
  status: {
    step: 0,
    name: '',
    color: colors.text_light_grey,
  },
}

// define type
type DefaultProps = typeof defaultProps

type AStatusChipProps = {
  supplier?: Supplier
  fromSupplier: boolean
  fromSample?: boolean
  safeSample?: SafeSample
  containerStyle?: StyleProp<ViewStyle>
  status: ProductStatus | SupplierStatus
} & DefaultProps

export type AStatusChipState = Readonly<typeof initialState>

export class AChipStatus extends React.PureComponent<
  AStatusChipProps,
  AStatusChipState
> {
  readonly state: AStatusChipState = initialState

  static defaultProps: DefaultProps = defaultProps

  get step() {
    const { status } = this.props
    return status && status.step > 0 ? status.step.toString() : ''
  }

  get label() {
    const { status, fromSupplier } = this.props
    const label = status && status.name ? status.name : ''

    if (fromSupplier) {
      return SafeStatusType.getNameSupplier(label).toUpperCase()
    }

    return SafeStatusType.getName(label).toUpperCase()
  }

  get color() {
    const { status } = this.props
    const category = status && status.category ? status.category : ''

    return SafeStatusType.getColor(category)
  }

  onPressStatus = () => {
    const { fromSupplier, supplier, fromSample } = this.props
    if (fromSupplier) {
      devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()
      navigation.navigate('SelectStatusPickerSupplier', {
        supplier,
        hideActionBar: false,
        hideUpDownClear: true,
      })
      return
    }
    if (fromSample) {
      sampleNavigation.open(SampleRef.SelectStatus)
      return
    }
    productNavigation.open(ProductRef.SelectStatus, {}, false, true)
  }

  renderSampleStatus = () => {
    const { safeSample } = this.props
    const { formattedLabel, color, background, step } = safeSample.safeStatus
    const name = `${step ? step + '. ' : ''}${formattedLabel}`

    return (
      <TouchableOpacity onPress={this.onPressStatus}>
        <View style={[styles.statusContainer, { backgroundColor: background }]}>
          <Text style={[styles.status, { color }]}>{name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { containerStyle, fromSample } = this.props

    if (fromSample) {
      return this.renderSampleStatus()
    }

    return (
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: this.color },
          containerStyle,
        ]}
        onPress={this.onPressStatus}
      >
        {!!this.step && (
          <View style={styles.wrapStepNumber}>
            <Text
              style={[styles.stepNumber, { color: this.color }]}
              numberOfLines={1}
            >
              {this.step}
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.text,
            { color: !this.step ? colors.text_light_grey : colors.white },
          ]}
          numberOfLines={1}
        >
          {this.label}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light_blue,
    paddingVertical: 4,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: metrics.request_sample_border_radius,
  },
  wrapStepNumber: {
    backgroundColor: colors.white,
    marginLeft: 3,
    height: metrics.product_info_image_icon_request_size,
    width: metrics.product_info_image_icon_request_size,
    borderRadius: metrics.product_info_image_icon_request_size,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: colors.text_light_grey,
    fontSize: fonts.size.s,
  },
  text: {
    color: colors.text_light_grey,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
    paddingHorizontal: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  status: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPBold,
    fontSize: fonts.size.s,
    textAlign: 'center',
  },
})
