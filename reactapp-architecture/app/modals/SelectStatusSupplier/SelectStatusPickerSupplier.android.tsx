import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Supplier, SupplierStatus } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { FlatListProps } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { debounce } from 'lodash'
import { SelectStatusListSupplier } from '@/modals/SelectStatusSupplier/Components/SelectStatusList'
import { SafeSupplier } from '@/shared/supplier'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      suppliersId: string[]
      supplier?: Supplier
      status: SupplierStatus
      setValue?: (data, key) => void
      hideActionBar?: boolean
      hideUpDownClear?: boolean
    }>
  >

export type State = Readonly<{
  status: Realm.Collection<SupplierStatus>
  supplier: SafeSupplier
  keyword: string
  loading: boolean
  value: string
  renderKey: number
}>

@withContext(AppContext.Consumer)
export class SelectStatusPickerSupplier extends React.PureComponent<
  Props,
  State
> {
  _flatListRef: React.RefObject<
    FlatListProps<SupplierStatus>
  > = React.createRef()
  _fuse: FuseService<SupplierStatus> = new FuseService<SupplierStatus>(
    [] as any
  )
  _subscription: Subscription
  _textInput: React.RefObject<any> = React.createRef()
  _results: Realm.Results<SupplierStatus> = [] as any
  _modal
  _modalIsClose = true

  static readonly defaultProps = defaultProps

  readonly state: State = {
    keyword: '',
    status: [] as any,
    loading: true,

    supplier: null,
    value: '',
    renderKey: 0,
  }

  componentDidMount() {
    this.open()

    const { supplierStatusFactory, navigation } = this.props

    const supplier = navigation.getParam('supplier', null)

    const safeSupplier = new SafeSupplier(supplier)

    this.setState({
      value: safeSupplier.safeStatus.id,
      supplier: safeSupplier,
    })

    this.focusKeyboard()

    const [subscription, results] = supplierStatusFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(supplierStatus => {
      this.setState(
        {
          status: supplierStatus,
        },
        () => {
          this.forceUpdate()
        }
      )

      this._fuse = new FuseService<SupplierStatus>(supplierStatus)
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  focusKeyboard = () => {
    setTimeout(() => {
      this._textInput.current && this._textInput.current.focus()
    }, 400)
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        status: this.props.supplierStatusFactory.sortData,
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

  onSelect = debounce((supplierStatus: SupplierStatus) => {
    this.updateToRealm(supplierStatus)
  }, 100)

  updateToRealm = (supplierStatus: SupplierStatus) => {
    const { supplier, value } = this.state
    const { supplierStatusFactory, navigation } = this.props
    const { status } = supplier.safeStatus
    const suppliersId = navigation.getParam('suppliersId', [])

    if (!supplier) return null

    if (
      !supplierStatus ||
      !supplierStatus.id ||
      (status && value === supplierStatus.id)
    ) {
      this.close()
      return
    }
    // if (status && value === supplierStatus.id) {
    //   this.close()
    //   return
    // }

    if (suppliersId.length > 0) {
      supplierStatusFactory
        .updateStatusMultiSupplier(
          suppliersId,
          supplierStatus && supplierStatus.id ? supplierStatus : null
        )
        .subscribe(() => {}, () => {})

      this.close()
    } else {
      supplierStatusFactory
        .update(supplier.id, {
          status: supplierStatus && supplierStatus.id ? supplierStatus : null,
        })
        .subscribe(
          () => {
            this.close()
          },
          () => {
            this.close()
          }
        )
    }
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      status: result.data as any,
    })
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
      this._modalIsClose = false
    }
  }

  close = () => {
    if (this._modal && this._modalIsClose === false) {
      this._modal.close()
      this._modalIsClose = true
    }
  }

  onClear = debounce(() => {
    if (this.state.keyword !== '') {
      this.setState({
        status: this._results || ([] as any),
        keyword: '',
        renderKey: this.state.renderKey + 1,
      })
      this._fuse.update(this._results || ([] as any))
    }
  }, 100)

  onComplete = () => {
    this.close()
  }

  render() {
    const { keyword, status, renderKey } = this.state
    const { navigation } = this.props
    const hideActionBar = navigation.getParam('hideActionBar', false)
    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
        }}
        headerProps={{
          title: I18n.t('selectStatus'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('searchForAStatus'),
        }}
        onClear={this.onClear}
        renderKey={renderKey}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
      >
        <SelectStatusListSupplier
          flatListRef={this._flatListRef}
          onPress={this.onSelect}
          data={status}
          keyword={keyword.trim()}
        />
      </AModal3>
    )
  }
}
