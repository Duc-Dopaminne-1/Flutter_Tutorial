import { WithAudit } from '@/models/team'

export interface ImageUrl {
  maxWidth: number
  maxHeight: number
  url: string
}

export interface Image extends WithAudit, Realm.Object {
  id: string
  fileName: string
  orientation: number
  imageType: string
  data?: ArrayBuffer
  urls: [ImageUrl, ImageUrl, ImageUrl, ImageUrl, ImageUrl, ImageUrl] | []
}

export interface CustomSchema {
  id: string // Composed with "team.id-target_class"
  uiDescriptor: string
  realmSchema: string
}

export interface Team extends Realm.Object {
  id: string
  ownerUser: User
  name: string
  defaultCurrency?: string
  status: string | 'pending'
  realmPath?: string
  realmServerName?: string
  creationDate: Date
  company: Company
  productSchema: CustomSchema
  supplierSchema: CustomSchema
}

export interface TeamUser extends Realm.Object {
  id: string
  team: Team
  user: User
  accessType: string
  status: string | 'pending'
}

export interface User extends Realm.Object {
  id: string
  firstName: string
  lastName: string
  phoneNumber?: string
  companyName?: string
  email: string
  currentTeam: Team
  preferredLanguage?: string
  avatar?: Image
}

export interface EventDescription {
  id: string
  name: string
  description?: string
  website?: string
  startDate?: Date
  endDate?: Date
  countryCode?: string
  venue?: Venue
  logoImage?: Image
  global: boolean
  supplierCount: number
  industry?: Industry
  primaryColor?: string
  secondaryColor?: string
}

export interface Industry {
  id: string
  name: string
}

export interface Invitation {
  id: string
  email: string
  inviterFirstName: string
  inviterLastName: string
  teamName: string
  teamId: string
  accessType: string
  userId?: string
  status: string | 'pending'
}

export interface PayingSubscription {
  id: string
  nbUsers: number
  validUntil: Date
  trialEnd?: Date
  status: string
  accessRights: string
}

export interface Company {
  id: string
  name: string
  owner: User
  subscription?: PayingSubscription
  description?: string
  taxId?: string
  industry: Industry[]
  address?: string
  phoneNumber?: string
  website?: string
  teams: Team[]
  users: User[]
}

export interface Venue {
  id: string
  city?: string
  name: string
  latitude?: number
  country?: string
  longitude?: number
  addressFull?: string
}
