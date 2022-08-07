import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import Container from '@src/components/Container';
import RequestView from '@src/components/RequestView';
import ListContent from '@src/components/MaintenanceRequests/ListContent';
import { STATUS_REQUESTS, FILTER } from '@constants/screenKeys';
import NavigationActionsService from '@src/navigation/navigation';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import TypeRequest from '@src/components/RequestView/enum';
import translate from '@src/localize';
import NewIcon from '@src/res/icons/new-request-icon/new-request-icon.png';
import PendingIcon from '@src/res/icons/pending-request-icon/pending-request-icon.png';
import InProgressIcon from '@src/res/icons/inprogress-request-icon/inprogress-request-icon.png';
import DoneIcon from '@src/res/icons/done-request-icon/done-request-icon.png';
import { hardShowBy } from '@src/screens/manager/Filter/dummyData';
import { StatusMaintenanceRequest, Priority } from '@reup/reup-api-sdk/libs/api/enum';
import { QueryMaintenanceRequestParams, QueryMaintenanceRequestGeneralParams } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { getListMaintenanceRequest, getGeneral, saveListMaintenanceRequest, saveStatus } from '@src/modules/Maintenance/actions';
import { pickBy, identity } from 'lodash';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import { ICON_MAINTENANCE } from '@src/constants/icons';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCaseFirstChar } from '@src/utils';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { formatDateWith } from '@src/utils/date';
import { Config } from '@src/configs/appConfig';

