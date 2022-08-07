import { pathOr } from 'ramda'
import { Company } from '@/models/common'

export class SafeCompany {
  private readonly _data: Company

  constructor(company: Company) {
    this._data = company
  }

  get name() {
    return pathOr('', ['name'], this._data)
  }
}
