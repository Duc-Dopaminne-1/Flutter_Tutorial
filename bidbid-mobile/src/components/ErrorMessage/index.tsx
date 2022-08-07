import React, { useEffect } from 'react';
import { Animated, ViewStyle } from 'react-native';
import styles from './styles';
import { CustomText } from '../CustomText';

type Props = {
  errorValue: any;
  style?: ViewStyle;
};

const ErrorMessage = ({ errorValue, style }: Props) => {
  const animated = new Animated.Value(0);
  useEffect(() => {
    Animated.spring(animated, {
      toValue: 4,
      restSpeedThreshold: 10,
      speed: 6,
      useNativeDriver: true,
    }).start();
  }, [errorValue]);

  const textAnimation = animated.interpolate({
    inputRange: [0, 1, 2, 3, 4],
    outputRange: [5, 30, 0, 30, 5],
  });

  return (
    <Animated.View style={[styles.wrapText, { transform: [{ translateX: textAnimation }] }, style]}>
      {errorValue ? <CustomText containerStyle={styles.container} titleStyle={styles.errorText} title={errorValue || ''} /> : null}
    </Animated.View>
  );
};

function moviePropsAreEqual(prevMovie, nextMovie) {
  return prevMovie.errorValue === nextMovie.errorValue;
}

export default React.memo(ErrorMessage, moviePropsAreEqual);
