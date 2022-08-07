import { SupplierStatus } from '@/models/team'
import { ifIphoneX } from '@/shared/devices'
import { SafeStatusType } from '@/shared/statusType'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  FlatListProps,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type SelectStatusListProps = {
  keyword: string
  onPress: (item: SupplierStatus) => void
  data: Realm.Collection<SupplierStatus>
  onClose?: () => void
  flatListRef?: any
  flatListProps?: Partial<FlatListProps<SupplierStatus>>
}

export class SelectStatusListSupplier extends React.PureComponent<
  SelectStatusListProps
> {
  static readonly defaultProps = {
    data: [],
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props
    const statusCategory = item && item.category ? item.category : ''
    const statusName = item && item.name ? item.name : ''
    const backgroundColor = SafeStatusType.getColor(statusCategory)
    const name = SafeStatusType.getNameSupplier(statusName)

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View style={[styles.wrapImage, { backgroundColor }]} />

        <Text style={styles.title} numberOfLines={1}>
          {`0${item.step}. ${name}`}
        </Text>
      </TouchableOpacity>
    )
  }

  // FIXME: can't scroll
  render() {
    const { data, flatListRef, flatListProps } = this.props

    return (
      <FlatList<SupplierStatus>
        ref={flatListRef}
        data={data}
        extraData={data}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'always'}
        onScrollBeginDrag={() => {
          Keyboard.dismiss()
        }}
        style={styles.flatList}
        {...flatListProps}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
  },
  wrapImage: {
    backgroundColor: colors.light_yellow,
    height: metrics.icon_category_size,
    width: metrics.icon_category_size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: metrics.small_base,
  },
  container: {
    height: 52,
    paddingTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
  symbol: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPBlack,
  },
  title: {
    marginLeft: 14,
    color: colors.tag_text_color,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
