/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from 'prop-types';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Dimensions, Keyboard, LayoutAnimation, Platform, StyleSheet, View} from 'react-native';

import {COLORS} from '../assets/theme/colors';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  accessory: {
    position: 'absolute',
    right: 0,
    left: 0,
  },
});

const isSafeAreaSupported = Platform.OS === 'ios' && (height > 800 || width > 800);

const accessoryAnimation = (duration, easing, animationConfig = null) => {
  if (animationConfig) {
    if (typeof animationConfig === 'function') {
      return animationConfig(duration, easing);
    }
    return animationConfig;
  }
  if (Platform.OS === 'android') {
    return {
      duration: 1000,
      create: {
        duration: 1000,
        type: LayoutAnimation.Types.keyboard,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    };
  }
  return LayoutAnimation.create(
    duration,
    LayoutAnimation.Types[easing],
    LayoutAnimation.Properties.opacity,
  );
};

const initState = {
  keyboardHeight: 0,
  accessoryHeight: 50,
  visibleAccessoryHeight: 50,
  isKeyboardVisible: false,
};

const KeyboardAccessoryView = props => {
  const [keyboardState, setKeyboardState] = useState(initState);

  useEffect(() => {
    const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const keyboardShowEventListener = Keyboard.addListener(keyboardShowEvent, handleKeyboardShow);
    const keyboardHideEventListener = Keyboard.addListener(keyboardHideEvent, handleKeyboardHide);
    return () => {
      keyboardShowEventListener.remove();
      keyboardHideEventListener.remove();
    };
  }, []);

  const handleKeyboardShow = useCallback(keyboardEvent => {
    if (!keyboardEvent.endCoordinates) {
      return;
    }
    const keyboardHeight = Platform.select({
      ios: keyboardEvent.endCoordinates.height - props.minusHeight,
      android: props.androidAdjustResize ? 0 : keyboardEvent.endCoordinates.height - 50,
    });
    const keyboardAnimate = () => {
      const {animationConfig, animateOn} = props;
      if (animateOn === 'all' || Platform.OS === animateOn) {
        LayoutAnimation.configureNext(
          accessoryAnimation(keyboardEvent.duration, keyboardEvent.easing, animationConfig),
        );
      }
      setKeyboardState({...keyboardState, isKeyboardVisible: true, keyboardHeight: keyboardHeight});
    };
    if (Platform.OS === 'ios' || typeof props.onKeyboardShowDelay !== 'number') {
      keyboardAnimate();
    } else {
      setTimeout(() => {
        keyboardAnimate();
      }, props.onKeyboardShowDelay);
    }
    setKeyboardState({
      ...keyboardState,
      isKeyboardVisible: true,
      keyboardHeight: keyboardHeight,
      accessoryHeight: keyboardState.visibleAccessoryHeight,
    });
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setKeyboardState({
      ...keyboardState,
      isKeyboardVisible: false,
      keyboardHeight: 0,
      accessoryHeight: props.alwaysVisible ? keyboardState.visibleAccessoryHeight : 0,
    });
  }, []);

  const {isKeyboardVisible, accessoryHeight, keyboardHeight} = keyboardState;

  const {
    bumperHeight,
    alwaysVisible,
    visibleOpacity,
    hiddenOpacity,
    style,
    inSafeAreaView,
    avoidKeyboard,
    visibleEmptyView,
    children,
    enableOnAndroid = true,
  } = props;

  const visibleHeight = accessoryHeight + (avoidKeyboard ? keyboardHeight : 0);
  const applySafeArea = isSafeAreaSupported && inSafeAreaView;
  const isChildRenderProp = typeof children === 'function';
  const heightStyle =
    // eslint-disable-next-line no-nested-ternary
    accessoryHeight + bumperHeight + (applySafeArea ? (!isKeyboardVisible ? 20 : -10) : 0);
  const bottomStyle = [
    styles.accessory,
    {
      backgroundColor: COLORS.BACKGROUND,
      opacity: isKeyboardVisible || alwaysVisible ? visibleOpacity : hiddenOpacity,
      bottom: keyboardHeight - (applySafeArea ? 30 : 20),
      height: visibleEmptyView ? heightStyle : 0,
    },
    style,
  ];
  const viewStyle = StyleSheet.create({
    view: Platform.select({
      android: enableOnAndroid ? bottomStyle : {},
      ios: bottomStyle,
    }),
  });

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{height: keyboardState.isKeyboardVisible || alwaysVisible ? visibleHeight : 0}}>
      <View style={viewStyle.view}>
        {isChildRenderProp ? children({isKeyboardVisible}) : children}
      </View>
    </View>
  );
};

KeyboardAccessoryView.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  animateOn: PropTypes.oneOf(['ios', 'android', 'all', 'none']),
  animationConfig: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  bumperHeight: PropTypes.number,
  visibleOpacity: PropTypes.number,
  minusHeight: PropTypes.number,
  hiddenOpacity: PropTypes.number,
  onKeyboardShowDelay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  androidAdjustResize: PropTypes.bool,
  alwaysVisible: PropTypes.bool,
  hideBorder: PropTypes.bool,
  inSafeAreaView: PropTypes.bool,
  avoidKeyboard: PropTypes.bool,
  visibleEmptyView: PropTypes.bool,
};

KeyboardAccessoryView.defaultProps = {
  animateOn: 'ios',
  bumperHeight: 40,
  visibleOpacity: 1,
  hiddenOpacity: 0,
  minusHeight: 0,
  androidAdjustResize: false,
  alwaysVisible: true,
  hideBorder: true,
  inSafeAreaView: true,
  avoidKeyboard: false,
  visibleEmptyView: true,
};

export default memo(KeyboardAccessoryView);
