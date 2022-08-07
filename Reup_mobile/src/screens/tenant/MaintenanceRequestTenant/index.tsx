import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import Container from '@src/components/Container';
import RequestView from '@src/components/RequestView';
import ListContent from '@src/components/MaintenanceRequests/ListContent';
import { STATUS_REQUESTS, FILTER, STATUS_REQUESTS_TENANT, FILTER_TENANT } from '@constants/screenKeys';
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
import { StatusMaintenanceRequest, Priority } from '@reup/reup-api-sdk/libs/api/enum';
import { getListMaintenanceRequest, getGeneral, saveStatus, getResidentRequestGeneral, getListResidentRequest } from '@src/modules/Maintenance/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { IRequest } from '@reup/reup-api-sdk/libs/api/maintenance/request/model';
import { ICON_MAINTENANCE } from '@src/constants/icons';
import CustomSectionHeader from '@src/components/CustomSection';
import { upperCaseFirstChar } from '@src/utils';
import { ICountry } from '@reup/reup-api-sdk/libs/api/country/model';
import { ICompanyProperty } from '@reup/reup-api-sdk/libs/api/company/property/model';
import { ResidentQueryMaintenanceRequestParams } from '@reup/reup-api-sdk/libs/api/resident/maintenance';

const MaintenanceRequestTenant = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const maintenanceRequestList = useSelector<RootState, IPagination<IRequest>>((state: RootState) => state.maintenance.listMaintenanceRequest);
  const flatListRef = useRef<any>(null);
  const [isLoadedData, setLoadedData] = useState(false);
  const [params, setParams] = useState<ResidentQueryMaintenanceRequestParams>({
    unit_id: '',
    search: '',
    status: ''
  });

  useEffect(() => {
    onSaveStatus(null);
  }, []);

  useEffect(() => {
    if (isLoadedData && me && me.default_property) {
      const p = {
        unit_id: '',
        search: '',
        status: ''
      };
      onGetGeneralMaintenanceRequest();
      onReloadDataWithParams(p);
    }
  }, [me.default_property]);

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
      STATUS_REQUESTS_TENANT,
      {
        title: title,
        icon: icon,
        status: status,
        maintenanceFlatListRef: flatListRef
      }
    );
  };

  const onReloadDataWithParams = (p: ResidentQueryMaintenanceRequestParams) => {
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
    const filterStatus = filter.status && dataStatus.find(item => item._key === filter.status);
    const p: ResidentQueryMaintenanceRequestParams = {
      unit_id: '',
      search: '',
      status: filterStatus ? filterStatus._key : ''
    };
    onReloadDataWithParams(p);
  };

  const onPressFilter = () => {
    NavigationActionsService.push(FILTER_TENANT, {
      numberOfInput: 1,
      isStatus: true,
      indexStatus: 0,
      dataStatus: dataStatus,
      isBuilding: false,

      onFilter: onApplyFilter
    });
  };

  const onGetGeneralMaintenanceRequest = () => {
    dispatch(
      getResidentRequestGeneral({
        property_id: me && me.default_property ? me.default_property : '',
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        }
      })
    );
  };

  const onGetListMaintenanceRequest = (page: number, q?: ResidentQueryMaintenanceRequestParams, onLoadSuccess?: () => void,
    onLoadFailure?: () => void) => {
    dispatch(
      getListResidentRequest({
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

export default MaintenanceRequestTenant;
