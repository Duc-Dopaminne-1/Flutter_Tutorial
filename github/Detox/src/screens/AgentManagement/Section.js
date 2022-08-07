import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, tiny} from '../../assets/theme/metric';

const styles = StyleSheet.create({
  sectionText: {
    ...HELPERS.fill,
    ...METRICS.normalMarginBottom,
    fontSize: 15,
    ...FONTS.semiBold,
  },
  viewMore: {
    fontSize: 13,
    ...FONTS.semiBold,
    color: COLORS.PRIMARY_A100,
    marginEnd: tiny,
  },
});

const Section = ({sectionName, children, onViewMore, isViewMoreVisible}) => {
  return (
    <View style={METRICS.normalMarginBottom}>
      <View style={[HELPERS.row, METRICS.horizontalMargin]}>
        <Text style={styles.sectionText}>{sectionName}</Text>
        {onViewMore && isViewMoreVisible && (
          <TouchableOpacity onPress={onViewMore}>
            <View style={[HELPERS.row, HELPERS.rowCenter]}>
              <Text style={styles.viewMore}>{translate(STRINGS.VIEW_MORE)}</Text>
              <FontAwesome size={20} name="angle-right" color={COLORS.PRIMARY_A100} />
            </View>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </View>
  );
};

export default Section;
