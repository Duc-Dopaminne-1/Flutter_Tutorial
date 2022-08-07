import findIndex from 'lodash/findIndex';
import React, {useContext, useReducer} from 'react';

import {AppContext} from '../../appData/appContext/useAppContext';
import {GLOBAL_ACTIONS} from '../../assets/constants';
import SearchDataUtils from '../../utils/SearchDataUtils';
import Filter from './components/Filter';
import {useFilter} from './useFilter';

function reducer(state, action) {
  switch (action.type) {
    case GLOBAL_ACTIONS.FIELD:
      return {...state, [action.fieldName]: action.payload};
    case GLOBAL_ACTIONS.INSERT_WORKING_AREA:
      return {
        ...state,
        placeJson: [...state.placeJson, action.payload],
      };
    case GLOBAL_ACTIONS.INSERT_EXIST_CITY:
      const placeJson = state.placeJson;
      const index = findIndex(placeJson, {city: action.payload.city});
      placeJson.splice(index, 1, action.payload);
      return {
        ...state,
        placeJson: placeJson,
      };
    case GLOBAL_ACTIONS.REMOVE_WORKING_AREA:
      return {
        ...state,
        placeJson: state.placeJson.filter(compareItem => compareItem !== action.payload),
      };
    case GLOBAL_ACTIONS.CHANGE_PRICES:
      return {
        ...state,
        rangePriceJson: action.payload,
      };
    case GLOBAL_ACTIONS.CHANGE_ACREAGES:
      return {
        ...state,
        rangeSquareJson: action.payload,
      };
    case GLOBAL_ACTIONS.ON_PROPERTY_TYPES_CHANGE:
      return {
        ...state,
        propertyTypeJson: action.payload,
      };
    case GLOBAL_ACTIONS.RESET:
      return {
        ...state,
        ...action.payload,
      };

    // case GLOBAL_ACTIONS.CHANGE_PROJECT_PRICE:
    //   return {
    //     ...state,
    //     projectPriceJson: action.payload,
    //   };
    case GLOBAL_ACTIONS.CREATE_WORKING_AREA:
      return {
        ...state,
        placeJson: [action.payload],
      };
  }
}

const SearchFilterScreen = props => {
  const [state, dispatch] = useReducer(reducer, {
    ...props.searchCriteria,
  });
  const context = useContext(AppContext);
  const {getMasterData} = context;
  const masterData = getMasterData();

  const onSelectPropertyType = (item, isSelect) => {
    let changedItems = [...state.propertyTypeJson];
    if (isSelect) {
      changedItems = [...changedItems, item];
    } else {
      const index = findIndex(changedItems, {id: item.id});
      changedItems.splice(index, 1);
    }
    dispatch({type: GLOBAL_ACTIONS.ON_PROPERTY_TYPES_CHANGE, payload: changedItems});
  };
  const onPriceChanged = values => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_PRICES, payload: values});
  };
  const onAcreageChanged = values => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_ACREAGES, payload: values});
  };
  const onChangeBedRoom = item => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'numberOfBedRoom', payload: item.id});
  };
  const onChangeBathRoom = item => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'numberOfBathRoom', payload: item.id});
  };

  // Handle chosen direction items
  const onSelectDirection = (items = []) =>
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: 'directionJson',
      payload: items?.length ? items?.map(item => item?.id) : [],
    });

  const onChangePropertyPostStatus = item => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'propertyPostStatus', payload: item.id});
  };

  const onChangeProjectStatus = item => {
    dispatch({type: GLOBAL_ACTIONS.FIELD, fieldName: 'projectStatus', payload: item.id});
  };

  const onResetFiler = () => {
    dispatch({
      type: GLOBAL_ACTIONS.RESET,
      payload: SearchDataUtils.resetFilter(
        {...props.route?.params, tabIndex: props.searchType},
        masterData,
      ),
    });
  };

  const onProjectPriceChanged = values => {
    dispatch({type: GLOBAL_ACTIONS.CHANGE_PRICES, payload: values});
  };

  // Handle chosen balcony direction items
  const onChosenBalconyDirection = (items = []) =>
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: 'balconyDirectionJson',
      payload: items?.length ? items?.map(item => item?.id) : [],
    });

  const getFilterState = () => {
    const {itemsData, directionJson, balconyDirectionJson, projectStatus} = state;

    return {
      ...state,
      itemsData: {
        ...itemsData,
        balconyDirections: itemsData?.balconyDirections?.map(direction => {
          const directionExistsInJson =
            balconyDirectionJson && balconyDirectionJson?.find(e => e === direction?.id);
          if (directionExistsInJson) {
            return {...direction, checked: true};
          }
          return {...direction, checked: false};
        }),
        directions: itemsData?.directions?.map(direction => {
          const directionExistsInJson =
            directionJson && directionJson?.find(e => e === direction?.id);
          if (directionExistsInJson) {
            return {...direction, checked: true};
          }
          return {...direction, checked: false};
        }),
        statuses: itemsData?.statuses?.map(status => {
          if (status?.id === projectStatus) {
            return {...status, checked: true};
          }
          return {...status, checked: false};
        }),
      },
    };
  };

  const filterProps = useFilter({
    ...props,
    state: getFilterState(),
    dispatch: dispatch,
    onSelectPropertyType: onSelectPropertyType,
    onPriceChanged: onPriceChanged,
    onAcreageChanged: onAcreageChanged,
    onChangeBedRoom: onChangeBedRoom,
    onChangePropertyPostStatus: onChangePropertyPostStatus,
    onChangeBathRoom: onChangeBathRoom,
    onSelectDirection: onSelectDirection,
    onChosenBalconyDirection: onChosenBalconyDirection,
    onChangeProjectStatus: onChangeProjectStatus,
    onResetFiler: onResetFiler,
    onProjectPriceChanged: onProjectPriceChanged,
  });

  return <Filter {...filterProps} />;
};

export default SearchFilterScreen;
