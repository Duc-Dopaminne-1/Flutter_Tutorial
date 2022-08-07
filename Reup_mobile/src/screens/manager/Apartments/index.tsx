import React, { useEffect, useState, useRef } from 'react';
import styles from './styles';
import { View, Image, Alert, KeyboardAvoidingView } from 'react-native';
import IC_APARTMENT from '@src/res/icons/icon_apartment.png';
import { CustomButton } from '@src/components/CustomButton';
import ADD_PLUS from '@res/icons/icon-plus-round.png';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import Container from '@src/components/Container';
import translate from '@src/localize';
import NavigationActionsService from '@src/navigation/navigation';
import { FILTER, APARTMENT_DETAILS, NEW_APARTMENT } from '@src/constants/screenKeys';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCase, debounce } from 'lodash';
import SearchBar from "@src/components/SearchBar";
import ApartmentItem from '@src/components/FlatListItem/ApartmentItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { getListApartment } from '@src/modules/Company/actions';
import { ICompanyUnit } from '@reup/reup-api-sdk/libs/api/company/unit/model';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { QueryCompanyUnitParams } from '@reup/reup-api-sdk/libs/api/company/unit';
import { getKeyboardAdvoidStyle } from '@src/utils';
import getStyles from '@src/utils/getStyles';
import { WIDTH } from '@src/constants/vars';

interface Props { }

const Apartments = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const apartmentList = useSelector<RootState, IPagination<ICompanyUnit>>((state: RootState) => state.company.listApartment);
  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryCompanyUnitParams) => {
    onGetListApartment(p, 1);
  }, 500);
  const flatList = useRef<any>(null)

  const [params, setParams] = useState<QueryCompanyUnitParams>({
    country_id: '',
    property_id: '',
    search: '',
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        country_id: '',
        property_id: '',
        search: searchText,
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_company.id])

  const onPressItem = (item: ICompanyUnit) => {
    NavigationActionsService.push(APARTMENT_DETAILS, { item, flatList });
  };

  useEffect(() => {
    if (isLoadedData) {
      const p = {
        ...params,
        search: searchText,
      }
      if (flatList && flatList.current) {
        flatList.current.resetInitPage(1);
        flatList.current.scrollToTop();
      }
      debounceLoadData(p);
    }
  }, [searchText]);

  const _renderItem = (item: ICompanyUnit) => {
    return <ApartmentItem
      item={item}
      onPress={onPressItem} />;
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const onReloadDataWithParams = (p: QueryCompanyUnitParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListApartment(p, 1);
    }, 200)
  }

  const onGetListApartment = (params: QueryCompanyUnitParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      dispatch(
        getListApartment({
          companyId,
          page,
          q: params,
          onSuccess: () => {
            onLoadSuccess && onLoadSuccess();
            setLoadedData(true);
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
    }
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListApartment({ ...params, search: searchText }, page, onLoadSuccess, onLoadFailure);
  };

  const onApplyFilter = async (filter: any) => {
    const p = {
      country_id: filter.country ?? '',
      property_id: filter.building ?? '',
      search: searchText,
    }
    onReloadDataWithParams(p)
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      onFilter: onApplyFilter,
    });
  };

  const onPressAdd = () => {
    NavigationActionsService.push(
      NEW_APARTMENT,
      {
        country_id: "",
        property_id: "",
        flatList
      });
  };

  const renderHeader = () => {
    return <CustomSectionHeader
      style={styles.sectionHeader}
      title={upperCase(translate("apartments.apartments"))}
      icon={IC_APARTMENT}
      isShowFilter={true}
      onPressFilter={onPressFilter}
    />;
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  const renderSearchBar = () => {
    return (
      <View style={styles.containerSearchFilterBar}>
        <SearchBar
          value={searchText}
          placeholder={translate("apartments.placeholder_search")}
          onChangeText={onChangeText}
        />
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <View style={styles.flatListContainer}>
        <CustomFlatList
          ref={flatList}
          pullToRefresh={true}
          loadMore={true}
          hasNext={apartmentList.next}
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={apartmentList.results}
          renderItem={_renderItem}
          contentContainerStyle={{ flexGrow: 1, }}
        />
      </View>
    );
  };

  const renderAddNew = () => {
    return (
      <View style={styles.buttonContainer}>
        <CustomButton
          onPress={onPressAdd}
          iconLeft={ADD_PLUS}
          text={upperCase(translate('apartments.add_new_apartment'))}
          style={styles.button} />
      </View>
    );
  };

  return (
    <Container
      title={translate('apartments.apartments')}
      isShowHeader={true}
      spaceBottom={true}>
      <KeyboardAvoidingView
        style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={'padding'}>
        <View style={styles.container}>
          {renderHeader()}
          {renderSearchBar()}
          {renderFlatList()}
          {renderAddNew()}
        </View>
      </KeyboardAvoidingView>
    </Container >
  );
};

export default Apartments;
