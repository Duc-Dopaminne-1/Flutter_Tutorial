import { ABooth } from '@/components/ABooth/ABooth'
import { Supplier } from '@/models/team'
import { SafeSupplier } from '@/shared/supplier'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { AText1 } from '@/components/AText/AText1'
import I18n from '@/i18n'

type Props = {
  onPress: (supplier: Supplier) => void
  suggestSuppliers: []
}

export class SelectSupplierSuggestList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    suggestSuppliers: [],
  }

  renderHeader = () => {
    return (
      <AText1
        title={I18n.t('lastUsed').toUpperCase()}
        containerStyle={{ marginBottom: 10 }}
      />
    )
  }

  renderBooth = (supplier: Supplier) => {
    if (supplier.categories.length !== 0) {
      return (
        <View style={styles.wrapCategory}>
          <ABooth
            booths={supplier.categories}
            isDisplayBooth={false}
            backgroundColor={colors.background_gray}
            color={colors.product_info_camera_btn_bottom}
            currentWidth={150}
          />
        </View>
      )
    }

    return <View style={styles.borderBottom} />
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    if (!item || !item.isValid() || item.deleted) return null

    const { statusType, name } = new SafeSupplier(item)

    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.wrapSupplierName}>
          <View
            style={[styles.dot, { backgroundColor: statusType.background }]}
          />
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
        </View>

        {this.renderBooth(item)}
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    return (
      <AText1
        title={I18n.t('allSuppliers').toUpperCase()}
        containerStyle={{ marginTop: 15, marginBottom: 10 }}
      />
    )
  }

  render() {
    const { suggestSuppliers } = this.props

    if (suggestSuppliers.length <= 0) return null

    return (
      <FlatList
        data={suggestSuppliers}
        extraData={suggestSuppliers}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        keyboardShouldPersistTaps={'always'}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  buttonContainer: {
    height: 63,
    justifyContent: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
  },
  wrapSupplierName: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: metrics.triple_base,
  },
  dot: {
    height: metrics.prod_card_dot_size,
    width: metrics.prod_card_dot_size,
    borderRadius: metrics.prod_card_dot_size,
    marginRight: metrics.base,
  },
  name: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  wrapCategory: {
    marginLeft: metrics.double_base,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
  },
  borderBottom: {
    height: 22,
    marginLeft: metrics.double_base,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
  },
})
