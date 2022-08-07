import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Harbour } from '@/models/global'
import { SafeHarbour } from '@/shared/harbour'
import { AIndicator } from '@/components/AIndicator/AIndicator'

type Props = {
  keyword: string
  onPress: (item: Harbour) => void
  // onCreate: (keyword: string) => void
  data: Realm.Results<Harbour>
  isPerfect: boolean
  onClose?: () => void
  textInputHeight?: number
  loading: boolean
}

export class SelectHarbourList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    data: [],
    textInputHeight: metrics.multi_select_text_input,
  }

  renderItem = ({ item }: { item: Harbour }) => {
    const { onPress } = this.props
    const { harbourName } = new SafeHarbour(item)

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <Text style={styles.buttonTitle} numberOfLines={1}>
          {harbourName}
        </Text>
      </TouchableOpacity>
    )
  }

  // renderFooter = () => {
  //   const { keyword, isPerfect } = this.props
  //   if (isPerfect) return null
  //
  //   return (
  //     <AButtonCreate
  //       text={keyword}
  //       // onPress={() => this.props.onCreate(keyword)}
  //       onPress={ () => {} }
  //       containerStyle={styles.createButton}
  //     />
  //   )
  // }

  render() {
    const { data, loading } = this.props

    if (loading) return <AIndicator containerStyle={styles.indicatorCustom} />

    return (
      <FlatList
        data={data}
        extraData={data}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'always'}
        style={styles.flatList}
        // ListFooterComponent={this.renderFooter}
        onScrollBeginDrag={() => {
          Keyboard.dismiss()
        }}
      />
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
  // wrapImage: {
  //   backgroundColor: colors.light_yellow,
  //   height: metrics.icon_category_size,
  //   width: metrics.icon_category_size,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   borderRadius: 5,
  //   marginBottom: metrics.small_base,
  // },
  // image: {
  //   height: metrics.medium_base,
  //   width: metrics.medium_base,
  // },
  buttonTitle: {
    marginLeft: 14,
    color: colors.tag_text_color,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  indicatorCustom: {
    marginTop: metrics.base,
  },
})
