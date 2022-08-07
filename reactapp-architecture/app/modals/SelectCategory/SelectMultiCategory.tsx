import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Category, Supplier } from '@/models/team'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SelectCategoryList } from '@/modals/SelectCategory/Components/SelectCategoryList'
import { SafeCategories } from '@/shared/categories'
import { colors, metrics } from '@/vars'
import { modalStore } from '@/stores/modalStore'
import { Toast } from '@/services/global'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  isPerfect: true,
  errMsg: null,
  selectedCategories: [] as any,
  textInputHeight: metrics.multi_select_text_input,
  renderKey: 0,
}

type SelectMultiTagProps = Readonly<{}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      selectedItem: Supplier
      suppliersId?: string[]
      tags: [] | any
      type: string
      isCreateProduct?: boolean
      setValue?: (data, key, type?: string) => void
      hideUpDownClear?: boolean
    }>
  >

export type SelectMultiTagState = Readonly<typeof initialState> &
  Partial<{
    data: Realm.Collection<Category>
  }>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SelectMultiCategory extends React.PureComponent<
  SelectMultiTagProps,
  SelectMultiTagState
> {
  _fuse: FuseService<Category> = new FuseService<Category>([] as any)
  _fuseSelected: FuseService<Category> = new FuseService<Category>([] as any)
  _categories: SafeCategories = new SafeCategories([] as any)
  _subscription: Subscription
  _supplierSubscription: Subscription
  _supplierResults: Realm.Results<Supplier>
  _results: Realm.Results<Category> = [] as any
  _modal
  _firstTimeUpdateSuggestList: boolean = true
  _firstTimeUpdateFuseData: boolean = true
  _isChoose = false
  _arrayCategory = []
  _isEditData = false

  readonly state: SelectMultiTagState = initialState

  componentDidMount() {
    this.initData()
  }

  componentWillUnmount() {
    this._supplierSubscription && this._supplierSubscription.unsubscribe()
    this._supplierResults && this._supplierResults.removeAllListeners()
    this._subscription && this._subscription.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)
    const type = navigation.getParam('type', '')
    const selectedItem = navigation.getParam('selectedItem', null)
    const suppliersId = navigation.getParam('suppliersId', [])

    return {
      hideUpDownClear,
      type,
      selectedItem,
      suppliersId,
    }
  }

  initData = () => {
    const { navigation } = this.props

    const suppliersId = navigation.getParam('suppliersId', [])
    if (suppliersId.length > 0) {
      suppliersId.map(categoryId => {
        const [subscription, results] = this.props.supplierFactory.fetchById(
          categoryId
        )

        this._supplierResults = results

        this._supplierSubscription = subscription.subscribe(data => {
          if (data) {
            this._arrayCategory[categoryId] = [...data.categories]
          }
        })
      })
      this.open()
      this.fetchCategory()
      return
    }

    const selectedItem = navigation.getParam('selectedItem', null)

    if (selectedItem) {
      const categories =
        selectedItem && selectedItem.categories
          ? [...selectedItem.categories]
          : []

      this.open()

      // add selected data
      this.setState(
        {
          selectedCategories: categories,
        },
        () => {
          this.fetchCategory()
        }
      )
    }
  }

  fetchCategory = () => {
    const { categoryFactory } = this.props
    const [subscription, results] = categoryFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(categories => {
      this._categories = new SafeCategories(categories)
      const { selectedCategories } = this.state

      // call this to update suggest list each time have change
      this.updateSuggestList(selectedCategories)

      // remove all data have in selectedCategories
      const filterCategories = this._categories.difference(selectedCategories)

      this.setState(
        {
          data: filterCategories,
        },
        () => {
          this.updateFuseData(filterCategories, selectedCategories)
          this.forceUpdate()
        }
      )
    })
  }

  updateFuseData = (dataSearch: any, selectedCategories: any) => {
    if (this._firstTimeUpdateFuseData) {
      this._firstTimeUpdateFuseData = false

      this._fuse = new FuseService<Category>(dataSearch)
      this._fuseSelected = new FuseService<Category>(selectedCategories)
    } else {
      this._fuse.update(dataSearch)
      this._fuseSelected.update(selectedCategories)
    }
  }

  updateSuggestList = (selectedCategories: Category[]) => {
    if (this._firstTimeUpdateSuggestList) {
      this._firstTimeUpdateSuggestList = false
      return
    }

    modalStore.categorySubject.next({
      isMulti: true,
      suggestCategory: modalStore.category,
      selectedCategory: selectedCategories,
    })
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

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        data: this._categories.data || [],
      })
      this._fuse.update(this._categories.data || ([] as any))
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
    this._isChoose = true
    const { selectedCategories } = this.state
    const newSelectedCategories = [...selectedCategories].concat(category)

    // Add to suggest
    modalStore.setCategory(category, newSelectedCategories, true)

    this.updateState(newSelectedCategories)
  }

  /**
   * Update for mass edit
   */
  updateMulti = () => {
    const { suppliersId } = this.navigationData()
    const { supplierFactory } = this.props
    const { selectedCategories } = this.state

    if (suppliersId.length <= 0) return

    supplierFactory
      .updateCategoryMultiSupplier(suppliersId, selectedCategories)
      .subscribe(() => {})

    if (selectedCategories.length > 0) {
      Toast.next({
        message: I18n.t('totalSupplierUpdate', {
          total: suppliersId.length,
          isMany: suppliersId.length === 1 ? '' : 's',
        }),
      })
    }
  }

  /**
   * Normal update
   */
  update = () => {
    const { supplierFactory } = this.props
    const { type, selectedItem } = this.navigationData()
    const { selectedCategories } = this.state

    if (!this._isEditData) return

    if (type === 'Supplier' && selectedItem) {
      supplierFactory
        .update(selectedItem.id, {
          categories: selectedCategories,
        })
        .subscribe(() => {})
    }
  }

  updateState = (selectedCategories: Category[], isRemove: boolean = false) => {
    const newData = this._categories.difference(selectedCategories as any)

    this._fuse.update(newData)
    this._fuseSelected.update(selectedCategories as any)

    this._isEditData = true

    this.setState(
      {
        selectedCategories,
        keyword: '',
        data: newData,
        renderKey: this.state.renderKey + 1,
      },
      () => {
        isRemove &&
          modalStore.categorySubject.next({
            isMulti: true,
            suggestCategory: modalStore.category,
            selectedCategory: selectedCategories,
          })
      }
    )
  }

  onCreate = (keyword: string) => {
    const { categoryFactory } = this.props

    categoryFactory
      .create({
        name: keyword.trim(),
      })
      .subscribe(createdCat => {
        this.onSelect(createdCat)
        this._categories.categories = this._results
        this.setState({
          keyword: '',
          isPerfect: true,
          renderKey: this.state.renderKey + 1,
        })
      })
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    const resultSelected = this._fuseSelected.search(keyword.trim())

    this.setState({
      data: result.data,
      isPerfect: resultSelected.isPerfect
        ? resultSelected.isPerfect
        : result.isPerfect,
    })
  }

  onClear = () => {
    this.setState({
      isPerfect: true,
      data: this._categories.data || [],
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })
    this._fuse.update(this._categories.data || ([] as any))
  }

  onHeightChange = (height: number) => {
    this.setState({
      textInputHeight: height,
    })
  }

  render() {
    const {
      keyword,
      data,
      selectedCategories,
      isPerfect,
      textInputHeight,
      renderKey,
    } = this.state
    const { hideUpDownClear, suppliersId } = this.navigationData()
    const isMassEdit = suppliersId.length > 0

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          supplierNavigation.setRef(SupplierRef.SelectMultiCategory, nodeRef)
        }}
        textInputType={'multiple'}
        headerProps={{
          title: I18n.t('selectCategories'),
          onPressIconRight: this.close,
        }}
        tagsInputProps={
          {
            onChangeText: this.onChangeText,
            onChange: categories => this.updateState(categories, true),
            placeholder: I18n.t('enterCategory'),
            value: selectedCategories,
            text: keyword,
            tagColor: colors.light_yellow,
            tagTextColor: colors.white,
            iconCloseStyle: styles.iconClose,
          } as any
        }
        updateMulti={isMassEdit ? this.updateMulti : this.update}
        onClear={this.onClear}
        onHeightChange={this.onHeightChange}
        renderKey={renderKey}
        hideUpDownClear={hideUpDownClear}
      >
        <SelectCategoryList
          selectedCategories={selectedCategories}
          onPress={this.onSelect}
          onCreate={this.onCreate}
          data={data}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
          textInputHeight={textInputHeight}
        />
      </AModal3>
    )
  }
}

const styles = StyleSheet.create<any>({
  iconClose: {
    tintColor: colors.white,
  },
})
