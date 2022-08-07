import React, { useEffect, memo, ReactElement } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { TutorialState } from '@/redux/tutorial/reducer';

interface CustomAnimationUpDownProp {
  children: ReactElement;
  style?: ViewStyle;
}
const CustomAnimationUpDown = (props: CustomAnimationUpDownProp) => {
  const { children, style } = props;
  const index = useSelector((state: TutorialState) => state.tutorial.index);
  const animatedY = new Animated.Value(index === 5 ? -30 : 0);

  useEffect(() => {
    setTimeout(() => {
      Animated.loop(
        Animated.stagger(600, [
          Animated.spring(animatedY, {
            toValue: index === 5 ? -10 : 30,
            tension: 3,
            useNativeDriver: true,
          }),
          Animated.spring(animatedY, {
            toValue: index === 5 ? -30 : 0,
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

  return <Animated.View style={[style, { transform: [{ translateY: animatedY }] }]}>{children}</Animated.View>;
};

export default memo(CustomAnimationUpDown);
