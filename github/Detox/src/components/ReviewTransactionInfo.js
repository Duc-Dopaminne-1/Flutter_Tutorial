import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  infoNameContainer: {
    flex: 1,
  },
  name: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.GREY_82,
    alignSelf: 'flex-end',
  },
  value: {
    ...FONTS.semiBold,
    fontSize: 15,
    color: COLORS.BLACK_33,
    flex: 1,
    marginLeft: 4,
  },
});

const ReviewTransactionInfo = ({transactionCode, projectName, code}) => {
  return (
    <View style={styles.infoContainer}>
      <View style={[HELPERS.rowCenter, METRICS.tinyVerticalPadding]}>
        <View style={styles.infoNameContainer}>
          <Text style={styles.name}>{translate(STRINGS.TRANSACTION_CODE)}</Text>
        </View>
        <Text style={styles.value}>{transactionCode}</Text>
      </View>
      <View style={[HELPERS.rowCenter, METRICS.tinyVerticalPadding]}>
        <View style={styles.infoNameContainer}>
          <Text style={styles.name}>{`${translate(STRINGS.PROJECT_NAME)}:`}</Text>
        </View>
        <Text style={styles.value}>{projectName}</Text>
      </View>
      <View style={[HELPERS.rowCenter, METRICS.tinyVerticalPadding]}>
        <View style={styles.infoNameContainer}>
          <Text style={styles.name}>{`${translate(STRINGS.PROPERTY_CODE)}:`}</Text>
        </View>
        <Text style={styles.value}>{code}</Text>
      </View>
    </View>
  );
};

ReviewTransactionInfo.propTypes = {
  projectName: PropTypes.string,
  transactionCode: PropTypes.string,
  code: PropTypes.string,
};

ReviewTransactionInfo.defaultProps = {
  projectName: '',
  transactionCode: '',
  code: '',
};

export default ReviewTransactionInfo;
