import { Category, Event, Project, Supplier, Tag } from '@/models/team'
import { Subject } from 'rxjs'
import { CopyProductFactory } from '@/services/copyProduct'
import { pathOr } from 'ramda'
import { AsyncStorage } from 'react-native'
import { findIndex } from 'lodash'
import { Currency } from '@/models/constant'
import {
  checkValidRealmObject,
  filterValidProject,
  filterValidRealmObject,
} from '@/shared/validator'

interface FetchData {
  listCategoryId: string[]
  listSupplierId: string[]
  listTagId: string[]
  listProjectId: string[]
  listEventId: string[]
  listCurrency: Currency[]
}

const suggestCategory = 'ss:suggest-category'
const suggestSupplier = 'ss:suggest-supplier'
const suggestTag = 'ss:suggest-tag'
const suggestProject = 'ss:suggest-project'
const suggestEvent = 'ss:suggest-event'
const suggestCurrency = 'ss:suggest-currency'

class ModalStore {
  private _copyProductFactory: CopyProductFactory = null

  // multi and single
  private _category: Category[] = []
  private _categorySubject = new Subject<{
    suggestCategory: Category[]
    selectedCategory: Category[]
    isMulti: boolean
  }>()
  private _selectCategory: Category[] = []

  // single
  private _supplier: Supplier[] = []
  private _supplierSubject = new Subject<any>()
  private _selectSupplier: Supplier[] = []

  // multi
  private _tag: Tag[] = []
  private _tagSubject = new Subject<{
    suggestTag: Tag[]
    selectedTag: Tag[]
    isMulti: boolean
  }>()

  // multi
  private _project: Project[] = []
  private _projectSubject = new Subject<{
    suggestProject: Project[]
    selectedProject: Project[]
    isMulti: boolean
  }>()

  // single
  private _event: Event[] = []
  private _eventSubject = new Subject<{
    suggestEvent: Event[]
    selectedEvent: Event[]
  }>()
  private _selectEvent: Event[] = []

  // single
  private _currency: Currency[] = []
  private _currencySubject = new Subject<Currency[]>()
  private _selectCurrency: Currency[] = []

  set factory(factory) {
    this._copyProductFactory = factory

    this.getDataFromStore()
  }

  /* CATEGORY */
  async setCategory(
    value: Category,
    selectCategories: Category[] = [],
    isMulti: boolean = false
  ) {
    // Check value have been add to list before or not
    const index = findIndex(this._category, item => item.id === value.id)

    if (index !== -1) {
      this._category.splice(index, 1)
      this._category.unshift(value)
    } else {
      if (this._category.length >= 5) {
        this._category.pop()
      }

      this._category.unshift(value)
    }

    // check valid data
    this._category = filterValidRealmObject(this._category)

    const listCategoryId = this._category
      .map(category => {
        return pathOr<string>(null, ['id'], category)
      })
      .filter(value => value)

    try {
      await AsyncStorage.setItem(
        suggestCategory,
        JSON.stringify(listCategoryId)
      )
    } catch (e) {}

    this._categorySubject.next({
      isMulti,
      suggestCategory: this._category,
      selectedCategory: selectCategories,
    })
  }

  get category() {
    const filterCategory = filterValidRealmObject(this._category)
    this._category = filterCategory

    return filterCategory
  }

  get categorySubject() {
    return this._categorySubject
  }

  get selectCategory() {
    const filterCategory = filterValidRealmObject(this._selectCategory)
    this._selectCategory = filterCategory

    return filterCategory
  }

  set selectCategory(value: any) {
    this._selectCategory = value ? [value] : []
  }

