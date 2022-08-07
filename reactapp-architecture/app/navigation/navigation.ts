import { productNavigation } from '@/navigation/productNavigation'
import { supplierNavigation } from '@/navigation/supplierNavigation'
import { sampleNavigation } from './sampleNavigation'
import {
  NavigationActions,
  NavigationParams,
  NavigationScreenProp,
} from 'react-navigation'
import { createProductNavigation } from '@/navigation/createProductNavigation'
import { Direction } from '@/common/constants/Direction'

export enum Screen {
  ProductInfo,
  SupplierInfo,
  CreateProduct,
  SampleInfo,
}

export class Navigation {
  private _navigator: NavigationScreenProp<any, any>
  private _currentScreen: Screen
  private _previousScreen: Screen

  set topLevelNavigator(navigator) {
    this._navigator = navigator
  }

  get navigator() {
    return this._navigator
  }

  set currentScreen(value: Screen) {
    if (!this._previousScreen) {
      this._previousScreen = value
    } else {
      this._previousScreen = this._currentScreen
    }
    this._currentScreen = value
  }

  removeLastScreen = () => {
    this._currentScreen = this._previousScreen
  }

  clearHandler = () => {
    if (this._currentScreen === Screen.ProductInfo) {
      productNavigation.clearHandler()
    }

    if (this._currentScreen === Screen.SupplierInfo) {
      supplierNavigation.clearHandler()
    }

    if (this._currentScreen === Screen.CreateProduct) {
      createProductNavigation.clearHandler()
    }

    if (this._currentScreen === Screen.SampleInfo) {
      sampleNavigation.clearHandler()
    }
  }

  moveHandler = (direction: Direction) => {
    if (this._currentScreen === Screen.ProductInfo) {
      productNavigation.moveHandler(direction)
    }

    if (this._currentScreen === Screen.SupplierInfo) {
      supplierNavigation.moveHandler(direction)
    }

    if (this._currentScreen === Screen.CreateProduct) {
      createProductNavigation.moveHandler(direction)
    }

    if (this._currentScreen === Screen.SampleInfo) {
      sampleNavigation.moveHandler(direction)
    }
  }

  navigate = (routeName: string, params: NavigationParams) => {
    this._navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    )
  }

  goBack = (key?: string | null) => {
    this._navigator.dispatch(
      NavigationActions.back({
        key,
      })
    )
  }
}

export const navigation = new Navigation()
