import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { Supplier } from '@/models/team'
import { navigation, Screen } from '@/navigation/navigation'
import {
  SupplierData,
  supplierNavigation,
} from '@/navigation/supplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierInfoContent } from '@/screens/SupplierInfo/Components/SupplierInfoContent'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { devices, metrics } from '@/vars'
import { debounce } from 'lodash'
import * as React from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SupplierInfoContext } from './SupplierInfoContext'
import { isIpad } from '@/shared/devices'
import { supplierStore } from '@/stores/supplierStore'
import {
  onDeleteSupplier,
  onSupplierChangeById,
  onItemCreated,
} from '@/services/global'
import { AToast } from '@/components/AToast/AToast'
import { CustomAlert } from '@/shared/alert'
import I18n from '@/i18n'
import { SafeSupplier } from '@/shared/supplier'
import { SupplierInfoActionBar } from '@/screens/SupplierInfo/Components/SupplierInfoActionBar'
import { contactNavigation } from '@/navigation/contactNavigation'
import { SafeProduct } from '@/shared/product'

export type Props = Readonly<{
  supplierId: string
  layoutWidth: number
  asComponent: boolean
  selectedIndex: number
}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      supplierId: string
    }>
  >

export type State = Readonly<{
  supplier: Supplier
  supplierName: string
  loading: boolean
  headerVisible: boolean
  imageData: string[]
  keyboardIsShowUp: boolean
  isBack: boolean
  like: boolean
  disableActionBar: boolean
}>

@withContext(AppContext.Consumer)
export class SupplierInfoScreen extends React.PureComponent<Props, State> {
  // variables
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription = null
  _timer: NodeJS.Timeout = null
  _isDeletedByMyself = false
  _results: Realm.Results<Supplier>
  _safeSupplier: SafeSupplier = new SafeSupplier(null)

