import { Supplier } from '@/models/team'
import * as React from 'react'
import Swipeable from '@/components/ASwipe/Swipeable'
import { NavigationInjectedProps } from 'react-navigation'
import { SafeSupplier } from '@/shared/supplier'
import { SupplierCard } from '@/cards/Supplier/SupplierCard'
import { SupplierSwipeableLeft } from '@/screens/Supplier/Components/SupplierSwipeableLeft'
import { SupplierSwipeableRight } from '@/screens/Supplier/Components/SupplierSwipeableRight'
import { isVisibleTabBar } from '@/services/global'
import { Subscription } from 'rxjs'

type Props = {
  supplier: Supplier
  index: number
  swipeRightOpen: () => void
  onPressDelete: () => void
  swipeLeftOpen: () => void
  _supplierSwipeRef?: any
  fromMultiSearch?: boolean
  onSelect: () => void
} & Partial<NavigationInjectedProps<{}>>

type State = Readonly<{
  selectedId: string
  isSwipe: boolean
}>

export class SupplierSwipeable extends React.PureComponent<Props, State> {
  widthSwipeRight = 99
  selectedSubscription: Subscription

  static readonly defaultProps = {
    fromMultiSearch: false,
  }

  readonly state: State = {
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

    return <SupplierSwipeableLeft isSelect={!!selectedId} onSelect={onSelect} />
  }

  render() {
    const {
      supplier,
      index,
      swipeRightOpen,
      swipeLeftOpen,
      _supplierSwipeRef,
      onPressDelete,
      fromMultiSearch,
    } = this.props
    const { isSwipe } = this.state

    const { id } = new SafeSupplier(supplier)

    return (
      <Swipeable
        ref={_supplierSwipeRef}
        friction={1}
        widthSwipeRight={this.widthSwipeRight}
        useNativeAnimations={true}
        onSwipeableRightWillOpen={swipeRightOpen}
        onSwipeableLeftWillOpen={swipeLeftOpen}
        renderRightActions={(_progress, _dragX) =>
          fromMultiSearch || !isSwipe ? null : (
            <SupplierSwipeableRight onPressDelete={onPressDelete} />
          )
        }
        renderLeftActions={(_progress, _dragX) =>
          !fromMultiSearch && this.renderLeftActions()
        }
      >
        <SupplierCard
          supplier={supplier}
          currentIndex={index}
          selected={false}
          fromSupplierList={true}
        />
      </Swipeable>
    )
  }
}
