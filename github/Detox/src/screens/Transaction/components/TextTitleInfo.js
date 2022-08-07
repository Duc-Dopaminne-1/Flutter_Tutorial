import React from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';

const styles = StyleSheet.create({
  title: {
    color: COLORS.GRAY_97,
    fontSize: 14,
    flex: 1,
  },
  description: {
    flex: 2,
    color: COLORS.BLACK_33,
  },
  desContainer: {
    flex: 2,
  },
  viewTextInfo: {
    flexDirection: 'row',
    marginTop: normal,
  },
});

type TextTitleInfoProps = {
  title: string,
  des: string,
  titleStyle: TextStyle,
  desStyle: TextStyle,
};

const TextTitleInfo = ({
  title,
  des,
  titleStyle,
  desStyle,
  rightItem,
  subRightItem,
  desContainer,
}: TextTitleInfoProps) => {
  if (subRightItem) {
    return (
      <View style={styles.viewTextInfo}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        <View style={[HELPERS.rowSpaceBetween, styles.desContainer, desContainer]}>
          <Text style={[styles.description, desStyle]}>{des}</Text>
          {subRightItem}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.viewTextInfo}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {rightItem ? rightItem : <Text style={[styles.description, desStyle]}>{des}</Text>}
    </View>
  );
};

export default TextTitleInfo;
