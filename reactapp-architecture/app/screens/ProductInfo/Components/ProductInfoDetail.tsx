import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ProductInfoDetailForm } from './ProductInfoDetailForm'
import { ProductInfoDetailCustomField } from '@/screens/ProductInfo/Components/ProductInfoDetailCustomField'
import { ProductInfoTradeShipping } from '@/screens/ProductInfo/Components/ProductInfoTradeShipping'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  tabLabel?: string
} & DefaultProps

export type State = Readonly<typeof initialState>

@DelayRender({ delay: 300 })
export class ProductInfoDetail extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.space} />
        <Text style={styles.title}>{I18n.t('productDetail')}</Text>

        <ProductInfoDetailForm />
        <ProductInfoDetailCustomField />
        <ProductInfoTradeShipping />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: '100%',
  },
  space: {
    height: 12,
    flex: 1,
    backgroundColor: colors.light_white_gray,
  },
  title: {
    marginTop: 12,
    marginHorizontal: metrics.keylines_screen_edge_margin,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
  },
})
