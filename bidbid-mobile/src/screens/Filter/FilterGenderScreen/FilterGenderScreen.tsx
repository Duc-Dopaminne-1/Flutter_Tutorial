import { language } from '@/i18n';
import { Gender } from '@/models/';
import { setFilterGender } from '@/redux/filters/actions';
import { getFilter } from '@/redux/filters/selector';
import { sortArrayByOrder } from '@/shared/processing';
import { colors } from '@/vars';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, BackHandler, Platform, View, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';
import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import FilterGenderItem from './components/FilterGenderItem';

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

interface GenderHash {
  [id: string]: Gender;
}

export function FilterGenderScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route: any = useRoute();
  const gendersList = useMemo(() => sortArrayByOrder(getFilter().data.gendersList) || [], []);
  const genderSelectedList = getFilter().genders || [];
  const { opacityViewHandler } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [genderSelectedTemp, setGenderSelectedTemp] = useState<GenderHash>({});

  const getIsEditing = () => {
    let isEditing = false;
    const currentGerderSelected = Object.values(genderSelectedTemp) || [];
    if (genderSelectedList.length != currentGerderSelected.length) {
      isEditing = true;
    } else {
      genderSelectedList.map(item => {
        if (!genderSelectedTemp[item.id]) {
          isEditing = true;
        }
      });
    }
    return isEditing;
  };

  const genderButtonOnPressed = useCallback(
    (itemSelected: any) => {
      if (!genderSelectedTemp[itemSelected.id]) {
        genderSelectedTemp[itemSelected.id] = itemSelected;
      } else {
        delete genderSelectedTemp[itemSelected.id];
      }
      setGenderSelectedTemp({ ...genderSelectedTemp });
    },
    [genderSelectedTemp],
  );

  useEffect(() => {
    const dictionary: any = genderSelectedList.reduce((dic, currentItem) => {
      dic[currentItem.id] = currentItem;
      return dic;
    }, {});
    setGenderSelectedTemp({ ...dictionary });
  }, []);

  useEffect(() => {
    opacityViewHandler && opacityViewHandler(0);
  }, []);

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
    setGenderSelectedTemp({});
  };

  const applyOnPressed = async () => {
    const isEditing = getIsEditing();
    if (isEditing) {
      setIsLoading(true);
      const genders = Object.values(genderSelectedTemp).map(item => {
        return {
          id: item.id,
          name: item.name.slice(0, -1),
        };
      });
      dispatch(
        setFilterGender(genders, {
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

  return (
    <>
      <View style={ROOT_VIEW}>
        <View style={CONTAINER}>
          <FilterHeaderView
            leftIcon="back"
            title={language('filterScreen.showMe')}
            closeOnPressed={onBackPressed}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <FilterBodyView>
            {gendersList.map(gender => {
              return (
                <FilterGenderItem
                  key={gender.id.toString()}
                  gender={gender}
                  isSelected={genderSelectedTemp[gender.id] ? true : false}
                  onPressed={genderButtonOnPressed}
                />
              );
            })}
          </FilterBodyView>
          <FilterBottomView applyOnPressed={applyOnPressed} />
          {isLoading && (
            <View style={WRAPPER_ACTIVITY_INDICATOR}>
              <ActivityIndicator color={colors.red_600} />
            </View>
          )}
        </View>
      </View>
    </>
  );
}
