import React, {useEffect, useState} from 'react';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {DROPDOWN_DIRECTION_MODEL} from '../../model/DropdownDirectionModel';
import DropdownList from './DropdownListView';

const mapDirections = (data, selected) => {
  return data
    ? [
        ...data.map(e => {
          return {
            id: e.id,
            name: e.name,
            checked: e.id === selected?.id,
          };
        }),
      ]
    : [];
};

const mapDirectionsToDropdownData = (data, selectedArray) => {
  return data?.map(item => {
    let isItemChecked = false;
    if (selectedArray) {
      selectedArray.forEach(e => {
        if (item.name === e) {
          isItemChecked = true;
        } else if (!isItemChecked) {
          isItemChecked = false;
        }
      });
    }
    return {
      id: item.id,
      name: item.name,
      checked: isItemChecked,
    };
  });
};

const mapDropdownDataToSendbackData = data => {
  const output = [];
  data?.forEach(e => {
    if (e.checked) {
      output.push(e.name);
    }
  });
  return output;
};

const popRemovedItemFromList = (chosenItemIds, list) => {
  return chosenItemIds?.map(e2 => {
    let output;
    list?.forEach(e => {
      if (e2 === e.id) {
        output = e;
      }
    });
    return output;
  });
};

const SelectDirectionDropdownView = ({onSelected = () => {}, directions}) => {
  const [directionsData, setDirectionsData] = useState(
    mapDirections(DROPDOWN_DIRECTION_MODEL(), {}),
  );
  const updateDirectionsData = () => {
    if (directions) {
      const mapDirectionsToDropdown = mapDirectionsToDropdownData(directionsData, directions);
      setDirectionsData(mapDirectionsToDropdown);
    }
  };
  useEffect(updateDirectionsData, [directions]);
  const onChosenItem = item => {
    if (item) {
      setDirectionsData(item);
      onSelected(mapDropdownDataToSendbackData(item));
    }
  };
  const onRemoveItem = chosenItemIds => {
    const formattedItems = popRemovedItemFromList(chosenItemIds, directionsData);
    onSelected(mapDropdownDataToSendbackData(formattedItems));
  };

  return (
    <DropdownList
      data={directionsData}
      viewTitle={translate(STRINGS.DIRECTION)}
      modalTitle={translate(STRINGS.SELECT_DIRECTION)}
      placeHolder={translate(STRINGS.SELECT_DIRECTION)}
      onSelected={onChosenItem}
      isSingleSelection={false}
      onRemoveItem={onRemoveItem}
    />
  );
};

export default SelectDirectionDropdownView;
