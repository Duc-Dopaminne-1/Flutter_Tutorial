import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

import {APP_CURRENCY} from '../../../../assets/constants';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import TextView from '../../../../components/TextView';
import NumberUtils from '../../../../utils/NumberUtils';
import PropertyPostUtils from '../../PropertyPostUtils';
import styles from '../styles';

const StatusCheckIcon = ({isValid}) => {
  return (
    <Image
      source={isValid ? IMAGES.IC_SUCCESS_FILL : IMAGES.IC_TL_FAIL}
      style={styles.commissionStatusIcon}
      resizeMode="contain"
    />
  );
};

const CommissionView = ({
  commission,
  commissionBuyer,
  commissionSeller,
  commissionCurrencyUnit,
  negotiable,
  price,
  onPressViewDetail,
}) => {
  const totalCommission = PropertyPostUtils.calculateTotalCommissionAmount(
    price,
    commission,
    commissionCurrencyUnit,
  );
  const totalCommissionText = `${NumberUtils.formatNumberToCurrencyNumber(
    totalCommission || '0',
    0,
  )} ${APP_CURRENCY}`;

  return (
    <View style={styles.propertyGeneralInfoContainer}>
      <TextView
        title={translate(STRINGS.TOTAL_COMMISSION)}
        titleStyle={commonStyles.blackTextBold20}
        customRightComponent={
          <View style={HELPERS.fillRowReverse}>
            <Text style={commonStyles.subColorTextBold20}>{`${totalCommissionText}`}</Text>
          </View>
        }
      />
      <>
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={translate('propertyPost.commissionForSeller')}
          titleStyle={commonStyles.blackText14}
          customRightComponent={
            <View style={HELPERS.fillRowReverse}>
              <StatusCheckIcon isValid={!!commissionSeller} />
            </View>
          }
        />
      </>
      <>
        <View style={commonStyles.separatorRow8} />
        <TextView
          customStyle={HELPERS.fill}
          title={translate('propertyPost.commissionForBuyer')}
          titleStyle={commonStyles.blackText14}
          customRightComponent={
            <View style={HELPERS.fillRowReverse}>
              <StatusCheckIcon isValid={!!commissionBuyer} />
            </View>
          }
        />
      </>
      <>
        <View style={commonStyles.separatorRow8} />
        <TextView
          customStyle={HELPERS.fill}
          title={translate('propertyPost.canBeNegotiable')}
          titleStyle={commonStyles.blackText14}
          customRightComponent={
            <View style={HELPERS.fillRowReverse}>
              <StatusCheckIcon isValid={negotiable} />
            </View>
          }
        />
      </>
      <View style={commonStyles.separatorRow12} />
      <View style={styles.separatorLine} />
      <View style={[HELPERS.fullWidth, HELPERS.center]}>
        <TouchableOpacity
          style={[METRICS.smallPadding, METRICS.smallMarginTop]}
          onPress={onPressViewDetail}>
          <Text style={commonStyles.mainColorTextBold14}>{translate(STRINGS.VIEW_DETAIL)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommissionView;
