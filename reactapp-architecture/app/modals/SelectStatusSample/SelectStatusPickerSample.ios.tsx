import React, { PureComponent } from 'react'
import { Picker } from 'react-native'
import Realm from 'realm'
import { pathOr } from 'ramda'
import { Subscription } from 'rxjs'
import { debounce } from 'lodash'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { AModal4 } from '@/components/AModal/AModal4'
import { APicker } from '@/components/APicker/APicker'
import { Sample, SampleStatus } from '@/models/team'
import { sampleNavigation, SampleRef } from '@/navigation/sampleNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SafeSample } from '@/shared/sample'
import { withContext } from '@/shared/withContext'
import { NavigationInjectedProps } from 'react-navigation'
import { SafeStatusType } from '@/shared/statusType'

export type SelectStatusPickerProps = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      samplesId: string[]
      isCreateSample?: boolean
      setValue?: (data, key) => void
      status: SampleStatus
      sample: Sample
      hideActionBar?: boolean
      hideUpDownClear?: boolean
      onCloseStatusPicker?: (status?: SampleStatus) => void
      modalProps?: any
    }>
  >

type SelectStatusPickerState = {
  status: Realm.Collection<SampleStatus>
  errMsg: string
  sample: SafeSample
  value: string
  loading: boolean
  selectedStatus?: SampleStatus
}

@withContext(AppContext.Consumer)
export class SelectStatusPickerSample extends PureComponent<
  SelectStatusPickerProps,
  SelectStatusPickerState
> {
  _subscription: Subscription
  _results: Realm.Results<SampleStatus> = [] as any
  _modal: any
  _isChoose = false
  _modalIsClose = true

  static readonly defaultProps = {}

  readonly state: SelectStatusPickerState = {
    status: [] as any,
    sample: null,
    value: '',
    errMsg: '',
    loading: true,
  }

  componentDidMount() {
    this.open()

    const { sampleStatusFactory, navigation } = this.props

    const isCreateSample = navigation.getParam('isCreateSample', false)
    const status = navigation.getParam('status', null)
    const sample = navigation.getParam('sample', null)

    if (isCreateSample) {
      this.setState({
        value: pathOr('', ['id'], status),
      })
    } else {
      const safeSample = new SafeSample(sample)

      this.setState({
        value: safeSample.safeStatus.id,
        sample: safeSample,
      })
    }

    const [subscription, results] = sampleStatusFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(sampleStatus => {
      this.setState(
        {
          status: sampleStatus,
          loading: false,
          selectedStatus: (sampleStatus || [])[0],
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
    const { sampleStatusFactory, navigation } = this.props

    const isCreateSample = navigation.getParam('isCreateSample', false)
    const setValue = navigation.getParam('setValue', null)

    const selectedStatus = sampleStatusFactory.getDatFromId(
      this._results || ([] as any),
      value
    )

    if (isCreateSample && setValue) {
      setValue(selectedStatus, 'status')
    } else {
      this.updateToRealm(selectedStatus)
    }

    this.setState({ value, selectedStatus })
  }

  updateToRealm = (selectedStatus?: SampleStatus) => {
    const { sample } = this.state
    const { sampleFactory, sampleStatusFactory, navigation } = this.props
    const samplesId = navigation.getParam('samplesId', [])

    if (!sample) return null

    this._isChoose = true

    sampleFactory
      .update(sample.id, {
        status: selectedStatus,
      })
      .subscribe(() => {}, () => {})
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

  onComplete = () => {
    this.close()
    const onCloseStatusPicker = this.props.navigation.getParam(
      'onCloseStatusPicker',
      () => null
    )
    onCloseStatusPicker(this.state.selectedStatus)
  }

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
          sampleNavigation.setRef(SampleRef.SelectStatus, nodeRef)
          // createProductNavigation.setRef(CreateProductRef.SelectStatus, nodeRef)
        }}
        onComplete={this.onComplete}
        onClear={this.onClear}
        hideActionBar={hideActionBar}
        hideUpDownClear={hideUpDownClear}
      >
        {loading ? (
          <AIndicator full />
        ) : (
          <APicker<SampleStatus>
            data={status}
            value={value}
            onValueChange={this.onValueChange}
            renderItem={() => {
              return status.map(stType => (
                <Picker.Item
                  key={stType.id}
                  label={`${stType.step}. ${SafeStatusType.getNameSample(
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
