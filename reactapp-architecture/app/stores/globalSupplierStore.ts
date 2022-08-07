import { BehaviorSubject, Subject } from 'rxjs'
import { SelectSub, UpdateSub } from '@/stores/options'

class GlobalSupplierStore {
  private _initSelect = false

  private _selectSub = new Subject<SelectSub<any>>()
  private _updateSub = new BehaviorSubject<UpdateSub>({
    selectedId: '',
  })

  get initSelect() {
    return this._initSelect
  }

  set initSelect(value: boolean) {
    this._initSelect = value
  }

  select() {
    return this._selectSub
  }

  update() {
    return this._updateSub
  }
}

export const globalSupplierStore = new GlobalSupplierStore()
