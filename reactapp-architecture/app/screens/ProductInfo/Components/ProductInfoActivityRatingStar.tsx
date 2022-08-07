import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import StarRating from 'react-native-star-rating'
import { withContext } from '@/shared/withContext'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeProduct } from '@/shared/product'
import { findIndex } from 'lodash'
import { Subscription } from 'rxjs'
import { updateProductInfo, updateStar } from '@/services/global'
import { Factory } from '@/services/factory'

// init state
const initialState = {
  starCount: 0,
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
export class ProductInfoActivityRatingStar extends React.PureComponent<
  Props,
  State
> {
  _userSubscription: Subscription
  _updateProductSubscription: Subscription
  _userInfo = null
  _currentStarId: string = ''

  readonly state: State = initialState

  componentDidMount() {
    this.fetchUser()
  }

  componentWillUnmount() {
    this._userSubscription && this._userSubscription.unsubscribe()
    this._updateProductSubscription &&
      this._updateProductSubscription.unsubscribe()
  }

  fetchUser = () => {
    const { userFactory } = this.props

    const [subscription, results] = userFactory.fetchById(
      Factory.user().identity
    )

    this._userInfo = results[0]

    this._userSubscription = subscription.subscribe(userInfo => {
      this._userInfo = userInfo
    })

    this.initStar()
  }

  initStar = () => {
    const { safeProduct } = this.props
    const { votes } = safeProduct

    const index = findIndex(
      votes,
      (data: any): any => data.user.id === (this._userInfo && this._userInfo.id)
    )
    if (index === -1) {
      this.setState({ starCount: 0 })
      this._currentStarId = ''
    } else {
      this.setState({
        starCount: this.changePercentToStar(votes[index].value),
      })
      this._currentStarId = votes[index].id
    }
  }

  onStarRatingPress = rating => {
    /**
     * If user reach to 1 star and continue click one star again, remove
     * user vote from product
     */
    if (this.state.starCount === 1 && rating === 1) {
      this.setState(
        {
          starCount: 0,
        },
        () => {
          this.deleteFromRealm()
        }
      )

      return
    }

    /**
     * If user click the same star again, don't do anything
     */
    if (this.state.starCount === rating) {
      return
    }

    this.setState({
      starCount: rating,
    })
    this.updateToRealm(rating)
  }

  updateToRealm = rating => {
    const { productFactory, safeProduct } = this.props
    const { id } = safeProduct

    if (!id) return

    const convertStarToPercent = this.changeStarToPercent(rating)

    const data = {
      productId: id,
      ratingId: this._currentStarId,
      value: convertStarToPercent,
      user: this._userInfo,
    }

    productFactory.rating(data).subscribe(
      ({ votes, product }) => {
        this._currentStarId = votes.id
        updateStar.next(product)
      },
      error => {
        console.log('create rating fail', error)
      }
    )
  }

  deleteFromRealm = () => {
    const { productVoteFactory } = this.props

    if (!this._currentStarId) return

    productVoteFactory.deleteVote(this._currentStarId).subscribe(() => {
      this._currentStarId = ''
    })
  }

  changeStarToPercent = (star: number) => {
    switch (star) {
      case 2:
        return 25
      case 3:
        return 50
      case 4:
        return 75
      case 5:
        return 100
      default:
        return 0
    }
  }

  changePercentToStar = (percent: number) => {
    if (percent === 0) {
      return 1
    }
    if (0 < percent && percent <= 25) {
      return 2
    }
    if (25 < percent && percent <= 50) {
      return 3
    }
    if (50 < percent && percent <= 75) {
      return 4
    }
    if (75 < percent && percent <= 100) {
      return 5
    }

    return 0
  }

  render() {
    const { starCount } = this.state

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('leaveYourAppreciation')}</Text>

        <StarRating
          disabled={false}
          maxStars={5}
          rating={starCount}
          emptyStar={'star'}
          selectedStar={this.onStarRatingPress}
          containerStyle={styles.starContainer}
          starSize={32}
          emptyStarColor={colors.close_icon_gray}
          fullStarColor={colors.tracking_orange_yellow}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.keylines_screen_product_info_margin,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    color: colors.dark_blue_grey,
    marginVertical: 14,
  },
  starContainer: {
    width: '60%',
  },
})
