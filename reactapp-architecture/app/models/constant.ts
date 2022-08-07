export interface Country {
  id: string
  fullName: string
  countryCode: string
}

export interface Currency {
  id: string
  name: string
  symbol: string
}

export interface Harbour {
  id: string
  name: string
}

export interface Incoterm {
  id: string
  name: string
}

export interface RealmServer {
  id: string
  name: string
  hostname: string
  httpPort?: number
  httpsPort?: number
}
