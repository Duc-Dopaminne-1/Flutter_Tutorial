import AppText from '../../../../components/app_text';
import { FONT_SIZE } from '../../../../constants/appFonts';
import { SPACING } from '../../../../constants/size';
import React from 'react';
import { Text, View } from 'react-native';
import React, { useContext } from 'react';
import themeContext from '../../../../constants/theme/themeContext';

const SalaryItem = props => {
  const { property, value, translate = false } = props;
  const { fonts } = useContext(themeContext) || {};
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: SPACING.Small
      }}>
      <AppText translate={translate} style={{ fontSize: FONT_SIZE.SubHead }}>
        {property}
      </AppText>
      <Text style={{ fontFamily: fonts?.BOLD }}>{value}</Text>
    </View>
  );
};
export default SalaryItem;
