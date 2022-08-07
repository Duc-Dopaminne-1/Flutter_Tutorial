import { AButtonDouble } from '@/components/AButton/AButtonDouble'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import I18n from '@/i18n'
import { CreateProductContext } from '@/screens/CreateProduct/CreateProductContext'
import { withContext } from '@/shared/withContext'
import { colors, devices, images, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { CreateType } from '@/screens/CreateProduct/CreateProductScreen'
import { AButton } from '@/components/AButton/AButton'
import { AKeyboardListener } from '@/components/AKeyboard/AKeyboardListener'
import { imageStore3 } from '@/stores/imageStore3'
import { debounce } from 'lodash'
import { Subscription } from 'rxjs'

// default props
const defaultProps = {
  isPressed: false,
}

type Props = {
  image?: []
  onSave: (type: 'normal' | 'multiple', nextScreen?: string) => void
  keyboardIsShowUp?: boolean
  isPressed: boolean
  createType?: CreateType
  loadingCreate: boolean
}

export type State = Readonly<{
  loading: boolean
  hideButton: boolean
  numberOfImages: number
}>

@withContext(CreateProductContext.Consumer)
export class CreateProductButton extends React.PureComponent<Props, State> {
  _subscription: Subscription

  readonly state: State = {
    loading: true,
    hideButton: false,
    numberOfImages: 0,
  }

  static readonly defaultProps = defaultProps

  componentDidMount(): void {
    this._subscription = imageStore3.observerResult().subscribe(data => {
      this.setState({
        loading: false,
        numberOfImages: data.length,
      })
    })
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
  }

  keyboardWillShow = () => {
    if (devices.isAndroid) {
      this.setState({
        hideButton: true,
      })
    }
  }

  keyboardWillHide = () => {
    if (devices.isAndroid) {
      this.setState({
        hideButton: false,
      })
    }
  }

  createProduct = debounce(
    (type: 'normal' | 'multiple', nextScreen?: string) => {
      const { onSave, isPressed, loadingCreate } = this.props
      const { loading } = this.state

      if (isPressed || loading || loadingCreate) return

      onSave(type, nextScreen)
    },
    100
  )

  get isMulti() {
    return this.props.createType === CreateType.Multi
  }

  get renderNormalButton() {
    const { loadingCreate } = this.props
    const { loading, hideButton } = this.state

    const products = I18n.t('createNumberProducts', {
      number: this.state.numberOfImages,
    })

    if (!this.isMulti || hideButton) return null

    return (
      <AButton
        onPress={() => {
          this.createProduct('multiple')
        }}
        title={products}
        rightIcon={images.rightArrow}
        containerStyle={styles.buttonContainer}
        titleStyle={styles.buttonText}
        loading={loading || loadingCreate}
      />
    )
  }

  get renderButtonDouble() {
    const { loadingCreate } = this.props
    const { loading, hideButton } = this.state

    if (this.isMulti || hideButton) return null

    return (
      <AButtonDouble
        onPressLeft={() => {
          this.createProduct('normal', 'CameraScreen')
        }}
        titleLeft={I18n.t('createAnother')}
        iconLeft={images.redo}
        onPressRight={() => {
          this.createProduct('normal')
        }}
        titleRight={I18n.t('save')}
        iconRight={images.rightArrow}
        loading={loading || loadingCreate}
      />
    )
  }

  get renderNetworkStatus() {
    const { keyboardIsShowUp } = this.props

    if (keyboardIsShowUp) return null

    return <ANetworkStatus connectedBgColor={colors.white} />
  }

  render() {
    return (
      <AKeyboardListener
        style={[
          styles.container,
          devices.isAndroid ? styles.shadowAndroid : styles.shadowIos,
        ]}
        keyboardWillShow={this.keyboardWillShow}
        keyboardWillHide={this.keyboardWillHide}
      >
        {this.renderNormalButton}
        {this.renderButtonDouble}
        {this.renderNetworkStatus}
      </AKeyboardListener>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  shadowIos: {
    shadowOpacity: 0.1,
    shadowOffset: { height: -5, width: 0 },
  },
  shadowAndroid: {
    elevation: metrics.base, // duc edited
  },
  buttonContainer: {
    height: metrics.double_button_height,
    borderRadius: metrics.small_base,
  },
  buttonText: {},
})
