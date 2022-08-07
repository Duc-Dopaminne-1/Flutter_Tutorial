import { PriceMatrix, PriceMatrixRow } from '@/models/team'
import { pathOr } from 'ramda'

export class SafePriceMatrix {
  _data: PriceMatrix = {} as any

  _defaultRows = [
    {
      label: '',
      price: {},
    },
  ]

  constructor(data: PriceMatrix) {
    this._data = data
  }

  get id() {
    return pathOr<string>('', ['id'], this._data)
  }

  get rows() {
    return pathOr<PriceMatrixRow[]>(
      this._defaultRows as any,
      ['rows'],
      this._data
    )
  }
}
