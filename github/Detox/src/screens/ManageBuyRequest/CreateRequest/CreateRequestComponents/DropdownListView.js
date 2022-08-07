import React, {useEffect, useState} from 'react';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {commonStyles} from '../../../../assets/theme/styles';
import DropdownWithTitle from '../../../../components/DropdownWithTitle';

const mapData = (data, selectedItem) => {
  return data?.map(item => ({
    id: item.id,
    name: item.name,
    checked: item.id === selectedItem?.id ? true : false,
  }));
};

const mapArrayAndArray = (data, selectedArray) => {
  return data?.map(item => {
    let isItemChecked = false;
    selectedArray.forEach(e => {
      if (item.id === e.id) {
        isItemChecked = true;
      }
    });
    return {
      id: item.id,
      name: item.name,
      checked: isItemChecked,
    };
  });
};

const DropdownListView = ({
  data = [],
  viewTitle = '',
  modalTitle = '',
  placeHolder = '',
  onSelected = () => {},
  isSingleSelection = true,
  errorText = '',
  onRemoveItem = () => {},
  isRequired = false,
}) => {
  const [dropdownData, setDropdownData] = useState(data);
  useEffect(() => {
    setDropdownData(data);
  }, [data]);
  const onChosenItem = item => {
    if (item) {
      if (isSingleSelection) {
        setDropdownData(mapData(dropdownData, item));
        onSelected(item);
      } else {
        setDropdownData(mapArrayAndArray(dropdownData, item));
        onSelected(mapArrayAndArray(dropdownData, item));
      }
    }
  };
  return (
    <>
      <DropdownWithTitle
        headerStyles={commonStyles.dropdownHeader}
        inputStyle={commonStyles.dropdownInput}
        title={viewTitle}
        dropdownPlaceHolderStyle={commonStyles.dropdownPlaceHolder}
        dropdownTitle={placeHolder}
        popupTitle={modalTitle}
        items={dropdownData}
        error={errorText}
        itemSelected={() => {}} // TODO Parse data
        onChosen={onChosenItem}
        onRemoveItem={onRemoveItem}
        isRequiredAtLeastOne
        emptyText={translate(STRINGS.DO_NOT_HAVE_DATA)}
        isSelectSingle={isSingleSelection}
        isRequired={isRequired}
      />
    </>
  );
};

export default DropdownListView;
