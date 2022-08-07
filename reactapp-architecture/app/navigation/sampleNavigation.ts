import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import { InteractionManager, Keyboard } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'
import { Subject } from 'rxjs'
import { Direction } from '@/common/constants/Direction'
import { Sample } from '@/models/team'

export enum SampleData {
  Sample,
  DescriptionOnSave,
  AssigneeSelect,
  indexOfField,
  indexOfFieldToUpDow,
  setValue,
  currencyExtendField,
  totalPriceOfCustomField,
  hasCustomField,
}

export enum SampleRef {
  Description,
  Reference,
  Name,
  Price,
  SelectCurrency,
  Assignee,
  CustomField,

  SelectProduct,
  SelectSupplier,
  SelectStatus,
}

export enum SampleRefAndroid {
  SelectCurrencyPickerList = 100,
}

const MoveHandle = {
  isMovePrice: false,
  isMoveSamplePrice: false,
  isPrice: false,
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

export class SampleNavigation {
  private _refs = new Map()
  private _customFieldRefs = new Map()
  private _data = new Map()
  private _current = -1
  private _currentCustomField = 0
  private _indexCurrencyExtendFieldRefs = new Map()
  private _currencyExtendOld = 0
  private _subject = new Subject()
  private indexCurrencyExtendOnPress = new Map()
  private countCurrencyExtendOnPress = 0
  private samplesId = []

  set current(value) {
    this._current = value
  }

  set sampleId(value) {
    this.samplesId = value
  }

  set currentCustomField(value) {
    this._currentCustomField = value
  }

  get subject() {
    return this._subject
  }

  get isModal() {
    return false
  }

  private navigate = <T extends NavigationParams>(
    routeName: string,
    params: T
  ) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  setData = (key: SampleData, value) => {
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

  setCustomFieldRef = (key, value) => {
    this._customFieldRefs.set(key, value)
  }

  clear = () => {
    this._refs.clear()
    this._data.clear()
    this._current = -1
    this._currentCustomField = 0
    this._indexCurrencyExtendFieldRefs.clear()
    this._currencyExtendOld = 0
    this.indexCurrencyExtendOnPress.clear()
    this.countCurrencyExtendOnPress = 0
  }

  clearHandler = () => {
    if (
      this._current === SampleRef.CustomField &&
      this._customFieldRefs.has(this._currentCustomField)
    ) {
      this._customFieldRefs.get(this._currentCustomField).clear()
    }

    const currentRef = this._refs.get(this._current)
    currentRef && currentRef.clear()
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

    // Custom Field check
    if (this._current < SampleRef.CustomField) {
      this._currentCustomField = 0
    }
    this._currentCustomField = this.nextCustomFieldIndex(direction)
    const totalPriceOfCustomField = this._data.get(
      SampleData.totalPriceOfCustomField
    )
    const hasCustomField = this._data.get(SampleData.hasCustomField)

    // Down
    if (
      hasCustomField &&
      (this._current === SampleRef.CustomField ||
        nextIndex === SampleRef.CustomField)
    ) {
      if (
        this._currentCustomField <=
          this._customFieldRefs.size +
            totalPriceOfCustomField -
            this.countCurrencyExtendOnPress &&
        this._currentCustomField > 0
      ) {
        return SampleRef.CustomField
      }
    }

    /* Up */
    if (!hasCustomField && direction === Direction.Up) {
      // nextIndex = nextIndex - 1 // Put back after adding extendedFields
    }

    if (nextIndex < 0) {
      return 0
    }

    return nextIndex
  }

  moveCurrencyExtendField = () => {
    const indexOfField = this._data.get(SampleData.indexOfField)
    const setValue = this._data.get(SampleData.setValue)
    const currencyExtendField = this._data.get(SampleData.currencyExtendField)
    const sample = this._data.get(SampleData.Sample)

    this.navigate('SelectCurrencyPicker', {
      setValue,
      sample,
      isSampleToSetRef: true,
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
      this._current = SampleRef.CustomField

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

  closeAllModal = () => {
    this.closeCurrentModal(this._current)
    this.closeCurrencyExtendField()
  }

  movePriceCurrencyAndSamplePriceCurrency = nextIndex => {
    if (nextIndex === SampleRef.SelectCurrency) {
      const move = {
        ...MoveHandle,
        isMovePrice: true,
        isPrice: true,
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
    const nextIndex = this.nextIndex(direction)
    this.closeCurrentModal(this._current)

    /**
     *  Disable move up when reach description field
     */
    if (
      this._current === SampleRef.Description &&
      nextIndex === SampleRef.Description &&
      direction === Direction.Up
    ) {
      return
    }

    if (this._current === SampleRef.SelectCurrency) {
      this.closeCurrentModal(SampleRefAndroid.SelectCurrencyPickerList)
    }

    if (this._current === SampleRef.CustomField) {
      this.closeCurrencyExtendField()
    }

    if (nextIndex === SampleRef.CustomField) {
      this.moveCustomFieldHandler()
      return
    }

    InteractionManager.runAfterInteractions(() => {
      this.movePriceCurrencyAndSamplePriceCurrency(nextIndex)
    })
  }

  onMoveUpDow = (
    key: SampleRef | SampleRefAndroid,
    isMoveHandle = MoveHandle,
    customField?: customField
  ) => {
    if (key !== SampleRefAndroid.SelectCurrencyPickerList) {
      this._current = key
    }

    const sample = this._data.get(SampleData.Sample)

    if (isMoveHandle && isMoveHandle.isMovePrice) {
      this.navigate('SelectCurrencyPicker', {
        sample,
        isSampleToSetRef: true,
        isCurrency: { isPrice: isMoveHandle.isPrice },
      })
      return
    }

    if (isMoveHandle && isMoveHandle.isMoveSamplePrice) {
      this.navigate('SelectCurrencyPicker', {
        sample,
        isSampleToSetRef: true,
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
        sample,
        isSampleToSetRef: true,
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
        sample,
        indexOfField: customField.indexOfField,
        setValue: customField.setValue,
        currency: customField.currency,
        isCustomField: customField.isCustomField,
        isSample: true,
      })
      return
    }
  }

  open = (
    key: SampleRef | SampleRefAndroid,
    isCurrency?: object,
    hideActionBar?: boolean,
    hideUpDownClear?: boolean
  ) => {
    if (key !== SampleRefAndroid.SelectCurrencyPickerList) {
      this._current = key
    }

    const sample = this._data.get(SampleData.Sample)

    switch (key) {
      case SampleRef.Description: {
        const onSave = this._data.get(SampleData.DescriptionOnSave)

        this.navigate('TextEditorModal', {
          onSave,
          selectedItem: sample,
          isCreateProduct: false,
          withoutNavigation: true,
        })
        break
      }

      case SampleRef.SelectSupplier: {
        this.navigate<{
          sample: Sample
          samplesId: string[]
          hideActionBar: boolean
        }>('SelectSupplierPicker', {
          sample,
          hideActionBar,
          samplesId: this.samplesId,
        })
        break
      }

      case SampleRef.Assignee: {
        const onUserSelect = this._data.get(SampleData.AssigneeSelect)
        this.navigate('SelectUserPicker', {
          onUserSelect,
          isSample: true,
          selected: sample ? sample.ssignee : undefined,
        })
        break
      }

      case SampleRef.SelectStatus: {
        this.navigate<{
          sample: Sample
          samplesId: string[]
          hideActionBar: boolean
          hideUpDownClear: boolean
        }>('SelectStatusPickerSample', {
          sample,
          hideActionBar,
          hideUpDownClear: true,
          samplesId: this.samplesId,
        })
        break
      }

      case SampleRefAndroid.SelectCurrencyPickerList: {
        this.navigate<{
          sample: Sample
          isCurrency: any
          isSample: boolean
          isCreateProduct: boolean
        }>('SelectCurrencyPickerList', {
          sample,
          isCurrency,
          isSample: true,
          isCreateProduct: false,
        })
        break
      }

      case SampleRef.SelectCurrency: {
        this.navigate<{
          sample: Sample
          isCurrency: any
          hideUpDownClear: boolean
          isSampleToSetRef: boolean
          getSample?: () => Sample
        }>('SelectCurrencyPicker', {
          sample,
          isCurrency,
          hideUpDownClear,
          isSampleToSetRef: true,
          getSample: () => this._data.get(SampleData.Sample),
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

  close = (key: SampleRef) => {
    switch (key) {
      case SampleRef.Description: {
        if (this._refs.has(key)) {
          this._refs.get(key).close()
        }
        break
      }
    }
  }
}

export const sampleNavigation = new SampleNavigation()
