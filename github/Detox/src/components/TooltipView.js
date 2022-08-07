import React, {useRef, useState} from 'react';
import {Animated, StyleSheet, TouchableWithoutFeedback, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';

export const TOOLTIP_SIDE = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
};

const arrowLength = 5;

const styles = StyleSheet.create({
  tooltipContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipArrowContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolTipContentContainer: {
    zIndex: 1,
    backgroundColor: COLORS.GREY_54,
    padding: 8,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  arrow: {
    backgroundColor: COLORS.GREY_54,
    transform: [{rotateX: '45deg'}, {rotateZ: '45deg'}],
    height: arrowLength * 2,
    width: arrowLength * 2,
  },
});

const getTooltipAdditionalStyle = (state, tooltipOpacity, side) => {
  const separatorLength = arrowLength * 2;
  const isTooltipViewHigherThanContentView = state.tooltipViewHeight >= state.contentViewHeight;
  const isTooltipViewWiderThanContentView = state.tooltipViewWidth >= state.contentViewWidth;
  const onLeftStyle = {
    right: '100%',
    top: isTooltipViewHigherThanContentView
      ? -(state.tooltipViewHeight - state.contentViewHeight) / 2
      : 0,
    // eslint-disable-next-line no-undefined
    bottom: isTooltipViewHigherThanContentView ? undefined : 0,
    marginRight: separatorLength,
  };
  const onRightStyle = {
    left: '100%',
    top: isTooltipViewHigherThanContentView
      ? -(state.tooltipViewHeight - state.contentViewHeight) / 2
      : 0,
    // eslint-disable-next-line no-undefined
    bottom: isTooltipViewHigherThanContentView ? undefined : 0,
    marginLeft: separatorLength,
  };
  const onTopStyle = {
    bottom: '100%',
    left: isTooltipViewWiderThanContentView
      ? -(state.tooltipViewWidth - state.contentViewWidth) / 2
      : 0,
    // eslint-disable-next-line no-undefined
    right: isTooltipViewWiderThanContentView ? undefined : 0,
    marginBottom: separatorLength,
  };
  const onBottomStyle = {
    top: '100%',
    left: isTooltipViewWiderThanContentView
      ? -(state.tooltipViewWidth - state.contentViewWidth) / 2
      : 0,
    // eslint-disable-next-line no-undefined
    right: isTooltipViewWiderThanContentView ? undefined : 0,
    marginTop: separatorLength,
  };
  let posView;
  switch (side) {
    case TOOLTIP_SIDE.top:
      posView = onTopStyle;
      break;
    case TOOLTIP_SIDE.bottom:
      posView = onBottomStyle;
      break;
    case TOOLTIP_SIDE.left:
      posView = onLeftStyle;
      break;
    case TOOLTIP_SIDE.right:
      posView = onRightStyle;
      break;
  }
  const viewStyle = {
    ...posView,
    opacity: tooltipOpacity,
  };
  return viewStyle;
};

const getTooltipArrowPos = side => {
  switch (side) {
    case TOOLTIP_SIDE.top:
      return {
        bottom: -arrowLength,
        left: 0,
        right: 0,
      };
    case TOOLTIP_SIDE.right:
      return {
        left: -arrowLength,
        top: 0,
        bottom: 0,
      };
    case TOOLTIP_SIDE.bottom:
      return {
        top: -arrowLength,
        left: 0,
        right: 0,
      };
    case TOOLTIP_SIDE.left:
      return {
        right: -arrowLength,
        top: 0,
        bottom: 0,
      };
  }
};

const fadeInTooltipView = tooltipOpacity => {
  Animated.timing(tooltipOpacity, {
    toValue: 1,
    duration: 1,
  }).start();
};

const fadeoutTooltipView = tooltipOpacity => {
  Animated.timing(tooltipOpacity, {
    toValue: 0,
    duration: 500,
  }).start();
};

const TooltipView = ({children, tooltipContent, onPress, side = TOOLTIP_SIDE.top}) => {
  const [state, setState] = useState({
    tooltipViewHeight: 0,
    tooltipViewWidth: 0,
    contentViewHeight: 0,
    contentViewWidth: 0,
  });
  const tooltipOpacity = useRef(new Animated.Value(0)).current;

  const onPressContent = () => {
    onPress();
    fadeInTooltipView(tooltipOpacity);
    setTimeout(() => fadeoutTooltipView(tooltipOpacity), 500);
  };

  const onTooltipViewRendered = ({nativeEvent}) => {
    const contentViewPos = nativeEvent.layout;
    setState({
      ...state,
      tooltipViewHeight: contentViewPos.height,
      tooltipViewWidth: contentViewPos.width,
    });
  };

  const onContentRendered = ({nativeEvent}) => {
    const contentViewPos = nativeEvent.layout;
    setState({
      ...state,
      contentViewHeight: contentViewPos.height,
      contentViewWidth: contentViewPos.width,
    });
  };

  const tooltipAdditionalStyle = getTooltipAdditionalStyle(state, tooltipOpacity, side);

  const tooltipArrowPos = getTooltipArrowPos(side);
  return (
    <View>
      <Animated.View style={[styles.tooltipContainer, tooltipAdditionalStyle]} pointerEvents="none">
        <View style={styles.toolTipContentContainer} onLayout={onTooltipViewRendered}>
          {tooltipContent}
        </View>
        <View style={[styles.tooltipArrowContainer, tooltipArrowPos]}>
          <View style={styles.arrow} />
        </View>
      </Animated.View>
      <TouchableWithoutFeedback onPress={onPressContent} onLayout={onContentRendered}>
        {children}
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TooltipView;
