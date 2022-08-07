import { AModal4 } from '@/components/AModal/AModal4'
import { APicker } from '@/components/APicker/APicker'
import units from '@/i18n/units/en'
import weightUnits from '@/i18n/weightUnits/en'
import { Product } from '@/models/team'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import {
  PackagingName,
  ResultPackagingName,
  SafeProduct,
} from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { isNil } from 'ramda'
import React, { PureComponent } from 'react'
import { NavigationInjectedProps } from 'react-navigation'

export type Props = {} & AppContextState &
  Partial<
    NavigationInjectedProps<{
      isCreateProduct?: boolean
      setValue?: (value: any, key: string, type: string) => void

      product: Product
      value: string
      packagingName: PackagingName
      type: 'metric' | 'weight'
    }>
  >

type State = {
  product: Product
  value: string
  packagingName: PackagingName
  cartonPackaging: ResultPackagingName
}

@withContext(AppContext.Consumer)
export class SelectUnitPicker extends PureComponent<Props, State> {
  _modal

  readonly state: State = {
    product: null,
    value: 'm',
    packagingName: '' as PackagingName,
    cartonPackaging: null,
  }

  componentDidMount(): void {
    this.open()

    const { navigation } = this.props

    const packagingName = navigation.getParam('packagingName', null)
    const value = navigation.getParam('value', '')
    const product = navigation.getParam('product', null)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    if (isCreateProduct) {
      this.setState({
        packagingName,
        value,
      })
    } else {
      const safeProduct = new SafeProduct(product)
      const cartonPackaging = safeProduct.carton.getCarton(packagingName)

      this.setState({
        cartonPackaging,
        packagingName,
        product,
        value: cartonPackaging.data[this.key],
      })
    }
  }

  get key() {
    const type = this.props.navigation.getParam('type', 'metric')
    return type === 'metric' ? 'unit' : 'weightUnit'
  }

  onValueChange = (value: string) => {
    const { navigation } = this.props
    const { packagingName } = this.state

    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)

    if (isCreateProduct && setValue) {
      setValue(value, this.key, packagingName)
    } else {
      this.updateToRealm(value)
    }

    this.setState({ value })
  }

  updateToRealm = (value: string) => {
    const { product, cartonPackaging } = this.state

    if (!product || isNil(cartonPackaging)) {
      return null
    }

    // if (value === cartonPackaging.data[this.key]) {
    //   return
    // }

    if (!cartonPackaging.packaging) {
      return null
    }

    this.props.productFactory
      .update(product.id, {
        [cartonPackaging.packaging]: {
          id: cartonPackaging.data.id,
          [this.key]: value,
        },
      })
      .subscribe(() => {})
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
    }
  }

  close = () => {
    if (this._modal) {
      this._modal.close()
      this.changeColorPicker()
    }
  }

  changeColorPicker = () => {
    const { navigation } = this.props
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    if (isCreateProduct) {
      createProductNavigation.close(CreateProductRef.InnerUnit)
      return
    }

    productNavigation.close(ProductRef.InnerUnit)
  }

  onComplete = () => {
    this.close()
  }

  renderContent = () => {
    const { value } = this.state
    const { navigation } = this.props
    const type = navigation.getParam('type', 'metric')

    const data = type === 'metric' ? units : weightUnits

    return (
      <APicker<any>
        data={data as any}
        value={value}
        onValueChange={this.onValueChange}
      />
    )
  }

  render() {
    return (
      <AModal4
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.InnerUnit, nodeRef)
          productNavigation.setRef(ProductRef.InnerWeightUnit, nodeRef)
          productNavigation.setRef(ProductRef.MasterUnit, nodeRef)
          productNavigation.setRef(ProductRef.MasterWeightUnit, nodeRef)
          createProductNavigation.setRef(CreateProductRef.InnerUnit, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.InnerWeightUnit,
            nodeRef
          )
          createProductNavigation.setRef(CreateProductRef.MasterUnit, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.MasterWeightUnit,
            nodeRef
          )
        }}
        hideClearButton={true}
        onComplete={this.onComplete}
        changeColorPicker={this.changeColorPicker}
      >
        {this.renderContent()}
      </AModal4>
    )
  }
}
