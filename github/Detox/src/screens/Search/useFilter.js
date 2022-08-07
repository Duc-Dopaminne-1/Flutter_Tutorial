import {useState} from 'react';

import {ALL_SELECT} from '../../assets/constants';

export const useFilter = ({
  dispatch,
  isShowPlaces = true,
  onAcreageChanged,
  onChangeBathRoom,
  onChangeBedRoom,
  onChangePropertyPostStatus,
  onChosenBalconyDirection,
  onPressConfirm,
  onPriceChanged,
  onProjectPriceChanged,
  onResetFiler,
  onSelectDirection,
  onSelectPropertyType,
  onChangeProjectStatus,
  searchType,
  state,
}) => {
  const [duplicateCityError, setDuplicateCityError] = useState({msg: '', isShow: false});

  const onConfirm = () => {
    onPressConfirm(state);
  };

  const onDuplicateCity = error => {
    setDuplicateCityError({...duplicateCityError, msg: error, isShow: true});
  };

  const onRemoveBalconyDirection = (_, selectedItems) => {
    onChosenBalconyDirection(selectedItems);
  };

  const onRemoveDirection = (_, selectedItems) => {
    onSelectDirection(selectedItems);
  };

  const getDirectionCheckedAll = (directions = []) => {
    return !!(
      directions?.length && directions.find(direction => direction?.id === ALL_SELECT.id)?.checked
    );
  };

  return {
    state,
    onSelectPropertyType,
    isShowPlaces,
    dispatch,
    onDuplicateCity,
    searchType,
    getDirectionCheckedAll,
    onSelectDirection,
    onRemoveDirection,
    onChosenBalconyDirection,
    onRemoveBalconyDirection,
    onPriceChanged,
    onProjectPriceChanged,
    onAcreageChanged,
    onChangePropertyPostStatus,
    onChangeBedRoom,
    onChangeBathRoom,
    duplicateCityError,
    setDuplicateCityError,
    onResetFiler,
    onConfirm,
    onChangeProjectStatus,
  };
};
