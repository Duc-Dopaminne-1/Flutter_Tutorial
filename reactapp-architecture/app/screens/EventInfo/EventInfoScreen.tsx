import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import * as React from 'react'
import { StatusBar, StyleSheet } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { EventInfoContext } from './EventInfoContext'
import { isIpad } from '@/shared/devices'
import { SafeEvent } from '@/shared/event'
import { EventInfoContent } from '@/screens/EventInfo/Components/EventInfoContent'
import { eventStore } from '@/stores/eventStore'

export type Props = Readonly<{
  asComponent: boolean
}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      eventId: string
      eventName: string
    }>
  >

export type State = Readonly<{
  event: any
  safeEvent: SafeEvent
  headerVisible: boolean
  loading: boolean
  isCheckIn: boolean
}>

@withContext(AppContext.Consumer)
export class EventInfoScreen extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _eventSubscription: Subscription

  readonly state: State = {
    event: null,
    safeEvent: null,
    headerVisible: true,
    loading: true,
    isCheckIn: false,
  }

  componentDidMount() {
    this.fetchEvent()
    this.checkCheckInEvent()
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._eventSubscription && this._eventSubscription.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const eventId = navigation.getParam('eventId', '')
    const eventName = navigation.getParam('eventName', '')

    return {
      eventId,
      eventName,
    }
  }

  fetchEvent = () => {
    const { globalEventFactory } = this.props
    const { eventId } = this.navigationData()
    const [subscription] = globalEventFactory.fetchById(eventId)

    this._subscription = subscription.subscribe(event => {
      if (event) {
        this.setState({
          event,
          safeEvent: new SafeEvent(event),
          loading: false,
        })
      }
    })
  }

  checkCheckInEvent = () => {
    const { eventName, eventId } = this.navigationData()

    /**
     * Check that user have already check-in this event or not
     * TRUE: already check-in
     * FALSE: not check-in
     */
    if (
      eventStore.currentEvent &&
      eventStore.currentEventGlobalId === eventId
    ) {
      this.setState({
        isCheckIn: true,
      })
    }

    this._eventSubscription = eventStore.updateEventSub.subscribe(data => {
      this.setState({
        isCheckIn: !!data,
      })
    })
  }

  onClose = () => {
    this.props.navigation.goBack(null)
  }

  onChangeHeaderVisibility = state => {
    const { headerVisible } = this.state
    const { asComponent } = this.props

    if (headerVisible !== state) {
      this.setState({
        headerVisible: state,
      })
    }

    if (!asComponent) {
      const barStyle = state ? 'light-content' : 'dark-content'
      StatusBar.setBarStyle(barStyle, true)
    }
  }

  get parallaxHeaderHeight() {
    const { asComponent } = this.props

    if (asComponent) {
      return 220 + metrics.header_absolute_height
    }

    return 220
  }

  get isActiveHeader() {
    const { headerVisible } = this.state
    const { asComponent } = this.props

    if (!asComponent) {
      return headerVisible
    }

    return headerVisible && !isIpad()
  }

  render() {
    const { event, safeEvent, loading, isCheckIn } = this.state
    const { asComponent } = this.props

    if (loading) return <AIndicator full />

    return (
      <EventInfoContext.Provider
        value={{
          event,
          safeEvent,
          asComponent,
          isCheckIn,
          headerVisible: this.isActiveHeader,
          onPressIconLeft: this.onClose,
        }}
      >
        <EventInfoContent
          onChangeHeaderVisibility={this.onChangeHeaderVisibility}
          headerHeight={this.parallaxHeaderHeight}
        />

        <ANetworkStatus fillAbsolute />
      </EventInfoContext.Provider>
    )
  }
}

const styles = StyleSheet.create<any>({})
