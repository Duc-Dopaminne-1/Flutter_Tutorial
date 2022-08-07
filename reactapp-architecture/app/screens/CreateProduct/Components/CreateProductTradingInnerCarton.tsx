import { AInput } from '@/components/AInput/AInput'
import { ARow } from '@/components/ARow/ARow'
import I18n from '@/i18n'
import { ProductInfoTradingForm } from '@/screens/ProductInfo/Components/ProductInfoTradingForm'
import { PackagingName } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import validate from 'validate.js'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { Subscription } from 'rxjs'

// init state
const initialState = {
  isEdit: false,
  selectedPacking: '' as PackagingName,
  innerCarton: {
    width: '',
    height: '',
    length: '',
    itemsQuantity: '',
    weight: '',
  },
  masterCarton: {
    width: '',
    height: '',
    length: '',
    itemsQuantity: '',
    weight: '',
  },

  openInnerUnit: false,
  openInnerWeightUnit: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  inputRefs?: React.RefObject<any>
  setValue?: (data, key, type) => void
  setCurrentRefAndAllowKeyboardAware?: (currentRef, allowKeyboardAware) => void
  innerCarton?: any
} & DefaultProps

export type State = Readonly<typeof initialState> &
  Readonly<{
    [key: string]: any
  }>

@DelayRender({ delay: 200 })
@withContext(CreateProductContext.Consumer)
export class CreateProductTradingInnerCarton extends React.PureComponent<
  Props,
  State
> {
  _subscription: Subscription
  readonly state: State = initialState

  componentDidMount() {
    this._subscription = createProductNavigation.subjectCarton.subscribe(
      data => {
        // @ts-ignore
        const { openInnerUnit, openInnerWeightUnit } = data

        this.setState({
          openInnerUnit,
          openInnerWeightUnit,
        })
      }
    )
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  openModal = key => () => {
    createProductNavigation.open(key)
  }

  onChangeText = (key: string) => (_text: string) => {
    const text: string =
      key === 'itemsQuantity' ? _text.replace(/\D/g, '') : _text
    this.props.setValue(text, key, 'innerCarton')
  }

  checkNumber = key => () => {
    const { setValue } = this.props
    const value = this.props['innerCarton'][key].toString()

    if (!value || value.length <= 0) {
      setValue('', key, 'innerCarton')
      return
    }

    const convertNumber = Number(value.replace(',', '.'))
    if (!validate.isNumber(convertNumber)) {
      alert('Not a number, please type again')
      setValue('', key, 'innerCarton')
      return
    }

    if (key === 'itemsQuantity') {
      const floor = Math.floor(convertNumber)
      setValue(floor, key, 'innerCarton')
      return
    }

    setValue(convertNumber, key, 'innerCarton')
  }

  onFocusTextInput = indexRef => () => {
    this.props.setCurrentRefAndAllowKeyboardAware(indexRef, true)
  }

  render() {
    const { innerCarton } = this.props
    const {
      width,
      height,
      length,
      itemsQuantity,
      weight,
      unit,
      weightUnit,
    } = innerCarton
    const { openInnerUnit, openInnerWeightUnit } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('tradeShipping')}</Text>
        <ProductInfoTradingForm title={I18n.t('innerCarton')}>
          <ARow>
            <AInput
              ref={nodeRef => {
                createProductNavigation.setRef(
                  CreateProductRef.InnerWith,
                  nodeRef
                )
              }}
              value={width}
              title={I18n.t('width').toUpperCase()}
              keyboardType={'numeric'}
              containerStyle={styles.input}
              onChangeText={this.onChangeText('width')}
              onEndEditing={this.checkNumber('width')}
              onFocusTextInput={() => {
                createProductNavigation.current = CreateProductRef.InnerWith
                createProductNavigation.currentCustomField =
                  createProductNavigation.CustomFieldRefTotal +
                  (CreateProductRef.InnerWith - CreateProductRef.CustomField)
              }}
            />
            <AInput
              ref={nodeRef => {
                createProductNavigation.setRef(
                  CreateProductRef.InnerHeight,
                  nodeRef
                )
              }}
              value={height}
              title={I18n.t('height').toUpperCase()}
              keyboardType={'numeric'}
              containerStyle={styles.input}
              onChangeText={this.onChangeText('height')}
              onEndEditing={this.checkNumber('height')}
              onFocusTextInput={() => {
                createProductNavigation.current = CreateProductRef.InnerHeight
              }}
            />
            <AInput
              ref={nodeRef => {
                createProductNavigation.setRef(
                  CreateProductRef.InnerDepth,
                  nodeRef
                )
              }}
              value={length}
              title={I18n.t('depth').toUpperCase()}
              keyboardType={'numeric'}
              containerStyle={styles.input}
              onChangeText={this.onChangeText('length')}
              onEndEditing={this.checkNumber('length')}
              onFocusTextInput={() => {
                createProductNavigation.current = CreateProductRef.InnerDepth
              }}
            />
            <AInput
              value={unit}
              title={I18n.t('unit').toUpperCase()}
              editable={false}
              onPress={this.openModal(CreateProductRef.InnerUnit)}
              modalIsOn={openInnerUnit}
              containerStyle={styles.input}
            />
          </ARow>

          <ARow>
            <AInput
              ref={nodeRef => {
                createProductNavigation.setRef(
                  CreateProductRef.InnerQuality,
                  nodeRef
                )
              }}
              value={itemsQuantity}
              title={I18n.t('quantity').toUpperCase()}
              keyboardType={'number-pad'}
              containerStyle={styles.input}
              onChangeText={this.onChangeText('itemsQuantity')}
              onEndEditing={this.checkNumber('itemsQuantity')}
              onFocusTextInput={() => {
                createProductNavigation.current = CreateProductRef.InnerQuality
              }}
            />
            <AInput
              ref={nodeRef => {
                createProductNavigation.setRef(
                  CreateProductRef.InnerWeight,
                  nodeRef
                )
              }}
              value={weight}
              title={I18n.t('weight').toUpperCase()}
              keyboardType={'numeric'}
              containerStyle={styles.input}
              onChangeText={this.onChangeText('weight')}
              onEndEditing={this.checkNumber('weight')}
              onFocusTextInput={() => {
                createProductNavigation.current = CreateProductRef.InnerWeight
              }}
            />
            <AInput
              value={weightUnit}
              title={I18n.t('weightUnit').toUpperCase()}
              editable={false}
              onPress={this.openModal(CreateProductRef.InnerWeightUnit)}
              modalIsOn={openInnerWeightUnit}
              containerStyle={styles.input}
            />
            <View style={{ flex: 1 }} />
          </ARow>
        </ProductInfoTradingForm>
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
  input: {
    marginRight: 3,
  },
})
