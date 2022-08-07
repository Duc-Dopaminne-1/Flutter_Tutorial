import * as React from 'react';
import Swipeable from './component/Swipeable';
import { SwipeableRight } from '@/components/CustomSwipe/component/SwipeableRight';

type ProductSwipeableProps = {
  product: any;
  swipeRightOpen: () => void;
  onPressDelete: () => void;
  _productSwipeRef?: any;
};

type ProductSwipeableState = Readonly<{
  selectedId: string;
}>;

export class CustomSwipeAble extends React.PureComponent<ProductSwipeableProps, ProductSwipeableState> {
  widthSwipeRight = 99;

  static readonly defaultProps = {
    fromMultiSearch: false,
  };

  readonly state: ProductSwipeableState = {
    selectedId: null,
  };

  render() {
    const { swipeRightOpen, _productSwipeRef, onPressDelete, children } = this.props;
    return (
      <Swipeable
        ref={_productSwipeRef}
        friction={1}
        widthSwipeRight={this.widthSwipeRight}
        useNativeAnimations={true}
        onSwipeableRightWillOpen={swipeRightOpen}
        renderRightActions={(_progress, _dragX) => {
          return <SwipeableRight onPressDelete={onPressDelete} />;
        }}
      >
        {children}
      </Swipeable>
    );
  }
}
