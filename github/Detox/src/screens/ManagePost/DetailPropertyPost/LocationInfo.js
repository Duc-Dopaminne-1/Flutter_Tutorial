import React, {useMemo, useState} from 'react';
import {Text, View} from 'react-native';

import {KEY_BOARD_TYPE, PROPERTY_LOCATION} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import InputSection from '../../../components/InputSection';

const locationTypes = [
  {
    id: PROPERTY_LOCATION.FRONTAGE,
    title: translate(STRINGS.TOWN_HOUSE),
    name: translate(STRINGS.TOWN_HOUSE),
    checked: false,
  },
  {
    id: PROPERTY_LOCATION.ALLEY,
    title: translate(STRINGS.ALLEY),
    name: translate(STRINGS.ALLEY),
    checked: false,
  },
];

const LocationInfo = ({
  onSelect,
  onInputText,
  locationError,
  alleyWidthError,
  locationId,
  alleyWidth,
}) => {
  const getLocations = () =>
    locationTypes.map(e => ({...e, checked: locationId ? locationId === e.id : e.checked}));
  const locations = useMemo(getLocations, [locationId]);
  const [isFocusInput, setIsFocusInput] = useState(false);

  const onChosenItem = item => {
    onSelect && onSelect(item.id);
  };

  const onChangeAlleyWidth = width => {
    onInputText && onInputText(width);
  };

  const isAlley = locationId === PROPERTY_LOCATION.ALLEY;

  return (
    <>
      <DropdownWithTitle
        colorTheme={COLORS.PRIMARY_A100}
        style={METRICS.marginTop}
        inputStyle={commonStyles.inputBorderWithIcon}
        title={translate(STRINGS.LOCATION)}
        placeholder={translate('newPost.locationPlaceholder')}
        headerStyles={[commonStyles.blackTextBold16, METRICS.resetPadding]}
        selectedStyle={commonStyles.blackText16}
        popupTitle={translate(STRINGS.LOCATION)}
        items={locations}
        showSearchBox={false}
        onChosen={onChosenItem}
        dropdownPlaceHolderStyle={commonStyles.placeholderText16}
        error={locationError}
        isRequired
      />
      {isAlley && (
        <InputSection
          isRequired
          customStyle={METRICS.smallMarginTop}
          inputStyle={[HELPERS.fullSize, commonStyles.blackText16]}
          inputContainerStyle={{
            ...commonStyles.input,
            ...(isFocusInput && {borderColor: COLORS.PRIMARY_A100}),
          }}
          headerStyles={commonStyles.blackTextBold16}
          headerTitle={translate('newPost.alleyWidth')}
          placeholder={translate('newPost.alleyWidth')}
          onChangeText={onChangeAlleyWidth}
          value={`${alleyWidth ?? ''}`}
          error={alleyWidthError}
          onFocus={() => setIsFocusInput(true)}
          onBlur={() => setIsFocusInput(false)}
          checkOnlyNumber
          customRightComponent={
            <View>
              <Text style={commonStyles.blackText16}>m</Text>
            </View>
          }
          keyboardType={KEY_BOARD_TYPE.FLOAT_NUMBER}
        />
      )}
    </>
  );
};

export default LocationInfo;
