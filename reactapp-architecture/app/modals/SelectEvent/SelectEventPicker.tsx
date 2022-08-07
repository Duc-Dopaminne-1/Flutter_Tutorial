import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Event, Product } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SelectEventList } from './Components/SelectEventList'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { modalStore } from '@/stores/modalStore'
import { SafeProduct } from '@/shared/product'

// init state
const initialState = {
  keyword: '',
  dataEventTeam: [] as any,
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
      product?: Product
      isCreateProduct?: boolean
      setValue?: (data: any, key: string) => void
    }>
  >

export type State = Readonly<typeof initialState> &
  Partial<{
    dataEventTeam: Realm.Collection<any>
  }>

@withContext(AppContext.Consumer)
export class SelectEventPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Event> = new FuseService<Event>([] as any)
  _subscriptionCreateEvent: Subscription

  _subscriptionEventTeam: Subscription
  _resultsEventTeam: Realm.Results<any> = [] as any
  _modal
  _subscriptionCreateEventTeam: Subscription
  _firstTimeLoadData: boolean = true

  readonly state = initialState

  async componentDidMount() {
    this.open()
    this.fetchEventTeam()
  }

  componentWillUnmount() {
    this._subscriptionCreateEvent && this._subscriptionCreateEvent.unsubscribe()

    this._subscriptionEventTeam && this._subscriptionEventTeam.unsubscribe()
    this._resultsEventTeam && this._resultsEventTeam.removeAllListeners()

    this._subscriptionCreateEventTeam &&
      this._subscriptionCreateEventTeam.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const product = navigation.getParam('product', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    return {
      product,
      isCreateProduct,
      setValue,
    }
  }

  fetchEventTeam = () => {
    const { eventFactory } = this.props
    const [subscription, results] = eventFactory.fetch()

    this._resultsEventTeam = results

    this._subscriptionEventTeam = subscription.subscribe(eventTeam => {
      // call this to update suggest list each time have change
      this.updateSuggestList()

      this.setState(
        {
          dataEventTeam: eventTeam,
        },
        () => {
          this.forceUpdate()
        }
      )

      const fuseData = eventTeam ? eventTeam : []
      this._fuse = new FuseService<Event>(fuseData as any)
    })
  }

  updateSuggestList = () => {
    if (this._firstTimeLoadData) {
      this._firstTimeLoadData = false
      return
    }

    modalStore.eventSubject.next({
      suggestEvent: modalStore.event,
      selectedEvent: this.selectEvent,
    })
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        dataEventTeam: this._resultsEventTeam || [],
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

  onSelect = (event: any) => {
    const { productFactory } = this.props
    const { product, isCreateProduct, setValue } = this.navigationData()

    if (!(event && event.isValid())) return

    // Add to suggest list
    modalStore.setEvent(event)

    if (isCreateProduct && setValue) {
      modalStore.selectEvent = event
      setValue(event, 'event')
      this.close()
      return
    }

    productFactory
      .update(product.id, {
        event,
      })
      .subscribe(() => {
        this.close()
      })
  }

  onCreate = (keyword: string) => {
    const { eventFactory } = this.props

    this._subscriptionCreateEvent = eventFactory
      .createEvent(keyword.trim())
      .subscribe(createdEvent => {
        this.onSelect(createdEvent)
      })
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      dataEventTeam: result.data,
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
      dataEventTeam: this._resultsEventTeam || [],
      keyword: '',
    })
    this._fuse.update(this._resultsEventTeam || ([] as any))
  }

  get selectEvent() {
    const { product, isCreateProduct } = this.navigationData()
    const { event } = new SafeProduct(product)

    if (isCreateProduct) {
      return modalStore.selectEvent
    }

    return event ? [event] : []
  }

  render() {
    const { keyword, isPerfect, dataEventTeam, loading } = this.state
    const selectedEvent = this.selectEvent

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectEvent, nodeRef)
          createProductNavigation.setRef(CreateProductRef.SelectEvent, nodeRef)
        }}
        headerProps={{
          title: I18n.t('selectEvents'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterEventName'),
        }}
        onClear={this.onClear}
      >
        <SelectEventList
          selectedEvent={selectedEvent}
          onPress={this.onSelect}
          onCreate={this.onCreate}
          data={dataEventTeam}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
          loading={loading}
        />
      </AModal3>
    )
  }
}
