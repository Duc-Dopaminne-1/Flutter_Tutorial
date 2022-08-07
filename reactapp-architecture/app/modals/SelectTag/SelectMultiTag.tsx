import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product, Supplier, Tag } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { SafeTags } from '@/shared/tags'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SelectTagList } from './Components/SelectTagList'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { metrics } from '@/vars'
import { modalStore } from '@/stores/modalStore'
import { filterValidRealmObject } from '@/shared/validator'
import { Toast } from '@/services/global'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  isPerfect: true,
  errMsg: null,
  selectedTags: [] as any,
  textInputHeight: metrics.multi_select_text_input,
  renderKey: 0,
}

type SelectMultiTagProps = Readonly<{}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      selectedItem?: Supplier | Product
      tags: [] | any
      suppliersId?: string[]
      type: string
      isCreateProduct?: boolean
      setValue?: (data, key, type?: string) => void
      hideUpDownClear?: boolean
    }>
  >

export type SelectMultiTagState = Readonly<typeof initialState> &
  Partial<{
    data: Realm.Collection<Tag>
  }>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SelectMultiTag extends React.PureComponent<
  SelectMultiTagProps,
  SelectMultiTagState
> {
  _fuse: FuseService<Tag> = new FuseService<Tag>([] as any)
  _fuseSelected: FuseService<Tag> = new FuseService<Tag>([] as any)
  _tags: SafeTags = new SafeTags([] as any)
  _subscription: Subscription
  _supplierResults: Realm.Results<Supplier>
  _supplierSubscription: Subscription
  _results: Realm.Results<Tag> = [] as any
  _modal
  _firstTimeUpdateSuggestList: boolean = true
  _firstTimeUpdateFuseData: boolean = true
  _isChoose = false
  _arrayTag = []
  _isEditData = false

  readonly state: SelectMultiTagState = initialState

  async componentDidMount() {
    const { navigation } = this.props
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    this.open()

    if (isCreateProduct) {
      this.initDataCreateProduct()
    } else {
      this.initData()
    }
  }

  componentWillUnmount() {
    this._supplierResults && this._supplierResults.removeAllListeners()
    this._supplierSubscription && this._supplierSubscription.unsubscribe()
    this._subscription && this._subscription.unsubscribe()

    if (this._results && this._results.removeAllListeners) {
      this._results.removeAllListeners()
    }
  }

  navigationData = () => {
    const { navigation } = this.props

    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)
    const type = navigation.getParam('type', '')
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)
    const selectedItem = navigation.getParam('selectedItem', null)
    const suppliersId = navigation.getParam('suppliersId', [])

    return {
      hideUpDownClear,
      type,
      isCreateProduct,
      setValue,
      selectedItem,
      suppliersId,
    }
  }

  initDataCreateProduct = () => {
    const { navigation } = this.props
    const selectedItem = navigation.getParam('tags', [])
    const filterSelectedTag = filterValidRealmObject(selectedItem)
    const setValue = navigation.getParam('setValue', null)

    if (setValue) {
      setValue(filterSelectedTag, 'tags')
    }

    this.setState(
      {
        selectedTags: filterSelectedTag,
      },
      () => {
        this.fetchTag()
      }
    )
  }

  initData = () => {
    const { navigation } = this.props
    const selectedItem = navigation.getParam('selectedItem', {
      tags: [],
    } as any)
    const suppliersId = navigation.getParam('suppliersId', [])

    if (suppliersId.length > 0) {
      suppliersId.map(supplierId => {
        const [subscription, results] = this.props.supplierFactory.fetchById(
          supplierId
        )

        this._supplierResults = results

        this._supplierSubscription = subscription.subscribe(data => {
          if (data) {
            this._arrayTag[supplierId] = [...data.tags]
          }
        })
      })
      this.fetchTag()
      return
    }

    if (selectedItem) {
      this.setState(
        {
          selectedTags: [...selectedItem.tags],
        },
        () => {
          this.fetchTag()
        }
      )
    }
  }

  fetchTag = () => {
    const { tagFactory } = this.props
    const [subscription, results] = tagFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(tags => {
      this._tags = new SafeTags(tags)
      const selectedTags = this.getSelectedTags()

      // call this to update suggest list each time have change
      this.updateSuggestList(selectedTags)

      // remove all data have in selectedTags
      const filterTags = this._tags.difference(selectedTags)

      this.setState(
        {
          data: filterTags,
        },
        () => {
          this.updateFuseData(filterTags, selectedTags)
          this.forceUpdate()
        }
      )
    })
  }

  updateFuseData = (dataSearch: any, selectedTags: any) => {
    if (this._firstTimeUpdateFuseData) {
      this._firstTimeUpdateFuseData = false

      this._fuse = new FuseService<Tag>(dataSearch)
      this._fuseSelected = new FuseService<Tag>(selectedTags)
    } else {
      this._fuse.update(dataSearch)
      this._fuseSelected.update(selectedTags)
    }
  }

  getSelectedTags = () => {
    const { navigation } = this.props
    const { selectedTags } = this.state
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    if (!isCreateProduct) {
      return selectedTags
    }

    // Only run this check valid data when create product

    const filterSelectedTag = filterValidRealmObject(selectedTags)

    if (selectedTags.length !== filterSelectedTag.length) {
      this.setState({
        selectedTags: filterSelectedTag,
      })

      this.updateState(filterSelectedTag)
    }

    return filterSelectedTag
  }

  updateSuggestList = (selectedTags: Tag[]) => {
    if (this._firstTimeUpdateSuggestList) {
      this._firstTimeUpdateSuggestList = false
      return
    }

    modalStore.tagSubject.next({
      isMulti: true,
      suggestTag: modalStore.tag,
      selectedTag: selectedTags,
    })
  }

  open = () => {
    this._modal && this._modal.open()
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
        data: this._tags.data || [],
      })
      this._fuse.update(this._tags.data || ([] as any))
      return
    }

    this.setState(
      {
        keyword,
      },
      () => this.onSearch(keyword)
    )
  }

  onSelect = (tag: Tag) => {
    this._isChoose = true
    const { selectedTags } = this.state
    const newSelectedTags = [...selectedTags].concat(tag)

    // Add to suggest
    modalStore.setTag(tag, newSelectedTags, true)

    this.updateState(newSelectedTags)
  }

  /**
   * Update for mass edit
   */
  updateMulti = () => {
    const { supplierFactory } = this.props
    const { selectedTags } = this.state
    const { suppliersId } = this.navigationData()

    if (suppliersId.length <= 0) return

    supplierFactory
      .updateTagMultiSupplier(suppliersId, selectedTags)
      .subscribe(() => {})

    if (selectedTags.length > 0) {
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
    const { productFactory, supplierFactory } = this.props
    const {
      type,
      isCreateProduct,
      setValue,
      selectedItem,
    } = this.navigationData()
    const { selectedTags } = this.state

    if (!this._isEditData) return

    if (isCreateProduct && setValue) {
      setValue(selectedTags, 'tags')
      return
    }

    if (type === 'Product' && selectedItem) {
      productFactory
        .update(selectedItem.id, {
          tags: selectedTags,
        })
        .subscribe(() => {})

      return
    }

    if (type === 'Supplier' && selectedItem) {
      supplierFactory
        .update(selectedItem.id, {
          tags: selectedTags,
        })
        .subscribe(() => {})
    }
  }

  updateState = (selectedTags: Tag[], isRemove: boolean = false) => {
    const newData = this._tags.difference(selectedTags)

    this._fuse.update(newData)
    this._fuseSelected.update(selectedTags as any)

    this._isEditData = true

    this.setState(
      {
        selectedTags,
        keyword: '',
        data: newData,
        renderKey: this.state.renderKey + 1,
      },
      () => {
        isRemove &&
          modalStore.tagSubject.next({
            isMulti: true,
            suggestTag: modalStore.tag,
            selectedTag: selectedTags,
          })
      }
    )
  }

  onCreate = (keyword: string) => {
    const { tagFactory } = this.props

    tagFactory
      .create({
        name: keyword.trim(),
      })
      .subscribe(newTag => {
        this.onSelect(newTag)
        this._tags.tag = this._results
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
      data: this._tags.data || [],
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })
    this._fuse.update(this._tags.data || ([] as any))
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
      selectedTags,
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
          productNavigation.setRef(ProductRef.SelectTags, nodeRef)
          supplierNavigation.setRef(SupplierRef.SelectTags, nodeRef)
          createProductNavigation.setRef(CreateProductRef.SelectTags, nodeRef)
        }}
        textInputType={'multiple'}
        headerProps={{
          title: I18n.t('selectTags'),
          onPressIconRight: this.close,
        }}
        tagsInputProps={
          {
            onChangeText: this.onChangeText,
            onChange: tags => this.updateState(tags, true),
            placeholder: I18n.t('enterTagName'),
            value: selectedTags,
            text: keyword,
          } as any
        }
        updateMulti={isMassEdit ? this.updateMulti : this.update}
        onClear={this.onClear}
        onHeightChange={this.onHeightChange}
        renderKey={renderKey}
        hideUpDownClear={hideUpDownClear}
      >
        <SelectTagList
          selectedTags={selectedTags}
          keyword={keyword.trim()}
          onPress={this.onSelect}
          onCreate={this.onCreate}
          data={data}
          isPerfect={isPerfect}
          textInputHeight={textInputHeight}
        />
      </AModal3>
    )
  }
}
