import React from 'react';
import {View} from 'react-native';

import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import RequiredLabel from '../../../../components/RequiredLabel';

const LabelSectionLimited = ({
  style = {},
  leftProps = {
    title: '',
    style: {},
    titleStyle: {},
    isRequired: true,
  },
  rightProps = {
    title: '',
    style: {},
    titleStyle: {},
    isRequired: true,
  },
}) => {
  return (
    <View style={HELPERS.rowSpaceBetweenCenter}>
      <RequiredLabel
        style={[METRICS.marginTop, leftProps.style, style]}
        title={leftProps.title}
        titleStyle={[commonStyles.blackText16, leftProps.titleStyle]}
        isRequired={leftProps.isRequired}
      />
      <RequiredLabel
        style={[METRICS.marginTop, rightProps.style]}
        title={rightProps.title}
        titleStyle={[commonStyles.blackText16, rightProps.titleStyle]}
        isRequired={rightProps.isRequired}
      />
    </View>
  );
};

export default LabelSectionLimited;
