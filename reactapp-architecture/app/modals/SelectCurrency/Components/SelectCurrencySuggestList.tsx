import { ABooth } from '@/components/ABooth/ABooth'
import { Event } from '@/models/team'
import { SafeSupplier } from '@/shared/supplier'
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
import { Currency } from '@/models/constant'
import { ifIphoneX } from '@/shared/devices'

type Props = {
  onPress: (currency: Currency) => void
  suggestCurrency: Currency[]
}

export class SelectCurrencySuggestList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    suggestCurrency: [],
  }

  renderHeader = () => {
    return (
      <AText1
        title={I18n.t('lastUsed').toUpperCase()}
        containerStyle={{ marginTop: 10 }}
      />
    )
  }

  renderItem = ({ item }: { item: Currency }) => {
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

  renderFooter = () => {
    return (
      <AText1
        title={I18n.t('allCurrencies').toUpperCase()}
        containerStyle={{ marginTop: 24 }}
      />
    )
  }

  render() {
    const { suggestCurrency } = this.props

    if (suggestCurrency.length <= 0) return null

    return (
      <FlatList
        data={suggestCurrency}
        extraData={suggestCurrency}
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
