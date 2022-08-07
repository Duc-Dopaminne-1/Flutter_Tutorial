import {StyleSheet} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';

export const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    margin: 16,
    borderRadius: SIZES.BORDER_RADIUS_8,
    ...commonStyles.shadowApp,
  },
  fullName: {
    ...FONTS.bold,
    fontSize: 18,
  },
  groupTitle: {
    ...FONTS.regular,
    fontSize: 14,
    marginBottom: 3,
    color: COLORS.BRAND_GREY,
  },
  groupValue: {
    ...FONTS.regular,
    fontSize: 14,
  },
  soldTitle: {
    ...FONTS.regular,
    fontSize: 14,
    marginBottom: 2,
    color: COLORS.BRAND_GREY,
  },
  soldValue: {
    ...FONTS.regular,
    fontSize: 14,
  },
  sectionText: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    fontSize: 24,
  },
  iconContactView: {
    marginRight: 8,
    width: 32,
    ...HELPERS.center,
  },
  viewContact: {
    flexDirection: 'row',
  },
  viewNameContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  viewName: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  viewRankContainer: {
    marginTop: 12,
    flexDirection: 'row',
    paddingRight: 8,
    alignItems: 'center',
    borderRadius: SIZES.BORDER_RADIUS_20,
  },
  rankImage: {width: 32, height: 32, left: -5},
  rankText: {...FONTS.semiBold, fontSize: 14, marginRight: 8, color: COLORS.NEUTRAL_WHITE},
  infoProperty: {
    borderTopColor: COLORS.SEPARATOR_LINE,
    borderBottomColor: COLORS.SEPARATOR_LINE,
    padding: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginHorizontal: 16,
    ...HELPERS.rowCenter,
  },
  infoRank: {
    ...HELPERS.fillCenter,
    marginHorizontal: 16,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: COLORS.SEPARATOR_LINE,
    borderRightColor: COLORS.SEPARATOR_LINE,
  },
  lineSeparatpr: {borderRightWidth: 1, borderRightColor: COLORS.SEPARATOR_LINE},
});
