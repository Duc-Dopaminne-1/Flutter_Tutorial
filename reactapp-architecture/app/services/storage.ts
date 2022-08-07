import { AsyncStorage } from 'react-native'

interface IStorageKey {
  '@ss:selectedTeamId': string
  '@ss:token': string
  '@ss:email': string
}

export class LocalStorage {
  static SELECTED_TEAM_ID = '@ss:selectedTeamId'
  static TOKEN = '@ss:token'
  static EMAIL = '@ss:email'

  static async get(key: keyof IStorageKey) {
    return await AsyncStorage.getItem(key)
  }

  static async set(key: keyof IStorageKey, value: string = '') {
    return await AsyncStorage.setItem(key, value)
  }

  static async clear(callback?: (error?: Error) => void) {
    return await AsyncStorage.clear(callback)
  }
}
