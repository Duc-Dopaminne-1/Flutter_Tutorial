import {StyleSheet} from 'react-native';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {SCREEN_SIZE} from '../../utils/ImageUtil';

const HEADER_IMAGE_RATIO = 171 / 379;
const HEADER_IMAGE_WIDTH = SCREEN_SIZE.WIDTH + 4;
export const HEADER_IMAGE_HEIGHT = HEADER_IMAGE_WIDTH * HEADER_IMAGE_RATIO;

const profileCommonStyle = StyleSheet.create({
  headerImage: {
    position: 'absolute',
    height: HEADER_IMAGE_HEIGHT,
    width: HEADER_IMAGE_WIDTH,
    left: -2,
    top: 0,
  },
  titleLabel: {
    ...HELPERS.selfCenter,
    ...FONTS.semiBold,
    fontSize: 24,
    color: COLORS.NEUTRAL_WHITE,
    marginTop: HEADER_IMAGE_HEIGHT / 2 - 24,
  },
  profileNavContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 4,
  },
});

export default profileCommonStyle;
