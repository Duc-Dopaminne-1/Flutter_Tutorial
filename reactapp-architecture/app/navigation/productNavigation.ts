import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import { InteractionManager, Keyboard } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'
import { Subject } from 'rxjs'
import { Direction } from '@/common/constants/Direction'
import { Product } from '@/models/team'
import { productStore } from '@/stores/productStore'

export enum ProductData {
  Product,
  DescriptionOnSave,
  indexOfField,
  indexOfFieldToUpDow,
  setValue,
  currencyExtendField,
  totalPriceOfCustomField,
  isShippingRender,
  hasCustomField,
}

export enum ProductRef {
  Description,

  SelectTags,
  SelectProjects,
  SelectSupplier,
  SelectCategory,
  SelectStatus,
  Name,
  Price,
  SelectCurrency,
  MOQ,
  MOQDescription,
  SelectHarbour,
  SelectIncoTerm,
  SelectEvent,
  SelectAssignee,

  CustomField,

  InnerWith,
  InnerHeight,
  InnerDepth,
  InnerUnit,
  InnerQuality,
  InnerWeight,
  InnerWeightUnit,

  MasterWith,
  MasterHeight,
  MasterDepth,
  MasterUnit,
  MasterQuality,
  MasterWeight,
  MasterWeightUnit,

  PriceMatrix,

  SamplePrice,
  CurrencySamplePrice,
}

export enum ProductRefAndroid {
  SelectCurrencyPickerList = 100,
}

const MoveHandle = {
  isMovePriceMatrix: false,
  isMovePrice: false,
  isMoveSamplePrice: false,
  isPrice: false,
  isMatrixPrice: false,
  isSamplePrice: false,
  indexCurrency: 0,
}

export type customField = {
  movePickerList?: boolean
  isCustomField?: boolean
  indexOfField?: number
  indexOfFieldToUpDow?: number
  setValue?: (string, number) => void
  currency?: any
}

export class ProductNavigation {
  private _refs = new Map()
  private _priceMatrixRefs = new Map()
  private _priceIndexMatrixRefs = new Map()
  private _customFieldRefs = new Map()
  private _data = new Map()
  private _current = -1
  private _currentPriceMatrix = 0
  private _currentPriceMatrixOld = 0
  private _currentCustomField = 0
  private _indexCurrencyExtendFieldRefs = new Map()
  private _currencyExtendOld = 0
  private _subject = new Subject()
  private _subjectCarton = new Subject()
  private _PriceMatrixRefTotal = 0
  private indexCurrencyExtendOnPress = new Map()
  private countCurrencyExtendOnPress = 0
  private productsId = []

  set current(value) {
    this._current = value
  }

  set productId(value) {
    this.productsId = value
  }

  set currentPriceMatrix(value) {
    this._currentPriceMatrix = value
  }

  set currentCustomField(value) {
    this._currentCustomField = value
  }

  get priceMatrixRefSize() {
    return this._priceMatrixRefs.size
  }

  get subject() {
    return this._subject
  }

  get subjectCarton() {
    return this._subjectCarton
  }

  get isModal() {
    // return (
    //   [
    //     ProductRef.SelectTags,
    //     ProductRef.SelectSupplier,
    //     ProductRef.SelectStatus,
    //   ].indexOf(this._current) > -1
    // )
    return false
  }

  private navigate = <T extends NavigationParams>(
    routeName: string,
    params: T
  ) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  setData = (key: ProductData, value) => {
    this._data.set(key, value)
  }

  setRef = (key, value) => {
    // this._current = key
    this._refs.set(key, value)
  }

  setPriceMatrixRef = (key, value) => {
    // this._current = key
    this._priceMatrixRefs.set(key, value)
  }

  setPriceMatrixRefTotal = key => {
    // this._current = key
    this._PriceMatrixRefTotal = key
  }

  get PriceMatrixRefTotal() {
    // this._current = key
    return this._PriceMatrixRefTotal
  }

  setIndexPriceMatrixRef = (key, value) => {
    // this._current = key
    this._priceIndexMatrixRefs.set(key, value)
  }

  setIndexCurrencyExtenddRefs = (key, value) => {
    // this._current = key
    this._indexCurrencyExtendFieldRefs.set(key, value)
  }

  setCustomFieldRef = (key, value) => {
    this._customFieldRefs.set(key, value)
  }

