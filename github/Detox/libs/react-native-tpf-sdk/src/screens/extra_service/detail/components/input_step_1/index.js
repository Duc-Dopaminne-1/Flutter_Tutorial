import React, { useContext, useState } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { scale } from '../../../../../utils/responsive';
import { Heading, PrimaryButton } from '../../../../../components';
import AppText from '../../../../../components/app_text';
import { IcArrowDown } from '../../../../../assets/icons';
import { FONT_SIZE } from '../../../../../constants/appFonts';
import { apiGetChildrenCategoryById } from '../../../../../services/api/extraServiceApi';
import themeContext from '../../../../../constants/theme/themeContext';
import CategoryChildrenList from './category_children_list';
import { convertHexColorToRGB } from '../../../../../utils/stringUltis';
const defaultValueSelectionPopup = {
  title: 'Chọn sản phẩm/dịch vụ',
  visible: true,
  value: null,
  showLoading: true,
  data: []
};
const InputStep1 = props => {
  const { categoryList, setSelectionPopup, currentCategory, setCurrentCategory, setCurrentStep } =
    props;
  const [categoryChildrenIfExist, setCategoryChildrenIfExist] = useState({
    visible: false,
    data: [],
    categoryParentName: ''
  }); // show category children list if it has children when select
  const theme = useContext(themeContext);
  const handleConfirm = async category => {
    // close modal
    setSelectionPopup({
      ...defaultValueSelectionPopup,
      value: {
        ...currentCategory,
        value: currentCategory?.id,
        title: defaultValueSelectionPopup.title
      }, //set current value for modal
      visible: false
    });
    if (category?.haveChildren) {
      // in the case: load category children list of this category
      setCurrentCategory(null);
      const categoryChildren = await apiGetChildrenCategoryById({ id: category?.id });
      if (categoryChildren?.status === 200) {
        setCategoryChildrenIfExist({
          visible: true,
          data: categoryChildren?.data?.result?.items,
          categoryParentName: category?.name
        });
      }
      return;
    }
    setCurrentCategory(category);
    setCurrentStep(2);
  };
  const handleClickItem = item => async () => {
    if (!item?.haveChildren) {
      setCurrentCategory(item);
      return;
    }
    const selectionPopupData = {
      ...defaultValueSelectionPopup,
      value: {
        ...currentCategory,
        value: currentCategory?.id,
        title: defaultValueSelectionPopup.title
      }, //set current value for modal
      onClose: () => setSelectionPopup({ ...defaultValueSelectionPopup, visible: false }),
      onConfirm: handleConfirm
    };
    setSelectionPopup(selectionPopupData); //open modal: chose category children
    const categoryChildren = await apiGetChildrenCategoryById({ id: item?.id });
    if (categoryChildren?.status === 200) {
      const newData = categoryChildren?.data?.result?.items?.map(item => ({
        ...item,
        title: item?.name,
        value: item?.id
      }));
      setSelectionPopup({ ...selectionPopupData, data: newData }); //load data for modal: chose category children
    }
  };
  const handleSetCurrentCategory = item => {
    setCurrentCategory({
      ...item,
      title: categoryChildrenIfExist?.categoryParentName + ' - ' + item?.name
    });
  };
  return (
    <>
      {!categoryChildrenIfExist?.visible ? (
        <View style={{ paddingHorizontal: scale(15), marginBottom: scale(16) }}>
          <Heading translate>extra_service_detail.product_and_service</Heading>
          {categoryList?.map(item => {
            const isActive = item?.id === currentCategory?.id;
            return (
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isActive && {
                    backgroundColor: convertHexColorToRGB(theme.app.primaryColor1, 0.12)
                  }
                ]}
                onPress={handleClickItem(item)}>
                <AppText
                  numberOfLines={2}
                  bold={isActive}
                  style={[styles.buttonTitle, isActive && { color: theme.app.primaryColor1 }]}>
                  {item?.name}
                </AppText>
                {item?.haveChildren ? (
                  <View style={styles.dropDownIcon}>
                    <IcArrowDown />
                  </View>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <CategoryChildrenList
          data={categoryChildrenIfExist?.data || []}
          currentCategory={currentCategory}
          setCurrentCategory={handleSetCurrentCategory}
          categoryChildrenIfExist={categoryChildrenIfExist}
          setCategoryChildrenIfExist={setCategoryChildrenIfExist}
        />
      )}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={() => setCurrentStep(2)}
          disabled={!currentCategory?.id}
          translate
          title={'extra_service_detail.choose_product_and_service'}
          style={styles.height48}
        />
      </View>
    </>
  );
};
export default React.memo(InputStep1);
const styles = StyleSheet.create({
  optionButton: {
    marginTop: scale(16),
    backgroundColor: '#F5F5F5',
    minHeight: scale(48),
    borderRadius: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: scale(13),
    justifyContent: 'space-between'
  },
  buttonTitle: { fontSize: FONT_SIZE.SubHead, flex: 1 },
  dropDownIcon: { alignItems: 'flex-end' },
  buttonContainer: { marginTop: scale(8), paddingHorizontal: scale(15) },
  height48: {
    height: scale(48)
  }
});