const MaintenanceRequest = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const myCountryList = useSelector<RootState, ICountry[]>((state: RootState) => state.company.listMyCountry.results);
  const buildingList = useSelector<RootState, ICompanyProperty[]>((state: RootState) => state.company.listProperty.results);
  const maintenanceRequestList = useSelector<RootState, IPagination<IRequest>>((state: RootState) => state.maintenance.listMaintenanceRequest);
  const flatListRef = useRef<any>(null);
  const [isLoadedData, setLoadedData] = useState(false);
  const [params, setParams] = useState<QueryMaintenanceRequestParams>({
    country_id: '',
    property_id: '',
    from_date: '',
    to_date: '',
    priority: '',
    status: ''
  });

  useEffect(() => {
    onSaveStatus(null);
  }, []);

  useEffect(() => {
    if (isLoadedData && me && me.default_company && me.default_company.id) {
      const p = {
        company_id: me && me.default_company ? me.default_company.id : '',
        country_id: '',
        property_id: '',
        from_date: '',
        to_date: '',
        priority: '',
        status: ''
      };
      onGetGeneralMaintenanceRequest();
      onReloadDataWithParams(p);
    }
  }, [me.default_company.id]);

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

  const dataStatus = [
    { _key: '', _value: 'Please Choose' },
    { _key: StatusMaintenanceRequest.Waiting, _value: upperCaseFirstChar(StatusMaintenanceRequest.Waiting.valueOf()) },
    { _key: StatusMaintenanceRequest.Pending, _value: upperCaseFirstChar(StatusMaintenanceRequest.Pending.valueOf()) },
    { _key: StatusMaintenanceRequest.InProgress, _value: upperCaseFirstChar(StatusMaintenanceRequest.InProgress.valueOf().replace("_", " ")) },
    { _key: StatusMaintenanceRequest.Done, _value: upperCaseFirstChar(StatusMaintenanceRequest.Done.valueOf()) },
  ];

  const onSaveStatus = (status?: StatusMaintenanceRequest | null | undefined) => {
    dispatch(
      saveStatus({
        results: status
      })
    );
  };

  const onSelect = (typeRequest: TypeRequest) => {
    let title = translate('maintenance.waiting');
    let icon = NewIcon;
    let status = StatusMaintenanceRequest.Waiting;
    if (typeRequest == TypeRequest.Waiting) {
      title = translate('maintenance.waiting');
      icon = NewIcon;
      status = StatusMaintenanceRequest.Waiting;
      onSaveStatus(StatusMaintenanceRequest.Waiting);
    } else if (typeRequest == TypeRequest.Pending) {
      title = translate('maintenance.pending');
      icon = PendingIcon;
      status = StatusMaintenanceRequest.Pending;
      onSaveStatus(StatusMaintenanceRequest.Pending);
    } else if (typeRequest == TypeRequest.In_Progress) {
      title = translate('maintenance.in_progress');
      icon = InProgressIcon;
      status = StatusMaintenanceRequest.InProgress;
      onSaveStatus(StatusMaintenanceRequest.InProgress);
    } else {
      title = translate('maintenance.done');
      icon = DoneIcon;
      status = StatusMaintenanceRequest.Done;
      onSaveStatus(StatusMaintenanceRequest.Done);
    }
    NavigationActionsService.push(
      STATUS_REQUESTS,
      {
        title: title,
        icon: icon,
        status: status,
        maintenanceFlatListRef: flatListRef
      }
    );
  };

  const onReloadDataWithParams = (p: QueryMaintenanceRequestParams) => {
    setParams(p);
    if (flatListRef && flatListRef.current) {
      flatListRef.current.resetInitPage(1);
      flatListRef.current.scrollToTop();
    }
    setTimeout(() => {
      onGetListMaintenanceRequest(1, p);
    }, 200);
  };

  const onApplyFilter = (filter: any) => {
    const filterCountry = filter.country && myCountryList.find(item => item.id === parseInt(filter.country));
    const filterBuilding = filter.building && buildingList.find(item => item.id === filter.building);
    const filterPriority = filter.sortByLatest && dataSortBy.find(item => item._key === filter.sortByLatest);
    const filterStatus = filter.status && dataStatus.find(item => item._key === filter.status);
    let p: QueryMaintenanceRequestParams = {
      country_id: filterCountry ? `${filterCountry.id}` : '',
      property_id: filterBuilding ? filterBuilding.id : '',
      priority: filterPriority ? filterPriority._key : '',
      status: filterStatus ? filterStatus._key : ''
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
      numberOfInput: 2,
      isSortByLatest: true,
      indexSortByLatest: 0,
      dataSortByLatest: dataSortBy,
      isShowBy: true,
      dataShowBy: dataShowBy,
      isStatus: true,
      indexStatus: 1,
      dataStatus: dataStatus,
      onFilter: onApplyFilter
    });
  };

  const onGetGeneralMaintenanceRequest = () => {
    dispatch(
      getGeneral({
        companyId: me && me.default_company ? me.default_company.id : '',
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onGetListMaintenanceRequest = (page: number, q?: QueryMaintenanceRequestParams, onLoadSuccess?: () => void,
    onLoadFailure?: () => void) => {
    dispatch(
      getListMaintenanceRequest({
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

  const onLoad = (page: number, onLoadSuccess: () => void, onLoadFailure: () => void) => {
    if (page == 1) {
      onGetGeneralMaintenanceRequest();
    }
    onGetListMaintenanceRequest(page, params, onLoadSuccess, onLoadFailure);
  };

  const _renderRequestView = () => {
    return (
      <View style={styles.viewFilter}>
        <CustomSectionHeader
          title="SUMMARY"
          style={styles.headers}
          icon={ICON_MAINTENANCE}
          isShowFilter={true}
          onPressFilter={onPressFilter}
        />
        <View style={styles.listContainer}>
          <ListContent
            flatListRef={flatListRef}
            data={maintenanceRequestList}
            onLoad={onLoad}
            showStatusIcon={true}
            listHeaderComponent={
              <View>
                <RequestView onPressItem={onSelect} />
                <View style={styles.viewLine} />
              </View>
            }
          />
        </View>
      </View>
    );
  };

  return (
    <Container isShowHeader={true} title={'Maintenance Requests'} isDisplayBackButton={false}>
      <View style={styles.maintainenceContainer}>
        {_renderRequestView()}
      </View>
    </Container >
  );
};

export default MaintenanceRequest;
