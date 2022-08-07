import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {ICONS} from '../../../assets/icons';
import CustomIcon from '../../../assets/icons/CustomIcon';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import BaseFilterScreen from '../../../components/BaseFilterScreen';

const ICON_SIZE = 125;
const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
  icon: {
    ...HELPERS.selfCenter,
    ...METRICS.mediumMarginTop,
    marginBottom: 64,
  },
  description: {
    ...FONTS.regular,
    ...METRICS.marginBottom,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
    textAlign: 'center',
  },
});

const SuccessPopup = ({onClose, onConfirmed, title, message, customMessage}) => {
  return (
    <BaseFilterScreen
      title={title}
      titleStyle={styles.title}
      rightButtonText={translate(STRINGS.BUTTON_OK)}
      isLeftButtonVisible={false}
      onClose={onClose}
      onConfirmed={onConfirmed}>
      <CustomIcon
        color={COLORS.PRIMARY_A100}
        size={ICON_SIZE}
        name={ICONS.DOUBLE_CHECK}
        style={styles.icon}
      />
      {!isEmpty(message) && <Text style={styles.description}>{message}</Text>}
      {customMessage && customMessage()}
    </BaseFilterScreen>
  );
};

export default SuccessPopup;
