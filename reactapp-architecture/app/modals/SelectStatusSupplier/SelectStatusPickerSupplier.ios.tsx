import { AIndicator } from '@/components/AIndicator/AIndicator'
import { AModal4 } from '@/components/AModal/AModal4'
import { APicker } from '@/components/APicker/APicker'
import { Supplier, SupplierStatus } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import React, { PureComponent } from 'react'
import { Picker } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SafeStatusType } from '@/shared/statusType'
import { debounce } from 'lodash'
import { SafeSupplier } from '@/shared/supplier'

export type SelectStatusPickerProps = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      suppliersId: string[]
      setValue?: (data, key) => void
      status: SupplierStatus
      supplier: Supplier
      hideActionBar?: boolean
      hideUpDownClear?: boolean
    }>
  >

type SelectStatusPickerState = {
  status: Realm.Collection<SupplierStatus>
  errMsg: string
  supplier: SafeSupplier
  value: string
  loading: boolean
}

@withContext(AppContext.Consumer)
export class SelectStatusPickerSupplier extends PureComponent<
  SelectStatusPickerProps,
  SelectStatusPickerState
> {
  _subscription: Subscription
  _results: Realm.Results<SupplierStatus> = [] as any
  _modal
  _isChoose = false
  _modalIsClose = true

  static readonly defaultProps = {}

  readonly state: SelectStatusPickerState = {
    status: [] as any,
    supplier: null,
    value: '',
    errMsg: '',
    loading: true,
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

    const [subscription, results] = supplierStatusFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(supplierStatus => {
      this.setState(
        {
          status: supplierStatus,
          loading: false,
        },
        () => {
          this.forceUpdate()
        }
      )
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  onValueChange = (value: string) => {
    const { supplierStatusFactory } = this.props

    if (value === this.state.value) {
      return
    }

    const selectedStatus = supplierStatusFactory.getDatFromId(
      this._results || ([] as any),
      value
    )

    if (!selectedStatus) {
      return
    }

    this.updateToRealm(selectedStatus)
    this.setState({ value })
  }

  updateToRealm = (selectedStatus?: SupplierStatus) => {
    const { supplier } = this.state
    const { supplierStatusFactory, navigation } = this.props
    const suppliersId = navigation.getParam('suppliersId', [])

    if (!supplier) return null

    this._isChoose = true

    if (suppliersId.length > 0) {
      supplierStatusFactory
        .updateStatusMultiSupplier(
          suppliersId,
          selectedStatus && selectedStatus.id ? selectedStatus : null
        )
        .subscribe(() => {}, () => {})
    } else {
      supplierStatusFactory
        .update(supplier.id, {
          status: selectedStatus && selectedStatus.id ? selectedStatus : null,
        })
        .subscribe(
          () => {},
          () => {
            console.log('Error while upload status to supplier')
          }
        )
    }
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

  onComplete = debounce(() => {
    this.close()
  }, 100)

  onClear = debounce(() => {
    if (this.state.value) {
      this.onValueChange(null)
    }
  }, 100)

  render() {
    const { value, status, loading } = this.state
    const { navigation } = this.props
    const hideActionBar = navigation.getParam('hideActionBar', false)
    const hideUpDownClear = navigation.getParam('hideUpDownClear', false)

    return (
      <AModal4
        ref={nodeRef => {
          this._modal = nodeRef
        }}
        onComplete={this.onComplete}
        onClear={this.onClear}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
      >
        {loading ? (
          <AIndicator full />
        ) : (
          <APicker<SupplierStatus>
            data={status}
            value={value}
            onValueChange={this.onValueChange}
            renderItem={() => {
              return status.map(stType => (
                <Picker.Item
                  key={stType.id}
                  label={`0${stType.step}. ${SafeStatusType.getNameSupplier(
                    stType.name
                  )}`}
                  value={stType.id}
                />
              ))
            }}
          />
        )}
      </AModal4>
    )
  }
}
