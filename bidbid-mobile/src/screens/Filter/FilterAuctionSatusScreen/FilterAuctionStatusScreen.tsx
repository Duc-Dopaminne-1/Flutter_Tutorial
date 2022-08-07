import React, { ReactElement, useEffect, useState } from 'react';
import { View, ViewStyle, ActivityIndicator, Platform, BackHandler, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@/redux/reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { language } from '@/i18n';

import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { FilterBodyView } from '../Commons/FilterBodyView';
import { FilterBottomView } from '../Commons/FilterBottomView';

import { FilterAuctionStatusEnum } from '@/redux/filters/types';
import { getAuctionStatus, getFilterCategories, setAuctionStatus } from '@/redux/filters/actions';
import Accordion from 'react-native-collapsible/Accordion';
import DefaultText from '@/components/CustomText/DefaultText';
import FilterCategoriesScreen from '@/screens/Filter/FilterCategoriesScreen';
import { getFilter } from '@/redux/filters/selector';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';

const ROOT_VIEW: ViewStyle = {
  flex: 1,
  justifyContent: 'flex-end',
  backgroundColor: colors.transparent,
};
const WRAP_RADIO: ViewStyle = {
  height: 50,
  width: 50,
  justifyContent: 'center',
  alignItems: 'center',
};

const TEXT_HEADER: TextStyle = {
  fontSize: fonts.size.s16,
  color: colors.gray_900,
};

const WRAP_HEADER: ViewStyle = {
  height: 50,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
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

export function FilterAuctionStatusScreen(): ReactElement {
  const dispatch = useDispatch();
  const [activeSections, setActiveSections] = useState([]);
  const navigation = useNavigation();
  const route: any = useRoute();
  const { opacityViewHandler } = route.params;
  const [categoryList, setCategoryList] = useState([]);
  const { filters } = useSelector((state: RootState) => {
    return state;
  });

  const [auctionStatusList, setAuctionStatusList] = useState<any[]>([]);
  const [auctionStatusSelected, setAuctionStatusSelected] = useState<FilterAuctionStatusEnum>(FilterAuctionStatusEnum.ALL);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const categoryDataList = getFilter().data.categoriesList || [];
    if (categoryDataList.length < 1) {
      dispatch(
        getFilterCategories({
          onSuccess: items => {
            setCategoryList([...items]);
          },
        }),
      );
    } else {
      setCategoryList([...categoryDataList]);
    }

    dispatch(
      getAuctionStatus({
        onSuccess: (data: any[]) => {
          setAuctionStatusList(data);
          setIsLoading(false);
        },
        onFail: () => {
          setIsLoading(false);
          setAuctionStatusList([]);
        },
      }),
    );
  }, []);

  useEffect(() => {
    const indexSelected = auctionStatusList.findIndex(item => item.name === auctionStatusSelected);
    setActiveSections([indexSelected]);
    setAuctionStatusSelected(filters.status);
  }, [filters.status, auctionStatusList]);

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
    setAuctionStatusSelected(FilterAuctionStatusEnum.ALL);
  };

  const applyOnPressed = async () => {
    setIsLoading(true);
    dispatch(
      setAuctionStatus(auctionStatusSelected, {
        onSuccess: () => {
          setIsLoading(false);
          onBackPressed && onBackPressed();
        },
        onFail: () => {
          setIsLoading(false);
        },
      }),
    );
  };

  const updateSections = activeSections => {
    if (activeSections.length === 0) {
      return;
    }
    const activitySection = activeSections.length > 0 ? activeSections[0] : '';
    const categoryName = auctionStatusList.length > 0 ? auctionStatusList[activitySection]?.name : '';
    setAuctionStatusSelected(categoryName);
    setActiveSections(activeSections);
  };

  const renderHeader = section => {
    const iconRadio = auctionStatusSelected && section.name === auctionStatusSelected ? <RadioCheckedSVG /> : <RadioUnCheckSVG />;

    return (
      <View style={WRAP_HEADER}>
        <DefaultText {...{ style: TEXT_HEADER }}>
          {language(`auctionStatus.${section.name}`, { defaultValue: section.description })}
        </DefaultText>
        <View style={WRAP_RADIO}>{iconRadio}</View>
      </View>
    );
  };

  const renderContent = (section: any) => {
    if (section.name === 'all') return null;
    return <FilterCategoriesScreen categoryList={categoryList} key={section.id} />;
  };

  return (
    <View style={ROOT_VIEW}>
      <View style={CONTAINER}>
        <FilterHeaderView
          leftIcon="back"
          title={language('filterScreen.auctionStatus')}
          closeOnPressed={onBackPressed}
          resetOnPressed={resetOnPressed}
        />
        <FilterLineBreak />
        <FilterBodyView style={WRAP_CONTAINER}>
          <Accordion
            sections={auctionStatusList}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={updateSections}
            expandFromBottom={false}
            underlayColor={colors.transparent}
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
