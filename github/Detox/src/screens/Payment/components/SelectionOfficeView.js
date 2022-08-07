import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownIcon from '../../../components/DropdownIcon';
import ErrorText from '../../../components/ErrorText';
import RequiredStar from '../../../components/RequiredStar';

const styles = StyleSheet.create({
  headerTitle: {
    paddingTop: 4,
    fontSize: 15,
    color: COLORS.ITEM_TITLE,
    ...FONTS.regular,
  },
  dropdown: {
    ...commonStyles.dropdown,
    paddingRight: normal,
  },
  container: {
    ...HELPERS.rowStartCenter,
  },
});

const SelectionOfficeView = ({
  placeHolder = translate('transaction.pleaseChoosePaymentAddress'),
  inputStyle = commonStyles.dropdownInput,
  dropdownPlaceHolderStyle = commonStyles.dropdownPlaceHolder,
  item,
  onPress = () => {},
  title,
  isRequired,
  headerStyles,
  error,
}) => {
  return (
    <>
      {!!title && (
        <View style={HELPERS.row}>
          <Text style={[styles.headerTitle, headerStyles]}>
            {title} {isRequired && <RequiredStar />}
          </Text>
        </View>
      )}
      <View>
        <TouchableOpacity onPress={onPress} style={[styles.container, styles.dropdown, inputStyle]}>
          <Text style={dropdownPlaceHolderStyle}>{item ? item?.branchName : placeHolder}</Text>
        </TouchableOpacity>
        <DropdownIcon onPress={onPress} />
      </View>
      <ErrorText errorText={error} />
    </>
  );
};

export default SelectionOfficeView;
