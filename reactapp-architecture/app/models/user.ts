import { Image, Team } from '@/models/common'

export interface User {
  id: string
  realmPath: string
  realmServerName: string
  firstName: string
  lastName: string
  phoneNumber?: string
  companyName?: string
  email: string
  currentTeam: Team
  preferredLanguage?: string
  avatar: Image
}
