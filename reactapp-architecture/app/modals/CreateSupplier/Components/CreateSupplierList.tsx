import { SupplierCard } from '@/cards/Supplier/SupplierCard'
import { SupplierCardSeparator } from '@/cards/Supplier/SupplierCardSeparator'
import { ABooth } from '@/components/ABooth/ABooth'
import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native'
import { CreateSupplierPlaceholder } from '@/modals/CreateSupplier/Components/CreateSupplierPlaceholder'

type Props = {
  keyword: string
  onPress: (supplier: Supplier) => void
  onCreate: (keyword: string) => void
  data: Realm.Results<Supplier>
  isPerfect: boolean
  dirty: boolean
}

export class CreateSupplierList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    data: [],
  }

  get isEmpty() {
    return !!this.props.data.length
  }

  renderBooth = (item: Supplier) => {
    if (item.categories.length !== 0) {
      return (
        <View style={styles.wrapCategory}>
          <ABooth
            booths={item.categories}
            isDisplayBooth={false}
            backgroundColor={colors.background_gray}
            color={colors.product_info_camera_btn_bottom}
          />
        </View>
      )
    }

    return <View style={styles.separator} />
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    return <SupplierCard supplier={item} onPress={() => onPress(item)} />
  }

  renderHeader = () => {
    const { keyword, onCreate, isPerfect } = this.props
    return (
      <View style={{ paddingTop: metrics.base, backgroundColor: colors.white }}>
        {!isPerfect && (
          <AButtonCreate
            text={keyword}
            onPress={() => onCreate(keyword)}
            containerStyle={{ marginBottom: metrics.base }}
          />
        )}
        {this.isEmpty && (
          <View style={styles.headerContainer}>
            <Text style={styles.headerLabel}>
              {I18n.t('supplierWithSimilarName').toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    )
  }

  renderSeparator = () => {
    return <SupplierCardSeparator />
  }

  render() {
    const { dirty, data } = this.props

    if (!dirty) {
      return <CreateSupplierPlaceholder />
    }

    return (
      <>
        {this.renderHeader()}
        <FlatList<Supplier>
          data={data}
          extraData={data}
          renderItem={this.renderItem}
          keyExtractor={_item => _item.id}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          style={styles.flatList}
          ItemSeparatorComponent={this.renderSeparator}
          onScrollBeginDrag={() => {
            Keyboard.dismiss()
          }}
        />
      </>
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    paddingBottom: 100,
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
  },
  wrapCategory: {
    marginLeft: metrics.double_base,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
  },
  separator: {
    height: 22,
    marginLeft: metrics.double_base,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
  },

  headerContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(241, 244, 248, 0.4)',
  },
  headerLabel: {
    color: colors.primary_blue,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
