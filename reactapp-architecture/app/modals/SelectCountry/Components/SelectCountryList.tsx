import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

type Props = {
  keyword: string
  onPress: (key: string) => void
  onClose?: () => void
  data: any
}

export class SelectCountryList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    data: [],
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(item.id)}
      >
        <View style={styles.wrapImage}>
          <Image source={images.category} style={styles.image} />
        </View>

        <Text style={styles.buttonTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.data}
        renderItem={this.renderItem}
        keyExtractor={_item => _item.id.toString()}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'always'}
        onScrollBeginDrag={() => {
          Keyboard.dismiss()
        }}
        style={styles.flatList}
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
  createButton: {
    marginTop: metrics.keylines_screen_edge_margin,
  },
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
    color: colors.text_light_grey,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
