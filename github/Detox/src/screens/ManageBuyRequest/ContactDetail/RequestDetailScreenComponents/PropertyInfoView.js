import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {ITEM_TYPE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import PropertyItemGuarantee from '../../../../components/PropertyItem/PropertyItemGuarantee';
import {mapPropertyC2CGuarantee} from '../../../Home/TopenerOfMonth/types';

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    width: '100%',
    ...METRICS.horizontalPadding,
    paddingVertical: 12,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  sectionTitle: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
  },
});

const PropertyInfoView = ({data, formatPrice, onPressProperty}) => {
  if (!data) return null;
  const propertyPostInfo = mapPropertyC2CGuarantee(data, formatPrice);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{translate('contactTrading.contactProperty')}</Text>
      <View style={commonStyles.separatorRow16} />
      <PropertyItemGuarantee
        onPress={onPressProperty}
        {...propertyPostInfo}
        showBrokenInfo={false}
        showForRentBanner={false}
        isShowFollowButton={false}
        itemType={ITEM_TYPE.fullWithPadding}
        showOutline
      />
    </View>
  );
};

export default PropertyInfoView;
