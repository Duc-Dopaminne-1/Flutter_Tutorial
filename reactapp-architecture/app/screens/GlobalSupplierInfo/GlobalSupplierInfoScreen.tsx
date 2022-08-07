import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { GlobalSupplierInfoContent } from './Components/GlobalSupplierInfoContent'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  Alert,
  Keyboard,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { GlobalSupplierInfoContext } from './GlobalSupplierInfoContext'
import { AHeader } from '@/components/AHeader/AHeader'
import I18n from '@/i18n'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'
import { SafeGlobalSupplier } from '@/shared/globalSupplier'
import { isIpad } from '@/shared/devices'
import { globalSupplierStore } from '@/stores/globalSupplierStore'
import { AModal5 } from '@/components/AModal/AModal5'
import { settingStore } from '@/stores/settingStore'
import { CameraMode } from '@/common/constants/CameraMode'
import { Supplier } from '@/models/team'

export type Props = Readonly<{
  asComponent: boolean
  selectedIndex: number
}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      boothId: string
      index: number
    }>
  >

export type State = Readonly<{
  booth: Booth
  loading: boolean
}>

@withContext(AppContext.Consumer)
export class GlobalSupplierInfoScreen extends React.PureComponent<
  Props,
  State
> {
  // variables
  _navListener = new NavigationService(this.props.navigation)
  _subscription: Subscription = null
  _saveSupplierSubscription: Subscription = null
  _modalSnapSupplierBusinessCard: React.RefObject<AModal5> = React.createRef()
  _selectedSupplier: Supplier = null

  // state
  readonly state: State = {
    booth: null,
    loading: true,
  }

  // life cycle
  async componentDidMount() {
    const { asComponent } = this.props

    this._navListener.didFocus(() => {
      !asComponent && StatusBar.setBarStyle('dark-content', true)
    })

    this.fetchBooth()
  }

  componentWillUnmount() {
    this._navListener.removeListener()
    this._subscription && this._subscription.unsubscribe()
    this._saveSupplierSubscription &&
      this._saveSupplierSubscription.unsubscribe()
  }

  saveSupplier = () => {
    const { supplierFactory } = this.props
    const { booth } = this.state
    const { supplier } = new SafeBooth(booth)
    const {
      id,
      name,
      fullName,
      tradingName,
      country,
      city,
      address,
      website,
      officeEmail,
      officePhone,
      type,
      logo,
      description,
    } = new SafeGlobalSupplier(supplier)

    this._saveSupplierSubscription = supplierFactory
      .saveSupplierGlobal({
        name,
        fullName,
        tradingName,
        description,
        country,
        city,
        address,
        website,
        officeEmail,
        officePhone,
        type,
        logo,
        globalDatabaseId: id,
      })
      .subscribe(data => {
        this.callBackCreateSupplier(data)
      })
  }

  callBackCreateSupplier = (supplier: Supplier) => {
    const { navigation } = this.props

    if (isIpad()) {
      const index = navigation.getParam('index', 0)
      globalSupplierStore.select().next({
        index,
        item: supplier,
      })
    }

    // if (settingStore.businessCard) {
    //   this._selectedSupplier = supplier
    //   this.openSnapSupplierModal()
    //   return
    // }

    isIpad()
      ? navigation.goBack()
      : this._navListener.replace('SupplierInfoScreen', {
          supplierId: supplier.id,
        })
  }

  fetchBooth = () => {
    const { globalBoothFactory, navigation } = this.props
    const boothId = navigation.getParam('boothId', '')
    const [subscription] = globalBoothFactory.fetchById(boothId)

    this._subscription = subscription.subscribe(booth => {
      if (booth && booth.length > 0) {
        this.setState({
          booth: booth[0],
          loading: false,
        })
      } else {
        this.setState({
          loading: false,
        })
        this.onShowAlert()
      }
    })
  }

  onShowAlert = () => {
    Alert.alert(`Can't not connect to this supplier`, null, [
      {
        text: 'Go back',
        onPress: () => {
          this.props.navigation.goBack()
        },
      },
    ])
  }

  // openSnapSupplierModal = () => {
  //   this._modalSnapSupplierBusinessCard.current &&
  //     this._modalSnapSupplierBusinessCard.current.open()
  // }

  // onSkip = () => {
  //   const { navigation } = this.props
  //
  //   this._modalSnapSupplierBusinessCard.current &&
  //     this._modalSnapSupplierBusinessCard.current.closed()
  //
  //   isIpad()
  //     ? navigation.goBack()
  //     : this._navListener.replace('SupplierInfoScreen', {
  //         supplierId: this._selectedSupplier.id || '',
  //       })
  // }

  // onSnapCard = () => {
  //   this._modalSnapSupplierBusinessCard.current &&
  //     this._modalSnapSupplierBusinessCard.current.closed()
  //
  //   this._navListener.replace('CameraScreen', {
  //     isSnapSupplierBusinessCard: true,
  //     supplier: this._selectedSupplier,
  //     cameraMode: CameraMode.BusinessCard,
  //     maxFiles: 1,
  //   })
  // }

  // onChangeCheck = (check: boolean) => {
  //   settingStore.businessCard = !check
  //   settingStore.setBusinessCardToStore(!check).catch(() => {})
  // }

  render() {
    const { loading, booth } = this.state

    if (loading) return <AIndicator full />

    return (
      <GlobalSupplierInfoContext.Provider
        value={{
          booth,
          saveSupplier: this.saveSupplier,
        }}
      >
        <AHeader
          title={I18n.t('exhibitor')}
          onPressIconLeft={() => {
            this.props.navigation.goBack(null)
          }}
          renderBackButtonIOS={true}
          containerStyle={styles.headerContainer}
          titleStyle={styles.titleStyle}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'always'}
          style={styles.scrollView}
        >
          <GlobalSupplierInfoContent />
        </ScrollView>

        {/* Modal snap business card */}
        {/*<AModal5*/}
        {/*  ref={this._modalSnapSupplierBusinessCard}*/}
        {/*  onPressLeft={this.onSkip}*/}
        {/*  onPressRight={this.onSnapCard}*/}
        {/*  onChangeCheck={this.onChangeCheck}*/}
        {/*/>*/}

        <ANetworkStatus fillAbsolute />
      </GlobalSupplierInfoContext.Provider>
    )
  }
}

const styles = StyleSheet.create<any>({
  headerContainer: {
    borderBottomWidth:
      metrics.supplier_info_header_container_border_bottom_width,
    borderBottomColor: colors.border_header,
    backgroundColor: colors.header_background_gray,
  },
  titleStyle: {
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.tag_text_color,
  },
  scrollView: {
    backgroundColor: colors.white,
  },
})
