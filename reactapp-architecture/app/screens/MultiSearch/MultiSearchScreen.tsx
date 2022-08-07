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
import { NavigationService } from '@/services/navigation'
import { flexIpadProduct } from '@/common/constants/FlexIpadProduct'
import { AScrollableTabViewDashboard } from '@/components/AScrollableTabView/AScrollableTabViewDashboard'
import { SupplierQuery } from '@/screens/Supplier/Components/SupplierQuery'
import { TasksScreen } from '@/screens/Tasks/TasksScreen'
import { SampleListScreen } from '@/screens/Sample/SampleListScreen'
import { MultiSearchQuery } from '@/screens/MultiSearch/Components/MultiSearchQuery'
import { AIndicator } from '@/components/AIndicator/AIndicator'

type Props = Partial<
  NavigationInjectedProps<{
    onPressBack?: () => void
    keyword?: string
    isCreateProduct?: boolean
  }>
>

export type State = Readonly<{
  layoutWidth: number
  selectedItem: Product
  selectedIndex: number
}>

export class MultiSearchScreen extends React.PureComponent<Props, State> {
  _selectItemSubSubscription: Subscription
  _navListener = new NavigationService(this.props.navigation)

  readonly state: State = {
    layoutWidth: 0,
    selectedItem: null,
    selectedIndex: 0,
  }

  componentDidMount() {
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

  componentWillUnmount() {
    this._navListener.removeListener()
    this._selectItemSubSubscription &&
      this._selectItemSubSubscription.unsubscribe()
  }

  onPressBack = () => {
    const { navigation } = this.props
    const onPressBack = navigation.getParam('onPressBack', () => {})

    Keyboard.dismiss()
    onPressBack && onPressBack()
    navigation.goBack(null)
  }

  onLayout = event => {
    const { width } = event.nativeEvent.layout
    this.setState({
      layoutWidth: width,
    })
  }

  // renderDetail = () => {
  //   const { selectedItem, layoutWidth, selectedIndex } = this.state
  //
  //   const productId = selectedItem && selectedItem.id
  //
  //   if (!productId) {
  //     return <AEmpty />
  //   }
  //
  //   return (
  //     <View
  //       style={[styles.detail, { flex: flexIpadProduct }]}
  //       onLayout={this.onLayout}
  //     >
  //       {productId && (
  //         <ProductInfoScreen
  //           key={productId}
  //           // @ts-ignore
  //           navigation={this.props.navigation}
  //           layoutWidth={layoutWidth}
  //           wasCreated={true}
  //           productId={productId}
  //           selectedIndex={selectedIndex}
  //           asComponent={isIpad()}
  //         />
  //       )}
  //     </View>
  //   )
  // }

  render() {
    const { navigation } = this.props
    const keyword = navigation.getParam('keyword', '')

    return (
      <View style={styles.container}>
        <AScrollableTabViewDashboard
          keyword={keyword}
          onPressBack={this.onPressBack}
          placeholderSearch={I18n.t('searchingText')}
          focusPlaceholderSearch={I18n.t('searchText')}
        >
          <MultiSearchQuery keyword={keyword} tabLabel={I18n.t('all')} />
          <ProductQuery
            fromMultiSearch={true}
            tabLabel={I18n.t('products')}
            type={SearchKeywordType.AllProduct}
          />
          <SupplierQuery
            fromMultiSearch={true}
            tabLabel={I18n.t('suppliers')}
            type={SearchKeywordType.AllSupplier}
          />
          <TasksScreen
            fromMultiSearch={true}
            tabLabel={I18n.t('taskMenu')}
            type={SearchKeywordType.AllTasks}
          />
          <SampleListScreen
            fromMultiSearch={true}
            tabLabel={I18n.t('samples')}
            type={SearchKeywordType.AllSamples}
          />
        </AScrollableTabViewDashboard>

        {/*{isIpad() && this.renderDetail()}  // slacking */}
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
