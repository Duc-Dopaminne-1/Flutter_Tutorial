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
import { SelectIncoTermList } from './Components/SelectIncoTermList'
import { Incoterm } from '@/models/global'
import { SafeIncoTerm } from '@/shared/IncoTerm'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  loading: true,
  isPerfect: true,
  errMsg: null,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      selectedItem?: Product | Supplier
      type?: 'Product' | 'Supplier'
      isCreateProduct?: boolean
      setValue?: (data: any, key: string) => void
    }>
  >

export type State = Readonly<typeof initialState> &
  Partial<{
    data: Realm.Collection<any>
  }>

@withContext(AppContext.Consumer)
export class SelectIncoTermPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Incoterm> = new FuseService<Incoterm>([] as any)

  _subscriptionIncoTerm: Subscription
  _subSubscriptionHarbour: Subscription

  _resultsIncoTerm: Realm.Results<any> = [] as any

  _modal

  readonly state = initialState

  async componentDidMount() {
    this.open()
    this.fetch()
  }

  componentWillUnmount() {
    this._subscriptionIncoTerm && this._subscriptionIncoTerm.unsubscribe()

    this._resultsIncoTerm && this._resultsIncoTerm.removeAllListeners()
  }

  fetch = () => {
    const { globalIncoTermFactory } = this.props
    const [subscription, results] = globalIncoTermFactory.fetch()

    this._resultsIncoTerm = results

    this._subscriptionIncoTerm = subscription.subscribe(incoTerm => {
      this.setState({
        data: incoTerm,
      })

      const fuseData = incoTerm ? incoTerm : []
      this._fuse = new FuseService<Incoterm>(fuseData as any)
    })

    this._subSubscriptionHarbour = globalIncoTermFactory
      .subject()
      .subscribe(value => {
        if (value === Realm.Sync.SubscriptionState.Complete) {
          this.setState({
            loading: false,
          })
        }
      })
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    this._modal && this._modal.close()
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        data: this._resultsIncoTerm || [],
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

  onSelect = (incoTerm: Incoterm) => {
    const { productFactory, navigation, supplierFactory } = this.props

    const selectedItem = navigation.getParam('selectedItem', null)
    const type = navigation.getParam('type', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)
    const { incoTermName } = new SafeIncoTerm(incoTerm)

    if (isCreateProduct && setValue) {
      setValue(incoTermName, 'incoTerm')
      this.close()
      return
    }
    if (type === 'Product' && selectedItem) {
      productFactory
        .update(selectedItem.id, {
          incoTerm: incoTermName,
        })
        .subscribe(() => {
          this.close()
        })

      return
    }
    if (type === 'Supplier' && selectedItem) {
      supplierFactory
        .update(selectedItem.id, {
          incoTerm: incoTermName,
        })
        .subscribe(() => {
          this.close()
        })

      return
    }

    return
  }

  // onCreate = (keyword: string) => {
  //   const { eventFactory } = this.props
  //
  //   this._subscriptionCreateEvent = eventFactory
  //   .createEvent(keyword.trim())
  //   .subscribe(createdEvent => {
  //     this.onSelect(createdEvent)
  //   })
  // }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())

    this.setState({
      data: result.data,
      isPerfect: result.isPerfect,
    })
  }

  onClear = () => {
    this.setState({
      isPerfect: true,
      data: this._resultsIncoTerm || [],
      keyword: '',
    })
    this._fuse.update(this._resultsIncoTerm || ([] as any))
  }

  render() {
    const { keyword, isPerfect, data, loading } = this.state

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectIncoTerm, nodeRef)
          supplierNavigation.setRef(SupplierRef.SelectIncoTerm, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.SelectIncoTerm,
            nodeRef
          )
        }}
        headerProps={{
          title: I18n.t('selectIncoTerm'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterAIncoTermName'),
        }}
        onClear={this.onClear}
      >
        <SelectIncoTermList
          onPress={this.onSelect}
          loading={loading}
          // onCreate={this.onCreate}
          data={data}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
        />
      </AModal3>
    )
  }
}
