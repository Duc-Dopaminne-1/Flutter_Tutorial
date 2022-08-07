import React from 'react';
import {StyleSheet, Switch, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import RequiredLabel from '../../../../components/RequiredLabel';

const styles = StyleSheet.create({
  container: {
    ...METRICS.horizontalMargin,
    ...METRICS.marginTop,
  },
  labelText: {
    ...FONTS.semiBold,
    fontSize: 14,
  },
  leftContainer: {
    ...HELPERS.rowSpaceBetweenCenter,
    width: '50%',
  },
});

const SwitchView = ({enable = true, onPress}) => {
  const toggleSwitch = () => onPress(previousState => !previousState);
  return (
    <View style={[HELPERS.rowSpaceBetweenCenter, styles.container]}>
      <RequiredLabel
        title={translate(STRINGS.REQUEST)}
        titleStyle={commonStyles.blackText14}
        isRequired={false}
      />
      <View style={styles.leftContainer}>
        <CustomButton
          title={translate(STRINGS.SENT)}
          titleStyle={styles.labelText}
          titleColor={enable ? COLORS.PRIMARY_A100 : COLORS.BRAND_GREY}
          onPress={() => onPress(true)}
        />
        <Switch
          trackColor={{false: COLORS.PRIMARY_A100, true: COLORS.PRIMARY_A100}}
          thumbColor={COLORS.NEUTRAL_WHITE}
          ios_backgroundColor={COLORS.PRIMARY_A100}
          onValueChange={toggleSwitch}
          value={!enable}
        />
        <CustomButton
          title={translate(STRINGS.RECEIVED)}
          titleStyle={styles.labelText}
          titleColor={enable ? COLORS.BRAND_GREY : COLORS.PRIMARY_A100}
          onPress={() => onPress(false)}
        />
      </View>
    </View>
  );
};

export default SwitchView;
