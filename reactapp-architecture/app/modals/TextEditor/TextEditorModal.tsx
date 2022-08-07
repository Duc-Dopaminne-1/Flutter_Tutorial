import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ifIphoneX } from '@/shared/devices'
import { withContext } from '@/shared/withContext'
import { colors, devices, fonts, metrics } from '@/vars'
import md5 from 'blueimp-md5'
import { pathOr } from 'ramda'
import React, { PureComponent } from 'react'
import {
  Alert,
  EmitterSubscription,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { sampleNavigation, SampleRef } from '@/navigation/sampleNavigation'
import { Direction } from 'tty'

export type Props = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      selectedItem: Product
      description?: string
      onSave?: (
        description: string,
        isMoveDown?: boolean,
        direction?: Direction
      ) => void
      isCreateProduct?: boolean
      setValue?: (data: any, key: string) => void
      hideActionBar?: boolean
      hideUpDownClear?: boolean
      modalProps?: object
      withoutNavigation?: boolean
    }>
  >

type State = {
  marginBottom: number
  hasEdited: boolean
  description: string
  baseDescription: string
  key: number
  renderKey: number
}

@withContext(AppContext.Consumer)
export class TextEditorModal extends PureComponent<Props, State> {
  _textInput: React.RefObject<TextInput> = React.createRef()
  _keyboardWillShowSub: EmitterSubscription
  _keyboardWillHideSub: EmitterSubscription
  _modal
  _isWriting = false

  readonly state: State = {
    marginBottom: 0,
    hasEdited: false,
    description: '',
    baseDescription: '',
    key: 0,
    renderKey: 0,
  }

  componentDidMount() {
    this.open()

    const { navigation } = this.props

    const selectedItem = navigation.getParam('selectedItem', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const description = isCreateProduct
      ? navigation.getParam('description', '')
      : pathOr('', ['description'], selectedItem)
    const hasEdited = selectedItem ? description.length <= 0 : true

    this.setState({
      description,
      hasEdited,
      baseDescription: description,
    })

    if (hasEdited) {
      setTimeout(() => {
        this._textInput.current && this._textInput.current.focus()
      }, 400)
    }

    this.keyboardTrigger()
  }

  componentWillUnmount(): void {
    this._keyboardWillShowSub && this._keyboardWillShowSub.remove()
    this._keyboardWillHideSub && this._keyboardWillHideSub.remove()
  }

  keyboardTrigger = () => {
    if (Platform.OS === 'android') {
      this._keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', e => {
        this.keyboardWillShow(e)
      })

      this._keyboardWillHideSub = Keyboard.addListener(
        'keyboardDidHide',
        () => {
          this.keyboardWillHide()
        }
      )
    } else {
      this._keyboardWillShowSub = Keyboard.addListener(
        'keyboardWillShow',
        e => {
          this.keyboardWillShow(e)
        }
      )

      this._keyboardWillHideSub = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          this.keyboardWillHide()
        }
      )
    }
  }

  keyboardWillShow = (event: any) => {
    this.setState({ marginBottom: event.endCoordinates.height + 90 })
  }

  keyboardWillHide = () => {
    this.setState({ marginBottom: 0 })
  }

  updateKey = () => {
    this.setState((prevState: State) => {
      return {
        key: prevState.key + 1,
      }
    })
  }

  renderLeft = () => {
    const { hasEdited, key } = this.state

    return (
      <TouchableOpacity
        style={styles.wrapHeaderText}
        onPress={() => {
          if (hasEdited) {
            this.onSave()
          } else {
            this.changeEditable()
          }
        }}
        key={key}
      >
        <Text style={styles.headerText}>
          {hasEdited ? I18n.t('save') : I18n.t('edit')}
        </Text>
      </TouchableOpacity>
    )
  }

  changeEditable = () => {
    try {
      this._textInput.current.focus()
      this.setState({
        hasEdited: true,
      })
    } catch (e) {
      // console.log(e)
    }
  }

  onChangeText = (description: string) => {
    this.setState(
      {
        description,
        hasEdited: true,
      },
      () => {
        this.updateKey()
      }
    )
  }

  openPressRight = () => {
    Keyboard.dismiss()
    const { description, baseDescription } = this.state
    const oldDescription = baseDescription ? baseDescription : ''
    const descriptionHash = md5(oldDescription)
    const newDescriptionHash = md5(description.trim())

    if (descriptionHash !== newDescriptionHash) {
      Alert.alert(
        I18n.t('discardChange'),
        '',
        [
          {
            text: I18n.t('cancel'),
            onPress: () => {},
          },
          {
            text: I18n.t('discard'),
            onPress: this.close,
            style: 'destructive',
          },
        ],
        { cancelable: false }
      )
    } else {
      this.close()
    }
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
    }
  }

  close = () => {
    if (this._modal) {
      this._modal.close()
    }
  }

  onSave = (isMove: boolean = false, direction?: Direction) => {
    const { navigation } = this.props
    const { description } = this.state

    const onSave = navigation.getParam('onSave', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    if (isCreateProduct && setValue) {
      setValue(description.trim(), 'description')
      !isMove && this.close()
      return
    }

    onSave && onSave(description.trim(), isMove, direction)
  }

  onClear = () => {
    this.onChangeText('')
    this.setState({
      renderKey: this.state.renderKey + 1,
    })
  }

  onMove = (direction: Direction) => {
    this.onSave(true, direction)
  }

  render() {
    const { marginBottom, description, key, renderKey } = this.state
    const hideActionBar = this.props.navigation.getParam('hideActionBar', false)
    const withoutNavigation = this.props.navigation.getParam(
      'withoutNavigation',
      false
    )
    const hideUpDownClear = this.props.navigation.getParam(
      'hideUpDownClear',
      false
    )
    const modalProps = this.props.navigation.getParam('modalProps', {})
    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.Description, nodeRef)
          supplierNavigation.setRef(SupplierRef.Description, nodeRef)
          createProductNavigation.setRef(CreateProductRef.Description, nodeRef)
          sampleNavigation.setRef(SampleRef.Description, nodeRef)
        }}
        textInputType={'none'}
        headerProps={{
          key,
          title: I18n.t('description'),
          onPressIconRight: this.openPressRight,
          renderLeft: this.renderLeft,
          onPressIconLeft: this.onSave,
        }}
        isDescription={true}
        modalProps={{
          handlePosition: 'inside',
          useScrollView: false,
          ...modalProps,
        }}
        onClear={this.onClear}
        clearTextStyle={
          description.length <= 0 ? styles.customClearTextStyle : {}
        }
        onMove={this.onMove}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
        isWriting={this._isWriting}
        withoutNavigation={withoutNavigation}
      >
        <TextInput
          ref={this._textInput}
          key={devices.isAndroid ? renderKey : 69}
          value={description}
          onChangeText={this.onChangeText}
          placeholder={I18n.t('enterDescriptionHere')}
          placeholderTextColor={colors.text_light_grey}
          autoCorrect={true}
          onBlur={() => {
            this._isWriting = false
          }}
          onFocus={() => {
            this._isWriting = true
            this.setState({ hasEdited: true }, () => {
              this.updateKey()
            })
          }}
          multiline={true}
          onTouchStart={() => {
            this.setState({ hasEdited: true })
          }}
          returnKeyType={'default'}
          style={[styles.textInput, { marginBottom }]}
        />
      </AModal3>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapHeaderText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerText: {
    color: colors.label_blue_light,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
  textInput: {
    color: colors.text_grey,
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPRegular,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    ...ifIphoneX({
      marginBottom: 20,
    }),
  },
  customClearTextStyle: {
    color: colors.warning,
  },
})
