import React, { ReactElement, useEffect, useState } from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { colors, fonts } from '@/vars';
import { useDispatch } from 'react-redux';
import { language } from '@/i18n';

import { FilterAuctionStatusEnum } from '@/redux/filters/types';
import { getAuctionStatus, getFilterCategories, setAuctionStatus } from '@/redux/filters/actions';
import Accordion from 'react-native-collapsible/Accordion';
import DefaultText from '@/components/CustomText/DefaultText';
import FilterCategoriesScreen from '@/screens/Filter/FilterCategoriesScreen';
import { FilterHeaderView } from '@/screens/Filter/Commons/FilterHeaderView';
import { FilterLineBreak } from '@/screens/Filter/Commons/FilterLineBreak';
import { FilterBodyView } from '@/screens/Filter/Commons/FilterBodyView';
import { FilterBottomView } from '@/screens/Filter/Commons/FilterBottomView';
import Modal from 'react-native-modal';
import { filterAuctionStatusSelector } from '@/redux/filters/selector';
import ModalLoading from '@/components/ModalLoading';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';

const ROOT_VIEW: ViewStyle = {
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

const WRAP_MODAL: ViewStyle = {
  margin: 0,
  justifyContent: 'flex-end',
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

interface AuctionStatusDialogProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  confirmOnPressedCallback?: () => void;
}

export function AuctionStatusDialog(props: AuctionStatusDialogProps): ReactElement {
  const { isVisible, onBackdropPress } = props;
  const dispatch = useDispatch();
  const [activeSections, setActiveSections] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const statusSelected = filterAuctionStatusSelector();

  const [auctionStatusList, setAuctionStatusList] = useState<any[]>([]);
  const [auctionStatusSelected, setAuctionStatusSelected] = useState<FilterAuctionStatusEnum>(FilterAuctionStatusEnum.ALL);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(
      getFilterCategories({
        onSuccess: items => {
          setCategoryList([...items]);
        },
      }),
    );

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
  }, [isVisible]);

  useEffect(() => {
    const indexSelected = auctionStatusList.findIndex(item => item.name === auctionStatusSelected);
    setActiveSections([indexSelected]);
    setAuctionStatusSelected(statusSelected);
  }, [statusSelected, auctionStatusList, isVisible]);

  const onBackPressed = (): boolean => {
    onBackdropPress && onBackdropPress();
    return true;
  };

  const resetOnPressed = async () => {
    setActiveSections([]);
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
      }),
    );
  };

  const updateSections = activeSections => {
    if (activeSections.length === 0) return;
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

  const renderContent = (section: { name: string; id: string }) => {
    if (section.name === 'all') return null;
    return <FilterCategoriesScreen categoryList={categoryList} key={section.id} />;
  };

  const onBack = () => {
    // setDataSelectTemp(dataSelectedList);
    onBackdropPress && onBackdropPress();
  };

  return (
    <>
      <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={WRAP_MODAL}>
        <View style={ROOT_VIEW}>
          <View style={CONTAINER}>
            <FilterHeaderView
              leftIcon="close"
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
          </View>
        </View>
        {isLoading && <ModalLoading isVisible={isLoading} />}
      </Modal>
    </>
  );
}
