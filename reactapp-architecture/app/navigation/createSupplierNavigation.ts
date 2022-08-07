import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import { InteractionManager } from 'react-native'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'

export enum CreateSupplierData {
  Supplier,
}

export enum CreateSupplierRef {
  Create,
}

export class CreateSupplierNavigation {
  private _refs = new Map()
  private _data = new Map()
  private _current = -1

  set current(value) {
    this._current = value
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

  private navigate = (routeName: string, params?: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  setData = (key: CreateSupplierData, value) => {
    this._data.set(key, value)
  }

  setRef = (key: CreateSupplierRef, value) => {
    // this._current = key
    this._refs.set(key, value)
  }

  clear = () => {
    this._refs.clear()
    this._data.clear()
    this._current = -1
  }

  open = (key: CreateSupplierRef) => {
    this._current = key

    switch (key) {
      case CreateSupplierRef.Create: {
        this.navigate('CreateSupplierPicker')
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

  close = (key: CreateSupplierRef, params: any = {}) => {
    switch (key) {
      case CreateSupplierRef.Create: {
        if (this._refs.has(key)) {
          this._refs.get(key).close()
          let supplier = params.supplier
          if (!supplier) {
            try {
              // When the supplier is deleted this._data.get() will throw an error
              supplier = this._data.get(CreateSupplierData.Supplier)
            } catch (error) {}
          }

          if (!supplier || !supplier.isValid() || supplier.delete) {
            break
          }

          this.navigate('SupplierInfoScreen', {
            supplierId: supplier.id,
          })
        }
        break
      }
    }
  }
}

export const createSupplierNavigation = new CreateSupplierNavigation()
