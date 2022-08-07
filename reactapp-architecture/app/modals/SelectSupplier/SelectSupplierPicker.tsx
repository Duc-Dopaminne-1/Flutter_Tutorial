import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product, Supplier } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SelectSupplierList } from './Components/SelectSupplierList'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { settingStore } from '@/stores/settingStore'
import { FlatList, Keyboard, StyleSheet, Dimensions } from 'react-native'
import { AModal5 } from '@/components/AModal/AModal5'
import { CameraMode } from '@/common/constants/CameraMode'
import { colors, metrics } from '@/vars'
import { ifIphoneX } from '@/shared/devices'
import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import { modalStore } from '@/stores/modalStore'
import { SelectSupplierSuggestList } from '@/modals/SelectSupplier/Components/SelectSupplierSuggestList'
import { SafeProduct } from '@/shared/product'
import { difference } from '@/shared/supportFunction'
import { Toast } from '@/services/global'
import {
  contactNavigation,
  ContactNavigationRef,
} from '@/navigation/contactNavigation'
import { Omit } from 'utility-types'
import { ModalizeProps } from '@/libs/Modalize'
import { Direction } from '@/common/constants/Direction'
import { sampleNavigation, SampleRef } from '@/navigation/sampleNavigation'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  loading: true,
  isPerfect: true,
  errMsg: '',
  renderKey: 0,
  suggestSuppliers: [],
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      product?: Product
      productsId?: string[]
      isCreateProduct?: boolean
      setValue?: (data: any, key: string) => void
      hideActionBar?: boolean
      createContactScreen?: boolean
      modalProps?: Omit<ModalizeProps, 'children'>
      shouldNotSetProductRef?: boolean
      onMove: (direction: Direction) => void
      hideUpDownClear?: boolean
    }>
  >

export type State = Readonly<typeof initialState> &
  Readonly<{
    data: Realm.Results<Supplier>
  }>

