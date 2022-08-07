import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../assets/constants/sizes';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS, normal} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {getColorStyleTextEditable} from '../utils/UiUtils';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  titleHeader: {
    fontSize: 15,
    color: COLORS.ITEM_TITLE,
    ...FONTS.regular,
  },
  rightButton: {
    ...commonStyles.dropdown,
    borderColor: COLORS.GREY_BERMUDA,
    borderWidth: SIZES.BORDER_WIDTH_1,
    justifyContent: 'center',
    marginStart: normal,
  },
  titleRightButton: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.GREY_BERMUDA,
  },
});

export const InputButton = ({
  headerStyles,
  headerTitle,
  isRequired,
  value,
  onChangeText,
  editable,
  buttonTitle,
  onPress,
}) => {
  const textColorStyle = getColorStyleTextEditable(editable);
  return (
    <View style={METRICS.smallVerticalPadding}>
      <View style={HELPERS.row}>
        <Text style={[styles.titleHeader, headerStyles]}>
          {headerTitle} {isRequired && <RequiredStar />}
        </Text>
      </View>
      <View style={HELPERS.row}>
        <TextInput
          style={[commonStyles.borderedInput, HELPERS.fill, textColorStyle]}
          headerTitle={headerTitle}
          onChangeText={onChangeText}
          value={value}
          editable={editable}
        />
        <TouchableOpacity style={styles.rightButton} onPress={onPress}>
          <Text style={styles.titleRightButton}>{buttonTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

InputButton.defaultProps = {
  headerTitle: 'title',
  value: 'value',
  buttonTitle: 'button',
  onPress: () => {},
};
