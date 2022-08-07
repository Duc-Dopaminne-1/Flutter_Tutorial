import CustomItemSetting from '@/components/CustomItemSetting';
import { language } from '@/i18n';
import { appLocaleSelector } from '@/redux/app/selector';
import { filterCategoriesSelectedSelector, getFilter } from '@/redux/filters/selector';
import { useLocalizeNameField } from '@/shared/processing';
import { images } from '@/vars';
import React, { memo, ReactElement, useMemo, useState } from 'react';
import { Image } from 'react-native';
import { CategoriesDialog } from './CategoriesDialog';

const CategoriesContainer = (): ReactElement => {
  const localizeNameField = useLocalizeNameField();
  const [categoriesDialogVisible, setCategoriesDialogVisible] = useState(false);
  const { data } = getFilter();
  const categoriesSelected = filterCategoriesSelectedSelector() || [];
  const categoriesList = data?.categoriesList || [];

  const categorySelectedTranslate = useMemo(
    () => categoriesSelected.map(item => categoriesList.find(i => i.id === item.id) || item).map(item => localizeNameField(item)),
    [categoriesSelected, appLocaleSelector()],
  );
  const filterCategoryDesc =
    categorySelectedTranslate.length > 0 ? categorySelectedTranslate.join(', ') + ' ' : language('filterScreen.none');

  return (
    <>
      <CustomItemSetting
        title={language('filterScreen.categories')}
        content={filterCategoryDesc}
        onPress={() => setCategoriesDialogVisible(true)}
        image={<Image source={images.categories} />}
      />
      <CategoriesDialog
        isVisible={categoriesDialogVisible}
        categoriesList={categoriesList || []}
        categoriesSelected={categoriesSelected}
        onBackdropPress={() => {
          setCategoriesDialogVisible(false);
        }}
      />
    </>
  );
};

export default memo(CategoriesContainer);
