import React, { useEffect, memo, ReactElement } from 'react';
import { Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { TutorialState } from '@/redux/tutorial/reducer';

interface CustomAnimationShakeProp {
  children: ReactElement;
}
const CustomAnimationLoopSwipe = (props: CustomAnimationShakeProp) => {
  const { children } = props;
  const animatedX = new Animated.Value(0);
  const index = useSelector((state: TutorialState) => state.tutorial.index);

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.stagger(700, [
          Animated.spring(animatedX, {
            toValue: index === 2 ? 30 : -30,
            tension: 3,
            useNativeDriver: true,
          }),
          Animated.spring(animatedX, {
            toValue: 0,
            tension: 3,
            useNativeDriver: true,
          }),
        ]),
        {
          iterations: 100,
        },
      ).start();
    }, 1000);
  }, [index]);

  return <Animated.View style={{ transform: [{ translateX: animatedX }] }}>{children}</Animated.View>;
};

export default memo(CustomAnimationLoopSwipe);
