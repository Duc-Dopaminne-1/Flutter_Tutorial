import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {KEY_BOARD_TYPE} from '../assets/constants';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import DropdownWithTitle from './DropdownWithTitle';
import InputSection from './InputSection';
import RequiredStar from './RequiredStar';

const styles = StyleSheet.create({
  headerTitle: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
  },
  dropdownTimeType: {
    width: 100,
  },
});

const InputWithDropdown = ({
  headerTitle,
  headerStyle,
  placeholder,
  dropdownTitle,
  popupTitle,
  list,
  onSelectListItem,
  value,
  error,
  onChangeValue,
  keyboardType = KEY_BOARD_TYPE.DEFAULT,
  isRequired = false,
  ...inputProps
}) => {
  return (
    <>
      <Text style={[styles.headerTitle, headerStyle]}>
        {headerTitle} {isRequired && <RequiredStar />}
      </Text>
      <View style={[HELPERS.fillRow]}>
        <InputSection
          customStyle={[METRICS.resetMargin, METRICS.resetPadding, HELPERS.fill]}
          placeholder={placeholder}
          keyboardType={keyboardType}
          inputStyle={commonStyles.input}
          value={value}
          error={error}
          onChangeText={onChangeValue}
          {...inputProps}
        />
        <View style={commonStyles.separatorColumn12} />
        <DropdownWithTitle
          style={styles.dropdownTimeType}
          inputStyle={
            inputProps.editable
              ? commonStyles.dropdownInput
              : {...commonStyles.dropdownInput, ...commonStyles.dropdownDisabled}
          }
          dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
          popupTitle={popupTitle}
          items={list}
          onChosen={onSelectListItem}
          showSearchBox={false}
          isRequiredAtLeastOne
          disabled={!inputProps.editable}
        />
      </View>
    </>
  );
};

export default InputWithDropdown;
