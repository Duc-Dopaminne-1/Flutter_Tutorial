import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, KeyboardAvoidingView, Alert } from "react-native";
import Container from "@src/components/Container";
import translate from "@src/localize";
import { styles } from "./styles";
import CustomSectionHeader from "@src/components/CustomSection";
import { ADD_PLUS, ICON_CATEGORY, ICON_DELETE } from "@src/constants/icons";
import { CustomFlatList } from "@src/components/FlatList";
import { CustomButton, ImageButton } from "@src/components/CustomButton";
import SearchBar from "@src/components/SearchBar";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle } from "@src/utils";
import NavigationActionsService from "@src/navigation/navigation";
import { NEW_CATEGORY, EDIT_MAINTENANCE_CATEGORY } from "@src/constants/screenKeys";
import { useDispatch, useSelector } from "react-redux";
import { getListMaintenanceCategory, deleteMaintenanceCategory } from "@src/modules/Maintenance/actions";
import { RootState } from "@src/types/types";
import { IPagination } from "@reup/reup-api-sdk/libs/type";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { ICompanyMaintenanceCategory } from "@reup/reup-api-sdk/libs/api/company/maintenance/category/models";
import { CustomTouchable } from "@src/components/CustomTouchable";
import { CustomText } from "@src/components/CustomText";
import { CustomCheckBox } from "@src/components/CustomCheckBox";
import { clone, debounce } from "lodash";
import { QueryCompanyMaintenanceCategory } from "@reup/reup-api-sdk/libs/api/company/maintenance/category";

const CategoryTenant = () => {

  const dispatch = useDispatch();
  const maintenanceCategoryList = useSelector<RootState, IPagination<ICompanyMaintenanceCategory>>((state: RootState) => state.maintenance.listMaintenanceCategory);
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [data, setData] = useState<(ICompanyMaintenanceCategory & { isActive: boolean })[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null);

  const debounceLoadData = debounce((search: string) => {
    fetchData(search, 1);
  }, 500);

  let defaultCompanyId = '';
  if (me && me.default_company) {
    defaultCompanyId = me.default_company.id;
  }

  useEffect(() => {
    setData(maintenanceCategoryList.results.map(item => {
      return {
        ...item,
        isActive: false
      };
    }));
  }, [maintenanceCategoryList]);

  useEffect(() => {
    if (isLoadedData) {
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      debounceLoadData(searchText);
    }
  }, [searchText]);

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      setTimeout(() => {
        fetchData(searchText, 1);
      }, 200);
    }
  }, [me.default_company.id]);

  const onPressAddCategory = () => {
    NavigationActionsService.push(NEW_CATEGORY, { flatList });
  };

  const fetchData = (search: string, page: number, onLoadSuccess?: () => void,
    onLoadFailure?: () => void) => {
    const params: QueryCompanyMaintenanceCategory = { search };
    dispatch(
      getListMaintenanceCategory({
        companyId: defaultCompanyId,
        page,
        params,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess();
          setLoadedData(true);
          console.log("===== Success list maintenance category: ", data);
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedData(true);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    if (me && me.default_company) {
      fetchData(searchText, page, onLoadSuccess, onLoadFailure);
    }
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  const renderItemSeparator = () => {
    return (
      <View style={styles.line} />
    );
  };

  const renderInactiveFlatList = () => {
    return (
      <View style={styles.body}>
        <CustomFlatList
          onLoad={onLoad}
          ref={flatList}
          contentContainerStyle={styles.contentContainerFlatList}
          data={data}
          renderItem={renderItem}
          ItemSeparatorComponent={renderItemSeparator}
          pullToRefresh={true}
          hasNext={maintenanceCategoryList.next}
          loadMore={true}
        />
      </View>
    );
  };

  const onPressItemCheck = (index: number) => {
    const cloneData = clone(data);
    cloneData[index].isActive = !cloneData[index].isActive;
    setData(cloneData);
  };

  const onPressItem = (item: ICompanyMaintenanceCategory & { isActive: boolean }) => {
    NavigationActionsService.push(EDIT_MAINTENANCE_CATEGORY, { item: item, flatList });
  };

  const renderItem = (item: ICompanyMaintenanceCategory & { isActive: boolean }, index: number) => {
    return (
      <CustomTouchable onPress={onPressItem.bind(undefined, item)} style={styles.itemContainer}>
        <CustomCheckBox
          stylesContainer={styles.checkbox}
          isCheck={item.isActive}
          onPress={onPressItemCheck.bind(undefined, index)}
        />
        <CustomText
          numberOfLines={1}
          text={item.name}
          styleContainer={styles.containerText}
          style={styles.itemText} />
      </CustomTouchable>
    );
  };

  const renderFooter = () => {
    return (
      <View style={styles.containerAddBuildingBtn}>
        <CustomButton
          style={styles.addBuildingBtn}
          text={translate("category.text_add_category")}
          iconLeft={ADD_PLUS}
          onPress={onPressAddCategory}
        />
      </View>
    );
  };

  const getButtonDeleteState = () => {
    return maintenanceCategoryList.results.length > 0 && data.filter(item => item.isActive).length > 0;
  };

  const onDeleteCategory = (id: string) => {
    NavigationActionsService.showLoading();
    dispatch(deleteMaintenanceCategory({
      companyId: defaultCompanyId,
      id: id,
      onSuccess: (data) => {
        flatList && flatList.current && flatList.current.reloadData();
        console.log("===== Success Delete maintenance category: ", data);
        NavigationActionsService.hideLoading();
      },
      onFail: error => {
        NavigationActionsService.hideLoading();
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };

  const onDeleteItem = () => {
    Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
      {
        text: translate('alert.delete'),
        style: 'default',
        onPress: () => {
          data.forEach(item => {
            if (item.isActive) {
              onDeleteCategory(item.id);
            }
          });
        },
      },
      {
        text: translate('alert.cancel'),
        style: 'cancel',
        onPress: () => undefined,
      },
    ]);
  };

  const renderHeader = () => (
    <CustomSectionHeader
      style={styles.sectionHeader}
      title={translate('category.title_section')}
      icon={ICON_CATEGORY}
      rightComponent={
        getButtonDeleteState() ? <ImageButton
          onPress={onDeleteItem}
          icon={ICON_DELETE}
          styleContainer={styles.containerImageBtn}
          styleIcon={styles.iconImageBtn}
        /> : undefined
      }
      styleRightComponent={styles.imageBtnHeafer}
    />
  );

  const renderCategory = () => {
    return (
      <>
        {renderHeader()}
        <View style={styles.containerSearchFilterBar}>
          <SearchBar
            value={searchText}
            styleContainer={styles.searchBar}
            placeholder={translate("category.placeholder_search")}
            onChangeText={onChangeText}
          />
        </View>
        {renderInactiveFlatList()}
      </>
    );
  };

  return (
    <Container
      isShowHeader={true}
      spaceBottom={true}
      title={translate("category.title_header")}
    >
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={'padding'}>
        <View style={styles.container}>
          {renderCategory()}

          {renderFooter()}
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default React.memo(CategoryTenant);
