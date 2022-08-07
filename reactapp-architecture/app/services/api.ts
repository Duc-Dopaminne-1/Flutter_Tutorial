import axios from 'axios'
import Realm from 'realm'
import { env } from '@/env'

export type SchemaConfig = {
  schema: (Realm.ObjectClass | Realm.ObjectSchema)[]
  user?: Realm.Sync.User
  path: string
  partial?: boolean
  fullSynchronization?: boolean
}

export const api = axios.create({
  baseURL: env.baseUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export const openSchema = (config?: SchemaConfig) => {
  return new Realm({
    schema: config.schema,
    schemaVersion: 11,
    sync: {
      user: config.user,
      url: `${env.realmBaseUrl()}${config.path}`,
      fullSynchronization: config.fullSynchronization,
      partial: config.partial,
    },
  })
}

export enum StatusCode {
  SUCCESS = 200,
  SUCCESS_NO_CONTENT = 204,
}
