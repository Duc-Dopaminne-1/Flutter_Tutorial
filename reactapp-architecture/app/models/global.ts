import { EventDescription, Image } from './common'

export interface Booth extends Realm.Object {
  id: string
  supplier: GlobalSupplier
  boothName: string
}

export interface Event extends Realm.Object {
  id: string
  description: EventDescription
  booths: Booth[]
}

export interface GlobalSupplier extends Realm.Object {
  id: string
  name: string
  supplierImage?: Image
  countryCode?: string
  addressFull?: string
  website?: string
  city: string
  emailAddress?: string
  phone?: string
  description?: string
  localName?: string
  tradingName?: string
  qrCode?: string
  keywords?: string
  additionalFields: string
  type: string
}

export interface Country extends Realm.Object {
  id: string
  fullName: string
  countryCode: string
}

export interface Currency extends Realm.Object {
  id: string
  name: string
  symbol: string
}

export interface Harbour extends Realm.Object {
  id: string
  name: string
}

export interface Incoterm extends Realm.Object {
  id: string
  name: string
}

export interface RealmServer extends Realm.Object {
  id: string
  name: string
  hostname: string
  httpPort?: number
  httpsPort?: number
}
