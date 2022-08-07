import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {COLORS} from '../../assets/theme/colors';

const ANIMATION_MAX_HEIGHT = 80;

const getPixelAnimation = () => {
  return {
    STATUS_BAR: getStatusBarHeight(true) - 4,
    HEADER_HEIGHT: 45,
    INFO_VIEW: 50,
    BLOCK_SELECTED: 45,
    INFO_FLOOR_HEIGHT: 63,
    FLOOR_SELECTED: 30,
    MARGIN_SPACE: 16,
  };
};

const useAnimationSlotSelect = () => {
  const {STATUS_BAR, INFO_VIEW, BLOCK_SELECTED, HEADER_HEIGHT, MARGIN_SPACE} = getPixelAnimation();
  const INFO_PROPERTY_HEIGHT = STATUS_BAR + HEADER_HEIGHT + MARGIN_SPACE;

  const HEADER_STYLE = INFO_PROPERTY_HEIGHT + INFO_VIEW + MARGIN_SPACE * 2;

  const HEADER_INFO_OF_BLOCK = INFO_VIEW + BLOCK_SELECTED;

  const NUMBER_FLOOR_SELECTED = HEADER_INFO_OF_BLOCK + BLOCK_SELECTED;

  const POSTION_TOP_LIST = NUMBER_FLOOR_SELECTED + MARGIN_SPACE * 2;

  const scrollSelectionList = useSharedValue(0);
  // View thông tin project
  const projectInfoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT],
            [1, 1.3],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT],
            [1, -23],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateX: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            [16, 32, 80],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: HEADER_STYLE,
      backgroundColor: COLORS.NEUTRAL_WHITE,
      width: '100%',
      zIndex: 999,
      transform: [
        {
          translateY: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            [0, -(ANIMATION_MAX_HEIGHT / 2), -ANIMATION_MAX_HEIGHT],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const projectSubInfo = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollSelectionList.value,
        [0, ANIMATION_MAX_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT],
            [1, 0.8],
            Extrapolate.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT / 2],
            [0, -10],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const headerStyle1 = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      top: NUMBER_FLOOR_SELECTED,
      backgroundColor: COLORS.NEUTRAL_WHITE,
      zIndex: 1,
      transform: [
        {
          translateY: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            [0, -(ANIMATION_MAX_HEIGHT / 2), -ANIMATION_MAX_HEIGHT],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const headerStyle2 = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: HEADER_INFO_OF_BLOCK,
      left: 0,
      right: 0,
      zIndex: 1,
      backgroundColor: COLORS.NEUTRAL_WHITE,
      transform: [
        {
          translateY: interpolate(
            scrollSelectionList.value,
            [0, ANIMATION_MAX_HEIGHT / 2, ANIMATION_MAX_HEIGHT],
            [0, -(ANIMATION_MAX_HEIGHT / 2), -ANIMATION_MAX_HEIGHT],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const resetAnimation = () => {
    scrollSelectionList.value = withSpring(0);
  };

  return {
    resetAnimation,
    headerStyle2,
    headerStyle1,
    scrollSelectionList,
    headerStyle,
    POSTION_TOP_LIST,
    projectSubInfo,
    projectInfoStyle,
    INFO_PROPERTY_HEIGHT,
  };
};

export default useAnimationSlotSelect;
