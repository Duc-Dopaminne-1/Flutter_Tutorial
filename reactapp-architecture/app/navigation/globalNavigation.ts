import { navigation } from '@/navigation/navigation'
import { devices } from '@/vars'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { NavigationParams } from 'react-navigation'

export enum GlobalNavigationData {
  SetValue,
}

export enum GlobalNavigationRef {
  SelectSupplier,
}

export class GlobalNavigation {
  private _refs = new Map()
  private _data = new Map()

  private navigate = (routeName: string, params: NavigationParams) => {
    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()

    return navigation.navigate(routeName, params)
  }

  setData = (key, value) => {
    this._data.set(key, value)
  }

  setRef = (key, value) => {
    this._refs.set(key, value)
  }

  closeAll = () => {
    const currentRef = this._refs.get(GlobalNavigationRef.SelectSupplier)

    if (
      this._refs.has(GlobalNavigationRef.SelectSupplier) &&
      currentRef &&
      currentRef.close
    ) {
      currentRef.close()
    }
  }

  open = (key: GlobalNavigationRef) => {
    const setValue = this._data.get(GlobalNavigationData.SetValue)

    switch (key) {
      case GlobalNavigationRef.SelectSupplier: {
        this.navigate('SelectSupplierPicker', {
          setValue,
          isCreateProduct: true,
          hideActionBar: true,
          createContactScreen: true,
        })
        break
      }
      default:
        break
    }
  }
}

export const globalNavigation = new GlobalNavigation()
