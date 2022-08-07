import React from 'react';
import {StyleSheet} from 'react-native';

import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal} from '../../../../assets/theme/metric';
import RequiredLabel from '../../../../components/RequiredLabel';

const styles = StyleSheet.create({
  labelText: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.semiBold,
  },
  label: {
    marginTop: normal,
  },
});

const NewPostRequiredLabel = ({title}) => {
  return <RequiredLabel title={title} titleStyle={styles.labelText} style={styles.label} />;
};

export default NewPostRequiredLabel;
