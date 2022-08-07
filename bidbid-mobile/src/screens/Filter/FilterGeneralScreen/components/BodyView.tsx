import {
  FILTER_AGE_RANGE_SCREEN,
  FILTER_AUCTION_STATUS_SCREEN,
  FILTER_GENDER_SCREEN,
  FILTER_IG_USERNAME_SCREEN,
  FILTER_LOCATION_SCREEN,
  FILTER_PROFILES_SCREEN,
} from '@/navigation/screenKeys';
import { getFiltersGeneral } from '@/redux/filters/actions';
import FilterGlobalContainer from '@/screens/Filter/FilterGeneralScreen/components/FilterGlobalContainer';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { CellEnum } from './CellDetail';
import FilterAgeRangeContainer from './FilterAgeRangeContainer';
import FilterAuctionStatusContainer from './FilterAuctionStatusContainer';
import FilterLocationContainer from './FilterLocationContainer';
import FilterSearchIGContainer from './FilterSearchIGContainer';
import FilterShowMeContainer from './FilterShowMeContainer';
import FilterProfilesContainer from '@/screens/Filter/FilterGeneralScreen/components/FilterProfilesContainer';

const CONTAINER: ViewStyle = {
  flex: 1,
};

export interface BodyViewProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: ViewStyle;
  onCellPressedCallBack?: (screenName: string) => void;
}

export function BodyView(props: BodyViewProps): ReactElement {
  const { style, onCellPressedCallBack = () => {} } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getFiltersGeneral({
        onSuccess: (_: any[]) => {},
        onFail: () => {},
      }),
    );
  }, []);

  const onCellPressed = useCallback((type: CellEnum) => {
    let screenName = '';
    switch (type) {
      case CellEnum.LOCATION: {
        screenName = FILTER_LOCATION_SCREEN;
        break;
      }

      case CellEnum.GENDER: {
        screenName = FILTER_GENDER_SCREEN;
        break;
      }

      case CellEnum.AGE_RANGE: {
        screenName = FILTER_AGE_RANGE_SCREEN;
        break;
      }

      case CellEnum.AUCTION_STATUS: {
        screenName = FILTER_AUCTION_STATUS_SCREEN;
        break;
      }

      case CellEnum.PROFILES: {
        screenName = FILTER_PROFILES_SCREEN;
        break;
      }

      case CellEnum.IG_USERNAME: {
        screenName = FILTER_IG_USERNAME_SCREEN;
        break;
      }

      default:
        break;
    }

    onCellPressedCallBack && onCellPressedCallBack(screenName);
  }, []);

  return (
    <View style={[CONTAINER, style]}>
      <FilterGlobalContainer />

      <FilterLocationContainer onCellPressed={onCellPressed} />

      <FilterShowMeContainer onCellPressed={onCellPressed} />

      <FilterAgeRangeContainer onCellPressed={onCellPressed} />

      <FilterAuctionStatusContainer onCellPressed={onCellPressed} />

      <FilterProfilesContainer onCellPressed={onCellPressed} />

      <FilterSearchIGContainer onCellPressed={onCellPressed} />
    </View>
  );
}
