import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {ViewPropTypes} from 'react-native';

import {useGetDistrictsByCityIdLazyQuery} from '../api/graphql/generated/graphql';
import {ALL_SELECT, CONSTANTS, FETCH_POLICY} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import DropdownWithTitle from './DropdownWithTitle';

const getSelectedDistrict = (item, selectedIds) => {
  for (const element of selectedIds) {
    if (element.id === item.districtId) {
      return true;
    }
  }
  return false;
};

const mapDistricts = (data, selectedIds) => {
  const districts = data?.districts?.edges;
  if (!districts || !Array.isArray(districts)) {
    return [];
  }

  return districts.map(item => {
    const checked = getSelectedDistrict(item, selectedIds);
    return {
      id: item.districtId,
      name: item.districtName,
      checked: checked,
    };
  });
};

const DropdownDistricts = ({
  cityId,
  selectedIds,
  onChangeDistrict,
  style,
  error,
  isSelectSingle,
  placeholder,
  isRequiredAtLeastOne,
  setDefaultFirst,
  isHaveAll,
  disabled,
  showSearchBox,
  removeDelete,
  isReset,
  title,
  titleStyle,
  inputStyle,
  isRequired = false,
  placeholderStyle,
  colorTheme = COLORS.PRIMARY_A100,
}) => {
  const [districts, setDistricts] = useState([]);
  const [loadingText, setLoadingText] = React.useState(translate(STRINGS.DO_NOT_HAVE_DATA));
  const [getDistricts, {data: districtsData, loading}] = useGetDistrictsByCityIdLazyQuery({
    skip: cityId === 0,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });

  useEffect(() => {
    getDistricts({variables: {where: {cityId: cityId}}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  useEffect(() => {
    setLoadingText(translate(loading ? STRINGS.SEARCHING : STRINGS.DO_NOT_HAVE_DATA));
  }, [loading]);

  const setDistrictsData = () => {
    let listItems = mapDistricts(districtsData, selectedIds);
    if (setDefaultFirst && listItems && listItems.length > 0) {
      const hasItemChecked = listItems.filter(item => item.checked).length > 0;
      if (!hasItemChecked && listItems.length > 0) {
        listItems[0].checked = true;
        onChangeDistrict(listItems[0]);
      }
    }
    if (isHaveAll && cityId && listItems && listItems.length > 0) {
      listItems = [{...ALL_SELECT, checked: false}, ...listItems];
    }
    setDistricts(listItems);
  };

  useEffect(() => {
    setDistrictsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtsData, selectedIds]);

  useEffect(() => {
    if (isReset) {
      setDistrictsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReset]);

  const onSelectDistrict = item => {
    if (isSelectSingle) {
      if (!item) {
        onChangeDistrict({
          id: CONSTANTS.DEFAULT_DROPDOWN_ID,
          name: CONSTANTS.DEFAULT_DROPDOWN_NAME,
          checked: true,
        });
      } else if (item.id !== selectedIds[0]) {
        onChangeDistrict(item);
      }
    } else {
      onChangeDistrict(item);
    }
  };

  const onRemoveItem = item => {
    const arrayObjectIds = item.map(value => ({id: value}));
    onChangeDistrict(arrayObjectIds);
  };

  return (
    <DropdownWithTitle
      colorTheme={colorTheme}
      style={style}
      isRequired={isRequired}
      inputStyle={inputStyle}
      title={title}
      headerStyles={titleStyle}
      dropdownTitle={placeholder}
      popupTitle={translate(STRINGS.DISTRICT)}
      items={districts}
      onChosen={onSelectDistrict}
      onRemoveItem={onRemoveItem}
      error={error}
      isSelectSingle={isSelectSingle}
      isRequiredAtLeastOne={isRequiredAtLeastOne}
      isHaveAll={isHaveAll}
      disabled={disabled}
      emptyText={loadingText}
      showSearchBox={showSearchBox}
      removeDelete={removeDelete}
      dropdownPlaceHolderStyle={placeholderStyle}
    />
  );
};

DropdownDistricts.propTypes = {
  cityId: PropTypes.number,
  selectedIds: PropTypes.array,
  onChangeDistrict: PropTypes.func,
  style: ViewPropTypes.style,
  error: PropTypes.string,
  isSelectSingle: PropTypes.bool,
  placeholder: PropTypes.string,
  isRequiredAtLeastOne: PropTypes.bool,
  setDefaultFirst: PropTypes.bool,
  isHaveAll: PropTypes.bool,
  disabled: PropTypes.bool,
  showSearchBox: PropTypes.bool,
  removeDelete: PropTypes.bool,
  isReset: PropTypes.bool,
};

DropdownDistricts.defaultProps = {
  cityId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  selectedIds: [CONSTANTS.DEFAULT_DROPDOWN_ID],
  onChangeDistrict: () => {},
  style: {},
  error: '',
  isSelectSingle: true,
  placeholder: translate(STRINGS.DISTRICT),
  isRequiredAtLeastOne: true,
  setDefaultFirst: false,
  isHaveAll: false,
  disabled: false,
  showSearchBox: true,
  removeDelete: false,
  isReset: false,
};

export default DropdownDistricts;
