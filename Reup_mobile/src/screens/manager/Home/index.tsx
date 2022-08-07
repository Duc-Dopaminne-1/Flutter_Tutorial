import styles from './styles';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HOME, REQUESTS, REPORT,
  SHOPPING_STORE,
  INVITE_STAFF
} from '@src/constants/screenKeys';
import Home from './Home';
import Requests from './Requests';
import Report from './Report';
import ShoppingStore from './ShoppingStore';
import translate from '@src/localize';
import {
  TABBAR_ICON_REQUEST,
  TABBAR_ICON_REPORT,
  TABBAR_ICON_SHOPPING_STORE,
  TABBAR_ICON_HOME
} from '@constants/icons';
import PlusButton from '@src/components/PlusButton';
import ItemBottomBar from '@src/components/ItemBottomBar';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { countListStaff, countListResident, getListProperty, getMyListCountry } from '@src/modules/Company/actions';
import { getListCountry, getIDType } from '@src/modules/Config/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import { ICompany } from '@reup/reup-api-sdk/libs/api/company/models';
import { getGeneral } from '@src/modules/Maintenance/actions';
import { QueryMaintenanceRequestGeneralParams } from '@reup/reup-api-sdk/libs/api/maintenance/request';
import moment from 'moment';
import { LimitGetAll, LimitLoadMore } from '@src/constants/vars';
import { Config } from '@src/configs/appConfig';
import { QueryCompanyBulletinBoardForLeaseParams } from '@reup/reup-api-sdk/libs/api/company/bulletin-board/for-lease';
import { getListForLease, getListForSale } from '@src/modules/bulletin/actions';
import { isTenantApp } from '@src/utils';

const MainScreen = () => {
  const dispatch = useDispatch();
  const Tab = createBottomTabNavigator();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);
  const companyList = useSelector<RootState, ICompany[]>((state: RootState) => state.company.listCompany.results);

  const onPress = () => {
    NavigationActionsService.push(INVITE_STAFF);
  };

  const fetchMyCountry = (companyID: string) => {
    dispatch(getMyListCountry({
      companyId: companyID,
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };
  const fetchCountStaff = (companyID: string) => {
    dispatch(countListStaff({
      companyId: companyID,
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };

  const fetchCountResident = (companyID: string) => {
    dispatch(countListResident({
      companyId: companyID,
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };

  const fetchIDType = () => {
    dispatch(getIDType({
      onSuccess: (data) => {
        console.log("===== Success IDType: ", data);
      },
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };

  const fetchListCountry = () => {
    dispatch(getListCountry({
      onSuccess: (data) => {
        console.log("===== Success country data: ", data);
      },
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };

  const fetchListBuilding = (companyId: string) => {
    dispatch(
      getListProperty({
        companyId,
        limit: LimitGetAll,
        onSuccess: async (data) => {
          console.log("===== Success List Building: ", data);
        },
        onFail: error => {
          console.log('Error', error && error.message);
        }
      }));
  };

  const fetchConfigData = () => {
    fetchIDType();
    fetchListCountry();
    if (me && me.default_company) {
      const defaultCompany = companyList.find(item => item.id === me.default_company.id);
      const defaultCompanyId = defaultCompany ? defaultCompany.id : '';
      fetchCountStaff(defaultCompanyId);
      fetchCountResident(defaultCompanyId);
      fetchListBuilding(defaultCompanyId);
      fetchMyCountry(defaultCompanyId);
      fetchGeneral();
    }
  };

  const fetchGeneral = () => {
    const startOfMonth = moment().startOf('month').format(Config.Manager.formatDateDisplay);
    const endOfMonth = moment().endOf('month').format(Config.Manager.formatDateDisplay);
    const params: QueryMaintenanceRequestGeneralParams = {
      // from_date: startOfMonth,
      // to_date: endOfMonth
    };
    dispatch(
      getGeneral({
        companyId: me && me.default_company ? me.default_company.id : '',
        onSuccess: async (data) => {
          console.log("===== Success general: ", data);
        },
        onFail: error => {
          console.log('Error', error && error.message);
        }
      })
    );
  };

  useEffect(() => {
    fetchConfigData();
  }, []);


  return (
    <Tab.Navigator tabBarOptions={{
      labelStyle: {},
      activeTintColor: '#ffffff', inactiveTintColor: '#ffffff',
      activeBackgroundColor: '#1B72BF', inactiveBackgroundColor: '#1B72BF',
      showLabel: false
    }}
    >
      <Tab.Screen name={HOME} options={{
        tabBarIcon: ({ color, focused }) => (
          <ItemBottomBar
            color={color}
            focused={focused}
            text={translate('navigation.tabbar_home')}
            icon={TABBAR_ICON_HOME} />
        ),
      }} component={Home} />
      <Tab.Screen name={REQUESTS} options={{
        tabBarIcon: ({ color, focused }) => (
          <ItemBottomBar
            color={color}
            focused={focused}
            text={translate('navigation.tabbar_requests')}
            icon={TABBAR_ICON_REQUEST} />
        ),
      }} component={Requests} />
      <Tab.Screen name={'center'}
        options={{
          tabBarIcon: () => (
            <PlusButton onPress={onPress} />
          )
        }} component={() => null} />
      <Tab.Screen name={REPORT}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ItemBottomBar
              color={color}
              focused={focused}
              text={translate('navigation.tabbar_report')}
              icon={TABBAR_ICON_REPORT} />
          ),
        }} component={Report} />
      <Tab.Screen name={SHOPPING_STORE}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ItemBottomBar
              color={color}
              focused={focused}
              text={translate('navigation.tabbar_shopping_store')}
              icon={TABBAR_ICON_SHOPPING_STORE} />
          ),
        }} component={ShoppingStore} />
    </Tab.Navigator>
  );
};

export default MainScreen;
