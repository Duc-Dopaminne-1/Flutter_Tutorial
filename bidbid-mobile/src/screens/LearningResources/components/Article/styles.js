import {StyleSheet} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: SIZES.MARGIN_12,
  },
  headerContainer: {},
  articleMostViewedContainer: {},
  title: {
    ...FONTS.bold,
    fontSize: SIZES.FONT_20,
    color: COLORS.TEXT_DARK_10,
  },
  articleType: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.PRIMARY_A100,
  },
  date: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_14,
    color: COLORS.TEXT_DARK_40,
  },

  sectionTitle: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    color: COLORS.TEXT_DARK_10,
    fontSize: 24,
    marginBottom: SIZES.MARGIN_8,
  },
  articleMostViewedList: {
    marginTop: SIZES.MARGIN_8,
  },
});

export default styles;
