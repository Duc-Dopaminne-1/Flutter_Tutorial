import { Category, Project, Supplier, Tag } from '@/models/team'
import { AsyncStorage } from 'react-native'
import { pathOr } from 'ramda'
import { CopyProductFactory } from '@/services/copyProduct'
import {
  checkValidRealmObject,
  filterValidRealmObject,
} from '@/shared/validator'

interface Data {
  category: Category
  projects: Project[]
  tags: Tag[]
  currency: string
  status: any
  supplier: Supplier
  moq: string
  moqDescription: string
  event: Event
  harbour: string
  incoTerm: string
}

const defaultData = {
  category: null,
  projects: [],
  tags: [],
  currency: '',
  status: null,
  supplier: null,
  moq: '',
  moqDescription: '',
  event: null,
  harbour: '',
  incoTerm: '',
}

interface FetchData {
  eventId: string
  supplierId: string
  categoryId: string
  statusId: string
  listTagId: string[]
  listProjectId: string[]
}

const key_copy_category = 'key_ss_copy_category'
const key_copy_projects = 'key_ss_copy_key_copy_projects'
const key_copy_tags = 'key_ss_copy_tags'
const key_copy_currency = 'key_ss_copy_currency'
const key_copy_status = 'key_ss_copy_status'
const key_copy_supplier = 'key_ss_copy_supplier'
const key_copy_moq = 'key_ss_copy_moq'
const key_copy_moqDescription = 'key_ss_copy_moqDescription'
const key_copy_event = 'key_ss_copy_event'
const key_copy_harbour = 'key_ss_copy_harbour'
const key_copy_incoTerm = 'key_ss_copy_incoTerm'

class CopyProductStore {
  private _copyProductFactory: CopyProductFactory = null
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

  set factory(factory) {
    this._copyProductFactory = factory

    this.getFromStore()
  }

  setData = (data: Data = defaultData) => {
    this._supplier = data.supplier
    this._category = data.category
    this._tags = data.tags
    this._currency = data.currency
    this._status = data.status
    this._moq = data.moq ? data.moq.toString() : ''
    this._moqDescription = data.moqDescription ? data.moqDescription : ''
    this._harbour = data.harbour ? data.harbour : ''
    this._incoTerm = data.incoTerm ? data.incoTerm : ''
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

  saveToStore = async () => {
    const eventId = pathOr<string>('', ['id'], this._event)
    const supplierId = pathOr<string>('', ['id'], this._supplier)
    const categoryId = pathOr<string>('', ['id'], this._category)
    const statusId = pathOr<string>('', ['id'], this._status)
    const listTagId = this._tags
      .map(tag => {
        return pathOr<string>(null, ['id'], tag)
      })
      .filter(value => value)

    const listProjectId = this._projects
      .map(project => {
        return pathOr<string>(null, ['id'], project)
      })
      .filter(value => value)

    try {
      await AsyncStorage.multiSet(
        [
          [key_copy_event, eventId],
          [key_copy_supplier, supplierId],
          [key_copy_category, categoryId],
          [key_copy_tags, JSON.stringify(listTagId)],
          [key_copy_projects, JSON.stringify(listProjectId)],
          [key_copy_moq, this._moq],
          [key_copy_moqDescription, this._moqDescription],
          [key_copy_harbour, this._harbour],
          [key_copy_incoTerm, this._incoTerm],
          [key_copy_currency, this._currency],
          [key_copy_status, statusId],
        ],
        e => {
          console.log(e)
        }
      )
    } catch (e) {}
  }

  getFromStore = async () => {
    try {
      await AsyncStorage.multiGet(
        [
          key_copy_event,
          key_copy_supplier,
          key_copy_category,
          key_copy_tags,
          key_copy_projects,
          key_copy_moq,
          key_copy_moqDescription,
          key_copy_harbour,
          key_copy_incoTerm,
          key_copy_currency,
          key_copy_status,
        ],
        this.initDataFromStore
      )
    } catch (e) {}
  }

  initDataFromStore = (_err, stores) => {
    let eventId = ''
    let supplierId = ''
    let categoryId = ''
    let statusId = ''
    let listTagId = []
    let listProjectId = []

    stores.map(result => {
      switch (result[0]) {
        case key_copy_event:
          eventId = result[1]
          break
        case key_copy_supplier:
          supplierId = result[1]
          break
        case key_copy_category:
          categoryId = result[1]
          break
        case key_copy_tags:
          listTagId = JSON.parse(result[1])
          break
        case key_copy_projects:
          listProjectId = JSON.parse(result[1])
          break
        case key_copy_moq:
          this._moq = result[1]
          break
        case key_copy_moqDescription:
          this._moqDescription = result[1]
          break
        case key_copy_harbour:
          this._harbour = result[1]
          break
        case key_copy_incoTerm:
          this._incoTerm = result[1]
          break
        case key_copy_currency:
          this._currency = result[1]
          break
        case key_copy_status:
          statusId = result[1]
          break
        default:
          break
      }
    })

    this.fetchData({
      eventId,
      supplierId,
      categoryId,
      listTagId,
      listProjectId,
      statusId,
    })
  }

  fetchData = (data: FetchData) => {
    if (!this._copyProductFactory) return

    const {
      eventId,
      supplierId,
      categoryId,
      listTagId,
      listProjectId,
      statusId,
    } = data

    const listResult = this._copyProductFactory.fetch(
      eventId,
      supplierId,
      categoryId,
      listTagId,
      listProjectId,
      statusId
    )

    this._event = listResult[0]
    this._supplier = listResult[1]
    this._category = listResult[2]
    this._tags = listResult[3]
    this._projects = listResult[4]
    this._status = listResult[5]
  }

  clear = async () => {
    this.init()

    await AsyncStorage.multiRemove(
      [
        key_copy_event,
        key_copy_supplier,
        key_copy_category,
        key_copy_tags,
        key_copy_projects,
        key_copy_moq,
        key_copy_moqDescription,
        key_copy_harbour,
        key_copy_incoTerm,
        key_copy_currency,
      ],
      err => {
        console.log(err)
      }
    )
  }
}

export const copyProductStore = new CopyProductStore()
