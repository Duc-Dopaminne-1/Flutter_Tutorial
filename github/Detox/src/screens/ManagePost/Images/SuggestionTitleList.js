import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import LabelSectionLimited from '../NewPost/NewPostComponents/LabelSectionLimited';

const SuggestionTitleList = ({data = [], value = '', onSelectItem = () => {}}) => {
  return (
    <View style={styles.container}>
      <LabelSectionLimited
        style={styles.labelContainer}
        leftProps={{
          title: translate('common.suggestionTitle'),
          titleStyle: {...FONTS.bold},
          isRequired: false,
        }}
        rightProps={{
          isRequired: false,
        }}
      />
      {data.map(item => {
        const isSelected = value === item.value;
        return (
          <TouchableOpacity
            onPress={() => onSelectItem(item?.value)}
            key={item.id}
            disabled={isSelected}
            style={[styles.button, isSelected && styles.buttonSelected]}>
            {isSelected && <Image source={IMAGES.IC_SUCCESS_FILL} style={styles.icon} />}
            <Text
              style={[styles.buttonText, isSelected && styles.buttonTextSelected]}
              numberOfLines={3}>
              {item.value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingVertical: 8,
  },
  labelContainer: {
    marginBottom: 10,
  },
  button: {
    marginVertical: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: SIZES.BORDER_RADIUS_20,
    backgroundColor: COLORS.SELECTED_AREA,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  buttonText: {...FONTS.regular, fontSize: SIZES.FONT_14},
  buttonSelected: {backgroundColor: COLORS.PRIMARY_A10},
  buttonTextSelected: {color: COLORS.PRIMARY_A100, paddingHorizontal: 10},
  icon: {width: 15, height: 15, borderRadius: 13, borderColor: COLORS.GRAY_C9, overflow: 'hidden'},
});

export default SuggestionTitleList;
