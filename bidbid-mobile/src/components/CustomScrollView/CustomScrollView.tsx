import { vs } from '@/vars/scaling';
import React, { FC, useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { Animated, ScrollView, ScrollViewProps } from 'react-native';

import styles from './styles';

interface CustomScrollViewProps extends ScrollViewProps {
  scrollBarHeight?: number;
  onScrollEvent?: (event: any) => void;
}

const CustomScrollView: FC<CustomScrollViewProps> = ({ scrollBarHeight = vs(120), onScrollEvent, ...props }) => {
  const scrollIndicator = useRef(new Animated.Value(0)).current;
  const [animatedOpacity] = useState(new Animated.Value(0));
  const [completeScrollBarHeight, setCompleteScrollBarHeight] = useState(scrollBarHeight);
  const [visibleScrollBarHeight, setVisibleScrollBarHeight] = useState(0);

  const displayScrollBar = useCallback(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animatedOpacity, {
        toValue: 0,
        duration: 300,
        delay: 3000,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    displayScrollBar();
  }, []);

  const scrollIndicatorSize = useMemo(
    () =>
      completeScrollBarHeight >= visibleScrollBarHeight
        ? (visibleScrollBarHeight * scrollBarHeight) / completeScrollBarHeight
        : visibleScrollBarHeight,
    [completeScrollBarHeight, visibleScrollBarHeight, scrollBarHeight],
  );

  const difference = useMemo(
    () => (scrollBarHeight > scrollIndicatorSize ? scrollBarHeight - scrollIndicatorSize : 1),
    [scrollBarHeight, scrollIndicatorSize],
  );

  const scrollIndicatorPosition = useMemo(
    () =>
      Animated.multiply(scrollIndicator, scrollBarHeight / completeScrollBarHeight).interpolate({
        inputRange: [0, difference],
        outputRange: [0, difference],
        extrapolate: 'clamp',
      }),
    [scrollIndicator, scrollBarHeight, completeScrollBarHeight, difference],
  );

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onContentSizeChange={(_, height) => {
          setCompleteScrollBarHeight(height);
        }}
        onLayout={({
          nativeEvent: {
            layout: { height },
          },
        }) => {
          setVisibleScrollBarHeight(height);
        }}
        onScrollBeginDrag={displayScrollBar}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollIndicator } } }], {
          listener: onScrollEvent,
          useNativeDriver: false,
        })}
        {...props}
      />
      <Animated.View style={[{ height: scrollBarHeight, opacity: animatedOpacity }, styles.scrollBarWrapper]}>
        <Animated.View
          style={[
            {
              height: scrollIndicatorSize,
              transform: [{ translateY: scrollIndicatorPosition }],
            },
            styles.scrollBarIndicator,
          ]}
        />
      </Animated.View>
    </>
  );
};

export default CustomScrollView;
