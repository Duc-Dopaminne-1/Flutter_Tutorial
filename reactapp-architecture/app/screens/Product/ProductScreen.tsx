import I18n from '@/i18n'
import { ProductQuery } from '@/screens/Product/Components/ProductQuery'
import { Factory } from '@/services/factory'
import { isIpad } from '@/shared/devices'
import * as React from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { ProductInfoScreen } from '@/screens/ProductInfo/ProductInfoScreen'
import { Product } from '@/models/team'
import { colors } from '@/vars'
import { Subscription } from 'rxjs'
import { productStore } from '@/stores/productStore'
import { AEmpty } from '@/components/AEmpty/AEmpty'
import { SearchKeywordType } from '@/services/global'
import { AScrollableTabViewProduct } from '@/components/AScrollableTabView/AScrollableTabViewProduct'
import { NavigationService } from '@/services/navigation'
import { flexIpadProduct } from '@/common/constants/FlexIpadProduct'

type Props = Partial<
  NavigationInjectedProps<{
    isCreateProduct?: boolean
  }>
>

export type State = Readonly<{
  layoutWidth: number
  selectedItem: Product
  selectedIndex: number
}>

export class ProductScreen extends React.PureComponent<Props, State> {
  _selectItemSubSubscription: Subscription
  _navListener = new NavigationService(this.props.navigation)
  _isSelectMulti = false

  readonly state: State = {
    layoutWidth: 0,
    selectedItem: null,
    selectedIndex: 0,
  }

  componentDidMount(): void {
    this._navListener.didFocus(() => {
      const isCreateProduct = this.props.navigation.getParam(
        'isCreateProduct',
        false
      )
      if (isCreateProduct) {
        // do something
        this.props.navigation.setParams({
          isCreateProduct: false,
        })
      }
    })

    this._selectItemSubSubscription = productStore.select().subscribe(value => {
      if (value.item && value.index >= 0) {
        this.setState({
          selectedItem: value.item,
          selectedIndex: value.index,
        })

        productStore.update().next({
          selectedId: value.item.id,
        })
      } else {
        this.setState({
          selectedItem: null,
          selectedIndex: -1,
        })
      }
    })
  }

  componentWillUnmount(): void {
    this._navListener.removeListener()
    this._selectItemSubSubscription &&
      this._selectItemSubSubscription.unsubscribe()
  }

  onPressCreate = () => {
    if (this._isSelectMulti) {
      return
    }
    Keyboard.dismiss()
    this.props.navigation.navigate('CameraScreen')
  }

  onLayout = event => {
    const { width } = event.nativeEvent.layout
    this.setState({
      layoutWidth: width,
    })
  }

  onSelected = (data: boolean) => {
    this._isSelectMulti = data
  }

  renderDetail = () => {
    const { selectedItem, layoutWidth, selectedIndex } = this.state

    const productId = selectedItem && selectedItem.id

    if (!productId) {
      return <AEmpty />
    }

    return (
      <View
        style={[styles.detail, { flex: flexIpadProduct }]}
        onLayout={this.onLayout}
      >
        {productId && (
          <ProductInfoScreen
            key={productId}
            // @ts-ignore
            navigation={this.props.navigation}
            layoutWidth={layoutWidth}
            wasCreated={true}
            productId={productId}
            selectedIndex={selectedIndex}
            asComponent={isIpad()}
          />
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <AScrollableTabViewProduct
          onPressCreate={this.onPressCreate}
          placeholderSearch={I18n.t('searchProduct')}
          focusPlaceholderSearch={I18n.t('searchText')}
        >
          <ProductQuery
            onSelected={this.onSelected}
            tabLabel={I18n.t('myProducts')}
            query={`createdBy.id = "${Factory.user().identity}"`}
            type={SearchKeywordType.MyProduct}
          />
          <ProductQuery
            onSelected={this.onSelected}
            tabLabel={I18n.t('allProducts')}
            type={SearchKeywordType.AllProduct}
          />
        </AScrollableTabViewProduct>
        {isIpad() && this.renderDetail()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  detail: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border_header,
  },
})
