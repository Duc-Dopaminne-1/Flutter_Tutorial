import { Subject } from 'rxjs'
import { Event } from '@/models/team'
import { AsyncStorage } from 'react-native'

interface UpdateEvent {
  event: Event
}

class EventStore {
  /**
   * The current event user have check-in
   */
  private _currentEvent: Event = null

  /**
   * global event id is for supplier screen fetch exhibitor
   */
  private _currentEventGlobalId: string = ''

  /**
   * The event list get form Team-Realm
   */
  private _updateEventSub = new Subject<Event>()

  get currentEvent() {
    return this._currentEvent
  }

  get currentEventGlobalId() {
    return this._currentEventGlobalId
  }

  get updateEventSub() {
    return this._updateEventSub
  }

  set currentEvent(value: Event) {
    this._currentEvent = value
  }

  set currentEventGlobalId(value: string) {
    this._currentEventGlobalId = value
  }

  clearAll = () => {
    this._currentEvent = null
    this._currentEventGlobalId = ''
  }

  saveCheckInEvent = async (eventId: string) => {
    try {
      await AsyncStorage.setItem('eventId', eventId)
    } catch (error) {
      console.log('error when save choose event ', error)
    }
  }

  removeCheckInEvent = async () => {
    try {
      await AsyncStorage.removeItem('eventId')
    } catch (error) {
      console.log('error when remove choose event ', error)
    }
  }
}

export const eventStore = new EventStore()
