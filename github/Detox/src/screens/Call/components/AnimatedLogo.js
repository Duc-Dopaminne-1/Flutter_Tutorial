import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import {IMAGES} from '../../../assets/images';
import {COLORS} from '../../../assets/theme/colors';
import {useMount} from '../../commonHooks';

const ICON_TOP = 60;
const DELAY_TIME = 400;
const COUNT = 5;
const ICON_SIZE = 100;
const DURATION = COUNT * DELAY_TIME + 1000;

const AnimationImage = Animated.createAnimatedComponent(Image);

const ListRing = ({enabledAnimation}) =>
  [...Array(COUNT).keys()].map(index => (
    <CircleRing key={index} enabledAnimation={enabledAnimation} delay={index * DELAY_TIME} />
  ));

const CircleRing = ({delay, enabledAnimation}) => {
  const ring = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [{scale: interpolate(ring.value, [0, 1], [0, 5])}],
    };
  });

  useMount(() => {
    if (enabledAnimation) {
      ring.value = withDelay(delay, withRepeat(withTiming(1, {duration: DURATION}), -1));
    }
    enabledAnimation;
  });

  return <Animated.View style={[styles.ring, style]} />;
};

export type Props = {
  enabledAnimation: Boolean,
};

const PhoneCallAnimation = ({
  //format
  enabledAnimation = false,
  source: uri,
}: Props) => {
  const image = useSharedValue(0);
  const imageStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: interpolate(image.value, [0, 0.5, 1], [1, 0.95, 1])}],
    };
  });

  useMount(() => {
    if (enabledAnimation) {
      image.value = withDelay(0, withRepeat(withTiming(1, {duration: DURATION}), -1));
    }
    enabledAnimation;
  });

  return (
    <View style={styles.container}>
      <ListRing enabledAnimation={enabledAnimation} />
      <AnimationImage
        style={[styles.midCircle, imageStyle]}
        source={uri ? {uri} : IMAGES.LOGO_CIRCLE}
      />
    </View>
  );
};

export default PhoneCallAnimation;

const styles = StyleSheet.create({
  midCircle: {
    alignItems: 'center',
    top: ICON_TOP,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    position: 'absolute',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: ICON_SIZE,
    height: ICON_SIZE,
    top: ICON_TOP,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 50,
    borderColor: COLORS.ORANGE_4A,
  },
  container: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