  clear = () => {
    this._refs.clear()
    this._priceMatrixRefs.clear()
    this._priceIndexMatrixRefs.clear()
    this._data.clear()
    this._current = -1
    this._currentPriceMatrix = 0
    this._currentPriceMatrixOld = 0
    this._PriceMatrixRefTotal = 0
    this._currentCustomField = 0
    this._indexCurrencyExtendFieldRefs.clear()
    this._currencyExtendOld = 0
    this.indexCurrencyExtendOnPress.clear()
    this.countCurrencyExtendOnPress = 0
  }

  clearHandler = () => {
    if (
      (this._current >= ProductRef.PriceMatrix &&
        this._current !== ProductRef.SamplePrice) ||
      (this._currentPriceMatrix > 1 &&
        this._currentPriceMatrix <= this._priceMatrixRefs.size)
    ) {
      const value = {
        isClear: true,
        index: this._currentPriceMatrix,
      }
      this._subject.next(value)
      return
    }

    if (
      this._current === ProductRef.CustomField &&
      this._customFieldRefs.has(this._currentCustomField)
    ) {
      this._customFieldRefs.get(this._currentCustomField).clear()
    }

    const currentRef = this._refs.get(this._current)
    currentRef && currentRef.clear()
  }

  nextPriceMatrixIndex = (direction: Direction) => {
    return direction === Direction.Down
      ? this._currentPriceMatrix + 1
      : this._currentPriceMatrix - 1
  }

  nextCustomFieldIndex = (direction: Direction) => {
    return direction === Direction.Down
      ? this._currentCustomField + 1
      : this._currentCustomField - 1
  }

  nextIndex = (direction: Direction) => {
    Keyboard.dismiss()
    let nextIndex =
      direction === Direction.Down ? this._current + 1 : this._current - 1

    // if (
    //   direction !== Direction.Down &&
    //   this._current === ProductRef.InnerWith
    // ) {
    //   return 1000
    // }

    // Custom Field check
    if (this._current < ProductRef.CustomField) {
      this._currentCustomField = 0
    }
    this._currentCustomField = this.nextCustomFieldIndex(direction)
    const totalPriceOfCustomField = this._data.get(
      ProductData.totalPriceOfCustomField
    )
    const hasCustomField = this._data.get(ProductData.hasCustomField)

    if (
      hasCustomField &&
      (this._current === ProductRef.CustomField ||
        nextIndex === ProductRef.CustomField)
    ) {
      if (
        this._currentCustomField <=
          this._customFieldRefs.size +
            totalPriceOfCustomField -
            this.countCurrencyExtendOnPress &&
        this._currentCustomField > 0
      ) {
        return ProductRef.CustomField
      }
    }

    /**
     * If custom field didn't exists, skip this current nextIndex, dependent
     * on with direction
     */
    /* Down */
    if (
      !hasCustomField &&
      direction === Direction.Down &&
      this._current === ProductRef.SelectAssignee
    ) {
      nextIndex = nextIndex + 1
    }

    /* Up */
    if (
      !hasCustomField &&
      direction === Direction.Up &&
      this._current === ProductRef.InnerWith
    ) {
      nextIndex = nextIndex - 1
    }

    // Price Matrix check
    const isShippingRender = this._data.get(ProductData.isShippingRender)
    if (this._current < ProductRef.PriceMatrix) {
      this._currentPriceMatrix = 0
    }

    this._currentPriceMatrix = this.nextPriceMatrixIndex(direction)
    if (
      (this._current === ProductRef.PriceMatrix ||
        nextIndex === ProductRef.PriceMatrix) &&
      isShippingRender
    ) {
      if (
        this._currentPriceMatrix <= this._PriceMatrixRefTotal &&
        this._currentPriceMatrix > 0
      ) {
        return ProductRef.PriceMatrix
      }
    }

    if (
      isShippingRender &&
      this._currentPriceMatrix ===
        this._PriceMatrixRefTotal +
          (ProductRef.SamplePrice - ProductRef.PriceMatrix)
    ) {
      return ProductRef.SamplePrice
    }

    if (
      isShippingRender &&
      this._currentPriceMatrix ===
        this._PriceMatrixRefTotal +
          (ProductRef.CurrencySamplePrice - ProductRef.PriceMatrix)
    ) {
      return ProductRef.CurrencySamplePrice
    }

    if (nextIndex < 0) {
      return 0
    }

    return nextIndex
  }

  moveMetrixPriceItem = () => {
    const indexCurrencyPriceMetrix = this._currentPriceMatrix / 3 - 1
    const move = {
      ...MoveHandle,
      isMovePriceMatrix: true,
      isMatrixPrice: true,
      indexCurrency: indexCurrencyPriceMetrix,
    }
    this.onMoveUpDow(ProductRef.PriceMatrix, move)
  }

