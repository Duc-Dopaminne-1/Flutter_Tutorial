import { ABooth } from '@/components/ABooth/ABooth'
import { Supplier } from '@/models/team'
import { SafeSupplier } from '@/shared/supplier'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
  onPress: (supplier: Supplier) => void
  data: Supplier
}

export class SelectSupplierList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    data: [],
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

  render() {
    const { onPress, data } = this.props
    const safeSupplier = new SafeSupplier(data)
    const { statusType } = safeSupplier

    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => onPress(data)}
      >
        <View style={styles.wrapSupplierName}>
          <View
            style={[styles.dot, { backgroundColor: statusType.background }]}
          />
          <Text style={styles.name} numberOfLines={1}>
            {data.name}
          </Text>
        </View>

        {this.renderBooth(data)}
      </TouchableOpacity>
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
