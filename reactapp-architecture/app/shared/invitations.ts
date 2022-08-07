import { pathOr } from 'ramda'
import { Invitation } from '@/models/team'

export class SafeInvitation {
  private readonly _invitation: Invitation = null

  constructor(invitation: Invitation) {
    this._invitation = invitation
  }

  get email() {
    return pathOr('', ['email'], this._invitation)
  }
}
