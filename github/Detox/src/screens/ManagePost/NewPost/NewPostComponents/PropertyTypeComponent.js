import React, {useEffect, useState} from 'react';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {commonStyles} from '../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';

const mapPropertyTypes = (json, checkedId) => {
  const listTypes = json?.edges;
  if (!listTypes || !Array.isArray(listTypes)) {
    return [];
  }
  return listTypes.map(item => ({
    id: item.propertyTypeId,
    name: item.propertyTypeDescription,
    checked: item.propertyTypeId === checkedId ? true : false,
    type: item.propertyTypeName,
  }));
};

const PropertyTypeComponent = ({state, data, onSelectPropertyType, error, style = {}}) => {
  const [listTypes, setListTypes] = useState([]);

  useEffect(() => {
    const propertyTypes = mapPropertyTypes(data, state.propertyTypeId);
    if (!state.propertyTypeId && propertyTypes.length > 0) {
      propertyTypes[0].checked = true;
      const item = propertyTypes[0];
      onSelectPropertyType(item);
    }
    setListTypes(propertyTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const updatePropertyTypeList = () => {
    if (state?.propertyTypeId) {
      const propertyPostType = mapPropertyTypes(data, state.propertyTypeId);
      setListTypes(propertyPostType);
    }
  };
  useEffect(updatePropertyTypeList, [state.propertyTypeId]);

  return (
    <DropdownWithTitle
      colorTheme={COLORS.PRIMARY_A100}
      style={style}
      isRequired={true}
      inputStyle={commonStyles.inputBorderWithIcon}
      headerStyles={commonStyles.blackTextBold16}
      dropdownPlaceHolderStyle={commonStyles.placeholderText16}
      selectedStyle={commonStyles.blackText16}
      title={translate(STRINGS.PROPERTY_TYPE)}
      dropdownTitle={translate(STRINGS.PROPERTY_TYPE)}
      popupTitle={translate(STRINGS.PROPERTY_TYPE)}
      items={listTypes}
      onChosen={onSelectPropertyType}
      error={error}
    />
  );
};

export default PropertyTypeComponent;
