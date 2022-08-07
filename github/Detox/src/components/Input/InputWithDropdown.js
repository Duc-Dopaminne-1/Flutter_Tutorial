import React, {useRef} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Select2 from 'react-native-select-two';

import {KEY_BOARD_TYPE, MAX_LENGTH} from '../../assets/constants';
import {FONT_REGULAR} from '../../assets/fonts';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS, normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import DropdownIcon from '../DropdownIcon';
import RequiredStar from '../RequiredStar';

const InputWithDropdown = ({
  title,
  description,
  onSelect,
  error,
  onChangeText,
  isDropdown = true,
  items = [],
  value,
  titleStyle = {},
  style = {},
  inputStyle = {},
  selectBoxStyle = {},
  colorTheme = COLORS.PRIMARY_A100,
  hint,
  ...textInputProps
}) => {
  const selectStyle = {...styles.dropdown, ...selectBoxStyle};
  const modalSelectRef = useRef();

  return (
    <View style={[METRICS.smallVerticalPadding, style]}>
      <View style={HELPERS.row}>
        <Text style={[styles.sectionText, titleStyle]}>
          {title} <RequiredStar />
        </Text>
      </View>
      {!!description && <Text style={styles.smallText}>{description}</Text>}
      <View style={[HELPERS.row]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[commonStyles.borderedInput, {color: COLORS.TEXT_BLACK}, HELPERS.fill, inputStyle]}
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
          maxLength={MAX_LENGTH.default}
          {...textInputProps}
        />
        {isDropdown && <DropdownIcon onPress={() => modalSelectRef.current.showModal()} />}
        {isDropdown ? (
          <Select2
            ref={ref => (modalSelectRef.current = ref)}
            style={selectStyle}
            isSelectSingle={true}
            isRequiredAtLeastOne={true}
            defaultFontName={FONT_REGULAR}
            colorTheme={colorTheme}
            data={items}
            onSelect={(unused, item) => onSelect(item)}
            showSearchBox={false}
            popupTitle={title}
            title={title}
            cancelButtonText={translate(STRINGS.CANCEL)}
            selectButtonText={translate(STRINGS.SELECT)}
            searchPlaceHolderText={translate(STRINGS.ENTER_SEARCH_KEY)}
          />
        ) : (
          <View style={styles.commissionUnit}>
            <Text>%</Text>
          </View>
        )}
      </View>
      {!!hint && <Text style={[commonStyles.blackText12, METRICS.tinyMarginTop]}>{hint}</Text>}
      {error ? <Text style={styles.errorText}>{translate(error)}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionText: {
    ...FONTS.semiBold,
    fontSize: 13,
    color: COLORS.BLACK_33,
  },
  smallText: {
    ...FONTS.regular,
    fontSize: 11,
    color: COLORS.BLACK_4F,
  },
  dropdown: {
    ...commonStyles.dropdown,
    width: '24%',
    marginStart: normal,
  },
  commissionUnit: {
    ...commonStyles.dropdown,
    width: '24%',
    marginStart: normal,
    justifyContent: 'center',
  },
  errorText: {
    ...FONTS.regular,
    paddingTop: 2,
    color: COLORS.STATE_ERROR,
    fontSize: 12,
  },
});

export default InputWithDropdown;
