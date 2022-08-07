import React, { useEffect, useState, useCallback, useRef } from "react";
import Container from "@src/components/Container";
import { View, KeyboardAvoidingView, Alert } from "react-native";
import styles from "./styles";
import { ADD_PLUS, ICON_STAFF_POSITION } from "@src/constants/icons";
import { CustomButton } from "@src/components/CustomButton";
import { CustomFlatList } from "@src/components/FlatList";
import { CustomText } from "@src/components/CustomText";
import CustomSectionHeader from "@src/components/CustomSection";
import getStyles from "@src/utils/getStyles";
import { getKeyboardAdvoidStyle } from "@src/utils";
import translate from "@src/localize";
import NavigationActionsService from "@src/navigation/navigation";
import { NEW_STAFF_POSITION, EDIT_STAFF_POSITION } from "@src/constants/screenKeys";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@src/types/types";
import { IPagination } from "@reup/reup-api-sdk/libs/type";
import { ICompanyPosition } from "@reup/reup-api-sdk/libs/api/company/position/model";
import { ICompany } from "@reup/reup-api-sdk/libs/api/company/models";
import { colors, LimitLoadMore } from "@src/constants/vars";
import { getListPosition } from "@src/modules/Company/actions";
import { CustomTouchable } from "@src/components/CustomTouchable";
import { IUserProfile } from "@reup/reup-api-sdk/libs/api/user/models";
import { clone, debounce } from "lodash";
import SearchBar from "@src/components/SearchBar";
import { QueryCompanyPositionParams } from "@reup/reup-api-sdk/libs/api/company/position";

const StaffPosition = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const [data, setData] = useState<(ICompanyPosition & { isActive: boolean })[]>([]);
  const positionList = useSelector<RootState, IPagination<ICompanyPosition>>((state: RootState) => state.company.listPosition);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((search: string) => { fetchData(search, 1); }, 500);
  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null);

  useEffect(() => {
    setData(positionList.results.map(item => {
      return {
        ...item,
        isActive: false
      };
    }));
  }, [positionList]);

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

  // const onPressItemCheck = (index: number) => {
  //   const cloneData = clone(data);
  //   cloneData[index].isActive = !cloneData[index].isActive;
  //   setData(cloneData);
  // };

  // const onDeleteItem = () => {
  //   Alert.alert(translate('alert.title_confirm'), translate('alert.message_delete'), [
  //     {
  //       text: translate('alert.delete'),
  //       style: 'default',
  //       onPress: () => {
  //         data.forEach(item => {
  //           if (item.isActive) {
  //             onDeletePosition(item.id)
  //           }
  //         })
  //       },
  //     },
  //     {
  //       text: translate('alert.cancel'),
  //       style: 'cancel',
  //       onPress: () => undefined,
  //     },
  //   ]);
  // }

  // const onDeletePosition = (id: string) => {
  //   NavigationActionsService.showLoading()
  //   dispatch(deletePosition({
  //     companyId: defaultCompanyId,
  //     id: id,
  //     onSuccess: (data) => {
  //       console.log("===== Success Delete position: ", data)
  //       NavigationActionsService.hideLoading();
  //     },
  //     onFail: error => {
  //       NavigationActionsService.hideLoading();
  //       setTimeout(() => {
  //         error && Alert.alert(translate('alert.title_error'), error.message);
  //       }, 700);
  //     }
  //   }))
  // }

  useEffect(() => {
    if (isLoadedData) {
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      debounceLoadData(searchText);
    }
  }, [searchText]);

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
  };

  const fetchData = (search: string, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    const params: QueryCompanyPositionParams = {
      search
    };
    dispatch(getListPosition({
      companyId: me.default_company.id,
      page: page,
      limit: LimitLoadMore,
      params: params,
      onSuccess: (data) => {
        onLoadSuccess && onLoadSuccess();
        setLoadedData(true);
        console.log("===== Success list position: ", data);
      },
      onFail: error => {
        onLoadFailure && onLoadFailure();
        setLoadedData(true);
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    fetchData(searchText, page, onLoadSuccess, onLoadFailure);
  };
  const onPressAdd = () => {
    NavigationActionsService.push(NEW_STAFF_POSITION, { flatList });
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.line} />
    );
  };

  const onPressItem = (item: ICompanyPosition & { isActive: boolean }) => {
    NavigationActionsService.push(EDIT_STAFF_POSITION, { item: item, flatList });
  };

  const renderItem = (item: ICompanyPosition & { isActive: boolean }, index: number) => {
    return (
      <CustomTouchable onPress={onPressItem.bind(undefined, item)} style={styles.itemContainer}>
        {/* <CustomCheckBox
          stylesContainer={styles.checkbox}
          isCheck={item.isActive}
          onPress={onPressItemCheck.bind(undefined, index)}
        /> */}
        <CustomText
          numberOfLines={1}
          text={item.name}
          styleContainer={styles.containerText}
          style={styles.itemText} />
      </CustomTouchable>);
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <SearchBar
        value={searchText}
        onChangeText={onChangeSearchText}
        placeholder={translate('staff.staff_position_search_position')} />
    </View>
  );

  // const getButtonDeleteState = () => {
  //   return data.length > 0 && data.filter(item => item.isActive).length > 0
  // }
  const renderHeader = () => (
    <CustomSectionHeader
      title={translate('staff.staff_position_section')}
      icon={ICON_STAFF_POSITION}
    // rightComponent={
    //   getButtonDeleteState() ? <ImageButton
    //     onPress={onDeleteItem}
    //     icon={ICON_DELETE}
    //     styleContainer={styles.containerImageBtn}
    //     styleIcon={styles.iconImageBtn}
    //   /> : undefined
    // }
    // styleRightComponent={styles.imageBtnHeafer}
    />
  );

  const renderBottomButton = () => (
    <View style={styles.bottomButtonContainer}>
      <CustomButton
        iconLeft={ADD_PLUS}
        text={translate('staff.staff_position_add_button')}
        onPress={onPressAdd}
      />
    </View>
  );

  const renderFlatListData = () => (
    <CustomFlatList
      ref={flatList}
      data={data}
      onLoad={onLoad}
      contentContainerStyle={styles.listContainer}
      pullToRefresh={true}
      renderItem={renderItem}
      indicatorColor={colors.GRAY500}
      ItemSeparatorComponent={_itemSeparator}
      hasNext={positionList.next}
      loadMore={true}
    />
  );

  return (
    <Container isShowHeader={true} title={translate('staff.staff_position_title')} spaceBottom={true}>
      <KeyboardAvoidingView style={getStyles('flex-1')} keyboardVerticalOffset={getKeyboardAdvoidStyle()} behavior={"padding"}>
        <View style={styles.staffPositionContainer}>
          {renderHeader()}
          {renderSearchBar()}
          {renderFlatListData()}
        </View>
        {renderBottomButton()}
      </KeyboardAvoidingView>
    </Container>
  );
};

export default StaffPosition;
