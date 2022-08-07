import React, {useEffect} from 'react';
import {View} from 'react-native';

import {
  FACILITY_TYPE,
  GLOBAL_ACTIONS,
  MAX_LENGTH,
  NEW_POST_MODAL_STATE,
} from '../../../assets/constants';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import RequiredLabel from '../../../components/RequiredLabel';
import ListWithAddition from './component/ListWithAddition';

const mapItems = ({state, facilityType}) => {
  const data =
    facilityType === FACILITY_TYPE.NEARBY
      ? state?.buildingFacility?.nearFacility
      : state?.buildingFacility?.internalFacility;
  const selectedItems = [];
  data?.forEach(e => {
    if (e.checked) {
      selectedItems.push(e);
    }
  });
  return selectedItems;
};

const AddFacilityComponent = ({
  state,
  title,
  dispatch,
  textButtonAdd,
  limitNumber = MAX_LENGTH.MAX_FACILITIES,
  facilityType = FACILITY_TYPE.NEARBY,
  showPopup = () => {},
  onDeleteItem,
}) => {
  const [items, setItems] = React.useState(mapItems({state, facilityType}));

  const changeModalizeState = value => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_MODALIZE_STATE, payload: value});
  };

  const onAddItem = () => {
    const modalizeState =
      facilityType === FACILITY_TYPE.NEARBY
        ? NEW_POST_MODAL_STATE.ADD_AREA_FACILITY
        : NEW_POST_MODAL_STATE.ADD_FURNITURE_FACILITY;
    changeModalizeState(modalizeState);
    showPopup();
  };

  const onPressErase = item => {
    onDeleteItem(item);
  };

  const onChangeBuildingFacility = () => {
    setItems(mapItems({state, facilityType}));
  };

  useEffect(onChangeBuildingFacility, [state.buildingFacility]);

  return (
    <View>
      <RequiredLabel
        style={[METRICS.marginTop, METRICS.smallMarginBottom]}
        title={title}
        titleStyle={commonStyles.blackTextBold16}
        isRequired={false}
      />
      <ListWithAddition
        items={items}
        addText={textButtonAdd}
        limitNumber={limitNumber}
        onAddItem={onAddItem}
        onDeleteItem={onPressErase}
        disabledEdit
      />
    </View>
  );
};

export default AddFacilityComponent;
