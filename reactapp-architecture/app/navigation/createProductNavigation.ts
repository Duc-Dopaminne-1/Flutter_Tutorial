import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import { InteractionManager } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'
import { Subject } from 'rxjs'
import { Direction } from '@/common/constants/Direction'
import { ProductRef } from '@/navigation/productNavigation'

export enum CreateProductData {
  SetValue,
  Description,
  Tags,
  Projects,
  Currency,
  Status,
  InnerUnit,
  InnerWeightUnit,
  MasterUnit,
  MasterWeightUnit,
  priceMatrix,
  currencySamplePrice,
  Product,
  DescriptionOnSave,
  indexOfField,
  indexOfFieldToUpDow,
  setValue,
  currencyExtendField,
  totalPriceOfCustomField,
  isCustomField,
}

export enum CreateProductRef {
  Description,
  SelectSupplier,
  SelectCategory,
  SelectTags,
  SelectProjects,

  Price,
  SelectCurrency,
  MOQ,
  MOQDescription,
  Name,
  SelectStatus,
  SelectHarbour,
  SelectIncoTerm,
  SelectEvent,
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

export enum CreateProductRefAndroid {
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

export class CreateProductNavigation {
  private _refs = new Map()
  private _priceMatrixRefs = new Map()
  private _priceIndexMatrixRefs = new Map()
  private _customFieldRefs = new Map()
  private _data = new Map()
  private _current = -1
  private _currentPriceMatrix = 0
  private _currentPriceMatrixOld = 0
  private _indexCurrencyExtendFieldRefs = new Map()
  private _currencyExtendOld = 0
  private _currentCustomField = 0
  private _subject = new Subject()
  private _subjectCarton = new Subject()
  private _PriceMatrixRefTotal = 0
  private indexCurrencyExtendOnPress = new Map()
  private countCurrencyExtendOnPress = 0

