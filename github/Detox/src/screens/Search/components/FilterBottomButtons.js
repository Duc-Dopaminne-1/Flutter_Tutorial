import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {METRICS, normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';

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
    ...METRICS.horizontalPadding,
  },
  buttonSearch: {
    marginTop: 8,
    flex: 1,
  },
  titleStyle: {...FONTS.bold},
});

const FilterBottomButtons = ({onPressSearch, onPressCancelFilter}) => {
  return (
    <View style={styles.viewBottom}>
      <CustomButton
        titleStyle={styles.titleStyle}
        style={styles.buttonCancelFilter}
        title={translate(STRINGS.RESET_FILTER)}
        onPress={onPressCancelFilter}
        titleColor={COLORS.PRIMARY_A100}
      />
      <CustomButton
        titleStyle={styles.titleStyle}
        style={[commonStyles.buttonNext, styles.buttonSearch]}
        title={translate(STRINGS.SEARCH)}
        onPress={onPressSearch}
      />
    </View>
  );
};

export default FilterBottomButtons;