  /* SUPPLIER */
  async setSupplier(value: Supplier) {
    // Check value have been add to list before or not
    const index = findIndex(this._supplier, item => item.id === value.id)

    if (index !== -1) {
      this._supplier.splice(index, 1)
      this._supplier.unshift(value)
    } else {
      // Remove the last data if data is more than 5 element
      if (this._supplier.length >= 5) {
        this._supplier.pop()
      }

      // Add to list
      this._supplier.unshift(value)
    }

    // check valid data
    this._supplier = filterValidRealmObject(this._supplier)

    const listSupplierId = this._supplier
      .map(supplier => {
        return pathOr<string>(null, ['id'], supplier)
      })
      .filter(value => value)

    try {
      await AsyncStorage.setItem(
        suggestSupplier,
        JSON.stringify(listSupplierId)
      )
    } catch (e) {}

    this._supplierSubject.next(this._supplier)
  }

  get supplier() {
    const filterSupplier = filterValidRealmObject(this._supplier)
    this._supplier = filterSupplier

    return filterSupplier
  }

  get supplierSubject() {
    return this._supplierSubject
  }

  get selectSupplier() {
    const filterSupplier = filterValidRealmObject(this._selectSupplier)
    this._selectSupplier = filterSupplier

    return filterSupplier
  }

  set selectSupplier(value: any) {
    this._selectSupplier = value ? [value] : []
  }

  /* TAG */
  async setTag(value: Tag, selectTags: Tag[] = [], isMulti: boolean = false) {
    // Check value have been add to list before or not
    const index = findIndex(this._tag, item => item.id === value.id)

    if (index !== -1) {
      this._tag.splice(index, 1)
      this._tag.unshift(value)
    } else {
      if (this._tag.length >= 5) {
        this._tag.pop()
      }

      this._tag.unshift(value)
    }

    // check valid data
    this._tag = filterValidRealmObject(this._tag)

    const listTagId = this._tag
      .map(tag => {
        return pathOr<string>(null, ['id'], tag)
      })
      .filter(value => value)

    try {
      await AsyncStorage.setItem(suggestTag, JSON.stringify(listTagId))
    } catch (e) {}

    this._tagSubject.next({
      isMulti,
      suggestTag: this._tag,
      selectedTag: selectTags,
    })
  }

  get tag() {
    const filterTag = filterValidRealmObject(this._tag)
    this._tag = filterTag

    return filterTag
  }

  get tagSubject() {
    return this._tagSubject
  }

  /* PROJECT */
  async setProject(
    value: Project,
    selectProjects: Project[] = [],
    isMulti: boolean = false
  ) {
    // Check value have been add to list before or not
    const index = findIndex(this._project, item => item.id === value.id)

    if (index !== -1) {
      this._project.splice(index, 1)
      this._project.unshift(value)
    } else {
      if (this._project.length >= 5) {
        this._project.pop()
      }

      this._project.unshift(value)
    }

    // check valid data
    this._project = filterValidRealmObject(this._project)

    // get all id of project
    const listProjectId = this._project
      .map(project => {
        return pathOr<string>(null, ['id'], project)
      })
      .filter(value => value)

    try {
      await AsyncStorage.setItem(suggestProject, JSON.stringify(listProjectId))
    } catch (e) {}

    this._projectSubject.next({
      isMulti,
      suggestProject: this._project,
      selectedProject: selectProjects,
    })
  }

  get project() {
    const filterProject = filterValidRealmObject(this._project)
    this._project = filterProject

    return filterProject
  }

  get projectSubject() {
    return this._projectSubject
  }

  /* EVENT */
  async setEvent(value: Event) {
    // Check value have been add to list before or not
    const index = findIndex(this._event, item => item.id === value.id)

    if (index !== -1) {
      this._event.splice(index, 1)
      this._event.unshift(value)
    } else {
      if (this._event.length >= 5) {
        this._event.pop()
      }

      this._event.unshift(value)
    }

    // check valid data
    this._event = filterValidRealmObject(this._event)

    const listEventId = this._event
      .map(event => {
        return pathOr<string>(null, ['id'], event)
      })
      .filter(value => value)

    try {
      await AsyncStorage.setItem(suggestEvent, JSON.stringify(listEventId))
    } catch (e) {}

    this._eventSubject.next({
      suggestEvent: this._event,
      selectedEvent: [],
    })
  }

