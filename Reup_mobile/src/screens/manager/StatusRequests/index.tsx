import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, Image, Alert } from 'react-native';
import Container from '@src/components/Container';
import { useRoute } from '@react-navigation/native';
import ListContent from '@src/components/MaintenanceRequests/ListContent';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import translate from '@src/localize';
import { capitalize, upperCase, pickBy, identity, debounce } from 'lodash';
import ICON_SEARCH from '@src/res/icons/icon-search-white.png';
import ADD_PLUS from '@res/icons/icon-plus-round.png';
import { CustomButton } from '@src/components/CustomButton';
import CustomSectionHeader from "@src/components/CustomSection";
import { FILTER, NEW_REQUEST } from '@src/constants/screenKeys';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { hardShowBy } from '@src/screens/manager/Filter/dummyData';
import { StatusMaintenanceRequest, Priority } from '@reup/reup-api-sdk/libs/api/enum';
import { QueryMaintenanceRequestParams } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { getListStatusMaintenanceRequest, saveStatus, saveListStatusMaintenanceRequest } from '@src/modules/Maintenance/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import SearchBar from '@src/components/SearchBar';
import { upperCaseFirstChar } from '@src/utils';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { formatDateWith } from '@src/utils/date';
import { Config } from '@src/configs/appConfig';

interface Props {
  title: string;
  icon: string;
  status: StatusMaintenanceRequest;
  maintenanceFlatListRef?: any;
}

