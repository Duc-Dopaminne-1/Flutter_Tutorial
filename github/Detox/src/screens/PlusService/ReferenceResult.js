import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {APP_CURRENCY} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal} from '../../assets/theme/metric';
import LinkTextButton from '../../components/LinkTextButton';
import MeasureUtils from '../../utils/MeasureUtils';

const styles = StyleSheet.create({
  container: {
    marginTop: normal,
  },
  title: {
    fontSize: 16,
    ...FONTS.bold,
    lineHeight: 23,
    color: COLORS.BLACK_31,
  },
  rowViewDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLinkText: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.fontSize14,
    ...FONTS.bold,
    textDecorationLine: 'none',
    marginRight: 8,
    alignSelf: 'center',
    marginBottom: 0,
  },
  rightArrowIcon: {
    width: 16,
    height: 16,
    marginHorizontal: SIZES.MARGIN_8,
  },
  infoTitle: {
    flex: 1,
    textAlign: 'left',
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.GRAY_A3,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
  horizontalInfoContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

const HorizontalInfo = ({title, value}) => {
  return (
    <View style={styles.horizontalInfoContainer}>
      <Text style={styles.infoTitle}>{title}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const getPriceFormat = price => MeasureUtils.getPriceFullFormat(price, '');
export const ReferenceResult = ({gotoLoanDetail, amount, duration, interest}) => {
  const loanRate = 100;
  const loan = amount * loanRate * 0.01;
  const rate = interest * 0.01;
  const monthlyBase = loan / duration;

  const interests = [];
  let sumInterest = 0;
  const detailData = [];

  for (let i = 0; i < duration; i++) {
    const tmpInterest = (loan * (duration - i) * rate) / duration / 12;
    interests.push(tmpInterest);
    sumInterest += tmpInterest;

    detailData.push([
      getPriceFormat((loan * (duration - i)) / duration),
      getPriceFormat(tmpInterest),
      getPriceFormat(monthlyBase + tmpInterest),
    ]);
  }

  const sumInterestFormat = getPriceFormat(sumInterest);
  const maxFormat = getPriceFormat(monthlyBase + interests[0]);
  const totalPayFormat = getPriceFormat(loan + sumInterest);
  const onPressLoanDetail = () => {
    gotoLoanDetail(detailData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowViewDetail}>
        <Text style={styles.title}>{translate('LOANS_SCREEN.TITLE_REFER_RESULT')}</Text>
        <LinkTextButton
          style={[HELPERS.fillRow, HELPERS.mainEnd, HELPERS.crossCenter]}
          textStyle={styles.detailLinkText}
          onPress={onPressLoanDetail}
          title={translate(STRINGS.DETAIL)}
          rightIcon={
            <Image
              source={IMAGES.ARROW_RIGHT_LINEAR}
              style={styles.rightArrowIcon}
              resizeMode="contain"
            />
          }
        />
      </View>
      <HorizontalInfo
        title={`${translate('LOANS_SCREEN.LABEL_MONEY_ON_MONTH')}:`}
        value={`${maxFormat} ${APP_CURRENCY}`}
      />
      <HorizontalInfo
        title={`${translate('LOANS_SCREEN.LABEL_INTERSET_TOTAL')}:`}
        value={`${sumInterestFormat} ${APP_CURRENCY}`}
      />
      <HorizontalInfo
        title={`${translate('LOANS_SCREEN.LABEL_TOTAL_MONEY')}:`}
        value={`${totalPayFormat} ${APP_CURRENCY}`}
      />
    </View>
  );
};
