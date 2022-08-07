import {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated';

const INPUT_RANGE = [0, 70, 140];
export const useHeaderAnimation = ({animatedValue}) => {
  const viewStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedValue.value, INPUT_RANGE, [1, 0.5, 0], Extrapolate.CLAMP),
      transform: [
        {
          translateY: interpolate(
            animatedValue.value,
            INPUT_RANGE,
            [0, -70, -140],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const headerScale = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedValue.value, INPUT_RANGE, [0, 0, 1], Extrapolate.CLAMP),
    };
  });

  return {viewStyle, headerScale};
};
