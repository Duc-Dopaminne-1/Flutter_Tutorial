import React, { useState, useEffect, useRef } from 'react';
import styles from './styles';
import { View, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { STAFF } from '@src/constants/icons';
import SearchBar from '../../../components/SearchBar/index';
import StaffItem from '@src/components/FlatListItem/StaffItem';
import { CustomButton } from '@src/components/CustomButton';
import ADD_PLUS from '@res/icons/icon-plus-round.png';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import { CustomFlatList } from '@src/components/FlatList';
import Container from '@src/components/Container';
import translate from '@src/localize';
import { getKeyboardAdvoidStyle } from '@src/utils';
import getStyles from '@src/utils/getStyles';
import NavigationActionsService from '@src/navigation/navigation';
import { STAFF_DETAIL, INVITE_STAFF, FILTER } from '@src/constants/screenKeys';
import CustomSectionHeader from '@src/components/CustomSection';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { getListStaff } from '@src/modules/Company/actions';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { QueryCompanyUserParams } from '@reup/reup-api-sdk/libs/api/company/user';
import { debounce } from 'lodash';
import { Role } from '@reup/reup-api-sdk/libs/api/enum';

interface Props {

}

const Staff = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const staffList = useSelector<RootState, IPagination<ICompanyUser>>((state: RootState) => state.company.listStaff);
  const [displayStaff, setDisplayStaff] = useState<ICompanyUser[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryCompanyUserParams) => {
    onGetListStaff(p, 1);
  }, 500);
  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null)

  const [params, setParams] = useState<QueryCompanyUserParams>({
    country_id: '',
    property_id: '',
    role: '',
    search: '',
  })

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        country_id: '',
        property_id: '',
        search: searchText
      }
      onReloadDataWithParams(p)
    }
  }, [me.default_company.id])

  useEffect(() => {
    const data: ICompanyUser[] = [];
    staffList.results.find((item) => {
      if (item.role.key !== Role.Owner) {
        data.push(item);
      }
    });
    setDisplayStaff(data);

  }, [staffList]);

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

  const onReloadDataWithParams = (p: QueryCompanyUserParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListStaff(p, 1);
    }, 200)
  }

  const onPressStaff = (item: ICompanyUser) => {
    NavigationActionsService.push(STAFF_DETAIL, { staffDetail: item, flatList });
  };

  const _renderItem = (item: any) => {
    return <StaffItem item={item} onPress={onPressStaff} />;
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image resizeMode={'contain'} source={LINE} style={styles.line} />
      </View>
    );
  };

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
  };

  const onGetListStaff = (params: QueryCompanyUserParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      dispatch(
        getListStaff({
          id: companyId,
          page,
          params: params,
          onSuccess: (data) => {
            onLoadSuccess && onLoadSuccess();
            setLoadedData(true);
            console.log("===== Success list staff: ", data);
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
    onGetListStaff({ ...params, search: searchText }, page, onLoadSuccess, onLoadFailure);
  };

  const onApplyFilter = (filter: any) => {
    const p = {
      country_id: filter.country ?? '',
      property_id: filter.building ?? '',
      search: searchText
    }
    onReloadDataWithParams(p);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 0,
      onFilter: onApplyFilter,
    });
  };

  const onPressAddStaff = () => {
    NavigationActionsService.push(INVITE_STAFF, { flatList });
  };
  return (
    <Container title={translate('staff.staff')} spaceBottom={true} isShowHeader={true}>
      <KeyboardAvoidingView style={getStyles('flex-1')}
        keyboardVerticalOffset={getKeyboardAdvoidStyle()}
        behavior={"padding"}>
        <View style={styles.container}>
          <CustomSectionHeader
            style={styles.sectionHeader}
            title={translate('staff.staff').toUpperCase()}
            icon={STAFF}
            isShowFilter={true}
            onPressFilter={onPressFilter}
          />
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchText}
              onChangeText={onChangeSearchText}
              placeholder={translate('staff.search_staff')} />
          </View>
          <View style={styles.listContainer}>
            <CustomFlatList
              ref={flatList}
              onLoad={onLoad}
              ItemSeparatorComponent={_itemSeparator}
              data={displayStaff}
              renderItem={_renderItem}
              pullToRefresh={true}
              hasNext={staffList.next}
              loadMore={true}
              contentContainerStyle={{ flexGrow: 1, }}
            />
          </View>

          <View style={styles.buttonContainer}>
            <CustomButton
              onPress={onPressAddStaff}
              iconLeft={ADD_PLUS}
              text={translate('staff.add_new_staff')}
              style={styles.button} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container >
  );
};

export default React.memo(Staff);
