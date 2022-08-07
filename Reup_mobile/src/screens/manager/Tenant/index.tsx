import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Alert } from 'react-native';
import translate from '@src/localize';
import { TENANT } from '@src/constants/icons';
import LINE from '@res/icons/ForLeaseForSale/image-line-dot.png';
import SearchBar from '@src/components/SearchBar';
import { CustomFlatList } from '@src/components/FlatList';
import TenantItem from '@src/components/FlatListItem/TenantItem';
import NavigationActionsService from '@src/navigation/navigation';
import { TENANT_DETAIL, FILTER } from '@constants/screenKeys';
import RoleType from './enum';
import CustomSectionHeader from '@src/components/CustomSection';
import { GetCompanyTenantParams } from '@reup/reup-api-sdk/libs/api/company/tenant';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';
import { getListTenant } from '@src/modules/Company/actions';
import { debounce } from 'lodash';
import { colors } from '@src/constants/vars';

const Tenant = () => {
  const [searchText, setSearchText] = useState<string>('');
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const tenantList = useSelector<RootState, IPagination<IUnitMember>>((state: RootState) => state.company.listTenant);
  const debounceLoadData = debounce((p: GetCompanyTenantParams) => {
    onGetListTenant(p, 1);
  }, 500);
  const dispatch = useDispatch();
  const [isLoadedData, setLoadedData] = useState(false);
  const flatList = useRef<any>(null)

  const [params, setParams] = useState<GetCompanyTenantParams>({
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

  const onChangeSearchText = (text: string) => {
    setSearchText(text);
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

  const onReloadDataWithParams = (p: GetCompanyTenantParams) => {
    setParams(p)
    if (flatList && flatList.current) {
      flatList.current.resetInitPage(1);
      flatList.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListTenant(p, 1);
    }, 200)
  }

  const onGetListTenant = (params: GetCompanyTenantParams, page: number, onLoadSuccess?: () => void, onLoadFailure?: () => void) => {
    if (me && me.default_company) {
      const companyId = me.default_company.id ?? ''
      dispatch(getListTenant({
        companyId,
        page: page,
        params: params,
        onSuccess: (data) => {
          onLoadSuccess && onLoadSuccess()
          setLoadedData(true);
          console.log("===== Success list tenant: ", data);
        },
        onFail: error => {
          onLoadFailure && onLoadFailure();
          setLoadedData(true);
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      }));
    }
  }

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListTenant(params, page, onLoadSuccess, onLoadFailure);
  };

  const onApplyFilter = (filter: any) => {
    const p = {
      country_id: filter.country ?? '',
      property_id: filter.building ?? '',
      search: searchText,
    }
    onReloadDataWithParams(p)
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 0,
      onFilter: onApplyFilter,
    });
  };

  const _itemSeparator = () => {
    return (
      <View style={styles.lineContainer}>
        <Image source={LINE} style={styles.line} />
      </View>
    );
  };

  const _renderItem = (item: IUnitMember) => {
    return <TenantItem item={item} onPress={onPressTenant} />;
  };

  const onPressTenant = (item: IUnitMember) => {
    NavigationActionsService.push(TENANT_DETAIL, { item: item, role: RoleType.management, flatList });
  };

  return (
    <Container isShowHeader={true} title={translate('tenant.title_nav_bar')} isDisplayBackButton={true}>
      <CustomSectionHeader
        style={styles.sectionHeader}
        title={translate('tenant.title_section_list')}
        icon={TENANT}
        isShowFilter={true}
        onPressFilter={onPressFilter}
      />
      <View style={styles.searchSection}>
        <SearchBar
          value={searchText}
          placeholder={translate('tenant.placeholder_search')}
          onChangeText={onChangeSearchText}
        />
      </View>
      <View style={styles.listContainer}>
        <CustomFlatList
          ref={flatList}
          onLoad={onLoad}
          ItemSeparatorComponent={_itemSeparator}
          data={tenantList.results}
          renderItem={_renderItem}
          indicatorColor={colors.GRAY500}
          pullToRefresh={true}
          hasNext={tenantList.next}
          loadMore={true}
          contentContainerStyle={{ flexGrow: 1, }}
        />

      </View>
    </Container>
  );
};

export default React.memo(Tenant);
