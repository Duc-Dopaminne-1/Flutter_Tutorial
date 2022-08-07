import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {ViewPropTypes} from 'react-native';

import {useGetWardByDistrictIdLazyQuery} from '../api/graphql/generated/graphql';
import {CONSTANTS, FETCH_POLICY} from '../assets/constants';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import DropdownWithTitle from './DropdownWithTitle';

const mapWards = (data, selectedWardId) => {
  const wards = data?.wards.edges;
  if (!wards || !Array.isArray(wards)) {
    return [];
  }
  return wards.map(item => ({
    id: item.wardId,
    name: item.wardName,
    checked: item.wardId === selectedWardId ? true : false,
  }));
};

const DropdownWards = ({
  onChangeWard,
  style,
  error,
  districtId = CONSTANTS.DEFAULT_DROPDOWN_ID,
  selectedId = CONSTANTS.DEFAULT_DROPDOWN_ID,
  isRequiredAtLeastOne,
  showSearchBox,
  disabled = false,
  title,
  inputStyle,
  isRequired = false,
  placeholder,
  placeholderStyle = {},
  colorTheme = COLORS.PRIMARY_A100,
  titleStyle,
}) => {
  const [wards, setWards] = useState([]);
  const [loadingText, setLoadingText] = React.useState(translate(STRINGS.DO_NOT_HAVE_DATA));
  const [getWards, {data: wardsData, loading}] = useGetWardByDistrictIdLazyQuery({
    skip: districtId === 0,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });

  useEffect(() => {
    getWards({variables: {where: {districtId: districtId}}});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtId]);

  useEffect(() => {
    setWards(mapWards(wardsData, selectedId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wardsData]);

  useEffect(() => {
    setLoadingText(translate(loading ? STRINGS.SEARCHING : STRINGS.DO_NOT_HAVE_DATA));
  }, [loading]);

  const onSelectWard = item => {
    if (!item) {
      onChangeWard({
        id: CONSTANTS.DEFAULT_DROPDOWN_ID,
        name: CONSTANTS.DEFAULT_DROPDOWN_NAME,
        checked: true,
      });
    } else if (item.id !== selectedId) {
      onChangeWard(item);
    }
  };

  return (
    <DropdownWithTitle
      colorTheme={colorTheme}
      style={style}
      dropdownTitle={placeholder}
      isRequired={isRequired}
      inputStyle={inputStyle}
      title={title}
      headerStyles={titleStyle}
      popupTitle={translate(STRINGS.WARD)}
      items={wards}
      onChosen={onSelectWard}
      error={error}
      isRequiredAtLeastOne={isRequiredAtLeastOne}
      emptyText={loadingText}
      showSearchBox={showSearchBox}
      disabled={disabled}
      dropdownPlaceHolderStyle={placeholderStyle}
    />
  );
};

DropdownWards.propTypes = {
  onChangeWard: PropTypes.func,
  style: ViewPropTypes.style,
  error: PropTypes.string,
  districtId: PropTypes.number,
  selectedId: PropTypes.number,
  showSearchBox: PropTypes.bool,
  placeholder: PropTypes.string,
  placeholderStyle: PropTypes.object,
};

DropdownWards.defaultProps = {
  onChangeWard: () => {},
  style: {},
  error: '',
  districtId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  selectedId: CONSTANTS.DEFAULT_DROPDOWN_ID,
  showSearchBox: true,
  placeholder: translate(STRINGS.WARD),
  placeholderStyle: {},
};

export default DropdownWards;
