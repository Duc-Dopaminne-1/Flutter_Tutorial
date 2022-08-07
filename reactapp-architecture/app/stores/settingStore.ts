import { AsyncStorage } from 'react-native'

const key_save_picture = '@ss:isSavePicture'
const key_business_card = '@ss:isSaveBusinessCard'
const key_copy_product = '@ss:isCopyProduct'

class SettingStore {
  private _savePicture: boolean = false
  private _businessCard: boolean = true
  private _copyProduct: boolean = true

  constructor() {
    this.getPictureFromStore()
    this.getBusinessCardFromStore()
    this.getCopyProductFromStore()
  }

  get savePicture() {
    return this._savePicture
  }

  get businessCard() {
    return this._businessCard
  }

  get copyProduct() {
    return this._copyProduct
  }

  set savePicture(value: boolean) {
    this._savePicture = value
  }

  set businessCard(value: boolean) {
    this._businessCard = value
  }

  set copyProduct(value: boolean) {
    this._copyProduct = value
  }

  getPictureFromStore = async () => {
    try {
      const value = await AsyncStorage.getItem(key_save_picture)
      if (value && value === 'true') {
        this._savePicture = true
      } else {
        this._savePicture = false
      }
    } catch (e) {
      this._savePicture = false
    }
  }

  getBusinessCardFromStore = async () => {
    try {
      const value = await AsyncStorage.getItem(key_business_card)

      if (value) {
        this._businessCard = value === 'true'
      }
    } catch (e) {
      this._businessCard = true
    }
  }

  getCopyProductFromStore = async () => {
    try {
      const value = await AsyncStorage.getItem(key_copy_product)

      if (value) {
        this._copyProduct = value === 'true'
      }
    } catch (e) {
      this._copyProduct = true
    }
  }

  setPictureToStore = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(key_save_picture, value.toString())
    } catch (e) {}
  }

  setBusinessCardToStore = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(key_business_card, value.toString())
    } catch (e) {}
  }

  setCopyProductToStore = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(key_copy_product, value.toString())
    } catch (e) {}
  }
}

export const settingStore = new SettingStore()
