import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../../components/Button/CustomButton';

const styles = StyleSheet.create({
  buttonCancelFilter: {
    width: '30%',
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 12,
    marginEnd: normal,
    marginTop: 8,
  },
  viewBottom: {
    flexDirection: 'row',
    marginVertical: normal,
    paddingHorizontal: normal,
  },
  buttonSearch: {
    marginTop: 8,
    flex: 1,
  },
  titleStyle: {...FONTS.bold},
});

const FilterFloorBottom = ({onPressApply, onPressCancelFilter}) => {
  return (
    <View style={styles.viewBottom}>
      <CustomButton
        titleStyle={styles.titleStyle}
        style={styles.buttonCancelFilter}
        title="Bỏ chọn"
        onPress={onPressCancelFilter}
        titleColor={COLORS.PRIMARY_A100}
      />
      <CustomButton
        titleStyle={styles.titleStyle}
        style={[commonStyles.buttonNext, styles.buttonSearch]}
        title="Áp dụng"
        onPress={onPressApply}
      />
    </View>
  );
};

export default FilterFloorBottom;
