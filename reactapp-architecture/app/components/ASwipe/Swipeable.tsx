import React, { PureComponent } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler'
import { Subscription } from 'rxjs'
import { isVisibleTabBar } from '@/services/global'

const DRAG_TOSS = 0.05
let isSwipe = false

export default class Swipeable extends PureComponent<any, any> {
  visibleTabBar: Subscription

  static defaultProps = {
    friction: 1,
    overshootFriction: 1,
    useNativeAnimations: true,
    onSwipeableLeftWillOpen: () => {},
    onSwipeableRightWillOpen: () => {},
  }
  _onGestureEvent: any
  _onGestureEventHide: any
  _transX: any
  _showLeftAction: any
  _leftActionTranslate: any
  _showRightAction: any
  _rightActionTranslate: any

  constructor(props) {
    super(props)
    const dragX = new Animated.Value(0)
    this.state = {
      dragX,
      rowTranslation: new Animated.Value(0),
      rowState: 0,
      leftWidth: undefined,
      rightOffset: undefined,
      rowWidth: undefined,
    }
    this._updateAnimatedEvent(props, this.state)

    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: dragX } }],
      { useNativeDriver: props.useNativeAnimations }
    )
  }

  async componentDidMount() {
    this.visibleTabBar = await isVisibleTabBar.subscribe(data => {
      isSwipe = !data
      if (data) {
        this.close()
      } else {
        this.openLeft()
        this.forceUpdate()
      }
    })

    if (isSwipe) {
      this.openLeft()
    }
  }
  componentWillUnmount(): void {
    this.visibleTabBar && this.visibleTabBar.unsubscribe()
  }

  // tslint:disable-next-line:function-name
  UNSAFE_componentWillUpdate(props: any, state: any) {
    if (
      this.props.friction !== props.friction ||
      this.props.overshootLeft !== props.overshootLeft ||
      this.props.overshootRight !== props.overshootRight ||
      this.props.overshootFriction !== props.overshootFriction ||
      this.state.leftWidth !== state.leftWidth ||
      this.state.rightOffset !== state.rightOffset ||
      this.state.rowWidth !== state.rowWidth
    ) {
      this._updateAnimatedEvent(props, state)
    }
  }

  _updateAnimatedEvent = (props: any, state: any) => {
    const {
      friction,
      overshootFriction,
      useNativeAnimations,
      widthSwipeRight,
    } = props
    const { dragX, rowTranslation, leftWidth = 0, rowWidth = 0 } = state
    const { rightOffset = rowWidth } = state
    const rightWidth = Math.max(0, rowWidth - rightOffset)
    const widthRightAnimation = widthSwipeRight
    const {
      overshootLeft = leftWidth > 0,
      overshootRight = rightWidth > 0,
    } = props

    const transX = Animated.add(
      rowTranslation,
      dragX.interpolate({
        inputRange: [0, friction],
        outputRange: [0, 1],
      })
    ).interpolate({
      inputRange: [
        -rightWidth - (overshootRight ? 1 : overshootFriction),
        -rightWidth,
        leftWidth,
        leftWidth + (overshootLeft ? 1 : overshootFriction),
      ],
      outputRange: [
        -rightWidth - (overshootRight || overshootFriction > 1 ? 1 : 0),
        -rightWidth,
        leftWidth,
        leftWidth + (overshootLeft || overshootFriction > 1 ? 1 : 0),
      ],
    })
    this._transX = transX

    this._showLeftAction =
      leftWidth > 0
        ? transX.interpolate({
            inputRange: [-1, 0, leftWidth],
            outputRange: [0, 0, 1],
          })
        : new Animated.Value(0)
    this._leftActionTranslate = this._showLeftAction.interpolate({
      inputRange: [0, Number.MIN_VALUE],
      outputRange: [-10000, 0],
      extrapolate: 'clamp',
    })
    this._showRightAction =
      rightWidth > 0
        ? transX.interpolate({
            inputRange: [-rightWidth, 0, 1],
            outputRange: [1, 0, 0],
          })
        : new Animated.Value(0)

    this._rightActionTranslate = this._showRightAction.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [widthRightAnimation, widthRightAnimation / 2, 0],
      // inputRange: [0, Number.MIN_VALUE],
      // outputRange: [-10000, 0],
      extrapolate: 'clamp',
    })
  }

  _onTapHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      this.close()
    }
  }

  _onTapHandlerStateChangeHide = () => {}

  _onHandlerStateChangeHide = () => {}

  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      this._handleRelease(nativeEvent)
      return
    }
    const { velocityX, translationX: dragX } = nativeEvent
    const { friction } = this.props
    const translationX = (dragX + DRAG_TOSS * velocityX) / friction
    if (translationX > 1) {
      this.props.onSwipeableLeftWillOpen()
    }
    if (translationX < -1) {
      this.props.onSwipeableRightWillOpen()
    }
  }

  _handleRelease = nativeEvent => {
    const { velocityX, translationX: dragX } = nativeEvent
    const { leftWidth = 0, rowWidth = 0, rowState } = this.state
    const { rightOffset = rowWidth } = this.state
    const rightWidth = rowWidth - rightOffset
    const {
      friction,
      leftThreshold = leftWidth / 2,
      rightThreshold = rightWidth / 2,
    } = this.props

    const startOffsetX = this._currentOffset() + dragX / friction
    const translationX = (dragX + DRAG_TOSS * velocityX) / friction

    let toValue = 0
    if (rowState === 0) {
      if (translationX > leftThreshold) {
        toValue = leftWidth
      } else if (translationX < -rightThreshold) {
        toValue = -rightWidth
      }
    } else if (rowState === 1) {
      // swiped to left
      if (translationX > -leftThreshold) {
        toValue = leftWidth
      }
    } else {
      // swiped to right
      if (translationX < rightThreshold) {
        toValue = -rightWidth
      }
    }

    this._animateRow(startOffsetX, toValue, velocityX / friction)
  }

  _animateRow = (fromValue, toValue, velocityX?: any) => {
    const { dragX, rowTranslation } = this.state
    dragX.setValue(0)
    rowTranslation.setValue(fromValue)

    this.setState({ rowState: Math.sign(toValue) })
    Animated.spring(rowTranslation, {
      restSpeedThreshold: 1.7,
      restDisplacementThreshold: 0.4,
      velocity: velocityX,
      bounciness: 0,
      // tslint:disable-next-line:object-shorthand-properties-first
      toValue,
      useNativeDriver: this.props.useNativeAnimations,
      ...this.props.animationOptions,
    }).start()
    if (toValue > 0 && this.props.onSwipeableLeftWillOpen) {
      this.props.onSwipeableLeftWillOpen()
    } else if (toValue < 0 && this.props.onSwipeableRightWillOpen) {
      this.props.onSwipeableRightWillOpen()
    }
  }

  _onRowLayout = ({ nativeEvent }) => {
    this.setState({ rowWidth: nativeEvent.layout.width })
  }

  _currentOffset = () => {
    const { leftWidth = 0, rowWidth = 0, rowState } = this.state
    const { rightOffset = rowWidth } = this.state
    const rightWidth = rowWidth - rightOffset
    if (rowState === 1) {
      return leftWidth
    }
    if (rowState === -1) {
      return -rightWidth
    }
    return 0
  }

  close = () => {
    this._animateRow(this._currentOffset(), 0)
  }

  openLeft = () => {
    this._animateRow(this._currentOffset(), 90)
  }

  openRight = () => {
    this._animateRow(this._currentOffset(), -99)
  }

  render() {
    const { rowState } = this.state
    const { children, renderLeftActions, renderRightActions } = this.props

    const left = renderLeftActions && (
      <Animated.View
        style={[
          styles.leftActions,
          { transform: [{ translateX: this._leftActionTranslate }] },
        ]}
      >
        {renderLeftActions(this._showLeftAction, this._transX)}
        <View
          onLayout={({ nativeEvent }) =>
            this.setState({ leftWidth: nativeEvent.layout.x })
          }
        />
      </Animated.View>
    )

    const right = renderRightActions && (
      <Animated.View
        style={[
          styles.rightActions,
          { transform: [{ translateX: this._rightActionTranslate }] },
        ]}
      >
        {renderRightActions(this._showRightAction, this._transX)}
        <View
          onLayout={({ nativeEvent }) =>
            this.setState({ rightOffset: nativeEvent.layout.x })
          }
        />
      </Animated.View>
    )

    return (
      <PanGestureHandler
        {...this.props}
        minDeltaX={10}
        onGestureEvent={
          isSwipe ? this._onGestureEventHide : this._onGestureEvent
        }
        onHandlerStateChange={
          isSwipe ? this._onHandlerStateChangeHide : this._onHandlerStateChange
        }
      >
        <Animated.View
          onLayout={this._onRowLayout}
          style={[styles.container, this.props.containerStyle]}
        >
          {left}
          {right}
          <TapGestureHandler
            enabled={rowState !== 0}
            onHandlerStateChange={
              isSwipe
                ? this._onTapHandlerStateChangeHide
                : this._onTapHandlerStateChange
            }
          >
            <Animated.View
              pointerEvents={rowState === 0 ? 'auto' : 'box-only'}
              style={[
                {
                  transform: [{ translateX: this._transX }],
                },
                this.props.childrenContainerStyle,
              ]}
            >
              {children}
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </PanGestureHandler>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  leftActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  rightActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row-reverse',
  },
})
