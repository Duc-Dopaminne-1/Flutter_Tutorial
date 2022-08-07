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
import { SelectHarbourList } from './Components/SelectHarbourList'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { Harbour } from '@/models/global'
import { SafeHarbour } from '@/shared/harbour'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'

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
export class SelectHarbourPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Harbour> = new FuseService<Harbour>([] as any)

  _subscriptionHarbour: Subscription
  _subSubscriptionHarbour: Subscription

  _resultsHarbour: Realm.Results<any> = [] as any

  _modal

  readonly state = initialState

  async componentDidMount() {
    this.open()
    this.fetch()
  }

  componentWillUnmount() {
    this._subscriptionHarbour && this._subscriptionHarbour.unsubscribe()
    this._subSubscriptionHarbour && this._subSubscriptionHarbour.unsubscribe()

    this._resultsHarbour && this._resultsHarbour.removeAllListeners()
  }

  fetch = () => {
    const { globalHarbourFactory } = this.props
    const [subscription, results] = globalHarbourFactory.fetch()

    this._resultsHarbour = results

    this._subscriptionHarbour = subscription.subscribe(harbour => {
      this.setState({
        data: harbour,
      })

      const fuseData = harbour ? harbour : []
      this._fuse = new FuseService<Harbour>(fuseData as any)
    })

    this._subSubscriptionHarbour = globalHarbourFactory
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
        data: this._resultsHarbour || [],
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

  onSelect = (harbour: Harbour) => {
    const { productFactory, navigation, supplierFactory } = this.props

    const selectedItem = navigation.getParam('selectedItem', null)
    const type = navigation.getParam('type', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)
    const { harbourName } = new SafeHarbour(harbour)

    if (isCreateProduct && setValue) {
      setValue(harbourName, 'harbour')
      this.close()
      return
    }
    if (type === 'Product' && selectedItem) {
      productFactory
        .update(selectedItem.id, {
          harbour: harbourName,
        })
        .subscribe(() => {
          this.close()
        })

      return
    }
    if (type === 'Supplier' && selectedItem) {
      supplierFactory
        .update(selectedItem.id, {
          harbour: harbourName,
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
      data: this._resultsHarbour || [],
      keyword: '',
    })
    this._fuse.update(this._resultsHarbour || ([] as any))
  }

  render() {
    const { keyword, isPerfect, data, loading } = this.state

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectHarbour, nodeRef)
          supplierNavigation.setRef(SupplierRef.SelectHarbour, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.SelectHarbour,
            nodeRef
          )
        }}
        headerProps={{
          title: I18n.t('selectHarbour'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterAHarbourName'),
        }}
        onClear={this.onClear}
      >
        <SelectHarbourList
          onPress={this.onSelect}
          // onCreate={this.onCreate}
          loading={loading}
          data={data}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
        />
      </AModal3>
    )
  }
}