  movePriceMatrixHandler = () => {
    if (
      this._priceMatrixRefs.has(this._currentPriceMatrix) ||
      this._priceIndexMatrixRefs.has(this._currentPriceMatrix)
    ) {
      this._current = ProductRef.PriceMatrix

      InteractionManager.runAfterInteractions(() => {
        if (this._currentPriceMatrix % 3 === 0) {
          this.moveMetrixPriceItem()
          return
        }
        this._priceMatrixRefs.get(this._currentPriceMatrix).focus()
      })
    }
  }

  moveCurrencyExtendField = () => {
    const indexOfField = this._data.get(ProductData.indexOfField)
    const setValue = this._data.get(ProductData.setValue)
    const currencyExtendField = this._data.get(ProductData.currencyExtendField)

    this.navigate('SelectCurrencyPicker', {
      setValue,
      isProductToSetRef: true,
      isCustomField: true,
      indexOfField: indexOfField.indexOf(this._currentCustomField - 1),
      indexOfFieldToUpDow: this._currentCustomField,
      currency:
        currencyExtendField[indexOfField.indexOf(this._currentCustomField - 1)],
    })
  }

  moveCustomFieldHandler = () => {
    if (
      this._customFieldRefs.has(this._currentCustomField) ||
      this._indexCurrencyExtendFieldRefs.has(this._currentCustomField)
    ) {
      this._current = ProductRef.CustomField

      InteractionManager.runAfterInteractions(() => {
        if (this._indexCurrencyExtendFieldRefs.has(this._currentCustomField)) {
          if (!this.indexCurrencyExtendOnPress.has(this._currentCustomField)) {
            this.countCurrencyExtendOnPress++
          }
          this.indexCurrencyExtendOnPress.set(
            this._currentCustomField,
            this._currentCustomField
          )
          this._currencyExtendOld = this._currentCustomField // index to close modal
          this.moveCurrencyExtendField()
          return
        }

        const customFieldRef = this._customFieldRefs.get(
          this._currentCustomField
        )
        if (customFieldRef && customFieldRef.focus) {
          customFieldRef.focus()
        }
      })
    }
  }

  closeCurrentModal = (index: number) => {
    const currentRef = this._refs.get(index)

    if (this._refs.has(index) && currentRef && currentRef.close) {
      currentRef.close()
    }
  }

  closeCurrentModalPriceMatrix = () => {
    const currentRef = this._priceMatrixRefs.get(this._currentPriceMatrixOld)

    if (
      this._priceMatrixRefs.has(this._currentPriceMatrixOld) &&
      currentRef &&
      currentRef.close
    ) {
      currentRef.close()
    }
  }

  closeAllModal = () => {
    this.closeCurrentModal(this._current)
    this.closeCurrentModalPriceMatrix()
    this.closeCurrencyExtendField()
  }

  movePriceCurrencyAndSamplePriceCurrency = nextIndex => {
    if (nextIndex === ProductRef.SelectCurrency) {
      const move = {
        ...MoveHandle,
        isMovePrice: true,
        isPrice: true,
      }
      this.onMoveUpDow(nextIndex, move)
      return
    }
    if (nextIndex === ProductRef.CurrencySamplePrice) {
      const move = {
        ...MoveHandle,
        isMoveSamplePrice: true,
        isSamplePrice: true,
      }
      this.onMoveUpDow(nextIndex, move)
      return
    }

    if (productStore.stayProductActivity && nextIndex > 2) {
      return
    }
    this.open(nextIndex)
  }

  closeCurrencyExtendField = () => {
    const currentRef = this._customFieldRefs.get(this._currencyExtendOld)
    if (
      this._customFieldRefs.has(this._currencyExtendOld) &&
      currentRef &&
      currentRef.close
    ) {
      currentRef.close()
    }
  }

  moveHandler = (direction: Direction) => {
    if (this._currentPriceMatrix % 3 === 0) {
      this._currentPriceMatrixOld = this._currentPriceMatrix
    }
    const nextIndex = this.nextIndex(direction)

    this.closeCurrentModal(this._current)

    /**
     *  Disable move up when reach description field
     */
    if (
      this._current === ProductRef.Description &&
      nextIndex === ProductRef.Description &&
      direction === Direction.Up
    ) {
      return
    }

    if (this._current === ProductRef.SelectCurrency) {
      this.closeCurrentModal(ProductRefAndroid.SelectCurrencyPickerList)
    }
    if (this._current === ProductRef.CurrencySamplePrice) {
      this.closeCurrentModal(ProductRefAndroid.SelectCurrencyPickerList)
    }

    if (this._current === ProductRef.CustomField) {
      this.closeCurrencyExtendField()
    }

    if (this._current === ProductRef.PriceMatrix) {
      this.closeCurrentModalPriceMatrix()
    }

    if (nextIndex === ProductRef.CustomField) {
      this.moveCustomFieldHandler()
      return
    }

    if (nextIndex === ProductRef.PriceMatrix) {
      this.movePriceMatrixHandler()
      return
    }

    InteractionManager.runAfterInteractions(() => {
      this.movePriceCurrencyAndSamplePriceCurrency(nextIndex)
    })
  }

