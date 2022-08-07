import ModalLoading from '@/components/ModalLoading';
import { language } from '@/i18n';
import { Category } from '@/models';
import { setFilterCareerStrengths } from '@/redux/filters/actions';
import { FilterBodyView } from '@/screens/Filter/Commons/FilterBodyView';
import { FilterBottomView } from '@/screens/Filter/Commons/FilterBottomView';
import { FilterHeaderView } from '@/screens/Filter/Commons/FilterHeaderView';
import { FilterLineBreak } from '@/screens/Filter/Commons/FilterLineBreak';
import FilterCategoryItem from '@/screens/Filter/FilterCategoriesScreen/components/FilterCategoryItem';
import { colors } from '@/vars';
import React, { memo, ReactElement, useEffect, useState } from 'react';
import { ScrollView, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch } from 'react-redux';

const ROOT_VIEW: ViewStyle = {
  backgroundColor: colors.transparent,
};

const CONTAINER: ViewStyle = {
  backgroundColor: colors.white,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 30,
};

const WRAP_MODAL: ViewStyle = {
  margin: 0,
  justifyContent: 'flex-end',
};

interface FilterCategoriesProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  careerStrengsSelected: any[];
  careerStrengsList: any[];
}

function CareerStrengthsDialog(props: FilterCategoriesProps): ReactElement {
  const { isVisible, onBackdropPress, careerStrengsSelected = [], careerStrengsList = [] } = props;
  const dispatch = useDispatch();

  const [dataSelectedList, setDataSelectedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDataSelectedList(careerStrengsSelected);
  }, [careerStrengsSelected, isVisible]);

  const onBackPressed = (): boolean => {
    onBackdropPress();
    return true;
  };

  const resetOnPressed = async () => {
    setDataSelectedList([]);
  };

  const checkIsSelected = (category: Category) => {
    let isSelected = false;
    dataSelectedList.map(item => {
      if (item.id === category.id) isSelected = true;
    });
    return isSelected;
  };

  const interestsOnPressed = async (item: Category) => {
    let newArray = [...dataSelectedList];
    if (checkIsSelected(item)) {
      newArray = dataSelectedList.filter(itemSelected => itemSelected.id !== item.id);
    } else {
      newArray.push(item);
    }
    setDataSelectedList(newArray);
  };

  const applyOnPressed = async () => {
    setIsLoading(true);
    if (setDataSelectedList && setDataSelectedList.length > 0) {
      const items = dataSelectedList.map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      dispatch(
        setFilterCareerStrengths(items, {
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
      dispatch(
        setFilterCareerStrengths([], {
          onSuccess: () => {
            setIsLoading(false);
            onBackPressed();
          },
          onFail: () => {
            setIsLoading(false);
          },
        }),
      );
    }
  };

  const onBack = () => {
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={WRAP_MODAL}>
      <View style={ROOT_VIEW}>
        <View style={CONTAINER}>
          <FilterHeaderView
            leftIcon="close"
            title={language('filterScreen.careerStrengths')}
            closeOnPressed={onBackPressed}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <FilterBodyView>
            <ScrollView showsVerticalScrollIndicator={false}>
              {careerStrengsList &&
                careerStrengsList.map(interestsItem => {
                  return (
                    <FilterCategoryItem
                      key={interestsItem.id.toString()}
                      category={interestsItem}
                      listSelected={dataSelectedList}
                      onPressed={interestsOnPressed}
                    />
                  );
                })}
            </ScrollView>
          </FilterBodyView>
          <FilterBottomView applyOnPressed={applyOnPressed} />
        </View>
      </View>
      {isLoading && <ModalLoading isVisible={isLoading} />}
    </Modal>
  );
}

export default memo(CareerStrengthsDialog);
