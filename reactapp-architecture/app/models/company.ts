import { Company, PayingSubscription, User } from './common'

export interface Company {
  id: 'string'
  name: 'string'
}

export interface CompanyUser {
  id: string
  company: Company
  user: User
  premium: boolean
}

export interface PaymentRequest {
  id: string
  nbUsers: number
  status: string
  subscription?: PayingSubscription
  coupon?: string
  plan?: string
  price?: number
  paymentToken?: string
}
