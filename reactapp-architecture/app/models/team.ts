import { EventDescription, Image, Team, User } from './common'
import { Event } from './global'

export interface WithAudit {
  creationDate?: Date
  createdBy?: User
  deletedBy?: User
  deletionDate?: Date
  lastUpdatedBy?: User
  lastUpdatedDate?: Date
  deleted?: boolean
}

export interface Category extends WithAudit, Realm.Object {
  id: string
  name: string
}

export interface Comment extends WithAudit, Realm.Object {
  id: string
  text: string
}

export interface Contact extends WithAudit, Realm.Object {
  id: string
  name?: string
  phoneNumber?: string
  email?: string
  businessCardImage?: Image
  jobTitle?: string
  supplier: Supplier
}

export interface Event extends WithAudit, Realm.Object {
  id: string
  name?: string
  rating?: number
  description: EventDescription
  comments: Comment[]
}

export interface ImageUploadRequest extends WithAudit, Realm.Object {
  id: string
  status: string
  image: Image
  uploadUrl?: string
  formData?: string
}

export interface AttachmentUploadRequest extends Realm.Object {
  id: string
  status: string
  attachment: Attachment
  uploadUrl?: string
  formData?: string
}

export interface Attachment extends Realm.Object {
  id: string
  fileName: string
  url?: string
  size: number
}

export interface Price extends WithAudit {
  id: string
  currency?: string
  value?: number
  baseCurrencyValue?: number
}

export interface Packaging extends WithAudit, Realm.Object {
  id: string
  height?: number
  width?: number
  length?: number
  unit?: string
  itemsQuantity?: number
  weight?: number
  weightUnit?: string
}

export interface ProductStatus {
  id: string
  name: string
  inWorkflow: boolean
  category: string
  step?: number
}

export interface PriceMatrixRow extends WithAudit, Realm.Object {
  id: string
  label?: string
  price?: Price
}

export interface PriceMatrix extends WithAudit, Realm.Object {
  id: string
  rows: PriceMatrixRow[]
}

export interface Product extends WithAudit, Realm.Object {
  id: string
  name: string
  supplier?: Supplier
  images: Image[]
  price?: Price
  category?: Category
  description?: string
  event?: Event
  favorite?: boolean
  status?: ProductStatus

  assignee?: User

  tags: Tag[]

  minimumOrderQuantity?: number
  moqDescription?: string

  votes: ProductVote[]
  score?: number

  comments: Comment[]
  attachments: Attachment[]
  // Trading Info --------

  // Packaging
  innerCarton?: Packaging
  masterCarton?: Packaging

  // Price Matrix
  priceMatrix?: PriceMatrix

  // Sample & Lead Time
  leadTimeValue?: number
  leadTimeUnit?: string
  sample?: boolean
  samplePrice?: Price

  projects: Project[]
  externalRequests: ExternalRequest[]
  extendedFields: []

  incoTerm?: string
  harbour?: string

  // Internals ---------
  archived: boolean
}

export interface ProductVote extends WithAudit, Realm.Object {
  id: string
  user: User
  value: number
}

export interface ProductVoteRequest extends WithAudit, Realm.Object {
  id: string
  product: Product
  users: User[]
  comment: string
}

export interface Project extends WithAudit, Realm.Object {
  id: string
  name: string
  logoImage?: Image
  description?: string
}

export interface SupplierType extends Realm.Object {
  id: string
  name: string
  deleted: boolean
}

export interface Sample extends WithAudit, Realm.Object {
  id: string
  name: string
  reference: string
  status: SampleStatus
  assignee: User
  description: string
  comments: Comment[]
  product: Product
  supplier: Supplier
  images: Image[]
  price: Price
  paid: boolean
  extendedFields: []
}

export interface SampleStatus extends WithAudit {
  id: string
  name: string
  inWorkflow: boolean
  category: string
  step?: number
}

export interface SupplierStatus extends Realm.Object {
  id: string
  name: string
  inWorkflow: boolean
  category: string
  step?: number
}

export interface Supplier extends WithAudit, Realm.Object {
  id: string
  name: string
  fullName?: string
  tradingName?: string

  status?: SupplierStatus

  description?: string
  images: Image[]
  logoImage?: Image
  supplierType?: SupplierType
  website?: string
  phoneNumber?: string
  country?: string
  city?: string
  address?: string
  officeEmail?: string
  officePhone?: string
  incoTerm?: string
  harbour?: string
  generalMOQ?: number
  generalLeadTime?: number
  assignee?: User

  tags: Tag[]
  categories: Category[]
  comments: Comment[]
  contacts: Contact[]
  attachments: Attachment[]

  favorite: boolean

  globalDatabaseId?: string
}

export interface Tag extends WithAudit, Realm.Object {
  id: string
  name: string
}

export interface TaskType extends Realm.Object {
  id: string
  name: string
  deleted: boolean
}

export interface Task extends WithAudit, Realm.Object {
  id: string
  type: TaskType
  name?: string
  code?: string
  description?: string

  done?: boolean
  dueDate?: Date
  completionDate?: Date
  assignee?: User
  comments: Comment[]
  product?: Product
  supplier?: Supplier
  reference?: string
  referenceKey?: number
  inProgress?: boolean
}

export interface Invitation extends Realm.Object {
  id: string
  email: string
  inviter: User
  accessType: string
  status: string | 'pending'
}

export interface CustomSchemaRequest extends Realm.Object {
  id: string // Valid values: product supplier
  uiDescriptor: string
  status: string
  errors: string[]
}

export interface Role extends Realm.Object {
  name: string
  access: string
  premiumRequired: boolean
}

export interface ExportRequest extends Realm.Object {
  id: string
  format: string
  type: string
  query?: string // JSON description of the query parameters
  status: string | 'created' // Values: created rejected processing ready
  documentUrl?: string
  errors: string[]
  creationDate: Date
  createdBy: User
}

export interface ExternalRequest extends WithAudit, Realm.Object {
  id: string
  name: string
  description?: string
  companyName?: string
  quotes: Quote[]
  descriptor: string
  targetedMOQ?: number
  status: string // possible values: pending replied busy resent declined valiDated
  supplier: Supplier
  images: Image[]
  event: EventDescription
  recipients: string[]
}

export interface Quote extends Realm.Object {
  id: string
  status: string // possible values: pending done declined
  comment?: string

  // Basic product fields
  name: string
  price?: Price
  description?: string
  minimumOrderQuantity?: number
  moqDescription?: string
  innerCarton?: Packaging
  masterCarton?: Packaging
  priceMatrix?: PriceMatrix
  leadTimeValue?: number
  leadTimeUnit?: string
  sample?: boolean
  samplePrice?: number
}

export interface TeamUser extends Realm.Object {
  id: string
  team?: Team
  user?: User
  accessType: string
  status: string
}
