import { Tag } from '@/models/team'
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
  onPress: (item: Tag) => void
  suggestTag: Tag[]
}

export class SelectTagSuggestList extends React.Component<Props> {
  static readonly defaultProps = {
    suggestTag: [],
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
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.wrapImage}>
          <Image source={images.tag} style={styles.image} />
        </View>

        <View style={styles.wrapButtonTitle}>
          <Text style={styles.buttonTitle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    return (
      <AText1
        title={I18n.t('allTags').toUpperCase()}
        containerStyle={{ marginTop: 24 }}
      />
    )
  }

  render() {
    const { suggestTag } = this.props

    if (suggestTag.length <= 0) return null

    return (
      <FlatList
        data={suggestTag}
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
  buttonContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
  wrapImage: {
    backgroundColor: colors.tag_color,
    height: metrics.icon_category_size,
    width: metrics.icon_category_size,
    marginRight: metrics.medium_base,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  image: {
    height: metrics.medium_base,
    width: metrics.medium_base,
    tintColor: colors.text_grey,
  },
  wrapButtonTitle: {
    flex: 1,
    paddingRight: metrics.base,
  },
  buttonTitle: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
