import { Supplier } from '@/models/team'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { HomeListSupplierListCard } from './HomeListSupplierListCard'
import { ProductCardFooter } from '@/cards/Product/ProductCardFooter'
import { SafeSupplier } from '@/shared/supplier'

type Props = {
  onPress?: () => void
  suppliers?: Realm.Collection<Supplier>
  isLoading: boolean
} & Partial<NavigationInjectedProps<{}>>

@(withNavigation as any)
export class HomeListSupplierList extends React.PureComponent<Props> {
  renderItem = ({ item, index }) => {
    if (!item || !item.isValid() || item.deleted) return null

    const { id } = new SafeSupplier(item)

    return (
      <HomeListSupplierListCard
        // supplierId={item.id}
        supplier={item}
        currentIndex={index}
        onPress={() => {
          this.props.navigation.navigate('SupplierInfoScreen', {
            supplierId: id,
          })
        }}
      />
    )
  }

  renderFooter = () => {
    const { isLoading } = this.props
    return (
      <ProductCardFooter
        loading={isLoading}
        containerStyle={{
          width: metrics.screen_width - metrics.keylines_screen_edge_margin * 2,
        }}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList<Supplier>
          data={this.props.suppliers}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          // ListFooterComponent={this.renderFooter}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomColor: colors.pale_grey,
    borderBottomWidth: metrics.home_screen_suppliers_list_border_bottom_width,
    marginTop: -metrics.home_screen_margin_edge,
  },
})
