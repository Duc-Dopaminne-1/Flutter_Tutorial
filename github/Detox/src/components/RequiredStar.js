import React from 'react';
import {Text} from 'react-native';

import {commonStyles} from '../assets/theme/styles';

const RequiredStar = () => {
  return <Text style={commonStyles.requiredSymbol}>*</Text>;
};

export default RequiredStar;
