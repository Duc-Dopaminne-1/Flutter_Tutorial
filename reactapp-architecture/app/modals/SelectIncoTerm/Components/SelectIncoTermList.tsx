import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Incoterm } from '@/models/global'
import { SafeIncoTerm } from '@/shared/IncoTerm'
import { AIndicator } from '@/components/AIndicator/AIndicator'

type Props = {
  keyword: string
  onPress: (item: Incoterm) => void
  // onCreate: (keyword: string) => void
  data: Realm.Results<Incoterm>
  isPerfect: boolean
  onClose?: () => void
  textInputHeight?: number
  loading: boolean
}

export class SelectIncoTermList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    data: [],
    textInputHeight: metrics.multi_select_text_input,
  }

  renderItem = ({ item }: { item: Incoterm }) => {
    const { onPress } = this.props
    const { incoTermName, logoPlaceholder } = new SafeIncoTerm(item)

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View style={styles.thumbnail}>
          <Text style={styles.thumbnailText}>{logoPlaceholder}</Text>
        </View>

        <Text style={styles.buttonTitle} numberOfLines={1}>
          {incoTermName}
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
  buttonTitle: {
    marginLeft: 14,
    color: colors.tag_text_color,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  thumbnail: {
    height: 40,
    width: 40,
    borderRadius: metrics.small_base,
    marginRight: metrics.supplier_card_padding_btw_content_and_img,
    backgroundColor: colors.background_violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPBold,
    color: colors.white,
  },
  indicatorCustom: {
    marginTop: metrics.base,
  },
})
