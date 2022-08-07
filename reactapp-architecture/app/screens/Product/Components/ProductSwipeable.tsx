import { Product } from '@/models/team'
import * as React from 'react'
import { Subscription } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'
import Swipeable from '@/components/ASwipe/Swipeable'
import { NavigationInjectedProps } from 'react-navigation'
import { ProductCard } from '@/cards/Product/ProductCard'
import { SafeProduct } from '@/shared/product'
import { ProductSwipeableRight } from '@/screens/Product/Components/ProductSwipeableRight'
import { ProductSwipeableLeft } from '@/screens/Product/Components/ProductSwipeableLeft'
import { isVisibleTabBar } from '@/services/global'

type ProductSwipeableProps = {
  product: Product
  index: number
  swipeRightOpen: () => void
  onPressDelete: () => void
  swipeLeftOpen: () => void
  _productSwipeRef?: any
  fromMultiSearch?: boolean
  onSelect: () => void
} & Partial<NavigationInjectedProps<{}>>

type ProductSwipeableState = Readonly<{
  isSwipe: boolean
  selectedId: string
}>

export class ProductSwipeable extends React.PureComponent<
  ProductSwipeableProps,
  ProductSwipeableState
> {
  widthSwipeRight = 99
  selectedSubscription: Subscription

  static readonly defaultProps = {
    fromMultiSearch: false,
  }

  readonly state: ProductSwipeableState = {
    isSwipe: true,
    selectedId: null,
  }

  componentDidMount(): void {
    this.selectedSubscription = isVisibleTabBar.subscribe(data => {
      this.setState({ isSwipe: data })
    })
  }

  componentWillUnmount(): void {
    this.selectedSubscription && this.selectedSubscription.unsubscribe()
  }

  renderLeftActions = () => {
    const { selectedId } = this.state
    const { onSelect } = this.props

    return <ProductSwipeableLeft isSelect={!!selectedId} onSelect={onSelect} />
  }

  render() {
    const {
      product,
      index,
      swipeRightOpen,
      swipeLeftOpen,
      _productSwipeRef,
      onPressDelete,
      fromMultiSearch,
    } = this.props
    const { isSwipe } = this.state

    return (
      <Swipeable
        ref={_productSwipeRef}
        friction={1}
        widthSwipeRight={this.widthSwipeRight}
        useNativeAnimations={true}
        onSwipeableRightWillOpen={swipeRightOpen}
        onSwipeableLeftWillOpen={swipeLeftOpen}
        renderRightActions={(_progress, _dragX) => {
          return fromMultiSearch || !isSwipe ? null : (
            <ProductSwipeableRight onPressDelete={onPressDelete} />
          )
        }}
        renderLeftActions={(_progress, _dragX) =>
          !fromMultiSearch && this.renderLeftActions()
        }
      >
        <ProductCard
          product={product}
          currentIndex={index}
          selected={false}
          fromProductList={true}
        />
      </Swipeable>
    )
  }
}
