import React, { useEffect, memo, ReactElement } from 'react';
import { Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { TutorialState } from '@/redux/tutorial/reducer';

interface CustomAnimationShakeProp {
  children: ReactElement;
}
const CustomAnimationShake = (props: CustomAnimationShakeProp) => {
  const { children } = props;
  const animated = new Animated.Value(0);
  const index = useSelector((state: TutorialState) => state.tutorial.index);

  useEffect(() => {
    setTimeout(() => {
      Animated.spring(animated, {
        toValue: 8,
        restSpeedThreshold: 10,
        speed: 1,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, [index]);

  const xAnimation = animated.interpolate({
    inputRange: [0, 2, 4, 6, 8],
    outputRange: [5, 30, 0, 30, 5],
  });

  return <Animated.View style={{ transform: [{ translateX: xAnimation }] }}>{children}</Animated.View>;
};

export default memo(CustomAnimationShake);
