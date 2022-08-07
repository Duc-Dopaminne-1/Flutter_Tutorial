import styles from './styles';
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HOME_TENANT,
  SHOPPING_STORE_TENANT,
  NEW_REQUEST_TENANT,
  MONTHLY_BILL_TENANT,
  VISITORS_TENANT, REQUESTS_TENANT
} from '@src/constants/screenKeys';
import Home from './HomeTenant';
import Requests from './RequestsTenant';
import ShoppingStore from './ShoppingStoreTenant';
import translate from '@src/localize';
import {
  TABBAR_ICON_REQUEST,
  TABBAR_ICON_SHOPPING_STORE,
  TABBAR_ICON_HOME,
  TABBAR_ICON_MONTHLY_BILL
} from '@constants/icons';
import PlusButton from '@src/components/PlusButton';
import ItemBottomBar from '@src/components/ItemBottomBar';
import NavigationActionsService from '@src/navigation/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getListCountry, getIDType } from '@src/modules/Config/actions';
import { RootState } from '@src/types/types';
import { IUserProfile } from '@reup/reup-api-sdk/libs/api/user/models';
import MonthlyBill from './MonthlyBillTenant';
import { getListMyProperty } from '@src/modules/Company/actions';

const MainScreenTenant = () => {
  const dispatch = useDispatch();
  const Tab = createBottomTabNavigator();
  const me = useSelector<RootState, IUserProfile>((state: RootState) => state.auth.userData!);

  const onPress = () => {
    NavigationActionsService.push(NEW_REQUEST_TENANT);
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

  const fetchListProperty = () => {
    dispatch(getListMyProperty({
      onSuccess: (data) => {
        console.log("===== Success fetchListProperty data: ", data);
      },
      onFail: error => {
        console.log('Error', error && error.message);
      }
    }));
  };

  const fetchConfigData = () => {
    fetchIDType();
    fetchListCountry();
    fetchListProperty();
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
      <Tab.Screen name={HOME_TENANT} options={{
        tabBarIcon: ({ color, focused }) => (
          <ItemBottomBar
            color={color}
            focused={focused}
            text={translate('navigation.tabbar_home')}
            icon={TABBAR_ICON_HOME} />
        ),
      }} component={Home} />
      <Tab.Screen name={REQUESTS_TENANT} options={{
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
      <Tab.Screen name={MONTHLY_BILL_TENANT}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ItemBottomBar
              color={color}
              focused={focused}
              text={translate('navigation.tabbar_bill')}
              icon={TABBAR_ICON_MONTHLY_BILL} />
          ),
        }} component={MonthlyBill} />
      <Tab.Screen name={SHOPPING_STORE_TENANT}
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

export default MainScreenTenant;