  set current(value) {
    this._current = value
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

  get PriceMatrixRefTotal() {
    return this._PriceMatrixRefTotal
  }

  get CustomFieldRefTotal() {
    const totalPriceOfCustomField = this._data.get(
      CreateProductData.totalPriceOfCustomField
    )
    return (
      this._customFieldRefs.size +
      totalPriceOfCustomField -
      this.countCurrencyExtendOnPress
    )
  }

  setPriceMatrixRefTotal = key => {
    this._PriceMatrixRefTotal = key
  }

  setIndexPriceMatrixRef = (key, value) => {
    this._priceIndexMatrixRefs.set(key, value)
  }

  setCustomFieldRef = (key, value) => {
    this._customFieldRefs.set(key, value)
  }

  get subject() {
    return this._subject
  }

  get subjectCarton() {
    return this._subjectCarton
  }

  private navigate = (routeName: string, params: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  setData = (key, value) => {
    this._data.set(key, value)
  }

  setRef = (key, value) => {
    // this._current = key
    this._refs.set(key, value)
  }

  setIndexCurrencyExtenddRefs = (key, value) => {
    // this._current = key
    this._indexCurrencyExtendFieldRefs.set(key, value)
  }

  setPriceMatrixRef = (key, value) => {
    // this._current = key
    this._priceMatrixRefs.set(key, value)
  }

  clear = () => {
    this._refs.clear()
    this._priceMatrixRefs.clear()
    this._priceIndexMatrixRefs.clear()
    this._data.clear()
    this._current = -1
    this._currentPriceMatrix = 0
    this._currentPriceMatrixOld = 0
    this._currentCustomField = 0
    this._indexCurrencyExtendFieldRefs.clear()
    this._currencyExtendOld = 0
    this._PriceMatrixRefTotal = 0
    this.indexCurrencyExtendOnPress.clear()
    this.countCurrencyExtendOnPress = 0
  }

  clearHandler = () => {
    if (
      (this._current >= CreateProductRef.PriceMatrix &&
        this._current !== CreateProductRef.SamplePrice) ||
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
      this._current === CreateProductRef.CustomField &&
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
    const nextIndex =
      direction === Direction.Down ? this._current + 1 : this._current - 1

    // Custom Field check
    const isCustomField = this._data.get(CreateProductData.isCustomField)

    if (!isCustomField) {
      if (
        nextIndex === CreateProductRef.CustomField &&
        direction === Direction.Down
      ) {
        return nextIndex + 1
      }
      if (
        nextIndex === CreateProductRef.CustomField &&
        direction !== Direction.Down
      ) {
        return nextIndex - 1
      }
    }

    if (this._current < CreateProductRef.CustomField) {
      this._currentCustomField = 0
    }
    this._currentCustomField = this.nextCustomFieldIndex(direction)
    const totalPriceOfCustomField = this._data.get(
      CreateProductData.totalPriceOfCustomField
    )

    if (
      this._current === CreateProductRef.CustomField ||
      nextIndex === CreateProductRef.CustomField
    ) {
      if (
        this._currentCustomField <=
          this._customFieldRefs.size +
            totalPriceOfCustomField -
            this.countCurrencyExtendOnPress &&
        this._currentCustomField > 0
      ) {
        return CreateProductRef.CustomField
      }
    }

    // Price Matrix check
    if (this._current < CreateProductRef.PriceMatrix) {
      this._currentPriceMatrix = 0
    }

    this._currentPriceMatrix = this.nextPriceMatrixIndex(direction)
    if (
      this._current === CreateProductRef.PriceMatrix ||
      nextIndex === CreateProductRef.PriceMatrix
    ) {
      if (
        this._currentPriceMatrix <= this._PriceMatrixRefTotal &&
        this._currentPriceMatrix > 0
      ) {
        return CreateProductRef.PriceMatrix
      }
    }

    if (
      this._currentPriceMatrix ===
      this._PriceMatrixRefTotal +
        (CreateProductRef.SamplePrice - CreateProductRef.PriceMatrix)
    ) {
      return CreateProductRef.SamplePrice
    }

    if (
      this._currentPriceMatrix ===
      this._PriceMatrixRefTotal +
        (CreateProductRef.CurrencySamplePrice - CreateProductRef.PriceMatrix)
    ) {
      return CreateProductRef.CurrencySamplePrice
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
    this.onMoveUpDow(CreateProductRef.PriceMatrix, move)
  }

  movePriceMatrixHandler = () => {
    if (
      this._priceMatrixRefs.has(this._currentPriceMatrix) ||
      this._priceIndexMatrixRefs.has(this._currentPriceMatrix)
    ) {
      this._current = CreateProductRef.PriceMatrix

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
    const indexOfField = this._data.get(CreateProductData.indexOfField)
    const setValue = this._data.get(CreateProductData.setValue)
    const currencyExtendField = this._data.get(
      CreateProductData.currencyExtendField
    )
    this.navigate('SelectCurrencyPicker', {
      setValue,
      isCustomField: true,
      isCreateProductToSetRef: true,
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
      this._current = CreateProductRef.CustomField

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

  movePriceCurrencyAndSamplePriceCurrency = nextIndex => {
    if (nextIndex === CreateProductRef.SelectCurrency) {
      const move = {
        ...MoveHandle,
        isMovePrice: true,
        isPrice: true,
      }
      this.onMoveUpDow(nextIndex, move)
      return
    }
    if (nextIndex === CreateProductRef.CurrencySamplePrice) {
      const move = {
        ...MoveHandle,
        isMoveSamplePrice: true,
        isSamplePrice: true,
      }
      this.onMoveUpDow(nextIndex, move)
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
      this._current === CreateProductRef.Description &&
      nextIndex === CreateProductRef.Description &&
      direction === Direction.Up
    ) {
      return
    }

    if (this._current === CreateProductRef.SelectCurrency) {
      this.closeCurrentModal(CreateProductRefAndroid.SelectCurrencyPickerList)
    }

    if (this._current === CreateProductRef.CurrencySamplePrice) {
      this.closeCurrentModal(CreateProductRefAndroid.SelectCurrencyPickerList)
    }

    if (this._current === ProductRef.CustomField) {
      this.closeCurrencyExtendField()
    }

    if (this._current === CreateProductRef.PriceMatrix) {
      this.closeCurrentModalPriceMatrix()
    }

    if (nextIndex === ProductRef.CustomField) {
      this.moveCustomFieldHandler()
      return
    }

    if (nextIndex === CreateProductRef.PriceMatrix) {
      this.movePriceMatrixHandler()
      return
    }

    InteractionManager.runAfterInteractions(() => {
      this.movePriceCurrencyAndSamplePriceCurrency(nextIndex)
    })
  }

  checkOpenUnitPicker = (key: CreateProductRef | CreateProductRefAndroid) => {
    switch (key) {
      case CreateProductRef.MasterUnit:
      case CreateProductRef.InnerUnit: {
        const isInner = key === CreateProductRef.InnerUnit
        this._subjectCarton.next({
          openInnerUnit: isInner,
          openInnerWeightUnit: false,
          openMasterUnit: !isInner,
          openMasterWeightUnit: false,
        })
        break
      }
      case CreateProductRef.MasterWeightUnit:
      case CreateProductRef.InnerWeightUnit: {
        const isInner = key === CreateProductRef.InnerWeightUnit
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
    key: CreateProductRef | CreateProductRefAndroid,
    isMoveHandle = MoveHandle,
    customField?: customField
  ) => {
    this.checkOpenUnitPicker(key)
    if (key !== CreateProductRefAndroid.SelectCurrencyPickerList) {
      this._current = key
    }
    const currencySamplePrice = this._data.get(
      CreateProductData.currencySamplePrice
    )
    const currency = this._data.get(CreateProductData.Currency)
    const setValue = this._data.get(CreateProductData.SetValue)

    if (isMoveHandle && isMoveHandle.isMovePrice) {
      this.navigate('SelectCurrencyPicker', {
        setValue,
        currency,
        isCreateProduct: true,
        isCurrency: { isPrice: isMoveHandle.isPrice },
      })
      return
    }
    if (isMoveHandle && isMoveHandle.isMovePriceMatrix) {
      const priceMatrix = this._data.get(CreateProductData.priceMatrix)
      this.navigate('SelectCurrencyPicker', {
        setValue,
        priceMatrix,
        isCreateProduct: true,
        isCurrency: {
          isMatrixPrice: isMoveHandle.isMatrixPrice,
          indexMatrixPrice: isMoveHandle.indexCurrency,
        },
      })
      return
    }
    if (isMoveHandle && isMoveHandle.isMoveSamplePrice) {
      this.navigate('SelectCurrencyPicker', {
        setValue,
        currencySamplePrice,
        isCreateProduct: true,
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
        isCreateProductToSetRef: true,
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
    key: CreateProductRef | CreateProductRefAndroid,
    isCurrency?: object,
    priceMatrix?: any
  ) => {
    this.checkOpenUnitPicker(key)
    if (key !== CreateProductRefAndroid.SelectCurrencyPickerList) {
      this._current = key
    }

    const setValue = this._data.get(CreateProductData.SetValue)
    const description = this._data.get(CreateProductData.Description)
    const tags = this._data.get(CreateProductData.Tags)
    const projects = this._data.get(CreateProductData.Projects)
    const status = this._data.get(CreateProductData.Status)
    const innerUnit = this._data.get(CreateProductData.InnerUnit)
    const innerWeightUnit = this._data.get(CreateProductData.InnerWeightUnit)
    const masterUnit = this._data.get(CreateProductData.MasterUnit)
    const masterWeightUnit = this._data.get(CreateProductData.MasterWeightUnit)

    switch (key) {
      case CreateProductRef.Description: {
        this.navigate('TextEditorModal', {
          setValue,
          description,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectSupplier: {
        this.navigate('SelectSupplierPicker', {
          setValue,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectCategory: {
        this.navigate('SelectCategoryPicker', {
          setValue,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectHarbour: {
        this.navigate('SelectHarbourPicker', {
          setValue,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectIncoTerm: {
        this.navigate('SelectIncoTermPicker', {
          setValue,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectEvent: {
        this.navigate('SelectEventPicker', {
          setValue,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectTags: {
        this.navigate('SelectMultiTag', {
          setValue,
          tags,
          isCreateProduct: true,
          type: 'CreateProduct',
        })
        break
      }

      case CreateProductRef.SelectProjects: {
        this.navigate('SelectMultiProject', {
          setValue,
          projects,
          isCreateProduct: true,
          type: 'CreateProduct',
        })
        break
      }

      case CreateProductRef.SelectStatus: {
        this.navigate('SelectStatusPickerProduct', {
          setValue,
          status,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRefAndroid.SelectCurrencyPickerList: {
        this.navigate('SelectCurrencyPickerList', {
          setValue,
          isCurrency,
          priceMatrix,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.SelectCurrency: {
        this.navigate('SelectCurrencyPicker', {
          setValue,
          isCurrency,
          priceMatrix,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.MasterUnit:
      case CreateProductRef.InnerUnit: {
        const isInner = key === CreateProductRef.InnerUnit
        this.navigate('SelectUnitPicker', {
          setValue,
          isCreateProduct: true,
          value: isInner ? innerUnit : masterUnit,
          packagingName: isInner ? 'innerCarton' : 'masterCarton',
          type: 'metric',
        })
        break
      }

      case CreateProductRef.MasterWeightUnit:
      case CreateProductRef.InnerWeightUnit: {
        const isInner = key === CreateProductRef.InnerWeightUnit
        this.navigate('SelectUnitPicker', {
          setValue,
          isCreateProduct: true,
          value: isInner ? innerWeightUnit : masterWeightUnit,
          packagingName:
            key === CreateProductRef.InnerWeightUnit
              ? 'innerCarton'
              : 'masterCarton',
          type: 'weight',
        })
        break
      }

      case CreateProductRef.PriceMatrix: {
        this.navigate('SelectCurrencyPicker', {
          setValue,
          isCurrency,
          priceMatrix,
          isCreateProduct: true,
        })
        break
      }

      case CreateProductRef.CurrencySamplePrice: {
        this.navigate('SelectCurrencyPicker', {
          setValue,
          isCurrency,
          isCreateProduct: true,
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

  close = (key: CreateProductRef) => {
    switch (key) {
      case CreateProductRef.Description: {
        if (this._refs.has(key)) {
          this._refs.get(key).close()
        }
        break
      }
      case CreateProductRef.MasterUnit:
      case CreateProductRef.InnerUnit:
      case CreateProductRef.MasterWeightUnit:
      case CreateProductRef.InnerWeightUnit: {
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

export const createProductNavigation = new CreateProductNavigation()
