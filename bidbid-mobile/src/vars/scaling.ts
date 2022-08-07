import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] = width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Will return a linear scaled result of the provided size, based on your device's screen width
export const scale = (size: number) => (shortDimension / guidelineBaseWidth) * size;

// Will return a linear scaled result of the provided size, based on your device's screen height.
export const verticalScale = (size: number) => (longDimension / guidelineBaseHeight) * size;

/**
 * Sometimes you don't want to scale everything in a linear manner, that's where moderateScale comes in.
 * The cool thing about it is that you can control the resize factor (default is 0.5).
 * If normal scale will increase your size by +2X, moderateScale will only increase it by +X, for example:
 * scale(10) = 20
 * moderateScale(10) = 15
 * moderateScale(10, 0.1) = 11
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

// Same as moderateScale, but using verticalScale instead of scale.
export const moderateVerticalScale = (size: number, factor = 0.5) => size + (verticalScale(size) - size) * factor;

// All scale functions can be imported using their shorthand alias as well:
export const s = scale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
export const windowSize = { width, height };
