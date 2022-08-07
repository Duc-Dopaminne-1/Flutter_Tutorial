import { AsyncStorage } from 'react-native'
import { findIndex } from 'lodash'

const keyListTeam = '@ss:listDownLoadTeam'
const keyHarbour = '@ss:harbour'
const keyIncoterm = '@ss:incoterm'

class DownloadTeamStore {
  private _listTeam = []
  private _isDownloadHarbour = false
  private _isDownloadIncoterm = false

  constructor() {
    this.readFromLocal().catch(() => {})
    this.readToLocalForHarbourIncoterm().catch(() => {})
  }

  get listTeam() {
    return this._listTeam
  }

  get isDownloadHarbour() {
    return this._isDownloadHarbour
  }

  get isDownloadIncoterm() {
    return this._isDownloadIncoterm
  }

  saveTeam = (teamId: string) => {
    if (!teamId) return

    const index = findIndex(this._listTeam, item => item === teamId)

    if (index === -1) {
      this._listTeam.push(teamId)
      this.writeToLocal()
    }
  }

  isAlreadyDownload = (teamId: string) => {
    const index = findIndex(this._listTeam, item => item === teamId)

    return index !== -1
  }

  saveHabourIncoterm = (type: 'habour' | 'incoterm', isDownload) => {
    if (type === 'habour') {
      this._isDownloadHarbour = isDownload
    } else if (type === 'incoterm') {
      this._isDownloadIncoterm = isDownload
    }
  }

  /**
   * Read and write for list team id
   */
  writeToLocal = () => {
    const convertToString = JSON.stringify(this._listTeam)
    AsyncStorage.setItem(keyListTeam, convertToString).then(() => {})
  }

  readFromLocal = async () => {
    const result = await AsyncStorage.getItem(keyListTeam)

    this._listTeam = result ? JSON.parse(result) : []
  }

  /**
   * Read and write for harbour and incoterm
   */
  writeToLocalForHarbourIncoterm = () => {
    if (this._isDownloadHarbour) {
      AsyncStorage.setItem(keyHarbour, '1').then(() => {})
    }

    if (this._isDownloadIncoterm) {
      AsyncStorage.setItem(keyIncoterm, '1').then(() => {})
    }
  }

  readToLocalForHarbourIncoterm = async () => {
    const result = await AsyncStorage.multiGet([keyHarbour, keyIncoterm])

    this._isDownloadHarbour = !!result[0][1]
    this._isDownloadIncoterm = !!result[1][1]
  }

  /**
   * Clear list team
   */
  clearTeam = () => {
    this._listTeam = []
  }
}

export const downloadTeamStore = new DownloadTeamStore()
