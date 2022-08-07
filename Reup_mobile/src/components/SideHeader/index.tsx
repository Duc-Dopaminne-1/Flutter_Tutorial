import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import styles from './styles';

import DropdownNative, { ObjDropdown } from '../Dropdown/DropdownNative';
import CircleAvatar from '@src/components/CircleAvatar';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUser, IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { getFullName, isTenantApp } from '@src/utils';
import { IPagination } from '@reup/reup-api-sdk/libs/type';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';
import { CustomText } from '../CustomText';
import { updateProfile } from '@src/modules/auth/actions';
import translate from '@src/localize';
import { countListStaff, countListResident, getListProperty, getMyListCountry, getListStaff, getListTenant, getListApartment } from '@src/modules/Company/actions';
import { LimitGetAll } from '@src/constants/vars';
import { QueryMaintenanceRequestGeneralParams, QueryMaintenanceRequestParams } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import { getGeneral, getListMaintenanceRequest, getListStatusMaintenanceRequest, getResidentRequestGeneral } from '@src/modules/Maintenance/actions';
import { StatusMaintenanceRequest } from '@reup/reup-api-sdk/libs/api/enum';
import { findIndex } from 'lodash';

const SideHeader = () => {
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const companyReducer = useSelector<RootState, IPagination<ICompany>>((state: RootState) => state.company.listCompany!);
  const listCompany: ObjDropdown[] = companyReducer && companyReducer.results && companyReducer.results.map((obj: ICompany) => {
    return { _key: obj.id, _value: obj.name };
  });
  const [company, setCompany] = useState<number>(findIndex(listCompany, { _key: me && me.default_company ? me.default_company.id : '' }) ?? 0);

  useEffect(() => {
    if (me && me.default_company && me.default_company.id) {
      setCompany(findIndex(listCompany, { _key: me.default_company.id }) ?? 0);
    }
  }, [me, listCompany]);

  const getName = () => {
    if (me && me.first_name && me.last_name) {
      return getFullName(me.first_name, me.last_name);
    }
    return me && me.email;
  };

  const fetchCountStaff = (companyID: string) => {
    dispatch(countListStaff({
      companyId: companyID,
      onFail: error => {
        console.log('Error CountStaff', error && error.message);
      }
    }));
  };

  const fetchCountResident = (companyID: string) => {
    dispatch(countListResident({
      companyId: companyID,
      onFail: error => {
        console.log('Error CountResident', error && error.message);
      }
    }));
  };

  const onSuccessUpdateProfile = (obj: ObjDropdown) => {
    setCompany(findIndex(listCompany, { _key: obj._key }));
    fetchCountStaff(obj._key);
    fetchCountResident(obj._key);
    fetchMyListCountry(obj._key);
    fetchGeneralMaintenanceRequest(obj._key);
  };

  const onChangeDropdown = (obj: ObjDropdown) => {
    dispatch(
      updateProfile({
        data: { default_company: obj._key },
        onSuccess: () => {
          onSuccessUpdateProfile(obj);
        },
        onFail: error => {
          setTimeout(() => {
            error && Alert.alert(translate('alert.title_error'), error.message);
          }, 700);
        },
      }));
  };

  const fetchMyListCountry = (companyId: string) => {
    dispatch(
      getMyListCountry({
        companyId,
        onFail: error => {
          console.log('Error MyListCountry', error && error.message);
        }
      }));
  };

  const fetchGeneralMaintenanceRequest = (id: string) => {
    if (isTenantApp()) {
      dispatch(
        getResidentRequestGeneral({
          property_id: id,
          onFail: error => {
            console.log('Error GeneralMaintenanceRequest', error && error.message);
          }
        })
      )
    } else {
      dispatch(
        getGeneral({
          companyId: id,
          onFail: error => {
            console.log('Error GeneralMaintenanceRequest', error && error.message);
          }
        })
      )
    }
  }

  const renderBuilding = () => {
    if (listCompany.length > 1) {
      return (
        <DropdownNative
          arrData={listCompany}
          containerStyle={styles.headerPositionName}
          selected={company}
          lineBottom={true}
          isShowAccessory={true}
          onChangeDropDown={onChangeDropdown}
          linearGradientColors={["transparent", "transparent"]}
          textStyle={styles.buildingText}
          iconRightStyle={styles.arrowImage}
          isHideTitle={true}
          textTitle={'Choose Company'}
        />
      );
    } else if (listCompany.length <= 1
      && me
      && me.default_company
      && me.default_company.id) {
      const defaultCompany = listCompany.find(item => item._key === me.default_company.id);
      const nameBuilding = defaultCompany ? defaultCompany._value : '';
      return (
        <CustomText text={nameBuilding} style={styles.buildingText} styleContainer={styles.headerPositionName} />
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.headerView}>
      <CircleAvatar
        name={getName()}
        size={66}
        avatar={me && me.avatar} />
      <View style={styles.headerName}>
        <Text style={styles.headerNameText}>Hi </Text>
        <Text style={styles.headerNameTextSpan}>{getName()}</Text>
      </View>
      {renderBuilding()}
    </View>
  );
};

export default React.memo(SideHeader);
