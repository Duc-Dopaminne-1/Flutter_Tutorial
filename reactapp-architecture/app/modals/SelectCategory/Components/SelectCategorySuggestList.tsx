import { Category } from '@/models/team'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { AText1 } from '@/components/AText/AText1'
import I18n from '@/i18n'

type Props = {
  onPress: (item: Category) => void
  suggestCategory: Category[]
}

export class SelectCategorySuggestList extends React.Component<Props> {
  static readonly defaultProps = {
    suggestCategory: [],
  }

  renderHeader = () => {
    return (
      <AText1
        title={I18n.t('lastUsed').toUpperCase()}
        containerStyle={{ marginTop: 10 }}
      />
    )
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    if (!item || !item.isValid() || item.deleted) return null

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View style={styles.wrapImage}>
          <Image source={images.category} style={styles.image} />
        </View>

        <Text style={styles.buttonTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    return (
      <AText1
        title={I18n.t('allCategories').toUpperCase()}
        containerStyle={{ marginTop: 24 }}
      />
    )
  }

  render() {
    const { suggestCategory } = this.props

    if (suggestCategory.length <= 0) return null

    return (
      <FlatList
        data={suggestCategory}
        extraData={this.props}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        keyboardShouldPersistTaps={'always'}
        scrollEnabled={false}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: 52,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
    paddingRight: 30,
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
  image: {
    height: metrics.medium_base,
    width: metrics.medium_base,
  },
  buttonTitle: {
    marginLeft: 14,
    color: colors.tag_text_color,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  warpTitle: {
    paddingHorizontal: 12,
    backgroundColor: colors.pale_grey_40,
    height: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.primary_blue,
  },
})
