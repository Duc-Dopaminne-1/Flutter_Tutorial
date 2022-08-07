import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { Event } from '@/models/global'
import { Product } from '@/models/team'

export enum EventData {
  Future,
  Close,
  Past,
  OnBoarding,
}

export class GlobalEventFactory extends Factory<Event> {
  constructor(realm: Realm) {
    super(realm, 'Event')
  }

  fetch({
    isGetAllEvent = false,
    isReceiveChange = false,
    tab = EventData.Future,
    skip = 0,
  }): [
    Observable<{
      col: Realm.Collection<Event>
      change: Realm.CollectionChangeSet
    }>,
    Realm.Results<Event>
  ] {
    const results = this._realm.objects<Event>('Event')
    const subscription = new Observable<any>(observer => {
      results.addListener(col => {
        observer.next(
          this.generateResult({
            skip,
            isReceiveChange,
            data: this.filterDate(col, isGetAllEvent, tab),
          })
        )

        return
      })
    })

    // @ts-ignore
    return [subscription, results]
  }

  fetchById = (
    eventId: string
  ): [Observable<Realm.Collection<Event>>, Realm.Results<Event>] => {
    const results = this._realm
      .objects<Event>('Event')
      .filtered('id = $0', eventId)

    const subscription = new Observable<Realm.Collection<Event>>(observer => {
      results.addListener(col => {
        observer.next(col[0] as any)

        return null
      })
    })

    return [subscription, results]
  }

  filterDate = (
    eventList,
    isGetAllEvent,
    tab?: EventData
  ): Realm.Collection<Event> => {
    if (isGetAllEvent) return eventList

    const date = new Date()

    if (tab === EventData.Future) {
      return eventList
        .filter(event => event.description.endDate >= date)
        .sort((a, b) => {
          return a.description.endDate - b.description.endDate
        })
    }

    if (tab === EventData.Close) {
      return eventList
        .filter(event => event.description.endDate >= date)
        .sort((a, b) => {
          return a.description.endDate - b.description.endDate
        })
    }

    if (tab === EventData.OnBoarding) {
      /**
       * Add setHours so it only can compare date not include time
       */
      const currentDate = new Date()
      currentDate.setHours(1, 1, 1, 1)
      const addThreeMoreDate = new Date()
      addThreeMoreDate.setDate(addThreeMoreDate.getDate() + 3)
      addThreeMoreDate.setHours(1, 1, 1, 1)

      return eventList
        .filter(event => {
          const { description } = event
          const startDate = new Date(description.startDate)
          startDate.setHours(1, 1, 1, 1)
          const endDate = new Date(description.endDate)
          endDate.setHours(1, 1, 1, 1)

          return (
            (startDate <= currentDate && currentDate <= endDate) ||
            (startDate <= addThreeMoreDate && addThreeMoreDate <= endDate)
          )
        })
        .sort((a, b) => {
          return a.description.startDate - b.description.startDate
        })
    }

    return eventList
      .filter(
        event =>
          event.description.startDate <= date &&
          event.description.endDate <= date
      )
      .sort((a, b) => {
        return b.description.startDate - a.description.startDate
      })
  }
}
