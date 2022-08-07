import * as React from 'react'
import { Subscription } from 'rxjs'
import Swipeable from './Swipeable'
import { ProductSwipeableRight } from './ProductSwipeableRight'
import { ProductSwipeableLeft } from './ProductSwipeableLeft'
import { isVisibleTabBar } from '@/shared/global'
import { Text, View } from 'react-native'
import { deviceWidth } from '@/vars'
import { ProductItem } from '@/screens/Admin/Notification/component/Item'

type ProductSwipeableProps = {
  product: any
  index: number
  swipeRightOpen: () => void
  onPressDelete: () => void
  swipeLeftOpen: () => void
  _productSwipeRef?: any
  fromMultiSearch?: boolean
  onSelect: () => void
}

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
    fromMultiSearch: false
  }

  readonly state: ProductSwipeableState = {
    isSwipe: true,
    selectedId: null
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
      swipeRightOpen,
      swipeLeftOpen,
      _productSwipeRef,
      onPressDelete,
      product
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
          return !isSwipe ? null : (
            <ProductSwipeableRight onPressDelete={onPressDelete} />
          )
        }}
        renderLeftActions={(_progress, _dragX) => this.renderLeftActions()}>
        <ProductItem product={product} />
      </Swipeable>
    )
  }
}
