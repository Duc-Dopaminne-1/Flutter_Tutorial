import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product, Supplier } from '@/models/team'
import {
  CreateSupplierData,
  createSupplierNavigation,
  CreateSupplierRef,
} from '@/navigation/createSupplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { CreateSupplierList } from './Components/CreateSupplierList'

// init state
const initialState = {
  keyword: '',
  isVisible: false,
  data: [] as any,
  loading: true,
  isPerfect: true,
  errMsg: '',
  selectedProduct: null,
  dirty: false,
  renderKey: 0,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = DefaultProps & AppContextState

export type State = Readonly<typeof initialState> &
  Readonly<{
    data: Realm.Collection<Supplier>
    selectedProduct: Product
  }>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class CreateSupplierPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Supplier> = new FuseService<Supplier>([] as any)
  _subscription: Subscription
  _subSubscription: Subscription
  _results: Realm.Results<Supplier>
  _modal

  readonly state: State = initialState

  async componentDidMount() {
    this.open()

    const { supplierFactory } = this.props

    const [subscription, results] = supplierFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(suppliers => {
      this.setState(
        {
          data: suppliers,
        },
        () => {
          this.forceUpdate()
        }
      )

      this._fuse = new FuseService<Supplier>(suppliers)
    })

    this._subSubscription = supplierFactory.subject().subscribe(value => {
      if (value === Realm.Sync.SubscriptionState.Complete) {
        this.setState({
          loading: false,
        })
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._subSubscription && this._subSubscription.unsubscribe()
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
        dirty: true,
      },
      () => this.onSearch(keyword)
    )
  }

  onCreate = (keyword: string) => {
    const { supplierFactory } = this.props

    supplierFactory.create({ name: keyword.trim() }).subscribe(
      supplier => {
        createSupplierNavigation.setData(CreateSupplierData.Supplier, supplier)
        this.onPress(supplier)
      },
      () => {
        this.close()
      }
    )
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
    this._modal && this._modal.close()
  }

  onClear = () => {
    this.setState({
      isPerfect: true,
      data: this._results || [],
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })

    this._fuse.update(this._results ? this._results : ([] as any))
  }

  onPress = (supplier: Supplier) => {
    if (!supplier || !supplier.isValid() || supplier.deleted) return

    createSupplierNavigation.close(CreateSupplierRef.Create, {
      supplier,
    })
  }

  render() {
    const { keyword, data, isPerfect, dirty, renderKey } = this.state

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          createSupplierNavigation.setRef(CreateSupplierRef.Create, nodeRef)
        }}
        headerProps={{
          title: I18n.t('addSupplier'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterSupplierName'),
        }}
        // onClear={this.onClear}
        hideActionBar={true}
        renderKey={renderKey}
      >
        <CreateSupplierList
          onPress={this.onPress}
          onCreate={this.onCreate}
          data={data}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
          dirty={dirty}
        />
      </AModal3>
    )
  }
}
