import { BehaviorSubject, Subject } from 'rxjs'
import { Supplier } from '@/models/team'
import { DeleteSub, SelectSub, UpdateSub } from '@/stores/options'

export enum SupplierStoreRef {
  TabView,
}

class SupplierStore {
  private _initSelect = false
  private _refs = new Map()
  private _selectSub = new Subject<SelectSub<Supplier>>()
  private _deleteSub = new Subject<DeleteSub>()
  private _updateSub = new BehaviorSubject<UpdateSub>({
    selectedId: '',
  })

  private _supplierListId = {}
  private _supplierListIdSub = new Subject<any>()

  get initSelect() {
    return this._initSelect
  }

  get supplierListId() {
    return this._supplierListId
  }

  get supplierListIdSub() {
    return this._supplierListIdSub
  }

  setRef = (key, value) => {
    this._refs.set(key, value)
  }

  changeTabView = (type: SupplierStoreRef, index: number) => {
    const currentRef = this._refs.get(type)
    currentRef && currentRef.goToPage(index)
  }

  set initSelect(value: boolean) {
    this._initSelect = value
  }

  set supplierListId(value: any) {
    this._supplierListId = value
  }

  delete() {
    return this._deleteSub
  }

  select() {
    return this._selectSub
  }

  update() {
    return this._updateSub
  }
}

export const supplierStore = new SupplierStore()
