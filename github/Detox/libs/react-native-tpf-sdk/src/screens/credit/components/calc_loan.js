import React, { useContext } from 'react';
import { SPACING } from '../../../constants/size';
import { scale } from '../../../utils/responsive';
import { CustomInput } from '../../../components/';
import AppText from '../../../components/app_text';
import { useSelector } from 'react-redux';
import { CUSTOM_COLOR } from '../../../constants/colors';
import { StyleSheet, View } from 'react-native';
import { FONT_SIZE, LINE_HEIGHT } from '../../../constants/appFonts';
import themeContext from '../../../constants/theme/themeContext';

const CalcLoan = props => {
  const theme = useContext(themeContext);
  const { dataInput, onChange } = props;
  const listCategory = useSelector(state => state.credit?.listCategory);

  const onChangeValue = obj => {
    onChange({ ...dataInput, ...obj });
  };

  return (
    <View>
      <CustomInput
        required
        translate
        translateTitle
        type={'select'}
        title={'loan_package.product'}
        placeholder={'loan_package.product_purpose_placeholder'}
        value={dataInput.categoryId}
        selectOptions={listCategory}
        onChangeText={value => {
          onChangeValue({
            categoryId: value,
            categoryName: listCategory?.find(t => t.code === value)?.displayName
          });
        }}
      />
      <AppText translate style={[styles.guideText, { color: theme.text.secondary }]}>
        {'loan_package.loan_guide'}
      </AppText>
    </View>
  );
};

export default CalcLoan;

const styles = StyleSheet.create({
  guideText: {
    fontSize: FONT_SIZE.SubHead,
    lineHeight: LINE_HEIGHT.SUB_TEXT,
    paddingTop: SPACING.XNormal
  },
  input: {
    height: scale(60, false),
    marginVertical: SPACING.Fit
  }
});
