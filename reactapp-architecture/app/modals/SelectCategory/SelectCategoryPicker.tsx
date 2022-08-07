import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Category, Product } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SelectCategoryList } from './Components/SelectCategoryList'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { modalStore } from '@/stores/modalStore'
import { SafeProduct } from '@/shared/product'
import { Toast } from '@/services/global'
import { Keyboard } from 'react-native'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  loading: true,
  isPerfect: true,
  errMsg: null,
  renderKey: 0,
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
      hideUpDownClear?: boolean
    }>
  >

export type State = Readonly<typeof initialState> &
  Partial<{
    data: Realm.Collection<Category>
  }>

@withContext(AppContext.Consumer)
export class SelectCategoryPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Category> = new FuseService<Category>([] as any)
  _subscription: Subscription
  _results: Realm.Results<Category> = [] as any
  _modal
  _firstTimeLoadData: boolean = true
  _isChoose = false

  readonly state = initialState

  async componentDidMount() {
    this.open()

    const { categoryFactory } = this.props

    const [subscription, results] = categoryFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(categories => {
      // call this to update suggest list each time have change
      this.updateSuggestList()

      this.setState(
        {
          data: categories,
          loading: false,
        },
        () => {
          this.forceUpdate()
        }
      )

      const fuseData = categories ? categories : []
      this._fuse = new FuseService<Category>(fuseData as any)
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    // this._subSubscription && this._subSubscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  navigationData = () => {
    const { navigation } = this.props

    const product = navigation.getParam('product', null)
    const productsId = navigation.getParam('productsId', [])
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    return {
      product,
      productsId,
      isCreateProduct,
      setValue,
    }
  }

  updateSuggestList = () => {
    if (this._firstTimeLoadData) {
      this._firstTimeLoadData = false
      return
    }

    modalStore.categorySubject.next({
      isMulti: true,
      suggestCategory: modalStore.category,
      selectedCategory: this.selectCategory,
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        data: this._results || [],
      })
      return
    }

    this.setState(
      {
        keyword,
      },
      () => this.onSearch(keyword)
    )
  }

  onSelect = (category: Category) => {
    const { productFactory } = this.props
    const {
      isCreateProduct,
      setValue,
      productsId,
      product,
    } = this.navigationData()

    Keyboard.dismiss()

    this._isChoose = true

    // Add to suggest
    modalStore.setCategory(category).catch(() => {})

    /**
     * Update data to state in create product
     */
    if (isCreateProduct && setValue) {
      this.updateDataForCreateProduct(category)
      return
    }

    /**
     * Update data for multi product
     */
    if (productsId.length > 0) {
      setTimeout(() => {
        productFactory
          .updateCategoryMultiProduct(productsId, category)
          .subscribe(() => {
            this.close()
          })
      }, 10)
      return
    }

    /**
     * Update data for product
     */
    if (product) {
      setTimeout(() => {
        productFactory.update(product.id, { category }).subscribe(() => {
          this.close()
        })
      }, 10)
    }
  }

  onCreate = (keyword: string) => {
    const { categoryFactory } = this.props
    const { productsId, product } = this.navigationData()
    const isUpdateToRealm = !!(product && product.id)

    Keyboard.dismiss()

    /**
     * Create and update category for multi product
     */
    if (productsId.length > 0) {
      setTimeout(() => {
        categoryFactory
          .createAndUpdateForMultiProduct({ name: keyword.trim() }, productsId)
          .subscribe(createdCategory => {
            // Add to suggest
            modalStore.setCategory(createdCategory).catch(() => {})
            this.close()
          })
      }, 10)
      return
    }

    setTimeout(() => {
      categoryFactory
        .create(
          { name: keyword.trim() },
          isUpdateToRealm,
          isUpdateToRealm ? product.id : ''
        )
        .subscribe(createdCategory => {
          // Add to suggest
          modalStore.setCategory(createdCategory).catch(() => {})

          if (!isUpdateToRealm) {
            this.updateDataForCreateProduct(createdCategory)
          } else {
            this.close()
          }
        })
    }, 10)
  }

  updateDataForCreateProduct = (category: Category) => {
    const { isCreateProduct, setValue } = this.navigationData()

    if (!isCreateProduct || !setValue) {
      return
    }

    modalStore.selectCategory = category
    setValue(category, 'category')
    this.close()
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      data: result.data,
      isPerfect: result.isPerfect,
    })
  }

  open = () => {
    this._modal && this._modal.open()
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
  }

  get selectCategory() {
    const { navigation } = this.props
    const product = navigation.getParam('product', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const { category } = new SafeProduct(product)

    if (isCreateProduct) {
      return modalStore.selectCategory
    }

    return category ? [category] : []
  }

  render() {
    const { keyword, data, isPerfect, renderKey, loading } = this.state
    const { navigation } = this.props
    const hideActionBar = navigation.getParam('hideActionBar', false)
    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)
    const selectCategory = this.selectCategory

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectCategory, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.SelectCategory,
            nodeRef
          )
        }}
        headerProps={{
          title: I18n.t('selectCategory'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterCategoryName'),
        }}
        onClear={this.onClear}
        renderKey={renderKey}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
      >
        <SelectCategoryList
          selectedCategories={selectCategory}
          onPress={this.onSelect}
          onCreate={this.onCreate}
          data={data}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
          loading={loading}
        />
      </AModal3>
    )
  }
}
