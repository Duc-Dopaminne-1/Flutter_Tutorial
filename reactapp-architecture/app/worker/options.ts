import { Image } from '@/models/common'

export enum TaskType {
  Buffer,
  Url,
}

export enum FlagType {
  Product,
  Supplier,
  Contact,
}

export enum Priority {
  Received,
  Thumbnail,
  Image,
}

export enum TaskName {
  CacheImage,
}

export type Task = {
  id: string
  priority: number
  name: TaskName
  data: Image | ArrayBuffer
  type: TaskType
}

export type CallbackResult = any
