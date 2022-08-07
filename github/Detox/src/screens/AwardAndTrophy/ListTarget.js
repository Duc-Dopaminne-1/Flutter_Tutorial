import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';

import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {normal, tiny} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  listKPI: {
    flex: 1,
  },
  kpiItem: {
    flex: 1,
    padding: normal,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginBottom: tiny,
  },
  kpiTitle: {
    ...FONTS.semiBold,
    fontSize: 13,
    marginBottom: normal,
    color: COLORS.GREY_82,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressStatus: {
    ...FONTS.semiBold,
    fontSize: 16,
    marginRight: normal,
    minWidth: 30,
  },
  processBar: {
    borderRadius: 5,
    height: 5,
    backgroundColor: COLORS.GREY_C4,
  },
  processBarContianer: {
    flex: 1,
  },
});

const ListTarget = ({listTargets}) => {
  const renderItem = (item, index) => {
    let kpi = 0;
    if (item) {
      if (item.target === 0) {
        kpi = 1;
      } else {
        kpi = item.current / item.target;
      }
    }

    return (
      <View style={styles.kpiItem} key={index}>
        <Text style={styles.kpiTitle}>{item.title}</Text>
        <View style={styles.progressContainer}>
          <Text
            style={[
              styles.progressStatus,
              {color: item.current >= item.target ? COLORS.PRIMARY_A100 : COLORS.BLACK_33},
            ]}>
            {item.current}/{item.target}
          </Text>
          <View style={styles.processBarContianer}>
            <ProgressBar progress={kpi} color={COLORS.PRIMARY_A100} style={styles.processBar} />
          </View>
        </View>
      </View>
    );
  };
  return <View style={styles.listKPI}>{listTargets.map(renderItem)}</View>;
};

ListTarget.propTypes = {
  listTargets: PropTypes.array,
};

ListTarget.defaultProps = {
  listTargets: [],
};

export default ListTarget;