  get event() {
    const filterEvent = filterValidRealmObject(this._event)
    this._event = filterEvent

    return filterEvent
  }

  get eventSubject() {
    return this._eventSubject
  }

  get selectEvent() {
    const filterEvent = filterValidRealmObject(this._selectEvent)
    this._selectEvent = filterEvent

    return filterEvent
  }

  set selectEvent(value: any) {
    this._selectEvent = value ? [value] : []
  }

  /* CURRENCY */
  async setCurrency(value: Currency) {
    // Check value have been add to list before or not
    const index = findIndex(this._currency, item => item.id === value.id)

    if (index !== -1) {
      this._currency.splice(index, 1)
      this._currency.unshift(value)
    } else {
      if (this._currency.length >= 5) {
        this._currency.pop()
      }

      this._currency.unshift(value)
    }

    try {
      await AsyncStorage.setItem(
        suggestCurrency,
        JSON.stringify(this._currency)
      )
    } catch (e) {}

    this._currencySubject.next(this._currency)
  }

  get currency() {
    return this._currency
  }

  get currencySubject() {
    return this._currencySubject
  }

  get selectCurrency() {
    return this._selectCurrency
  }

  set selectCurrency(value: any) {
    const convertToObject = {
      id: value,
      name: '',
      symbol: value,
    }

    this._selectCurrency = [convertToObject]
  }

  /* HANDLE DATA */
  getDataFromStore = async () => {
    try {
      await AsyncStorage.multiGet(
        [
          suggestCategory,
          suggestSupplier,
          suggestTag,
          suggestProject,
          suggestEvent,
          suggestCurrency,
        ],
        this.initDataFromStore
      )
    } catch (e) {}
  }

  initDataFromStore = (_err, stores) => {
    let listCategoryId = []
    let listSupplierId = []
    let listTagId = []
    let listProjectId = []
    let listEventId = []
    let listCurrency = []

    stores.map(result => {
      switch (result[0]) {
        case suggestCategory:
          listCategoryId = JSON.parse(result[1])
          break
        case suggestSupplier:
          listSupplierId = JSON.parse(result[1])
          break
        case suggestTag:
          listTagId = JSON.parse(result[1])
          break
        case suggestProject:
          listProjectId = JSON.parse(result[1])
          break
        case suggestEvent:
          listEventId = JSON.parse(result[1])
          break
        case suggestCurrency:
          listCurrency = JSON.parse(result[1])
          break
        default:
          break
      }
    })

    this.fetchData({
      listCategoryId: listCategoryId ? listCategoryId : [],
      listSupplierId: listSupplierId ? listSupplierId : [],
      listTagId: listTagId ? listTagId : [],
      listProjectId: listProjectId ? listProjectId : [],
      listEventId: listEventId ? listEventId : [],
      listCurrency: listCurrency ? listCurrency : [],
    })
  }

  fetchData = (data: FetchData) => {
    if (!this._copyProductFactory) return

    const {
      listCategoryId,
      listSupplierId,
      listTagId,
      listProjectId,
      listEventId,
      listCurrency,
    } = data

    const listResult = this._copyProductFactory.fetchSuggest(
      listCategoryId,
      listSupplierId,
      listTagId,
      listProjectId,
      listEventId
    )

    this._category = listResult[0]
    this._supplier = listResult[1]
    this._tag = listResult[2]
    this._project = listResult[3]
    this._event = listResult[4]
    this._currency = listCurrency
  }

  cleanAllSelectData = () => {
    this._selectCategory = []
    this._selectCurrency = []
    this._selectEvent = []
    this._selectSupplier = []
  }
}

export const modalStore = new ModalStore()
