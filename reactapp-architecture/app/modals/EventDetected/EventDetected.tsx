import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { AsyncStorage } from 'react-native'
import { AModal1 } from '@/components/AModal/AModal1'
import { EventDetectedHeader } from './Components/EventDetectedHeader'
import { EventDetectedContent } from './Components/EventDetectedContent'
import { SafeEvent } from '@/shared/event'
import { eventStore } from '@/stores/eventStore'
import moment from 'moment'
import { Event } from '@/models/team'

// init state
const initialState = {
  isVisible: false,
  event: null,
  index: 0,
}

// default props
const defaultProps = {
  detectedEventList: [],
}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  detectedEventList: any
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> & Readonly<{}>

export class EventDetected extends React.PureComponent<Props, State> {
  _event: Event

  readonly state: State = initialState

  open = () => {
    this.setState({
      isVisible: true,
    })
  }

  closed = () => {
    this.setState({
      isVisible: false,
    })
  }

  onPressYes = async () => {
    const { eventId } = new SafeEvent(this._event)

    try {
      await AsyncStorage.setItem('eventId', eventId)
    } catch (error) {
      console.log('error when save choose event ', error)
    }

    this.setState({
      isVisible: false,
    })

    eventStore.currentEvent = this._event
    eventStore.updateEventSub.next(this._event)
  }

  onPressNo = () => {
    this.saveEventNotChoose().catch(() => {})
    if (this.nextEvent()) return

    eventStore.clearAll()

    this.setState({
      isVisible: false,
    })
  }

  saveEventNotChoose = async () => {
    const { index } = this.state
    const { detectedEventList } = this.props
    const { eventId } = new SafeEvent(detectedEventList[index])
    const currentTime = moment().format('YYYY-MM-DD')

    try {
      await AsyncStorage.setItem(eventId, currentTime.toString())
    } catch (error) {
      console.log('error when save event not choose', error)
    }
  }

  checkEvent = index => {
    const { detectedEventList } = this.props

    // check has event or not
    if (!detectedEventList || detectedEventList.length === 0) return false

    // check current index has data or not
    return detectedEventList[index]
  }

  nextEvent = () => {
    const { index } = this.state

    if (!this.checkEvent(index + 1)) return false

    this.setState((prevState: State) => {
      return {
        index: prevState.index + 1,
      }
    })

    return true
  }

  eventData = () => {
    const { index } = this.state
    const { detectedEventList } = this.props

    if (!this.checkEvent(index)) return false

    this._event = detectedEventList[index]

    return detectedEventList[index]
  }

  render() {
    const { isVisible } = this.state
    const event = this.eventData()

    if (!event) return null

    const { eventName, primaryColor } = new SafeEvent(event)

    return (
      <AModal1
        // @ts-ignore
        modalProps={{
          isVisible,
        }}
      >
        <EventDetectedHeader
          backgroundColor={primaryColor}
          eventName={eventName}
        />
        <EventDetectedContent
          eventName={eventName}
          onPressYes={this.onPressYes}
          onPressNo={this.onPressNo}
        />
      </AModal1>
    )
  }
}
