import React, { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, TextStyle, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { language } from '@/i18n';

import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';

import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { colors, fonts } from '@/vars/index';
import { setFilterAgeRange } from '@/redux/filters/actions';
import DefaultText from '@/components/CustomText/DefaultText';

const ROOT_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: colors.transparent,
};

const CONTAINER: ViewStyle = {
  backgroundColor: colors.white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 30,
};

const SLIDER_CONTAINER: ViewStyle = {
  marginHorizontal: 0,
  alignItems: 'center',
};

const VALUE_TEXT: TextStyle = {
  fontSize: fonts.size.s16,
  alignItems: 'flex-end',
  alignSelf: 'flex-end',
  color: colors.gray_900,
  marginRight: 50,
  marginTop: 30,
};

const CUSTOM_MARKER: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const IN_LINE: ViewStyle = {
  backgroundColor: colors.blue_700,
  height: 5,
};

const THUMB_CIRCLE: ViewStyle = {
  backgroundColor: colors.white,
  width: 24,
  height: 24,
  borderRadius: 12,
  margin: 4,
  shadowColor: colors.gray_800,
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 3,
};

const TRACK_LINE: ViewStyle = {
  height: 5,
  backgroundColor: colors.gray_200,
};

const WRAPPER_ACTIVITY_INDICATOR: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: colors.gray_600_alpha,
  justifyContent: 'center',
  alignItems: 'center',
};

const MIN_VALUE = 18;
const MAX_VALUE = 100;

export function FilterAgeRangeScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route: any = useRoute();
  const { opacityViewHandler = () => {} } = route.params;
  const { filters } = useSelector((state: RootState) => {
    return state;
  });
  const [isLoading, setIsLoading] = useState(false);
  const ageRangeSelectedDefault = useMemo(
    () => (filters.ageRange ? [filters.ageRange.min, filters.ageRange.max] : [MIN_VALUE, MAX_VALUE]),
    [],
  );

  const [ageRangeSelected, setAgeRangeSelected] = useState(ageRangeSelectedDefault);

  useEffect(() => {
    opacityViewHandler && opacityViewHandler(0);
  }, []);

  const getIsEditing = (): boolean => {
    return ageRangeSelectedDefault[0] != ageRangeSelected[0] || ageRangeSelectedDefault[1] != ageRangeSelected[1];
  };

  const onBackPressed = (): boolean => {
    opacityViewHandler && opacityViewHandler(1);
    navigation.canGoBack() && navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPressed);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPressed);
      };
    } else {
      return () => {};
    }
  }, []);

  const resetOnPressed = async () => {
    setAgeRangeSelected([MIN_VALUE, MAX_VALUE]);
  };

  const sliderValuesOnValuesChange = (values: number[]) => {
    setAgeRangeSelected(values ? values : [MIN_VALUE]);
  };

  const applyOnPressed = async () => {
    const isEditing = getIsEditing();
    if (isEditing) {
      setIsLoading(true);
      dispatch(
        setFilterAgeRange(ageRangeSelected[0], ageRangeSelected[1], {
          onSuccess: () => {
            setIsLoading(false);
            onBackPressed();
          },
          onFail: () => {
            setIsLoading(false);
          },
        }),
      );
    } else {
      onBackPressed();
    }
  };

  const customMarker = () => {
    return (
      <View style={CUSTOM_MARKER}>
        <View style={THUMB_CIRCLE} />
      </View>
    );
  };

  return (
    <View style={ROOT_VIEW}>
      <View style={CONTAINER}>
        <FilterHeaderView
          leftIcon="back"
          title={language('filterScreen.ageRange')}
          closeOnPressed={onBackPressed}
          resetOnPressed={resetOnPressed}
        />
        <FilterLineBreak />

        <FilterBodyView>
          <DefaultText {...{ style: VALUE_TEXT }}>{`${ageRangeSelected[0]} - ${ageRangeSelected[1]}`}</DefaultText>

          <MultiSlider
            containerStyle={SLIDER_CONTAINER}
            values={ageRangeSelected}
            min={MIN_VALUE}
            max={MAX_VALUE}
            customMarker={customMarker}
            onValuesChange={sliderValuesOnValuesChange}
            selectedStyle={IN_LINE}
            trackStyle={TRACK_LINE}
            isMarkersSeparated={false}
          />
        </FilterBodyView>
        <FilterBottomView applyOnPressed={applyOnPressed} />

        {isLoading && (
          <View style={WRAPPER_ACTIVITY_INDICATOR}>
            <ActivityIndicator color={colors.red_600} />
          </View>
        )}
      </View>
    </View>
  );
}
