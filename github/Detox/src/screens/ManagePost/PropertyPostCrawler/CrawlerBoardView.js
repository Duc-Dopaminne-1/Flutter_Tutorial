import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';

const styles = StyleSheet.create({
  posted: {
    ...commonStyles.blackTextBold24,
    color: COLORS.GREEN_BASIC,
  },
  rejected: {
    ...commonStyles.blackTextBold24,
    color: COLORS.STATE_ERROR,
  },
  progressing: {
    ...commonStyles.blackTextBold24,
    color: COLORS.ORANGE_BASIC,
  },
  line: {
    width: 1,
    height: '100%',
    backgroundColor: COLORS.LINE_COLOR,
  },
  grayTitle: {
    ...commonStyles.grayText14,
    ...METRICS.tinyMarginTop,
    ...FONTS.fontSize14,
  },
});

const CrawlerBoardView = ({data, style}) => {
  const {distributed = 0, posted = 0, rejected = 0, progressing = 0} = data;
  return (
    <View style={[HELPERS.rowSpaceBetweenCenter, METRICS.smallNormalVerticalPadding, style]}>
      <View style={HELPERS.colCenter}>
        <Text style={commonStyles.blackTextBold24}>{distributed}</Text>
        <Text style={styles.grayTitle}>
          {translate('propertyPost.crawler.propertyDistributed')}
        </Text>
      </View>
      <View style={styles.line} />
      <View style={HELPERS.colCenter}>
        <Text style={styles.posted}>{posted}</Text>
        <Text style={styles.grayTitle}>{translate('propertyPost.crawler.propertyPosted')}</Text>
      </View>
      <View style={styles.line} />
      <View style={HELPERS.colCenter}>
        <Text style={styles.rejected}>{rejected}</Text>
        <Text style={styles.grayTitle}>{translate('propertyPost.crawler.propertyRejected')}</Text>
      </View>
      <View style={styles.line} />
      <View style={HELPERS.colCenter}>
        <Text style={styles.progressing}>{progressing}</Text>
        <Text style={styles.grayTitle}>
          {translate('propertyPost.crawler.propertyProgressing')}
        </Text>
      </View>
    </View>
  );
};

export default CrawlerBoardView;