const StatusRequests = (props: Props) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const myCountryList = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const buildingList = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results);
  const statusMaintenanceRequestList = useSelector<RootState, IPagination<IRequest>>((state: RootState) => state.maintenance.listStatusMaintenanceRequest);
  const { title, icon, status, maintenanceFlatListRef } = route.params as Props;

  const [params, setParams] = useState<QueryMaintenanceRequestParams>({
    status: status ? status.valueOf() : '',
    search: '',
    country_id: '',
    property_id: '',
    from_date: '',
    to_date: '',
    priority: ''
  });

  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: QueryMaintenanceRequestParams) => {
    onGetListStatusMaintenanceRequest(1, p);
  }, 500);

  const flatListRef = useRef<any>(null);

  const dataSortBy = [
    { _key: '', _value: 'Please Choose' },
    { _key: Priority.High, _value: upperCaseFirstChar(Priority.High.valueOf()) },
    { _key: Priority.Medium, _value: upperCaseFirstChar(Priority.Medium.valueOf()) },
    { _key: Priority.Low, _value: upperCaseFirstChar(Priority.Low.valueOf()) }
  ];

  const dataShowBy = [
    { _key: '', _value: 'Please Choose' },
    { _key: "0", _value: translate('filter.all_time') },
    { _key: "1", _value: translate('filter.specific_time') }
  ];

  const onSaveStatus = (status?: StatusMaintenanceRequest | null | undefined) => {
    dispatch(
      saveStatus({
        results: status
      })
    );
  };

  useEffect(() => {
    return () => {
      onSaveStatus(null);
      onResetDataRequest();
    };
  }, []);

  const onResetDataRequest = () => {
    dispatch(saveListStatusMaintenanceRequest({
      results: {
        count: 0,
        next: '',
        previous: '',
        results: []
      }
    }));
  };

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        status: status ? status.valueOf() : '',
        country_id: '',
        property_id: '',
        from_date: '',
        to_date: '',
        priority: '',
        search: searchText
      };
      onReloadDataWithParams(p);
    }
  }, [me.default_company.id]);

  useEffect(() => {
    if (isLoadedData) {
      const p = {
        ...params,
        search: searchText,
      };
      if (flatListRef && flatListRef.current) {
        flatListRef.current.resetInitPage(1);
        flatListRef.current.scrollToTop();
      }
      debounceLoadData(p);
    }
  }, [searchText]);

  const onGetListStatusMaintenanceRequest = (page: number, q?: QueryMaintenanceRequestParams, onLoadSuccess?: () => void,
    onLoadFailure?: () => void) => {
    dispatch(
      getListStatusMaintenanceRequest({
        companyId: me && me.default_company ? me.default_company.id : '',
        page,
        q,
        onSuccess: (data) => {
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
  };

  const onReloadDataWithParams = (p: QueryMaintenanceRequestParams) => {
    setParams(p);
    if (flatListRef && flatListRef.current) {
      flatListRef.current.resetInitPage(1);
      flatListRef.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListStatusMaintenanceRequest(1, p);
    }, 200);
  };

  const onLoadStatus = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    onGetListStatusMaintenanceRequest(page, { ...params, search: searchText }, onLoadSuccess, onLoadFailure);
  };

  const onApplyFilter = (filter: any) => {
    const filterCountry = filter.country && myCountryList.find(item => item.id === parseInt(filter.country));
    const filterBuilding = filter.building && buildingList.find(item => item.id === filter.building);
    const filterPriority = filter.sortByLatest && dataSortBy.find(item => item._key === filter.sortByLatest);
    let p: QueryMaintenanceRequestParams = {
      status: status ? status.valueOf() : '',
      country_id: filterCountry ? `${filterCountry.id}` : '',
      property_id: filterBuilding ? filterBuilding.id : '',
      priority: filterPriority ? filterPriority._key : '',
      search: searchText
    };
    const filterShowBy = filter.showBy && dataShowBy.find(item => item._key === filter.showBy);
    if (filterShowBy && filterShowBy._key == '1') {
      p = {
        ...p,
        from_date: formatDateWith(filter.from, Config.Manager.formatDate, Config.Manager.formatDateDisplay),
        to_date: formatDateWith(filter.to, Config.Manager.formatDate, Config.Manager.formatDateDisplay),
      };
    } else {
      p = {
        ...p,
        from_date: '',
        to_date: '',
      };
    }
    onReloadDataWithParams(p);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER, {
      numberOfInput: 1,
      isSortByLatest: true,
      indexSortByLatest: 0,
      dataSortByLatest: dataSortBy,
      isShowBy: true,
      dataShowBy: dataShowBy,
      onFilter: onApplyFilter
    });
  };

  const onChangeText = (text: string) => {
    setSearchText(text);
  };

  const _renderRequestView = () => {
    return (
      <View style={styles.viewFilter}>
        <CustomSectionHeader
          style={styles.headers}
          title={`${title} ${upperCase(translate('navigation.tabbar_requests'))}`}
          styleTitle={styles.styleTitle}
          styleTitleContain={styles.styleTitleContain}
          icon={icon}
          isShowFilter={true}
          onPressFilter={onPressFilter}
        />
        <View style={styles.viewListContent}>
          <View style={styles.containerSearchFilterBar}>
            <SearchBar
              value={searchText}
              placeholder={translate("category.placeholder_search")}
              onChangeText={onChangeText}
            />
          </View>
          <ListContent
            showStatusIcon={false}
            onLoad={onLoadStatus}
            data={statusMaintenanceRequestList}
            flatListRef={flatListRef}
            maintenanceFlatListRef={maintenanceFlatListRef} />
        </View>
      </View>
    );
  };

  const onPressAddNewRequest = () => {
    NavigationActionsService.push(
      NEW_REQUEST,
      {
        MaintenanceRequestRef: maintenanceFlatListRef,
        StatusRequests: flatListRef
      }
    );
  };

  const _renderAddNewRequest = () => {
    return (
      <View style={styles.addNewRequestContainer}>
        <View style={styles.line}></View>
        <View style={styles.addNewRequestContents}>
          <CustomButton
            onPress={onPressAddNewRequest}
            iconLeft={ADD_PLUS} style={styles.btnAddNewRequest}
            text={translate('requests.add_new_request')} />
        </View>
      </View>
    );
  };

  return (
    <Container
      isShowHeader={true}
      title={`${capitalize(title)} ${translate('navigation.tabbar_requests')}`}
      spaceBottom={true}
      isDisplayBackButton={true}>
      <View style={styles.maintainenceContainer}>
        {_renderRequestView()}
      </View>
      {_renderAddNewRequest()}
    </Container >
  );
};

export default React.memo(StatusRequests);
