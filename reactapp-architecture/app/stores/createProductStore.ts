import { Category, Project, Supplier, Tag } from '@/models/team'
import {
  checkValidRealmObject,
  filterValidRealmObject,
} from '@/shared/validator'

interface Data {
  supplier: Supplier
  category: Category
  tags: Tag[]
  currency: string
  status: any
  moq: string
  moqDescription: string
  event: Event
  harbour: string
  incoTerm: string
  projects: Project[]
}

class CreateProductStore {
  private _supplier: Supplier
  private _category: Category
  private _tags: Tag[]
  private _currency: string
  private _status: any
  private _moq: string
  private _moqDescription: string
  private _harbour: string
  private _incoTerm: string
  private _event: Event
  private _projects: Project[]

  constructor() {
    this.init()
  }

  init = () => {
    this._supplier = null
    this._category = null
    this._tags = []
    this._currency = 'USD'
    this._status = null
    this._moq = ''
    this._moqDescription = ''
    this._harbour = ''
    this._incoTerm = ''
    this._event = null
    this._projects = []
  }

  setData = (data: Data) => {
    this._supplier = data.supplier
    this._category = data.category
    this._tags = data.tags
    this._currency = data.currency
    this._status = data.status
    this._moq = data.moq
    this._moqDescription = data.moqDescription
    this._harbour = data.harbour
    this._incoTerm = data.incoTerm
    this._event = data.event
    this._projects = data.projects
  }

  get supplier() {
    const validSupplier = checkValidRealmObject(this._supplier, null)
    this._supplier = validSupplier

    return validSupplier
  }

  get category() {
    const validCategory = checkValidRealmObject(this._category, null)
    this._category = validCategory

    return validCategory
  }

  get tags() {
    const filterTags = filterValidRealmObject(this._tags)
    this._tags = filterTags

    return filterTags
  }

  get currency() {
    return this._currency
  }

  get status() {
    return this._status
  }

  get moq() {
    return this._moq
  }

  get moqDescription() {
    return this._moqDescription
  }

  get harbour() {
    return this._harbour
  }

  get incoTerm() {
    return this._incoTerm
  }

  get event() {
    const validEvent = checkValidRealmObject(this._event, null)
    this._event = validEvent

    return validEvent
  }

  get projects() {
    const filterProject = filterValidRealmObject(this._projects)
    this._projects = filterProject

    return filterProject
  }

  clear() {
    this.init()
  }
}

export const createProductStore = new CreateProductStore()
