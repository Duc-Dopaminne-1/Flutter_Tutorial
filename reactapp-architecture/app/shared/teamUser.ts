import { TeamUser } from '@/models/team'
import { pathOr } from 'ramda'

export class SafeTeamUser {
  private readonly _teamUser: TeamUser = null

  constructor(teamUser: TeamUser) {
    this._teamUser = teamUser
  }

  get id(): string {
    return pathOr('', ['id'], this._teamUser)
  }

  get team() {
    return pathOr({}, ['team'], this._teamUser)
  }

  get user() {
    return pathOr({}, ['user'], this._teamUser)
  }

  get accessType(): string {
    return pathOr('', ['accessType'], this._teamUser)
  }

  get status(): string {
    return pathOr('', ['status'], this._teamUser)
  }
}
