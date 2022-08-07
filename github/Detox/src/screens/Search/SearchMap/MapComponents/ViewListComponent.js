import PropTypes from 'prop-types';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, ViewPropTypes} from 'react-native';

import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: COLORS.BLACK_4F,
    borderRadius: 5,
  },
  text: {
    ...FONTS.regular,
    fontSize: 10,
    marginTop: 10,
    marginBottom: 12,
    marginRight: 18,
    color: COLORS.NEUTRAL_WHITE,
  },
  icon: {
    width: 15,
    height: 15,
  },
});

const ViewListComponent = ({style, onPress}) => {
  return (
    <TouchableOpacity style={[styles.viewContainer, style]} onPress={onPress}>
      <Text style={styles.text}>{translate(STRINGS.LIST)}</Text>
      <Image style={styles.icon} source={IMAGES.IC_LIST} />
    </TouchableOpacity>
  );
};

ViewListComponent.propTypes = {
  style: ViewPropTypes.style,
  onPress: PropTypes.func,
};

ViewListComponent.defaultProps = {
  onPress: () => {},
};

export default ViewListComponent;
