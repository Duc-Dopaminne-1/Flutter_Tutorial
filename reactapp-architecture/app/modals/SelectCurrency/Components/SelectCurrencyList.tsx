import { Currency } from '@/models/constant'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  FlatListProps,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native'
import { modalStore } from '@/stores/modalStore'
import { SelectCurrencySuggestList } from '@/modals/SelectCurrency/Components/SelectCurrencySuggestList'
import { difference } from '@/shared/supportFunction'

type Props = {
  keyword: string
  onPress: (item: Currency) => void
  data: Realm.Collection<Currency>
  onClose?: () => void
  flatListRef?: any
  flatListProps?: Partial<FlatListProps<Currency>>
}

type State = {
  suggestCurrency: Currency[]
}

export class SelectCurrencyList extends React.PureComponent<Props, State> {
  static readonly defaultProps = {
    data: [],
  }

  state: State = {
    suggestCurrency: [],
  }

  componentDidMount() {
    const diffData = difference(modalStore.selectCurrency, modalStore.currency)

    this.setState({
      suggestCurrency: diffData,
    })
  }

  renderHeader = () => {
    const { suggestCurrency } = this.state
    const { onPress } = this.props

    return (
      <SelectCurrencySuggestList
        onPress={onPress}
        suggestCurrency={suggestCurrency}
      />
    )
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <Text style={styles.symbol}>{item.symbol}</Text>

        <Text style={styles.title} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { data, flatListRef, flatListProps } = this.props

    return (
      <FlatList<Currency>
        ref={flatListRef}
        data={data}
        extraData={data}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'always'}
        ListHeaderComponent={this.renderHeader}
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
    paddingBottom: 100,
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
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
    color: colors.text_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
})