  checkOpenUnitPicker = (key: ProductRef | ProductRefAndroid) => {
    switch (key) {
      case ProductRef.MasterUnit:
      case ProductRef.InnerUnit: {
        const isInner = key === ProductRef.InnerUnit
        this._subjectCarton.next({
          openInnerUnit: isInner,
          openInnerWeightUnit: false,
          openMasterUnit: !isInner,
          openMasterWeightUnit: false,
        })
        break
      }
      case ProductRef.MasterWeightUnit:
      case ProductRef.InnerWeightUnit: {
        const isInner = key === ProductRef.InnerWeightUnit
        this._subjectCarton.next({
          openInnerUnit: false,
          openInnerWeightUnit: isInner,
          openMasterUnit: false,
          openMasterWeightUnit: !isInner,
        })
        break
      }
      default: {
        break
      }
    }
  }

  onMoveUpDow = (
    key: ProductRef | ProductRefAndroid,
    isMoveHandle = MoveHandle,
    customField?: customField
  ) => {
    this.checkOpenUnitPicker(key)
    if (key !== ProductRefAndroid.SelectCurrencyPickerList) {
      this._current = key
    }

    const product = this._data.get(ProductData.Product)

    if (isMoveHandle && isMoveHandle.isMovePrice) {
      this.navigate('SelectCurrencyPicker', {
        product,
        isCurrency: { isPrice: isMoveHandle.isPrice },
      })
      return
    }

    if (isMoveHandle && isMoveHandle.isMovePriceMatrix) {
      this.navigate('SelectCurrencyPicker', {
        product,
        isCurrency: {
          isMatrixPrice: isMoveHandle.isMatrixPrice,
          indexMatrixPrice: isMoveHandle.indexCurrency,
        },
      })
      return
    }

    if (isMoveHandle && isMoveHandle.isMoveSamplePrice) {
      this.navigate('SelectCurrencyPicker', {
        product,
        isCurrency: { isSamplePrice: isMoveHandle.isSamplePrice },
      })
      return
    }

    if (
      customField &&
      customField.isCustomField &&
      !customField.movePickerList
    ) {
      this._currencyExtendOld = customField.indexOfFieldToUpDow
      if (
        !this.indexCurrencyExtendOnPress.has(customField.indexOfFieldToUpDow)
      ) {
        this.countCurrencyExtendOnPress++
      }
      this.indexCurrencyExtendOnPress.set(
        customField.indexOfFieldToUpDow,
        customField.indexOfFieldToUpDow
      )
      this.navigate('SelectCurrencyPicker', {
        isProductToSetRef: true,
        isCustomField: customField.isCustomField,
        indexOfField: customField.indexOfField,
        indexOfFieldToUpDow: customField.indexOfFieldToUpDow,
        setValue: customField.setValue,
        currency: customField.currency,
      })
      return
    }

    if (
      customField &&
      customField.isCustomField &&
      customField.movePickerList
    ) {
      this.navigate('SelectCurrencyPickerList', {
        indexOfField: customField.indexOfField,
        setValue: customField.setValue,
        currency: customField.currency,
        isCustomField: customField.isCustomField,
      })
      return
    }
  }

