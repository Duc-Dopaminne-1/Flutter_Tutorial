import { AsyncStorage } from 'react-native'
import { findIndex } from 'lodash'

const LIST_SELECTED_TEAM_ID = '@ss:listSelectedTeamId'

class SelectTeamStore {
  private _listSelectTeamId = []

  constructor() {
    this.getDataFromAsyncStorage().catch(() => {})
  }

  get listSelectTeamId() {
    return this._listSelectTeamId
  }

  checkTeam = (teamId: string) => {
    const index = findIndex(this._listSelectTeamId, data => data === teamId)

    return index !== -1
  }

  saveData = (teamId: string) => {
    if (this.checkTeam(teamId)) {
      return
    }

    this._listSelectTeamId.push(teamId)
    const convertToJson = JSON.stringify(this._listSelectTeamId)

    AsyncStorage.setItem(LIST_SELECTED_TEAM_ID, convertToJson).catch(() => {})
  }

  private getDataFromAsyncStorage = async () => {
    const result = await AsyncStorage.getItem(LIST_SELECTED_TEAM_ID)

    if (result) {
      this._listSelectTeamId = JSON.parse(result)
    }
  }

  /**
   * call when sign out
   * because when all data in async storage will be clean when sign out
   * so after call sign out function. We will set the data back to storage
   */
  setDataBackToAsyncStorage = () => {
    const convertToJson = JSON.stringify(this._listSelectTeamId)

    AsyncStorage.setItem(LIST_SELECTED_TEAM_ID, convertToJson).catch(() => {})
  }
}

export const selectTeamStore = new SelectTeamStore()
