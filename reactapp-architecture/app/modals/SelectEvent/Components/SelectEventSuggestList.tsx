import { Event } from '@/models/team'
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
import { SafeEvent } from '@/shared/event'

type Props = {
  onPress: (event: Event) => void
  suggestEvent: Event[]
}

export class SelectEventSuggestList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    suggestEvent: [],
  }

  renderHeader = () => {
    return (
      <AText1
        title={I18n.t('lastUsed').toUpperCase()}
        containerStyle={{ marginBottom: 10 }}
      />
    )
  }

  renderItem = ({ item }: { item: Event }) => {
    const { onPress } = this.props

    if (!item || !item.isValid() || item.deleted) return null

    const { eventName } = new SafeEvent(item)

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View style={styles.wrapImage}>
          <Image source={images.category} style={styles.image} />
        </View>

        <Text style={styles.buttonTitle} numberOfLines={1}>
          {eventName}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    return (
      <AText1
        title={I18n.t('allEvents').toUpperCase()}
        containerStyle={{ marginTop: 15, marginBottom: 10 }}
      />
    )
  }

  render() {
    const { suggestEvent } = this.props

    if (suggestEvent.length <= 0) return null

    return (
      <FlatList
        data={suggestEvent}
        extraData={suggestEvent}
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
})