  open = (
    key: ProductRef | ProductRefAndroid,
    isCurrency?: object,
    hideActionBar?: boolean,
    hideUpDownClear?: boolean
  ) => {
    this.checkOpenUnitPicker(key)
    if (key !== ProductRefAndroid.SelectCurrencyPickerList) {
      this._current = key
    }

    const product = this._data.get(ProductData.Product)

    switch (key) {
      case ProductRef.Description: {
        const onSave = this._data.get(ProductData.DescriptionOnSave)

        this.navigate('TextEditorModal', {
          onSave,
          selectedItem: product,
        })
        break
      }

      case ProductRef.SelectTags: {
        this.navigate<{
          selectedItem: Product
          type: string
        }>('SelectMultiTag', {
          selectedItem: product,
          type: 'Product',
        })
        break
      }

      case ProductRef.SelectProjects: {
        this.navigate<{
          selectedItem: Product
          type: string
          hideUpDownClear
        }>('SelectMultiProject', {
          hideUpDownClear,
          selectedItem: product,
          type: 'Product',
        })
        break
      }

      case ProductRef.SelectSupplier: {
        this.navigate<{
          product: Product
          productsId: string[]
          hideActionBar: boolean
          hideUpDownClear: boolean
        }>('SelectSupplierPicker', {
          product,
          hideActionBar,
          hideUpDownClear,
          productsId: this.productsId,
        })
        break
      }

      case ProductRef.SelectCategory: {
        this.navigate<{
          product: Product
          productsId: string[]
          hideActionBar: boolean
        }>('SelectCategoryPicker', {
          product,
          hideActionBar,
          productsId: this.productsId,
        })
        break
      }

      case ProductRef.SelectStatus: {
        this.navigate<{
          product: Product
          productsId: string[]
          hideActionBar: boolean
          hideUpDownClear: boolean
        }>('SelectStatusPickerProduct', {
          product,
          hideActionBar,
          hideUpDownClear,
          productsId: this.productsId,
        })
        break
      }

      case ProductRefAndroid.SelectCurrencyPickerList: {
        this.navigate<{
          product: Product
          isCurrency: any
        }>('SelectCurrencyPickerList', {
          product,
          isCurrency,
        })
        break
      }

      case ProductRef.SelectCurrency: {
        this.navigate<{
          product: Product
          isCurrency: any
          hideUpDownClear: boolean
        }>('SelectCurrencyPicker', {
          product,
          isCurrency,
          hideUpDownClear,
        })
        break
      }

      case ProductRef.SelectHarbour: {
        this.navigate<{
          selectedItem: Product
          type: string
        }>('SelectHarbourPicker', {
          selectedItem: product,
          type: 'Product',
        })
        break
      }

      case ProductRef.SelectIncoTerm: {
        this.navigate<{
          selectedItem: Product
          type: string
        }>('SelectIncoTermPicker', {
          selectedItem: product,
          type: 'Product',
        })
        break
      }

      case ProductRef.SelectEvent: {
        this.navigate<{
          product: Product
        }>('SelectEventPicker', {
          product,
        })
        break
      }

      case ProductRef.SelectAssignee: {
        this.navigate<{
          product: Product
          isProduct: boolean
        }>('SelectUserPicker', {
          product,
          isProduct: true,
        })
        break
      }

      case ProductRef.MasterUnit:
      case ProductRef.InnerUnit: {
        this.navigate<{
          product: Product
          packagingName: string
          type: string
        }>('SelectUnitPicker', {
          product,
          packagingName:
            key === ProductRef.InnerUnit ? 'innerCarton' : 'masterCarton',
          type: 'metric',
        })
        break
      }

      case ProductRef.MasterWeightUnit:
      case ProductRef.InnerWeightUnit: {
        this.navigate<{
          product: Product
          packagingName: string
          type: string
        }>('SelectUnitPicker', {
          product,
          packagingName:
            key === ProductRef.InnerWeightUnit ? 'innerCarton' : 'masterCarton',
          type: 'weight',
        })
        break
      }

      case ProductRef.PriceMatrix: {
        this.navigate<{
          product: Product
          isCurrency: any
        }>('SelectCurrencyPicker', {
          product,
          isCurrency,
        })
        break
      }

      case ProductRef.CurrencySamplePrice: {
        this.navigate<{
          product: Product
          isCurrency: any
        }>('SelectCurrencyPicker', {
          product,
          isCurrency,
        })
        break
      }

      default: {
        const currentRef = this._refs.get(key)
        if (this._refs.has(key) && currentRef && currentRef.focus()) {
          this._refs.get(key).focus()
        }
        break
      }
    }
  }

  close = (key: ProductRef) => {
    switch (key) {
      case ProductRef.Description: {
        if (this._refs.has(key)) {
          this._refs.get(key).close()
        }
        break
      }
      case ProductRef.MasterUnit:
      case ProductRef.InnerUnit:
      case ProductRef.MasterWeightUnit:
      case ProductRef.InnerWeightUnit: {
        this._subjectCarton.next({
          openInnerUnit: false,
          openInnerWeightUnit: false,
          openMasterUnit: false,
          openMasterWeightUnit: false,
        })
        break
      }
    }
  }
}

export const productNavigation = new ProductNavigation()