  // state
  readonly state: State = {
    supplier: null,
    supplierName: '',
    loading: true,
    headerVisible: true,
    imageData: [],
    keyboardIsShowUp: false,
    isBack: false,
    like: false,
    disableActionBar: false,
  }

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    navigation.currentScreen = Screen.SupplierInfo
  }

  // life cycle
  componentDidMount() {
    const {
      navigation,
      supplierFactory,
      asComponent,
      supplierId: _supplierId,
    } = this.props

    this._navListener.didFocus(() => {
      !asComponent && StatusBar.setBarStyle('light-content', true)
      devices.isAndroid && AndroidKeyboardAdjust.setAdjustResize()
    })

    const supplierId = navigation.getParam('supplierId', _supplierId)

    const [subscription, results] = supplierFactory.fetchById(supplierId)

    this._results = results

    this._subscription = subscription.subscribe(supplier => {
      this.setSupplierData(supplier)
      onSupplierChangeById.next(supplier)
    })
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
    clearTimeout(this._timer)
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()
    navigation.removeLastScreen()
  }

  get isActiveHeader() {
    const { headerVisible } = this.state
    const { asComponent } = this.props

    if (!asComponent) {
      return headerVisible
    }

    return headerVisible && !isIpad()
  }

  get parallaxHeaderHeight() {
    const { asComponent } = this.props

    if (asComponent) {
      return 210 + metrics.header_absolute_height
    }

    return 210
  }

  setSupplierData = (supplier: Supplier) => {
    if (supplier) {
      clearTimeout(this._timer)

      this._safeSupplier.supplier = supplier

      supplierNavigation.setData(SupplierData.Supplier, supplier)
      const { name, favorite } = new SafeSupplier(supplier)

      this.setState({
        supplier,
        supplierName: name,
        loading: false,
        like: favorite,
      })
    } else {
      this.setState({
        loading: true,
      })

      const { asComponent, selectedIndex } = this.props
      if (asComponent && isIpad()) {
        supplierStore.delete().next({
          index: selectedIndex,
        })
      } else {
        // this.onShowAlert()
        this.props.navigation.goBack()
      }
    }
  }

  onComment = (text: string, cb: (clear: boolean) => void) => {
    const { supplierFactory, commentFactory } = this.props
    const { supplier } = this.state
    if (!supplier) {
      return
    }

    commentFactory.create({ text }).subscribe(
      comment => {
        supplierFactory.comment(supplier.id, comment).subscribe(newSupplier => {
          cb && cb(true)
          if (newSupplier) {
            this.setState({ supplier: newSupplier })
          }
          onItemCreated.next({
            supplier,
            type: 'comment',
            commentType: 'supplier',
            id: comment.id,
          })
        })
      },
      err => {
        console.warn('Error creating comment', err)
      }
    )
  }

  onCommentInputFocus = (isFocused: boolean) => {
    this.setState({ disableActionBar: isFocused })
  }

  // onShowAlert = () => {
  //   supplierNavigation.closeAllModal()
  //   contactNavigation.closeAll()
  //
  //   if (!this._isDeletedByMyself) {
  //     CustomAlert.error({
  //       message: I18n.t('thisSupplierWasDeleted'),
  //       onPress: () => {
  //         this.props.navigation.goBack()
  //       },
  //     })
  //   }
  // }

  onDelete = () => {
    const {
      supplierFactory,
      navigation,
      selectedIndex,
      asComponent,
    } = this.props
    const { supplier } = this.state

    supplierFactory
      .update(supplier.id, {
        deleted: true,
      })
      .subscribe(() => {
        onDeleteSupplier.next()
        if (asComponent && isIpad()) {
          supplierStore.delete().next({
            index: selectedIndex,
          })
        } else {
          setTimeout(() => {
            this._isDeletedByMyself = true
            navigation.goBack()
          }, 10)
        }
      })
  }

  onChangeHeaderVisibility = state => {
    this.setState({
      headerVisible: state,
    })

    if (!this.props.asComponent) {
      const barStyle = state ? 'light-content' : 'dark-content'
      StatusBar.setBarStyle(barStyle, true)
    }
  }

  onLike = debounce(() => {
    const { supplierFactory } = this.props
    const { supplier, like } = this.state

    this.setState({
      like: !like,
    })

    supplierFactory
      .update(supplier.id, {
        favorite: !like,
      })
      .subscribe(() => {})
  }, 100)

  onPressIconLeft = () => {
    this.setState({
      isBack: true,
    })

    this.props.navigation.goBack()
  }

  setKeyboardIsShowUp = (keyboardIsShowUp: boolean) => {
    this.setState({ keyboardIsShowUp })
  }

  renderNetWorkStatus = () => {
    const { keyboardIsShowUp } = this.state
    const { asComponent } = this.props

    if (keyboardIsShowUp || asComponent) return null

    return <ANetworkStatus fillAbsolute />
  }

  render() {
    const {
      loading,
      supplier,
      supplierName,
      imageData,
      keyboardIsShowUp,
      isBack,
      like,
    } = this.state
    const { asComponent } = this.props

    if (loading) return <AIndicator full />

    return (
      <SupplierInfoContext.Provider
        value={{
          supplier,
          supplierName,
          like,
          imageData,
          isBack,
          asComponent,
          safeSupplier: this._safeSupplier,
          onDelete: this.onDelete,
          headerVisible: this.isActiveHeader,
          onLike: this.onLike,
          onPressIconLeft: this.onPressIconLeft,
          onSend: this.onComment,
          onCommentInputFocus: this.onCommentInputFocus,
        }}
      >
        <SupplierInfoContent
          onChangeHeaderVisibility={this.onChangeHeaderVisibility}
          headerHeight={this.parallaxHeaderHeight}
        />

        <SupplierInfoActionBar
          setKeyboardIsShowUp={this.setKeyboardIsShowUp}
          disable={this.state.disableActionBar}
        />

        {this.renderNetWorkStatus()}
        {!keyboardIsShowUp && <AToast />}
      </SupplierInfoContext.Provider>
    )
  }
}

const styles = StyleSheet.create<any>({})
