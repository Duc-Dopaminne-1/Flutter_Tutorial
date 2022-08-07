import * as React from 'react'
import { FlatListProps } from 'react-native'
import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Sample, SampleStatus } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import { pathOr } from 'ramda'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { SelectStatusListSample } from './Components/SelectStatusList'
import { debounce } from 'lodash'
import { Toast } from '@/services/global'
import { SafeSample } from '@/shared/sample'
import { sampleNavigation, SampleRef } from '@/navigation/sampleNavigation'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      isCreateSample?: boolean
      sample?: Sample
      samplesId?: string[]
      status: SampleStatus
      setValue?: (data, key) => void
      hideActionBar?: boolean
      hideUpDownClear?: boolean
      onCloseStatusPicker?: (status?: SampleStatus) => void
      modalProps?: any
    }>
  >

export type State = Readonly<{
  status: Realm.Collection<SampleStatus>
  sample: SafeSample
  keyword: string
  loading: boolean
  value: string
  renderKey: number
}>

@withContext(AppContext.Consumer)
export class SelectStatusPickerSample extends React.PureComponent<
  Props,
  State
> {
  _flatListRef: React.RefObject<FlatListProps<SampleStatus>> = React.createRef()
  _fuse: FuseService<SampleStatus> = new FuseService<SampleStatus>([] as any)
  _subscription: Subscription
  _textInput: React.RefObject<any> = React.createRef()
  _results: Realm.Results<SampleStatus> = [] as any
  _modal: any
  _isChoose = false
  _modalIsClose = true

  static readonly defaultProps = defaultProps

  readonly state: State = {
    keyword: '',
    status: [] as any,
    loading: true,

    sample: null,
    value: '',
    renderKey: 0,
  }

  componentDidMount() {
    this.open()

    const { sampleStatusFactory, navigation } = this.props

    const isCreateSample = navigation.getParam('isCreateSample', null)
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

    this.focusKeyboard()

    const [subscription, results] = sampleStatusFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(sampleStatus => {
      this.setState(
        {
          status: sampleStatus,
        },
        () => {
          this.forceUpdate()
        }
      )

      this._fuse = new FuseService<SampleStatus>(sampleStatus)
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
        status: this.props.sampleStatusFactory.sortData,
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

  onSelect = (sampleStatus: SampleStatus) => {
    this._isChoose = true
    const { navigation } = this.props
    const isCreateSample = navigation.getParam('isCreateSample', false)
    const setValue = navigation.getParam('setValue', null)

    if (isCreateSample && setValue) {
      setValue(sampleStatus, 'status')
      this.close()
      const onCloseStatusPicker = this.props.navigation.getParam(
        'onCloseStatusPicker',
        () => null
      )
      onCloseStatusPicker(sampleStatus)
    } else {
      this.updateToRealm(sampleStatus)
    }
  }

  updateToRealm = (sampleStatus: SampleStatus) => {
    const { sample, value } = this.state
    const { sampleFactory } = this.props
    const { status } = sample.safeStatus

    if (!sample) return null

    if (status && value === sampleStatus.id) {
      this.close()
      return
    }

    sampleFactory
      .update(sample.id, {
        status: sampleStatus,
      })
      .subscribe(() => {}, () => {})
    this.close()
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

  Toast = () => {
    const samplesId = this.props.navigation.getParam('samplesId', [])
    if (samplesId.length > 0 && this._isChoose) {
      Toast.next({
        message: I18n.t('totalProductUpdate', {
          total: samplesId.length,
          isMany: samplesId.length === 1 ? '' : 's',
        }),
      })
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
    const modalProps = navigation.getParam('modalProps', {})

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          sampleNavigation.setRef(SampleRef.SelectStatus, nodeRef)
          // createProductNavigation.setRef(CreateProductRef.SelectStatus, nodeRef)
        }}
        showToast={this.Toast}
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
        modalProps={modalProps}
      >
        <SelectStatusListSample
          flatListRef={this._flatListRef}
          onPress={this.onSelect}
          data={status}
          keyword={keyword.trim()}
        />
      </AModal3>
    )
  }
}
