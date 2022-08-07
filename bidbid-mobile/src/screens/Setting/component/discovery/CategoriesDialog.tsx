import ModalLoading from '@/components/ModalLoading';
import { language } from '@/i18n';
import { Category } from '@/models/';
import { setFilterCategories } from '@/redux/filters/actions';
import { FilterBodyView } from '@/screens/Filter/Commons/FilterBodyView';
import { FilterBottomView } from '@/screens/Filter/Commons/FilterBottomView';
import { FilterHeaderView } from '@/screens/Filter/Commons/FilterHeaderView';
import { FilterLineBreak } from '@/screens/Filter/Commons/FilterLineBreak';
import FilterCategoryItem from '@/screens/Filter/FilterCategoriesScreen/components/FilterCategoryItem';
import { colors } from '@/vars';
import React, { ReactElement, useCallback, useLayoutEffect, useRef, useState } from 'react';
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
  categoriesList: any[];
  categoriesSelected: any[];
  onBackdropPress?: () => void;
}

export function CategoriesDialog(props: FilterCategoriesProps): ReactElement {
  const { isVisible, onBackdropPress, categoriesList = [], categoriesSelected = [] } = props;
  const dispatch = useDispatch();

  const [categoriesSelectedTmp, setCategoriesSelectedTmp] = useState({});
  const [loading, setLoading] = useState(false);
  const categoriesSelectedDefault = useRef({});

  useLayoutEffect(() => {
    const dictionary = categoriesSelected.reduce((dic, currentItem) => {
      dic[currentItem.id] = currentItem;
      return dic;
    }, {});
    categoriesSelectedDefault.current = dictionary;
    setCategoriesSelectedTmp({ ...dictionary });
  }, [categoriesSelected]);

  const onBackPressed = (): boolean => {
    onBackdropPress();
    return true;
  };

  const resetOnPressed = async () => {
    setCategoriesSelectedTmp({});
  };

  const itemOnPressed = useCallback(
    (item: Category) => {
      if (!categoriesSelectedTmp[item.id]) {
        categoriesSelectedTmp[item.id] = item;
      } else {
        delete categoriesSelectedTmp[item.id];
      }
      setCategoriesSelectedTmp({ ...categoriesSelectedTmp });
    },
    [categoriesSelectedTmp],
  );

  const onSuccessHandler = () => {
    onBackPressed();
    setLoading(false);
  };

  const onFailedHandler = () => {
    setLoading(false);
  };

  const applyOnPressed = async () => {
    setLoading(true);
    const categoriesSelected = Object.values(categoriesSelectedTmp) || [];
    if (categoriesSelected && categoriesSelected.length > 0) {
      const categories = (categoriesSelected as { id: string; name: string }[]).map(item => {
        return {
          id: item.id,
          name: item.name,
        };
      });
      dispatch(
        setFilterCategories(
          categories,
          {
            onSuccess: onSuccessHandler,
            onFail: onFailedHandler,
          },
          true,
        ),
      );
    } else {
      dispatch(
        setFilterCategories(
          [],
          {
            onSuccess: onSuccessHandler,
            onFail: onFailedHandler,
          },
          true,
        ),
      );
    }
  };

  const onBack = () => {
    setCategoriesSelectedTmp({ ...categoriesSelectedDefault.current });
    onBackdropPress && onBackdropPress();
  };

  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={WRAP_MODAL}>
      <View style={ROOT_VIEW}>
        <View style={CONTAINER}>
          <FilterHeaderView
            leftIcon="close"
            title={language('categories')}
            closeOnPressed={onBackPressed}
            resetOnPressed={resetOnPressed}
          />
          <FilterLineBreak />
          <FilterBodyView>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categoriesList.map(item => {
                return (
                  <FilterCategoryItem
                    key={item.id.toString()}
                    category={item}
                    listSelected={Object.values(categoriesSelectedTmp)}
                    onPressed={itemOnPressed}
                  />
                );
              })}
            </ScrollView>
          </FilterBodyView>
          <FilterBottomView applyOnPressed={applyOnPressed} />
        </View>
      </View>
      {loading && <ModalLoading isVisible={loading} />}
    </Modal>
  );
}
