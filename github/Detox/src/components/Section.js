import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, tiny} from '../assets/theme/metric';
import {SCREEN_SIZE} from '../utils/ImageUtil';

const styles = StyleSheet.create({
  container: {
    ...METRICS.mediumMarginTop,
  },
  sectionTextContainer: {
    ...METRICS.horizontalMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionText: {
    ...HELPERS.fill,
    ...FONTS.semiBold,
    fontSize: 12,
    maxWidth: SCREEN_SIZE.WIDTH * 0.6,
  },
  viewMore: {
    ...FONTS.bold,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
    marginEnd: tiny,
  },
  seeMoreContainer: {
    ...HELPERS.row,
    ...HELPERS.rowCenter,
    marginTop: 3,
  },
});

const Section = ({
  sectionName,
  children,
  onViewMore,
  titleStyle,
  viewMoreStyle,
  containerStyle,
  titleContainerStyle,
  isViewMoreVisible = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.sectionTextContainer, titleContainerStyle]}>
        <Text style={[styles.sectionText, titleStyle]}>{sectionName}</Text>
        {onViewMore && isViewMoreVisible && (
          <TouchableOpacity hitSlop={CONSTANTS.HIT_SLOP_SMALL} onPress={onViewMore}>
            <View style={styles.seeMoreContainer}>
              <Text style={[styles.viewMore, viewMoreStyle]}>{translate(STRINGS.VIEW_MORE)}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

Section.propsTypes = {
  sectionName: PropTypes.string,
  onViewMore: PropTypes.func,
  isViewMoreVisible: PropTypes.bool,
  titleStyle: Text.propTypes.style,
  viewMoreStyle: Text.propTypes.style,
  containerStyle: ViewPropTypes.style,
  titleContainerStyle: ViewPropTypes.style,
};

export default Section;