@withContext(AppContext.Consumer)
export class SelectSupplierPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Supplier> = new FuseService<Supplier>([] as any)
  _fuseSuggestion: FuseService<Supplier> = new FuseService<Supplier>([] as any)
  _subscription: Subscription
  _subSubscription: Subscription
  _results: Realm.Results<Supplier> = [] as any
  _modal
  _modalSnapSupplierBusinessCard: React.RefObject<AModal5> = React.createRef()
  _selectedSupplier: Supplier = null
  _isChoose = false

  static readonly defaultProps = {
    onPressClose: () => {},
  }

  readonly state: State = initialState

  async componentDidMount() {
    const { supplierFactory } = this.props

    this.open()

    const [subscription, results] = supplierFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(suppliers => {
      this.setState(
        {
          data: suppliers,
          loading: false,
        },
        () => {
          this.forceUpdate()
        }
      )

      // call this to update suggest list each time have change
      this.fetchSuggest()

      this._fuse = new FuseService<Supplier>(suppliers)
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  navigationData = () => {
    const { navigation } = this.props

    const product = navigation.getParam('product', null)
    const createContactScreen = navigation.getParam('createContactScreen', null)
    const productsId = navigation.getParam('productsId', [])
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    return {
      product,
      createContactScreen,
      productsId,
      isCreateProduct,
      setValue,
    }
  }

  fetchSuggest = () => {
    const { navigation } = this.props
    const product = navigation.getParam('product', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    this._fuseSuggestion = new FuseService<Supplier>(modalStore.supplier as any)
    if (isCreateProduct) {
      this.setState({
        suggestSuppliers: difference(
          modalStore.selectSupplier,
          modalStore.supplier
        ),
      })
      return
    }

    const { supplier } = new SafeProduct(product)
    const convertSupplierToArray = supplier ? [supplier] : []

    this.setState({
      suggestSuppliers: difference(convertSupplierToArray, modalStore.supplier),
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        data: this._results || [],
      })
      // Reset suggestions
      this.fetchSuggest()
      return
    }

    this.setState(
      {
        keyword,
      },
      () => this.onSearch(keyword)
    )
  }

  onSelect = (supplier: Supplier) => {
    const { productFactory } = this.props
    const {
      product,
      productsId,
      isCreateProduct,
      setValue,
    } = this.navigationData()

    Keyboard.dismiss()

    this._isChoose = true

    if (!(supplier && supplier.isValid())) return

    /**
     * Add to suggest list
     */
    modalStore.setSupplier(supplier).catch(() => {})

    /**
     * Update data to state from create product
     */
    if (isCreateProduct && setValue) {
      this.updateDataForCreateProduct(supplier)
      return
    }

    /**
     * Update data for multi product
     */
    if (productsId.length > 0 && supplier) {
      setTimeout(() => {
        productFactory
          .updateSupplierMultiProduct(productsId, supplier)
          .subscribe(() => {
            this.close()
          })
      }, 10)
    }

    /**
     * Update data for one product
     */
    if (product && supplier) {
      setTimeout(() => {
        productFactory.update(product.id, { supplier }).subscribe(() => {
          this.close()
        })
      }, 10)
    }
  }

  onCreate = (keyword: string) => {
    const { supplierFactory } = this.props
    const { product, createContactScreen, productsId } = this.navigationData()
    const isUpdateToRealm = !!(product && product.id)

    Keyboard.dismiss()

    /**
     * Create and update supplier for multi product
     */
    if (productsId.length > 0) {
      setTimeout(() => {
        supplierFactory
          .createAndUpdateMultiProduct({ name: keyword.trim() }, productsId)
          .subscribe(createdSupplier => {
            /**
             * Add to suggest list
             */
            modalStore.setSupplier(createdSupplier).catch(() => {})

            this.close()
          })
      }, 10)
      return
    }

    setTimeout(() => {
      supplierFactory
        .create(
          { name: keyword.trim() },
          isUpdateToRealm,
          isUpdateToRealm ? product.id : ''
        )
        .subscribe(createdSupplier => {
          /**
           * Add to suggest list
           */
          modalStore.setSupplier(createdSupplier).catch(() => {})

          if (!isUpdateToRealm) {
            /**
             * Update data to state in create product
             */
            this.updateDataForCreateProduct(createdSupplier, true)
          } else {
            /**
             * Check and open modal snap business card
             */
            if (settingStore.businessCard && !createContactScreen) {
              this._selectedSupplier = createdSupplier
              this.openSnapSupplierModal()
            } else {
              this.close()
            }
          }
        })
    }, 10)
  }

  updateDataForCreateProduct = (
    supplier: Supplier,
    fromCreate: boolean = false
  ) => {
    const {
      isCreateProduct,
      setValue,
      createContactScreen,
    } = this.navigationData()

    if (!supplier || !supplier.isValid() || !isCreateProduct || !setValue) {
      return
    }

    modalStore.selectSupplier = supplier
    setValue(supplier, 'supplier')

    /**
     * Open snap business card modal
     */
    if (fromCreate && settingStore.businessCard && !createContactScreen) {
      this._selectedSupplier = supplier
      this.openSnapSupplierModal()
      return
    }

    this.close()
  }

  openSnapSupplierModal = () => {
    Keyboard.dismiss()

    setTimeout(() => {
      this._modalSnapSupplierBusinessCard.current &&
        this._modalSnapSupplierBusinessCard.current.open()
    }, 10)
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    const resultsSuggestion = this._fuseSuggestion.search(keyword.trim())

    // Filter suggestions
    let suggestSuppliers = []
    const { navigation } = this.props
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    if (isCreateProduct) {
      suggestSuppliers = difference(
        modalStore.selectSupplier,
        resultsSuggestion.data
      )
    } else {
      const product = navigation.getParam('product', null)
      const { supplier } = new SafeProduct(product)
      const convertSupplierToArray = supplier ? [supplier] : []
      suggestSuppliers = difference(
        convertSupplierToArray,
        resultsSuggestion.data
      )
    }

    this.setState({
      suggestSuppliers,
      data: result.data,
      isPerfect: result.isPerfect,
    })
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
    }
  }

  close = () => {
    if (this._modal) {
      const productsId = this.props.navigation.getParam('productsId', [])
      if (productsId.length > 0 && this._isChoose) {
        Toast.next({
          message: I18n.t('totalProductUpdate', {
            total: productsId.length,
            isMany: productsId.length === 1 ? '' : 's',
          }),
        })
      }
      this._modal.close()
    }
  }

  onClear = () => {
    this.setState({
      isPerfect: true,
      data: this._results || [],
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })
    this._fuse.update(this._results || ([] as any))
    this._fuse.update((modalStore.supplier || []) as any)
    // Reset suggestions
    this.fetchSuggest()
  }

  onSkip = () => {
    this._modalSnapSupplierBusinessCard.current &&
      this._modalSnapSupplierBusinessCard.current.closed()

    setTimeout(() => {
      this.close()
    }, 100)
  }

  onSnapCard = () => {
    const { navigation } = this.props
    const productsId = this.props.navigation.getParam('productsId', [])

    navigation.navigate('CameraScreen', {
      productsId,
      isSnapSupplierBusinessCard: true,
      supplier: this._selectedSupplier,
      cameraMode: CameraMode.BusinessCard,
      maxFiles: 1,
    })
  }

  onChangeCheck = (check: boolean) => {
    settingStore.businessCard = !check
    settingStore.setBusinessCardToStore(!check)
  }

  renderHeader = () => {
    const { suggestSuppliers } = this.state

    return (
      <SelectSupplierSuggestList
        onPress={this.onSelect}
        suggestSuppliers={suggestSuppliers as any}
      />
    )
  }

  renderItem = ({ item }) => {
    if (!item || !item.isValid() || item.deleted) return null

    return <SelectSupplierList data={item} onPress={this.onSelect} />
  }

  renderFooter = () => {
    const { keyword } = this.state

    return (
      <AButtonCreate
        text={keyword}
        onPress={() => {
          this.onCreate(keyword)
        }}
      />
    )
  }

  render() {
    const { keyword, data, isPerfect, renderKey } = this.state
    const onMove = this.props.navigation.getParam('onMove', () => null)
    const hideActionBar = this.props.navigation.getParam('hideActionBar', false)
    const hideUpDownClear = this.props.navigation.getParam(
      'hideUpDownClear',
      false
    )
    const modalProps = this.props.navigation.getParam('modalProps', undefined)
    const shouldNotSetProductRef = this.props.navigation.getParam(
      'shouldNotSetProductRef',
      false
    )

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          if (!shouldNotSetProductRef) {
            contactNavigation.setRef(
              ContactNavigationRef.SelectSupplier,
              nodeRef
            )
            productNavigation.setRef(ProductRef.SelectSupplier, nodeRef)
            sampleNavigation.setRef(SampleRef.SelectSupplier, nodeRef)
            createProductNavigation.setRef(
              CreateProductRef.SelectSupplier,
              nodeRef
            )
          }
        }}
        headerProps={{
          title: I18n.t('selectSupplier'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterSupplierName'),
        }}
        onClear={this.onClear}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
        renderKey={renderKey}
        modalProps={modalProps}
        onMove={onMove}
      >
        <FlatList
          data={data}
          extraData={data}
          renderItem={this.renderItem}
          keyExtractor={(_item, index) => index.toString()}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          style={styles.flatList}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={!isPerfect && this.renderFooter}
          onScrollBeginDrag={() => {
            Keyboard.dismiss()
          }}
        />

        <AModal5
          ref={this._modalSnapSupplierBusinessCard}
          onPressLeft={this.onSkip}
          onPressRight={this.onSnapCard}
          onChangeCheck={this.onChangeCheck}
        />
      </AModal3>
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    paddingTop: metrics.medium_base,
    paddingBottom: 100,
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
  },
})
