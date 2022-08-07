import React, { ReactElement, useEffect, useState } from 'react';
import { View, ViewStyle, Platform, BackHandler } from 'react-native';
import { colors } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { language } from '@/i18n';
import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';
import { FindProfiles, TypeFindProfiles } from '@/models/findProfiles';
import FilterProfilesItem from '@/screens/Filter/FilterProfilesScreen/components/FilterFindProfileItem';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import NavigationActionsService from '@/navigation/navigation';
import { saveFiltersFindProfiles } from '@/redux/filters/actions';

const ROOT_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: colors.transparent,
};

const WRAP_CONTAINER: ViewStyle = {
  paddingHorizontal: 0,
};

const CONTAINER: ViewStyle = {
  backgroundColor: colors.white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 30,
};

export function FilterProfilesScreen(): ReactElement {
  const navigation = useNavigation();
  const route: any = useRoute();
  const { opacityViewHandler } = route.params;
  const [profileSelected, setProfileSelected] = useState([]);
  const findProfile = useSelector((state: RootState) => state.filters.findProfiles);
  const data: FindProfiles[] = [
    {
      id: 1,
      type: TypeFindProfiles.FOLLOWED,
      name: language('filterScreen.profilesFollowed'),
    },
    {
      id: 2,
      type: TypeFindProfiles.UN_FOLLOWED,
      name: language('filterScreen.profilesUnfollowed'),
    },
  ];

  useEffect(() => {
    setProfileSelected(findProfile ? findProfile : []);
  }, [findProfile]);

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

  const resetOnPressed = () => {
    setProfileSelected([]);
  };

  const applyOnPressed = async () => {
    if (profileSelected && profileSelected.length > 0) {
      const profile = profileSelected.map(item => {
        const { id, type, name } = item;
        return {
          id,
          type,
          name,
        };
      });
      NavigationActionsService.dispatchAction(saveFiltersFindProfiles({ findProfiles: profile }));
    } else {
      NavigationActionsService.dispatchAction(saveFiltersFindProfiles({ findProfiles: [] }));
    }
    onBackPressed && onBackPressed();
  };

  const checkIsSelected = (category: FindProfiles) => {
    let isSelected = false;
    profileSelected.map(item => {
      if (item.id === category.id) isSelected = true;
    });
    return isSelected;
  };

  const profileOnPressed = async (item: FindProfiles) => {
    let newArray = [...profileSelected];
    if (checkIsSelected(item)) {
      newArray = profileSelected.filter(itemSelected => itemSelected.id !== item.id);
    } else {
      newArray.push(item);
    }
    setProfileSelected(newArray);
  };

  return (
    <View style={ROOT_VIEW}>
      <View style={CONTAINER}>
        <FilterHeaderView
          leftIcon="back"
          title={language('filterScreen.findProfiles')}
          closeOnPressed={onBackPressed}
          resetOnPressed={resetOnPressed}
        />
        <FilterLineBreak />
        <FilterBodyView style={WRAP_CONTAINER}>
          {data.map(item => {
            return <FilterProfilesItem key={item.id.toString()} data={item} listSelected={profileSelected} onPressed={profileOnPressed} />;
          })}
        </FilterBodyView>
        <FilterBottomView applyOnPressed={applyOnPressed} />
      </View>
    </View>
  );
}
