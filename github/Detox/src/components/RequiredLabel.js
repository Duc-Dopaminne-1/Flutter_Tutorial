import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewPropTypes} from 'react-native';

import {FONT_REGULAR} from '../assets/fonts';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  priceLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleHeader: {
    fontSize: 15,
    color: COLORS.ITEM_TITLE,
    ...FONTS.regular,
  },
});
const RequiredLabel = ({title, titleStyle, rightAction, textRight, style, isRequired}) => {
  return (
    <View style={[styles.priceLabelContainer, style]}>
      <Text style={[styles.titleHeader, titleStyle]}>
        {title} {isRequired && <RequiredStar />}
      </Text>
      {textRight && (
        <TouchableOpacity onPress={rightAction}>
          <Text style={[titleStyle, {color: COLORS.PRIMARY_A100, fontFamily: FONT_REGULAR}]}>
            {textRight}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

RequiredLabel.propTypes = {
  title: PropTypes.string,
  style: ViewPropTypes.style,
  isRequired: PropTypes.bool,
};

RequiredLabel.defaultProps = {
  title: '',
  style: {},
  isRequired: true,
};

export default RequiredLabel;
