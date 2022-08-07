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
import { FILTER, FILTER_TENANT, NEW_REQUEST, NEW_REQUEST_TENANT } from '@src/constants/screenKeys';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { StatusMaintenanceRequest, Priority } from '@reup/reup-api-sdk/libs/api/enum';
import { getListStatusMaintenanceRequest, getListStatusResidentRequest, saveStatus } from '@src/modules/Maintenance/actions';
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
import { ResidentQueryMaintenanceRequestParams } from '@reup/reup-api-sdk/libs/api/resident/maintenance';

interface Props {
  title: string;
  icon: string;
  status: StatusMaintenanceRequest;
  maintenanceFlatListRef?: any;
}

const StatusRequestsTenant = (props: Props) => {
  const dispatch = useDispatch();
  const route = useRoute();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const myCountryList = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const buildingList = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results);
  const statusMaintenanceRequestList = useSelector<RootState, IPagination<IRequest>>((state: RootState) => state.maintenance.listStatusMaintenanceRequest);
  const { title, icon, status, maintenanceFlatListRef } = route.params as Props;

  const [params, setParams] = useState<ResidentQueryMaintenanceRequestParams>({
    status: status ? status.valueOf() : '',
    search: '',
    unit_id: ''
  });

  const [isLoadedData, setLoadedData] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const debounceLoadData = debounce((p: ResidentQueryMaintenanceRequestParams) => {
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
    { _key: '', _value: translate('filter.please_choose') },
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
    };
  }, []);

  useEffect(() => {
    if (isLoadedData && me && me.default_property) {
      const p = {
        status: status ? status.valueOf() : '',
        unit_id: '',
        search: searchText
      };
      onReloadDataWithParams(p);
    }
  }, [me.default_property]);

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

  const onGetListStatusMaintenanceRequest = (page: number, q?: ResidentQueryMaintenanceRequestParams, onLoadSuccess?: () => void,
    onLoadFailure?: () => void) => {
    dispatch(
      getListStatusResidentRequest({
        property_id: me && me.default_property ? me.default_property : '',
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

  const onReloadDataWithParams = (p: ResidentQueryMaintenanceRequestParams) => {
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
    const p: ResidentQueryMaintenanceRequestParams = {
      status: status ? status.valueOf() : '',
      unit_id: '',
      search: searchText
    };
    onReloadDataWithParams(p);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER_TENANT, {
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
          isShowFilter={false}
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
      NEW_REQUEST_TENANT,
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

export default React.memo(StatusRequestsTenant);
