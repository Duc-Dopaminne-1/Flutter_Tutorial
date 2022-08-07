import React, { Component } from 'react';
import { PanResponder, Animated } from 'react-native';
import styles from './styles';
interface Props {
  onDrag: (isDelete: boolean) => void;
  onStartDrag: () => void;
  styles: any;
}

interface State {
  pan: any;
}

export default class Draggable extends Component<Props, State> {
  _val = {};
  panResponder: any;
  constructor() {
    super();
    this.state = {
      pan: new Animated.ValueXY(),
    };
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 };
    this.state.pan.addListener((value: any) => (this._val = value));
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.props.onStartDrag();
      },
      onPanResponderMove: Animated.event([null, { dx: this.state.pan.x, dy: this.state.pan.y }]),
      // adjusting delta value
      onPanResponderRelease: (e, gesture) => {
        if (this.isDropArea(gesture)) {
          this.props.onDrag(true);
        } else {
          this.props.onDrag(false);
        }
        Animated.spring(this.state.pan, {
          toValue: { x: 0, y: 0 },
          friction: 5,
        }).start();
      },
    });
  }

  isDropArea(gesture: any) {
    return gesture.moveX < 60;
  }

  render() {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform(),
    };
    return <Animated.View {...this.panResponder.panHandlers} style={[panStyle, styles.circle, this.props.styles]} />;
  }
}
