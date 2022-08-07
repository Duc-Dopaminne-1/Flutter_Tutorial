import {
  EventDescription,
  Image,
  ImageUrl,
  Industry,
  Venue,
} from '@/models/common'
import { Event } from '@/models/team'
import { Factory } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { findIndex } from 'lodash'
import { SafeEvent } from '@/shared/event'

type EventDto = {
  id: string
  description: EventDescription
}

export class EventFactory extends Factory<Event> {
  constructor(realm: Realm) {
    super(realm, 'Event')
  }

  fetch = (
    getAll: boolean = false
  ): [Observable<Realm.Collection<Event>>, Realm.Results<Event>] => {
    const results = getAll
      ? this._realm.objects<Event>('Event').sorted('name', false)
      : this._realm
          .objects<Event>('Event')
          .filtered('deleted = false')
          .sorted('name', false)

    const subscription = new Observable<Realm.Collection<Event>>(observer => {
      results.addListener(
        (col): Realm.CollectionChangeCallback<Event> => {
          observer.next(col)

          return null
        }
      )
    })

    // @ts-ignore
    return [subscription, results]
  }

  // filterDate = (eventList): Realm.Collection<Event> => {
  //   const date = new Date()
  //   return eventList.filter(
  //     event =>
  //       event.description.startDate <= date && event.description.endDate >= date
  //   )
  // }

  private getIndustry = (industry: Industry) => {
    if (!industry || !industry.id) return null

    const result: Industry = this._realm.objectForPrimaryKey(
      'Industry',
      industry.id
    )

    if (result && result.id) return result

    return industry
  }

  private getVenue = (venue: Venue) => {
    if (!venue.id) return null

    const result: Venue = this._realm.objectForPrimaryKey('Venue', venue.id)

    if (result && result.id) return result

    return venue
  }

  private getLogoImage = (logoImage: Image) => {
    if (!logoImage) return null

    const eventImage = this._realm.objectForPrimaryKey('Image', logoImage.id)

    /**
     * If event logo image is already create to team
     */
    if (eventImage) {
      /**
       * If event logo image in global is not exist then just return the result
       */
      if (logoImage.urls.length <= 0) {
        return eventImage
      }

      /**
       * If event logo image in global is exist then update it with event
       * logo image
       */
      // @ts-ignore
      const urls = logoImage.urls.map(data => {
        return this._realm.create<ImageUrl>(
          'ImageUrl',
          {
            id: data.id,
            ...data,
          },
          true
        )
      })

      return this._realm.create<Image>(
        'Image',
        {
          urls,
          id: logoImage.id,
          fileName: logoImage.fileName,
          orientation: logoImage.orientation,
          imageType: logoImage.imageType,
          data: logoImage.data,
          ...this.widthAudit({}, 'update'),
        },
        true
      )
    }

    /**
     * If event logo image is not exist, then create it.
     */
    // @ts-ignore
    const urls = logoImage.urls.map(data => {
      return this._realm.create<ImageUrl>('ImageUrl', {
        ...data,
      })
    })

    return this._realm.create<Image>('Image', {
      urls,
      fileName: logoImage.fileName,
      orientation: logoImage.orientation,
      imageType: logoImage.imageType,
      data: logoImage.data,
      id: logoImage.id,
      ...this.createWidthAudit(),
    })
  }

  copyGlobalEvent = (data: EventDto, isUpdate = false): Observable<Event> => {
    return new Observable<Event>(observer => {
      try {
        let createdEvent = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            const logoImage = this.getLogoImage(data.description.logoImage)
            const venue = this.getVenue(data.description.venue)
            /**
             * Check or create industry
             */
            const industry = this.getIndustry(data.description.industry)

            // Create event description
            const eventDescription = this._realm.create<EventDescription>(
              'EventDescription',
              {
                ...data.description,
                logoImage,
                industry,
                venue,
                id: data.description.id,
              },
              isUpdate
            )

            createdEvent = this._realm.create<Event>(
              'Event',
              {
                id: data.id,
                name: data.description ? data.description.name : '',
                description: eventDescription,
                ...this.widthAudit({}, isUpdate ? 'update' : 'create'),
                deleted: false,
              },
              isUpdate
            )
          } catch (e) {
            observer.error(e)
          }
        })

        if (createdEvent) {
          observer.next(createdEvent)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  createEvent = (name: string): Observable<Event> => {
    return new Observable<Event>(observer => {
      try {
        let createdEvent = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create event description
          const eventDescription = this._realm.create<EventDescription>(
            'EventDescription',
            {
              name,
              id: this.generateId,
            }
          )

          createdEvent = this._realm.create<Event>('Event', {
            name,
            id: this.generateId,
            description: eventDescription,
            ...this.widthAudit(),
          })
        })

        if (createdEvent) {
          observer.next(createdEvent)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  updateEventDeleted = (eventId): Observable<Event> => {
    return new Observable<Event>(observer => {
      try {
        let updatedEvent: Event = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          updatedEvent = this._realm.objectForPrimaryKey('Event', eventId)

          updatedEvent.deleted = false
        })

        if (updatedEvent) {
          observer.next(updatedEvent)
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
}
