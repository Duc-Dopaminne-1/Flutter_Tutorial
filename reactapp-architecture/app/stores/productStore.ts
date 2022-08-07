import { BehaviorSubject, Subject } from 'rxjs'
import { Product } from '@/models/team'

interface SelectSub<T> {
  item: T
  index: number
}

interface DeleteSub {
  index: number
}

interface ReceivedSub {
  selectedId: string
}

class ProductStore {
  private _initSelect = false
  private isStayProductActivity = false
  private _selectSub = new Subject<SelectSub<Product>>()
  private _deleteSub = new Subject<DeleteSub>()
  private _updateSub = new BehaviorSubject<ReceivedSub>({
    selectedId: '',
  })

  set stayProductActivity(value: boolean) {
    this.isStayProductActivity = value
  }

  get stayProductActivity() {
    return this.isStayProductActivity
  }

  get initSelect() {
    return this._initSelect
  }

  set initSelect(value: boolean) {
    this._initSelect = value
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

export const productStore = new ProductStore()
