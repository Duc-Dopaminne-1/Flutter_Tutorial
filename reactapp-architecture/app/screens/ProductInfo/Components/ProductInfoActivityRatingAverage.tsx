import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ASlider1 } from '@/components/ASlider/ASlider1'
import { Subscription } from 'rxjs'
import { updateProductInfo, updateStar } from '@/services/global'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { Product } from '@/models/team'

// init state
const initialState = {
  oneStarSum: 0,
  twoStarSum: 0,
  threeStarSum: 0,
  fourStarSum: 0,
  fiveStarSum: 0,
  totalVotes: 0,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  safeProduct?: SafeProduct
} & DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
export class ProductInfoActivityRatingAverage extends React.PureComponent<
  Props,
  State
> {
  _updateProductSubscription: Subscription
  _updateStarLocal: Subscription
  readonly state: State = initialState

  componentDidMount() {
    this.updateRentingAverage()
  }

  componentWillUnmount() {
    this._updateProductSubscription &&
      this._updateProductSubscription.unsubscribe()

    this._updateStarLocal && this._updateStarLocal.unsubscribe()
  }

  updateRentingAverage = () => {
    this._updateProductSubscription = updateProductInfo.subscribe(product => {
      if (!product) return

      this.updateStar(product)
    })

    this._updateStarLocal = updateStar.subscribe(product => {
      if (!product) return

      this.updateStar(product)
    })
  }

  updateStar = (product: Product) => {
    const { votes } = new SafeProduct(product)

    /**
     * one start filter
     */
    const oneStarSum = votes.filter(vote => vote.value === 0).length

    /**
     * two start filter
     */
    const twoStarSum = votes.filter(vote => 0 < vote.value && vote.value <= 25)
      .length

    /**
     * three start filter
     */
    const threeStarSum = votes.filter(
      vote => 25 < vote.value && vote.value <= 50
    ).length

    /**
     * four start filter
     */
    const fourStarSum = votes.filter(
      vote => 50 < vote.value && vote.value <= 75
    ).length

    /**
     * five start filter
     */
    const fiveStarSum = votes.filter(
      vote => 75 < vote.value && vote.value <= 100
    ).length

    /**
     * Total votes
     */
    const totalVotes = votes.length

    this.setState({
      oneStarSum,
      twoStarSum,
      threeStarSum,
      fourStarSum,
      fiveStarSum,
      totalVotes,
    })
  }

  renderRentingAverage = () => {
    const { safeProduct } = this.props
    const { voteStar } = safeProduct
    const { totalVotes } = this.state

    const textVote =
      totalVotes > 1
        ? totalVotes + ' ' + I18n.t('votes')
        : totalVotes + ' ' + I18n.t('vote')

    return (
      <>
        <Text style={styles.ratingAverage}>{voteStar}</Text>
        <Text style={styles.vote}>{textVote}</Text>
      </>
    )
  }

  renderRatingChart = () => {
    const { safeProduct } = this.props
    const { votes } = safeProduct
    const numberOfVote = votes.length
    const {
      oneStarSum,
      twoStarSum,
      threeStarSum,
      fourStarSum,
      fiveStarSum,
    } = this.state

    return (
      <>
        <ASlider1
          maximumRating={numberOfVote}
          currentRating={fiveStarSum}
          star={'5'}
        />
        <ASlider1
          maximumRating={numberOfVote}
          currentRating={fourStarSum}
          star={'4'}
        />
        <ASlider1
          maximumRating={numberOfVote}
          currentRating={threeStarSum}
          star={'3'}
        />
        <ASlider1
          maximumRating={numberOfVote}
          currentRating={twoStarSum}
          star={'2'}
        />
        <ASlider1
          maximumRating={numberOfVote}
          currentRating={oneStarSum}
          star={'1'}
        />
      </>
    )
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.wrapRatingAverageNumber}>
            {this.renderRentingAverage()}
          </View>

          <View style={styles.wrapSlider}>{this.renderRatingChart()}</View>
        </View>
        <View style={styles.line} />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  wrapRatingAverageNumber: {
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapSlider: {
    flex: 2,
  },
  ratingAverage: {
    color: colors.black,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: 58,
  },
  vote: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
    marginTop: -8,
  },
  line: {
    height: 1,
    width: metrics.screen_width - 46,
    backgroundColor: colors.pale_grey,
    marginHorizontal: 23,
    marginTop: 25,
  },
})
