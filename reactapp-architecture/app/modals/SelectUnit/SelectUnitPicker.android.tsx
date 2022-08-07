import { AModal4 } from '@/components/AModal/AModal4'
import { SelectUnitTab } from '@/modals/SelectUnit/Components/SelectUnitTab'
import { SelectWeightUnitTab } from '@/modals/SelectUnit/Components/SelectWeightUnitTab'
import { Product } from '@/models/team'
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
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { metrics } from '@/vars'

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

  onSelect = (value: string) => {
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

    if (!product || isNil(cartonPackaging)) return null

    if (value === cartonPackaging.data[this.key]) {
      return
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

  get modalHeight() {
    if (this.key === 'unit') {
      return metrics.unit_modal_height + 100
    }

    return metrics.unit_modal_height + 50
  }

  renderContent = () => {
    const { value } = this.state

    if (this.key === 'unit') {
      return <SelectUnitTab value={value} onSelect={this.onSelect} />
    }

    return <SelectWeightUnitTab value={value} onSelect={this.onSelect} />
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
        modalHeight={this.modalHeight}
      >
        {this.renderContent()}
      </AModal4>
    )
  }
}
