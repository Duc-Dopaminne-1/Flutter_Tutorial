import { BehaviorSubject, Subject } from 'rxjs'
import { Task } from '@/models/team'
import { DeleteSub, SelectSub, UpdateSub } from '@/stores/options'

class TaskStore {
  private _initSelect = false

  private _selectSub = new Subject<SelectSub<Task>>()
  private _deleteSub = new Subject<DeleteSub>()
  private _updateSub = new BehaviorSubject<UpdateSub>({
    selectedId: '',
  })

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

export const taskStore = new TaskStore()
