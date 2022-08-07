import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
import { AForm } from '@/components/AForm/AForm'
import { ProductInfoActivityRatingAverage } from '@/screens/ProductInfo/Components/ProductInfoActivityRatingAverage'
import { ProductInfoActivityRatingStar } from '@/screens/ProductInfo/Components/ProductInfoActivityRatingStar'
import { ProductInfoActivityTasks } from '@/screens/ProductInfo/Components/ProductInfoActivityTasks'
import { ProductInfoActivitySamples } from '@/screens/ProductInfo/Components/ProductInfoActivitySamples'
import { ProductInfoActivityComments } from './ProductInfoActivityComments'
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

@DelayRender({ delay: 200 })
export class ProductInfoActivity extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <AForm
          title={I18n.t('teamRating')}
          titleContainer={styles.titleContainer}
          textLabelStyle={styles.textLabel}
          containerStyle={styles.customFormContainer}
        >
          <>
            <ProductInfoActivityRatingAverage />
            <ProductInfoActivityRatingStar />
          </>
        </AForm>
        <ProductInfoActivitySamples />
        <ProductInfoActivityTasks />
        <ProductInfoActivityComments />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light_white_gray,
  },
  customFormContainer: {
    paddingBottom: 24,
  },
  titleContainer: {
    paddingTop: 12,
    borderBottomWidth: 0,
  },
  textLabel: {
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
  },
})
