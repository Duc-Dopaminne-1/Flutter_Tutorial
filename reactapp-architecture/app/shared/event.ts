import { pathOr, isNil } from 'ramda'
import moment from 'moment'
import { Booth, GlobalSupplier } from '@/models/global'
import { SafeImage } from '@/shared/image'
import { colors } from '@/vars'

export class SafeEvent {
  private readonly _event: any = null

  constructor(event) {
    if (isNil(event) || (event.isValid && !event.isValid()) || event.deleted) {
      this._event = null
    } else {
      this._event = event
    }
  }

  get eventId() {
    return pathOr<string>('', ['id'], this._event)
  }

  get eventDescription() {
    return pathOr<string>(null, ['description'], this._event)
  }

  get booths(): Realm.Results<Booth> {
    return pathOr<Booth>([] as any, ['booths'], this._event)
  }

  get boothsLength() {
    return this.booths.length
  }

  get suppliers() {
    const booths = this.booths

    return booths.map(booth =>
      pathOr<GlobalSupplier[]>(null, ['supplier'], booth)
    )
  }

  get eventName() {
    const eventDescription = this.eventDescription
    return pathOr<string>('', ['name'], eventDescription)
  }

  get primaryColor() {
    const eventDescription = this.eventDescription
    let color = eventDescription
      ? pathOr<string>('f94259', ['primaryColor'], eventDescription)
      : 'f94259'

    if (color[0] !== '#') {
      color = '#' + color
    }

    /**
     * The color string need at least 4 char to display
     */
    if (color.length <= 3) return '#f94259'

    return color
  }

  get secondaryColor() {
    const eventDescription = this.eventDescription
    let color = eventDescription
      ? pathOr<string>('f9429c', ['secondaryColor'], eventDescription)
      : 'f9429c'

    if (color[0] !== '#') {
      color = '#' + color
    }

    /**
     * The color string need at least 4 char to display
     */
    if (color.length <= 3) return '#f9429c'

    return color
  }

  get venue() {
    const eventDescription = this.eventDescription
    return eventDescription
      ? pathOr<string>(null, ['venue'], eventDescription)
      : null
  }

  get coordinate() {
    const venue = this.venue

    if (venue.latitude && venue.longitude) {
      return {
        latitude: venue.latitude,
        longitude: venue.longitude,
      }
    }

    return null
  }

  get address() {
    const venue = this.venue
    return pathOr<string>('', ['addressFull'], venue)
  }

  get date() {
    const eventDescription = this.eventDescription
    const startDate = pathOr<string>(null, ['startDate'], eventDescription)
    const endDate = pathOr<string>(null, ['endDate'], eventDescription)

    return {
      startDate: startDate
        ? moment(startDate).format('DD - MMMM' + ' YYYY')
        : '',
      endDate: endDate ? moment(endDate).format('DD-MMMM YYYY') : '',
    }
  }

  get supplierCount() {
    const eventDescription = this.eventDescription
    return pathOr<Number>(0, ['supplierCount'], eventDescription)
  }

  get industryName() {
    const eventDescription = this.eventDescription
    return pathOr<String>('', ['industry', 'name'], eventDescription)
  }

  get venueName() {
    const venue = this.venue
    return pathOr<string>('', ['name'], venue)
  }

  get venueAddress() {
    const venue = this.venue
    return pathOr<string>('', ['addressFull'], venue)
  }

  get logo() {
    const eventDescription = this.eventDescription
    const logo = pathOr<any>(null, ['logoImage'], eventDescription)
    return new SafeImage(logo)
  }

  get logoPlaceholder() {
    const normalizeName = this.eventName
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      .toUpperCase()

    const words = normalizeName.split(' ')

    switch (words.length) {
      case 0:
        return ''
      case 1:
        return words[0].substring(0, 4)
      case 2:
        return words[0].substring(0, 2) + words[1].substring(0, 2)
      case 3:
        return (
          words[0].substring(0, 1) +
          words[1].substring(0, 1) +
          words[2].substring(0, 1)
        )
      default:
        return (
          words[0].substring(0, 1) +
          words[1].substring(0, 1) +
          words[2].substring(0, 1) +
          words[3].substring(0, 1)
        )
    }
  }

  get eventInfoDate() {
    const eventDescription = this.eventDescription
    const startDate = pathOr<string>(null, ['startDate'], eventDescription)
    const endDate = pathOr<string>(null, ['endDate'], eventDescription)

    return {
      startDate: startDate ? moment(startDate).format('ddd, DD MMM') : '',
      endDate: endDate ? moment(endDate).format('ddd DD MMM YYYY') : '',
    }
  }

  get eventInfoDateVer2() {
    const eventDescription = this.eventDescription
    const startDate = pathOr<string>(null, ['startDate'], eventDescription)
    const endDate = pathOr<string>(null, ['endDate'], eventDescription)

    return {
      startDate: startDate ? moment(startDate).format('ddd, DD MMM') : '',
      endDate: endDate ? moment(endDate).format('ddd DD MMM') : '',
    }
  }

  get descriptionText() {
    const eventDescription = this.eventDescription
    return pathOr<string>('', ['description'], eventDescription)
  }
}
