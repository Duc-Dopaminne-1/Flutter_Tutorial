import { AInput } from '@/components/AInput/AInput'
import { ARow } from '@/components/ARow/ARow'
import I18n from '@/i18n'
import { ProductInfoTradingForm } from '@/screens/ProductInfo/Components/ProductInfoTradingForm'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
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
  openMasterUnit: false,
  openMasterWeightUnit: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  inputRefs?: React.RefObject<any>
  setValue?: (data, key, type) => void
  setCurrentRefAndAllowKeyboardAware?: (currentRef, allowKeyboardAware) => void
  masterCarton?: any
} & DefaultProps

export type State = Readonly<typeof initialState> &
  Readonly<{
    [key: string]: any
  }>

@DelayRender({ delay: 250 })
@withContext(CreateProductContext.Consumer)
export class CreateProductTradingMasterCarton extends React.PureComponent<
  Props,
  State
> {
  _subscription: Subscription
  readonly state: State = initialState

  componentDidMount() {
    this._subscription = createProductNavigation.subjectCarton.subscribe(
      data => {
        // @ts-ignore
        const { openMasterUnit, openMasterWeightUnit } = data

        this.setState({
          openMasterUnit,
          openMasterWeightUnit,
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
    this.props.setValue(text, key, 'masterCarton')
  }

  checkNumber = key => () => {
    const { setValue } = this.props
    const value = this.props['masterCarton'][key].toString()

    if (!value || value.length <= 0) {
      setValue('', key, 'masterCarton')
      return
    }

    const convertNumber = Number(value.replace(',', '.'))
    if (!validate.isNumber(convertNumber)) {
      alert('Not a number, please type again')
      setValue('', key, 'masterCarton')
      return
    }

    if (key === 'itemsQuantity') {
      const floor = Math.floor(convertNumber)
      setValue(floor, key, 'masterCarton')
      return
    }

    setValue(convertNumber, key, 'masterCarton')
  }

  onFocusTextInput = indexRef => () => {
    this.props.setCurrentRefAndAllowKeyboardAware(indexRef, true)
  }

  render() {
    const { masterCarton } = this.props
    const {
      width,
      height,
      length,
      itemsQuantity,
      weight,
      unit,
      weightUnit,
    } = masterCarton
    const { openMasterUnit, openMasterWeightUnit } = this.state

    return (
      <ProductInfoTradingForm title={I18n.t('masterCarton')}>
        <ARow>
          <AInput
            ref={nodeRef => {
              createProductNavigation.setRef(
                CreateProductRef.MasterWith,
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
              createProductNavigation.current = CreateProductRef.MasterWith
            }}
          />
          <AInput
            ref={nodeRef => {
              createProductNavigation.setRef(
                CreateProductRef.MasterHeight,
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
              createProductNavigation.current = CreateProductRef.MasterHeight
            }}
          />
          <AInput
            ref={nodeRef => {
              createProductNavigation.setRef(
                CreateProductRef.MasterDepth,
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
              createProductNavigation.current = CreateProductRef.MasterDepth
            }}
          />
          <AInput
            value={unit}
            title={I18n.t('unit').toUpperCase()}
            editable={false}
            onPress={this.openModal(CreateProductRef.MasterUnit)}
            modalIsOn={openMasterUnit}
            containerStyle={styles.input}
          />
        </ARow>

        <ARow>
          <AInput
            ref={nodeRef => {
              createProductNavigation.setRef(
                CreateProductRef.MasterQuality,
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
              createProductNavigation.current = CreateProductRef.MasterQuality
            }}
          />
          <AInput
            ref={nodeRef => {
              createProductNavigation.setRef(
                CreateProductRef.MasterWeight,
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
              createProductNavigation.current = CreateProductRef.MasterWeight
            }}
          />
          <AInput
            value={weightUnit}
            title={I18n.t('weightUnit').toUpperCase()}
            editable={false}
            onPress={this.openModal(CreateProductRef.MasterWeightUnit)}
            modalIsOn={openMasterWeightUnit}
            containerStyle={styles.input}
          />
          <View style={{ flex: 1 }} />
        </ARow>
      </ProductInfoTradingForm>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    marginRight: 3,
  },
})
