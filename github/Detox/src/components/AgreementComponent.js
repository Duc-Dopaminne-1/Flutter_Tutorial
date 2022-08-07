import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import CustomCheckbox from './Checkbox/CustomCheckbox';

const styles = StyleSheet.create({
  label: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.TEXT_DARK_10,
  },
  linkText: {
    ...FONTS.regular,
    fontSize: SIZES.FONT_16,
    color: COLORS.PRIMARY_A100,
  },
  checkBox: {alignSelf: 'flex-start'},
  agreement: {
    flex: 1,
    textAlign: 'justify',
    marginTop: SIZES.MARGIN_4,
  },
});
const AgreementComponent = ({
  checkValue,
  onConfirm,
  isAgree,
  textFirst = '',
  textSeconds = '',
  suffix = '',
  hyperlink = '',
  hyperlink2 = '',
  onPressLink2,
}) => {
  const text = isEmpty(textFirst) ? translate(STRINGS.AGREEMENT_FIRST) : textFirst;
  return (
    <View style={HELPERS.row}>
      <CustomCheckbox
        images={['checkbox', 'checkbox-blank-outline']}
        customCheckedBox
        parentCheckedValue={isAgree}
        checkValue={checkValue}
        style={styles.checkBox}
        hitSlop={CONSTANTS.HIT_SLOP_HORIZONTAL}
      />
      <Text style={[HELPERS.rowWrap, METRICS.smallHorizontalMargin, styles.agreement]}>
        <Text style={styles.label}>{`${text} `}</Text>
        {!isEmpty(hyperlink2) && (
          <Text style={styles.linkText} onPress={onPressLink2}>
            {`${hyperlink2} `}
          </Text>
        )}
        {!isEmpty(textSeconds) && <Text style={styles.label}>{`${textSeconds} `}</Text>}
        <Text style={styles.linkText} onPress={onConfirm}>
          {`${hyperlink} `}
        </Text>
        <Text style={styles.label}>{suffix} </Text>
      </Text>
    </View>
  );
};

export default AgreementComponent;
