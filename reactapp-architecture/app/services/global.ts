import { BehaviorSubject, Subject } from 'rxjs'
import {
  Product,
  Supplier,
  Sample,
  Project,
  Task,
  Comment,
} from '@/models/team'
import { Image } from '@/models/common'
import { SafeEvent } from '@/shared/event'

/**
 * Define keyword for each tag in product and supplier
 *  + Product has MyProduct and AllProduct tag
 *  + Supplier has MySupplier and AllSupplier tag. Exhibitors tag will display with 2 tags in supplier when user have check in to an event.
 */
export enum SearchKeywordType {
  MyProduct,
  AllProduct,
  MySupplier,
  AllSupplier,
  Exhibitors,
  MyTasks,
  AllTasks,
  AssignedToMeTasks,
  MySamples,
  AllSamples,
  AssignedToMeSamples,
  FutureEvent,
  CloseToMe,
  PastEvents,
  AllSearch,
}

/**
 * This subject help to alert to SupplierInfoScreen when add new image to supplier
 */
export const imageDataSupplierSubject = new Subject<{
  imageData: string[]
  imageType: string[]
}>()

/**
 * This subject help to alert to ProductInfoScreen when add new image to
 * product
 */
export const imageDataProductSubject = new Subject<{
  imageData: string[]
  imageType: string[]
}>()

/**
 * This subject help to alert to SampleInfoScreen when add new image to sample
 */
export const imageDataSampleSubject = new Subject<{
  imageData: string[]
  imageType: string[]
}>()

/**
 * This subject help to alert to ProductInfoScreen when edit image ( delete,
 * change to main image or draw to image)
 */
export const editImageDataSubject = new Subject<string[]>()

/**
 * This subject help to alert to SupplierInfoScreen when edit image ( delete,
 * change to main image or draw to image)
 */
export const editImageSupplierSubject = new Subject<string[]>()

/**
 * This subject help to pass search keyword from header textInput to
 * function search in supplierList or productList dependent on with type.
 */
export const searchKeyword = new Subject<{
  text: string
  type: SearchKeywordType
}>()

/**
 * This subject help to pass search keyword from header textInput to
 * function search in supplierList or productList dependent on with type.
 * Use for dashboard only
 */
export const searchKeywordDashboard = new BehaviorSubject<{
  text: string
  type: SearchKeywordType
}>({
  text: '',
  type: SearchKeywordType.AllSearch,
})

/**
 * This subject help to pass search keyword from header textInput to projectList
 */
export const searchKeywordProject = new Subject<{
  text: string
}>()

/**
 * This subject help to pass data from productList to scrollableTabView
 */
export const scrollTabView = new Subject<{
  y: number
  type: 'Supplier' | 'Product'
  flatListRef: any
}>()

/**
 * This subject help to pass scrolling data from supplierList to
 * scrollableTabView when have any change
 */
export const scrollTabViewSupplier = new Subject<{
  y: number
  type: 'Supplier' | 'Product' | 'Task'
  flatListRef: any
}>()

/**
 * This subject help to pass scrolling data from supplierList to
 * scrollableTabView when have any change
 */
export const scrollTabViewTask = new Subject<{
  y: number
  type: 'Task'
  flatListRef: any
}>()

/**
 * This subject help to pass scrolling data from sampleList to
 * scrollableTabView when have any change
 */
export const scrollTabViewSample = new Subject<{
  y: number
  type: 'Sample'
  flatListRef: any
}>()

export const onSupplierChange = new Subject<{
  index: number
  data: Supplier
}>()

export const onProductChange = new Subject()

/**
 * This subject help to alert that new product have been create to display
 * toast message
 */
export const onProductCreated = new Subject<{ total: number }>()

/**
 * This subject help to alert that new item have been create to display
 * toast message
 */
export const onItemCreated = new Subject<{
  id: string
  type: 'sample' | 'task' | 'product' | 'comment'
  commentType?: 'sample' | 'task' | 'product' | 'supplier'
  product?: Product
  supplier?: Supplier
  sample?: Sample
  task?: Task
}>()

export const onScrollToComment = new Subject<{
  commentId: string
  type?: 'sample' | 'task' | 'product' | 'supplier'
  product?: Product
  sample?: Sample
  task?: Task
  supplier?: Supplier
}>()

/**
 * This subject help to update product image when product have been update
 */
export const onProductChangeById = new BehaviorSubject<Product>(null)

/**
 * This subject help to update sample image when sample have been update
 */
export const onSampleChangeById = new BehaviorSubject<Sample>(null)

/**
 * This subject help to update supplier image when supplier have been update
 */
export const onSupplierChangeById = new BehaviorSubject<Supplier>(null)

export const extendField = new Subject()

/**
 *  This subject help to pass image data from ProductInfo to GalleryScreen
 *  when have any change
 */
export const onImageProductInfo = new Subject<{ imageData: Image[] }>()

/**
 *  This subject help to pass image data from SupplierInfo to GalleryScreen
 *  when have any change
 */
export const onImageSupplierInfo = new Subject<{ imageData: Image[] }>()

/**
 *  This subject help to pass image data from SupplierInfo to GalleryScreen
 *  when have any change
 */
export const onImageSampleInfo = new Subject<{ imageData: Image[] }>()

/**
 * This subject help to
 */
export const renderImageProgress = new Subject()

export const imageKeyUpdate = new Subject()

export const updateCameraImage = new Subject<{ imageData: string[] }>()

export const setLoadingSnapImageBusinessCard = new Subject<boolean>()

export const onDeleteProduct = new Subject()

export const onDeleteSupplier = new Subject()

export const onDeleteTask = new Subject()

export const onDeleteSample = new Subject()

export const onSelectProjectInModal = new Subject<Project>()

export const onStoreSuccess = new Subject()

export const updateProductInfo = new BehaviorSubject<Product>(null)

export const updateStar = new Subject<Product>()

export const updateSampleInfo = new Subject<Sample>()

export const createProduct = new Subject()

export const Toast = new Subject<{ message: string }>()

export const isVisibleTabBar = new Subject<boolean>()

export const isSelectMulti = new Subject<boolean>()

export const totalSelectMulti = new Subject<number>()

/**
 * call to force update product in project screen
 */
export const forceUpdateProductInProject = new Subject<boolean>()

/**
 * Request change tab in supplier list
 */
export const changeTabSupplierList = new Subject<number>()

/**
 * call to open modal check-in event success in home screen
 */
export const openModalCheckInEventSuccess = new Subject<{
  isOpen: boolean
  safeEvent: SafeEvent
}>()

/**
 * Send data to download screen
 */
export const sendDataToDownloadScreen = new BehaviorSubject<{
  downloadClassName: string
  isFinish: boolean
}>({
  downloadClassName: '',
  isFinish: false,
})
