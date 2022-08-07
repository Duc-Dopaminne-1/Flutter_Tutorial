import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS, normal, small} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';

const GeneralRequestBottomView = ({isAgree, onConfirm, onCancel, isUpdate}) => {
  return (
    <View style={[styles.bottom, METRICS.horizontalPadding, HELPERS.row]}>
      <CustomButton
        style={[commonStyles.buttonNext, styles.buttonCancel]}
        title={translate(STRINGS.DISCARD)}
        onPress={onCancel}
        titleStyle={{color: COLORS.PRIMARY_A100, ...FONTS.bold}}
      />
      <CustomButton
        style={[
          styles.buttonConfirm,
          isAgree ? commonStyles.buttonNext : commonStyles.disabledButtonNext,
        ]}
        disabled={!isAgree}
        title={isUpdate ? translate(STRINGS.SAVE) : translate(STRINGS.CREATE_NEW)}
        titleStyle={FONTS.bold}
        onPress={onConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {
    marginTop: SIZES.MARGIN_8,
    justifyContent: 'flex-end',
  },
  buttonCancel: {
    marginTop: small,
    flex: 1,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginBottom: normal,
  },
  buttonConfirm: {marginTop: small, flex: 1, marginLeft: SIZES.MARGIN_12, marginBottom: normal},
});

export default GeneralRequestBottomView;
