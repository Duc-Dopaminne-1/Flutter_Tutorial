import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewPropTypes} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {CONSTANTS, MAX_LENGTH} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import {useGetStreets} from '../hooks/useGetStreetsByCityAndDistrict';
import {NewPostStyles} from '../screens/ManagePost/NewPost/NewPostComponents/NewPostConstant';
import ArrayUtils from '../utils/ArrayUtils';
import NumberUtils from '../utils/NumberUtils';
import DropdownCities from './DropdownCities';
import DropdownDistricts from './DropdownDistricts';
import DropdownWards from './DropdownWards';
import InputSection from './InputSection';

const initialAddress = {
  cityId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  cityName: CONSTANTS.DEFAULT_DROPDOWN_NAME,
  districtId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  districtName: CONSTANTS.DEFAULT_DROPDOWN_NAME,
  wardId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  wardName: CONSTANTS.DEFAULT_DROPDOWN_NAME,
};

const CitiesDistrictsWardsStreet = ({
  address,
  placeHolderHomeNumber = translate(STRINGS.HOME_NUMBER),
  placeHolderStreetName = translate(STRINGS.STREET_NAME),
  styleTextInput = commonStyles.inputBorderWithIcon,
  maxLength = MAX_LENGTH.ADDRESS_INPUT,
  onChangeAddress = () => {},
  onChangeCoordinateText = () => {},
  error,
  disabled = false,
  dropdownPlaceHolderStyle = NewPostStyles.dropdownPlaceholder,
  inputPlaceHolderColor = COLORS.TEXT_DARK_40,
  selectedStyle,
  showCoordinateInput = false,
  colorTheme = COLORS.PRIMARY_A100,
  coordinateText,
  customTitleStyle,
}) => {
  const MAX_LENGTH_NUMBER = 5;
  const [addressState, setAddressState] = useState(address);
  const [focusState, setFocusState] = useState({
    homeAddress: false,
    streetName: false,
    location: false,
  });
  const [originStreets, setOriginStreets] = useState([]);
  const [listStreets, setListStreets] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  useEffect(() => {
    setAddressState(address);
  }, [address]);

  const onSuccess = result => {
    if (ArrayUtils.hasArrayData(result)) {
      setOriginStreets(result);
    }
  };

  const {getStreets} = useGetStreets({onSuccess});
  const getStreetsAPI = () => {
    if (address?.districtId && address?.cityId) {
      getStreets({where: {districtId: address?.districtId, cityId: address?.cityId}});
    }
  };
  useEffect(getStreetsAPI, [address?.districtId, address?.cityId]);

  const onSelectStreetItem = item => {
    if (!isEmpty(item)) {
      const newState = {
        ...addressState,
        streetName: item.streetName,
      };
      setAddressState(newState);
      onChangeAddress(newState);
      setShowSuggest(false);
    }
  };

  const onChangeCity = item => {
    const newState = {
      ...addressState,
      cityId: item.id,
      cityName: item.name,
      districtId: CONSTANTS.DEFAULT_DROPDOWN_ID,
      districtName: CONSTANTS.DEFAULT_DROPDOWN_NAME,
      wardId: CONSTANTS.DEFAULT_DROPDOWN_ID,
      wardName: CONSTANTS.DEFAULT_DROPDOWN_NAME,
      streetName: '',
      homeAddress: '',
    };
    setAddressState(newState);
    onChangeAddress(newState);
  };

  const onChangeDistrict = item => {
    const newState = {
      ...addressState,
      districtId: item.id,
      districtName: item.name,
      wardId: CONSTANTS.DEFAULT_DROPDOWN_ID,
      wardName: CONSTANTS.DEFAULT_DROPDOWN_NAME,
      streetName: '',
      homeAddress: '',
    };

    if (newState?.districtId && newState?.cityId) {
      getStreets({where: {districtId: newState?.districtId, cityId: newState?.cityId}});
    }

    setAddressState(newState);
    onChangeAddress(newState);
  };

  const onChangeWard = item => {
    const newState = {
      ...addressState,
      wardId: item.id,
      wardName: item.name,
      streetName: '',
      homeAddress: '',
    };
    setAddressState(newState);
    onChangeAddress(newState);
  };

  const onChangeLocationText = text => {
    onChangeCoordinateText(text);
  };

  const onChangeTextStreet = text => {
    const newState = {
      ...addressState,
      streetName: text,
    };

    if (!isEmpty(text)) {
      const value = String(text).trim().toLowerCase();
      if (value.length > 0) {
        const filterStreets = originStreets.filter(item =>
          String(item?.streetName).trim().toLowerCase().includes(value),
        );

        setListStreets(
          filterStreets.length > MAX_LENGTH_NUMBER
            ? filterStreets.slice(0, MAX_LENGTH_NUMBER)
            : filterStreets,
        );
        setShowSuggest(filterStreets.length > 0);
      } else {
        setShowSuggest(false);
      }
    } else {
      setShowSuggest(false);
    }

    setAddressState(newState);
    onChangeAddress(newState);
  };

  const onChangeTextHome = text => {
    const newState = {
      ...addressState,
      homeAddress: text,
    };
    setAddressState(newState);
    onChangeAddress(newState);
  };

  const onChangeFocused = value => {
    setFocusState({...focusState, ...value});
  };

  const emptyCity = NumberUtils.parseIntValue(addressState?.cityId) === 0;
  const emptyDistrict = NumberUtils.parseIntValue(addressState?.districtId) === 0;
  const hasWardId = NumberUtils.parseIntValue(addressState?.wardId) !== 0;

  return (
    <>
      <DropdownCities
        colorTheme={colorTheme}
        isRequired
        inputStyle={styleTextInput}
        placeholder={translate(STRINGS.PLACEHOLDER_PROVINCE)}
        placeholderStyle={
          addressState?.cityId <= 0 ? dropdownPlaceHolderStyle : commonStyles.blackText16
        }
        selectedStyle={selectedStyle}
        title={translate(STRINGS.PROVINCE)}
        titleStyle={[commonStyles.blackText14, customTitleStyle]}
        style={METRICS.smallNormalMarginTop}
        selectedId={addressState?.cityId}
        onChangeCity={onChangeCity}
        isRequiredAtLeastOne={true}
        error={error?.city}
        disabled={disabled}
      />
      <DropdownDistricts
        colorTheme={colorTheme}
        isRequired
        inputStyle={emptyCity ? {...styleTextInput, ...styles.disabledInput} : styleTextInput}
        placeholder={translate(STRINGS.PLACEHOLDER_DISTRICT)}
        placeholderStyle={
          addressState?.districtId <= 0 ? dropdownPlaceHolderStyle : commonStyles.blackText16
        }
        selectedStyle={selectedStyle}
        title={translate(STRINGS.DISTRICT)}
        titleStyle={[commonStyles.blackText14, customTitleStyle]}
        style={METRICS.smallNormalMarginTop}
        cityId={addressState?.cityId}
        selectedIds={[{id: addressState?.districtId}]}
        onChangeDistrict={onChangeDistrict}
        isRequiredAtLeastOne={true}
        error={error?.district}
        disabled={emptyCity}
      />
      <DropdownWards
        colorTheme={colorTheme}
        isRequired
        inputStyle={emptyDistrict ? {...styleTextInput, ...styles.disabledInput} : styleTextInput}
        placeholder={translate(STRINGS.PLACEHOLDER_WARD)}
        placeholderStyle={
          addressState?.wardId <= 0 ? dropdownPlaceHolderStyle : commonStyles.blackText14
        }
        selectedStyle={selectedStyle}
        title={translate(STRINGS.WARD)}
        titleStyle={[commonStyles.blackText14, customTitleStyle]}
        style={METRICS.smallNormalMarginTop}
        districtId={addressState?.districtId}
        selectedId={addressState?.wardId}
        onChangeWard={onChangeWard}
        isRequiredAtLeastOne={true}
        error={error?.ward}
        disabled={emptyDistrict}
      />
      <InputSection
        isRequired
        inputStyle={
          focusState?.streetName ? {...styleTextInput, borderColor: colorTheme} : styleTextInput
        }
        placeholder={translate('PLACEHOLDER_STREET_NAME')}
        placeHolderColor={inputPlaceHolderColor}
        maxLength={maxLength}
        value={addressState?.streetName}
        onChangeText={onChangeTextStreet}
        error={error?.streetName}
        editable={hasWardId}
        headerTitle={placeHolderStreetName}
        headerStyles={[commonStyles.blackText14, customTitleStyle]}
        customStyle={METRICS.smallMarginTop}
        onBlur={() => {
          onChangeFocused({streetName: false});
          setShowSuggest(false);
        }}
        onFocus={() => onChangeFocused({streetName: true})}
      />
      {showSuggest && listStreets?.length > 0 && (
        <View style={NewPostStyles.suggestionContainer}>
          {listStreets?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectStreetItem(item)}
              style={NewPostStyles.itemSuggestion}>
              <Text style={commonStyles.blackText14}>{item.streetName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <InputSection
        inputStyle={
          focusState?.homeAddress ? {...styleTextInput, borderColor: colorTheme} : styleTextInput
        }
        placeholder={translate('PLACEHOLDER_HOME_NUMBER')}
        placeHolderColor={inputPlaceHolderColor}
        maxLength={maxLength}
        value={addressState?.homeAddress}
        onChangeText={onChangeTextHome}
        error={error?.homeAddress}
        editable={!disabled}
        headerTitle={placeHolderHomeNumber}
        headerStyles={[commonStyles.blackText14, customTitleStyle]}
        onBlur={() => {
          onChangeFocused({homeAddress: false});
        }}
        onFocus={() => onChangeFocused({homeAddress: true})}
      />

      {showCoordinateInput && (
        <InputSection
          inputStyle={
            focusState?.location ? {...styleTextInput, borderColor: colorTheme} : styleTextInput
          }
          placeholder={translate('newPost.placeHolderCoordinate')}
          placeHolderColor={inputPlaceHolderColor}
          maxLength={maxLength}
          value={coordinateText}
          onChangeText={onChangeLocationText}
          error={error?.coordinateText}
          headerTitle={translate('common.coordinate')}
          headerStyles={[commonStyles.blackText14, customTitleStyle]}
          onBlur={() => {
            onChangeFocused({location: false});
          }}
          onFocus={() => onChangeFocused({location: true})}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  disabledInput: {
    backgroundColor: COLORS.NEUTRAL_DISABLE,
  },
});

CitiesDistrictsWardsStreet.propTypes = {
  address: PropTypes.object,
  placeHolderHomeNumber: PropTypes.string,
  placeHolderStreetName: PropTypes.string,
  styleDropDown: ViewPropTypes.style,
  styleTextInput: ViewPropTypes.style,
  maxLength: PropTypes.number,
  onChangeAddress: PropTypes.func,
  error: PropTypes.object,
};

CitiesDistrictsWardsStreet.defaultProps = {
  address: initialAddress,
  placeHolderHomeNumber: translate(STRINGS.HOME_NUMBER),
  placeHolderStreetName: translate(STRINGS.STREET_NAME),
  styleDropDown: NewPostStyles.dropdown,
  styleTextInput: commonStyles.inputBorderWithIcon,
  maxLength: MAX_LENGTH.ADDRESS_INPUT,
  onChangeAddress: () => {},
  error: {},
};

export default CitiesDistrictsWardsStreet;
