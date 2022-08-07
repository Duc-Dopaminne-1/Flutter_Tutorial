import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import { InteractionManager } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'
import { Direction } from '@/common/constants/Direction'
import { ProductRef } from '@/navigation/productNavigation'

export enum SupplierData {
  Supplier,
  DescriptionOnSave,
}

export enum SupplierRef {
  Description,
  SelectMultiCategory,
  SelectTags,
  AliasName,
  LegalName,
  MOQ,
  LeadTime,
  SelectCountry,
  Web,
  Email,
  PhoneNumber,
  SelectHarbour,
  SelectIncoTerm,
  SelectAssignee,
}

export class SupplierNavigation {
  private _refs = new Map()
  private _data = new Map()
  private _current = -1
  private suppliersId = []

  set current(value) {
    this._current = value
  }

  set supplierId(value) {
    this.suppliersId = value
  }

  get isModal() {
    // return (
    //   [
    //     SupplierRef.SelectTags,
    //     SupplierRef.SelectSupplier,
    //     SupplierRef.SelectStatus,
    //   ].indexOf(this._current) > -1
    // )
    return false
  }

  private navigate = (routeName: string, params: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  setData = (key: SupplierData, value) => {
    this._data.set(key, value)
  }

  setRef = (key: SupplierRef, value) => {
    // this._current = key
    this._refs.set(key, value)
  }

  clear = () => {
    this._refs.clear()
    this._data.clear()
    this._current = -1
  }

  clearHandler = () => {
    const currentRef = this._refs.get(this._current)
    currentRef && currentRef.clear()
  }

  nextIndex = (direction: Direction) => {
    const nextIndex =
      direction === Direction.Down ? this._current + 1 : this._current - 1

    if (nextIndex < 0) {
      return 0
    }

    return nextIndex
  }

  closeCurrentModal = (index: number) => {
    const currentRef = this._refs.get(index)

    if (this._refs.has(index) && currentRef && currentRef.close) {
      currentRef.close()
      // Keyboard.dismiss()
    }
  }

  closeAllModal = () => {
    this.closeCurrentModal(this._current)
  }

  moveHandler = (direction: Direction) => {
    const nextIndex = this.nextIndex(direction)

    this.closeCurrentModal(this._current)

    if (
      this._current === SupplierRef.Description &&
      nextIndex === SupplierRef.Description &&
      direction === Direction.Up
    ) {
      return
    }

    InteractionManager.runAfterInteractions(() => {
      this.open(nextIndex)
    })
  }

  open = (key: SupplierRef, hideUpDownClear?: boolean) => {
    this._current = key

    const supplier = this._data.get(SupplierData.Supplier)

    switch (key) {
      case SupplierRef.Description: {
        const onSave = this._data.get(SupplierData.DescriptionOnSave)

        this.navigate('TextEditorModal', {
          onSave,
          selectedItem: supplier,
        })
        break
      }
      case SupplierRef.SelectMultiCategory: {
        this.navigate('SelectMultiCategory', {
          hideUpDownClear,
          selectedItem: supplier,
          type: 'Supplier',
        })
        break
      }
      case SupplierRef.SelectTags: {
        this.navigate('SelectMultiTag', {
          selectedItem: supplier,
          type: 'Supplier',
        })
        break
      }

      case SupplierRef.SelectCountry: {
        this.navigate('SelectCountryPicker', {
          selectedItem: supplier,
        })
        break
      }

      case SupplierRef.SelectHarbour: {
        this.navigate('SelectHarbourPicker', {
          selectedItem: supplier,
          type: 'Supplier',
        })
        break
      }

      case SupplierRef.SelectIncoTerm: {
        this.navigate('SelectIncoTermPicker', {
          selectedItem: supplier,
          type: 'Supplier',
        })
        break
      }

      case SupplierRef.SelectAssignee: {
        this.navigate('SelectUserPicker', {
          supplier,
          isSupplier: true,
        })
        break
      }

      default: {
        if (this._refs.has(key)) {
          this._refs.get(key).focus()
        }
        break
      }
    }
  }

  close = (key: SupplierRef) => {
    switch (key) {
      case SupplierRef.Description: {
        if (this._refs.has(key)) {
          this._refs.get(key).close()
        }
        break
      }
    }
  }
}

export const supplierNavigation = new SupplierNavigation()
