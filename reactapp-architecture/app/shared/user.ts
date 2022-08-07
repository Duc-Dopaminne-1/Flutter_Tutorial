import { User } from '@/models/user'
import { pathOr } from 'ramda'

export class SafeUser {
  private readonly _user: User = null

  constructor(user: User) {
    this._user = user
  }

  get logoPlaceholder(): string {
    return this.firstName.slice(0, 1) + this.lastName.slice(0, 1)
  }

  get firstName() {
    return pathOr('', ['firstName'], this._user)
  }

  get lastName() {
    return pathOr('', ['lastName'], this._user)
  }

  get fullName() {
    const firstName = this.firstName.length > 0 ? this.firstName + ' ' : ''

    return firstName + this.lastName
  }

  get email() {
    return pathOr('', ['email'], this._user)
  }

  get phoneNumber() {
    return pathOr('', ['phoneNumber'], this._user)
  }

  get companyName() {
    return pathOr('', ['companyName'], this._user)
  }

  get id() {
    return pathOr('', ['id'], this._user)
  }
}
