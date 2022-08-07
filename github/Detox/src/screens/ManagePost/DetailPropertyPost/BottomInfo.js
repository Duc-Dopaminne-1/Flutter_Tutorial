import isEmpty from 'lodash/isEmpty';
import React, {useRef} from 'react';
import {Text, TextInput, View} from 'react-native';
import Select2 from 'react-native-select-two';

import {KEY_BOARD_TYPE, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {FONT_REGULAR} from '../../../assets/fonts';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownIcon from '../../../components/DropdownIcon';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import RequiredStar from '../../../components/RequiredStar';
import ArrayUtils from '../../../utils/ArrayUtils';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import styles from './styles';

export const InputWithUnit = ({
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
  dropdownPlaceholderStyle,
  isRequired,
  ...textInputProps
}) => {
  const selectStyle = {...styles.dropdown, ...selectBoxStyle, fontSize: SIZES.FONT_16};
  const modalSelectRef = useRef();

  return (
    <View style={[METRICS.smallVerticalPadding, style]}>
      <View style={HELPERS.row}>
        <Text style={[styles.sectionText, titleStyle]}>
          {title} {isRequired && <RequiredStar />}
        </Text>
      </View>
      {!!description && <Text style={styles.smallText}>{description}</Text>}
      <View style={[HELPERS.row]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[
            commonStyles.borderedInput,
            {color: COLORS.TEXT_DARK_10},
            HELPERS.fill,
            inputStyle,
          ]}
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
            stylePlaceholder={dropdownPlaceholderStyle}
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

const PRICE_DROPDOWN = 'PRICE_DROPDOWN';

const BottomInfo = ({state, onComponentChange, legalStatus = [], propertyStatus = []}) => {
  const onChangeItemSelected = ({item, data = [], key = ''}) => {
    if (ArrayUtils.hasArrayData(data)) {
      if (isEmpty(item) || isEmpty(item.id)) {
        onComponentChange({[key]: data[0]}.id);
      } else {
        onComponentChange({[key]: item.id});
      }
    }
  };
  return (
    <View>
      <DropdownWithTitle
        colorTheme={COLORS.PRIMARY_A100}
        style={METRICS.smallMarginTop}
        inputStyle={commonStyles.inputBorderWithIcon}
        title={translate(STRINGS.LEGAL_TYPE)}
        headerStyles={[commonStyles.blackTextBold16, METRICS.resetPadding]}
        selectedStyle={commonStyles.blackText16}
        dropdownTitle={translate(STRINGS.PLACE_HOLDER_LEGAL_TYPE)}
        popupTitle={translate(STRINGS.LEGAL_TYPE)}
        items={legalStatus}
        showSearchBox={false}
        itemSelected={item =>
          onChangeItemSelected({key: STRINGS.LEGAL_STATUS, item: item, data: legalStatus})
        }
        dropdownPlaceHolderStyle={
          isEmpty(state?.LEGAL_STATUS)
            ? NewPostStyles.dropdownPlaceholder
            : commonStyles.blackText16
        }
      />

      <DropdownWithTitle
        colorTheme={COLORS.PRIMARY_A100}
        style={METRICS.marginTop}
        inputStyle={commonStyles.inputBorderWithIcon}
        title={translate(STRINGS.PROPERTY_STATUS)}
        headerStyles={[commonStyles.blackTextBold16, METRICS.resetPadding]}
        selectedStyle={commonStyles.blackText16}
        dropdownTitle={translate(STRINGS.PLACE_HOLDER_PROPERTY_STATUS)}
        popupTitle={translate(STRINGS.PROPERTY_STATUS)}
        items={propertyStatus}
        showSearchBox={false}
        itemSelected={item =>
          onChangeItemSelected({key: STRINGS.PROPERTY_STATUS, item: item, data: propertyStatus})
        }
        dropdownPlaceHolderStyle={
          isEmpty(state?.PROPERTY_STATUS)
            ? NewPostStyles.dropdownPlaceholder
            : commonStyles.blackText16
        }
      />
    </View>
  );
};

export {BottomInfo, PRICE_DROPDOWN};
