import {
  APP_SCREEN,
  LOGIN,
  SIGN_UP,
  FORGOT_PASSWORD,
  ONBOARDING,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  MAIN_SCREEN,
  STAFF_POSITION,
  MAINTENANCE_REQUEST,
  BUILDING_DETAIL,
  MY_PROFILE,
  STAFF,
  NEW_STAFF_POSITION,
  STAFF_DETAIL,
  TENANT,
  NOTIFICATIONS,
  TENANT_DETAIL,
  BUILDIND_SYSTEM,
  STATUS_REQUESTS,
  REQUEST_DETAIL,
  NOTIFICATION_DETAILS,
  NEW_NOTIFICATION,
  DOCUMENT,
  CATEGORY_DETAILS,
  NEW_CATEGORY,
  VISITORS,
  CALENDAR_DETAILS,
  CALENDAR_SCREEN,
  NEW_CALENDAR_EVENT,
  PRODUCT_CATEGORY,
  NEW_BUILDING,
  DELIVERIES,
  NEW_DELIVERY,
  CATEGORY,
  NEW_PRODUCT_CATEGORY,
  RECURRING_TASK,
  RECURRING_TASK_DETAIL,
  NEW_COMPANY,
  POST,
  POST_DETAIL,
  DOCUMENT_DETAIL,
  PERSONAL_INFO,
  CONFIRMATION,
  FILTER,
  EDIT_PROFILE,
  NEW_TASK,
  NEW_POST,
  NEW_APARTMENT,
  APARTMENTS,
  APARTMENT_DETAILS,
  PRODUCT_DETAIL,
  INVITE_STAFF,
  ENVENT_TYPE,
  NEW_EVENT_TYPE,
  MODAL_LOADING,
  MEMBER_DETAILS,
  EDIT_STAFF_POSITION,
  NEW_MEMBER,
  TRANSFER_APARTMENT,
  EDIT_MEMBER,
  EDIT_MAINTENANCE_CATEGORY,
  EDIT_RECURRING_TASK,
  FACILITIES,
  NEW_FACILITY,
  FACILITY_DETAIL,
  EDIT_FACILITY,
  NEW_VISITOR,
  EDIT_PRODUCT_CATEGORY,
  NEW_REQUEST,
  APP_SCREEN_TENANT,
  FORGOT_PASSWORD_TENANT,
  LOGIN_TENANT,
  SIGN_UP_TENANT,
  PERSONAL_INFO_TENANT,
  MAIN_SCREEN_TENANT,
  ONBOARDING_TENANT,
  RESET_PASSWORD_TENANT,
  RESET_PASSWORD_SUCCESS_TENANT,
  MAINTENANCE_REQUEST_TENANT,
  MY_PROFILE_TENANT,
  NOTIFICATIONS_TENANT,
  STATUS_REQUESTS_TENANT,
  REQUEST_DETAIL_TENANT,
  DOCUMENT_TENANT,
  VISITORS_TENANT,
  NEW_VISITOR_TENANT,
  NOTIFICATION_DETAILS_TENANT,
  NEW_NOTIFICATION_TENANT,
  DELIVERIES_TENANT,
  CALENDAR_DETAILS_TENANT,
  CALENDAR_SCREEN_TENANT,
  NEW_CALENDAR_EVENT_TENANT,
  NEW_PRODUCT_CATEGORY_TENANT,
  EDIT_PRODUCT_CATEGORY_TENANT,
  RECURRING_TASK_TENANT,
  RECURRING_TASK_DETAIL_TENANT,
  POST_TENANT,
  DOCUMENT_DETAIL_TENANT,
  POST_DETAIL_TENANT,
  FILTER_TENANT,
  EDIT_PROFILE_TENANT,
  NEW_TASK_TENANT,
  CONFIRMATION_TENANT,
  NEW_POST_TENANT,
  APARTMENTS_TENANT,
  APARTMENT_DETAILS_TENANT,
  MODAL_LOADING_TENANT,
  MEMBER_DETAILS_TENANT,
  NEW_MEMBER_TENANT,
  EDIT_MEMBER_TENANT,
  EDIT_MAINTENANCE_CATEGORY_TENANT,
  EDIT_RECURRING_TASK_TENANT,
  FACILITIES_TENANT,
  FACILITY_DETAIL_TENANT,
  NEW_REQUEST_TENANT,
  MY_PURCHASE_TENANT,
  FINANCIAL_MANAGEMENT_TENANT,
  NEW_VEHICLE_TENANT,
  NEW_PET_TENANT,
  MONTHLY_BILL_TENANT,
  MY_SALE,
  NEW_BANK_ACCOUNT_TENANT,
  EDIT_BANK_ACCOUNT_TENANT,
  NEW_MONTHLY_BILL,
  MONTHLY_BILL,
  EDIT_MONTHLY_BILL,
  EDIT_STORE_TENANT,
  WHOLE_STORE_DETAILS_TENANT,
  MY_SHOP_DETAILS_TENANT,
  NEW_PRODUCT_TENANT,
} from '@constants/screenKeys';

import React, { useState } from 'react';
import App from '@src/screens/manager/App';
import Login from '@src/screens/manager/Account/Login';
import SignUp from '@src/screens/manager/Account/SignUp';
import ForgotPassword from '@src/screens/manager/Account/ForgotPassword';
import Onboarding from '@src/screens/manager/Onboarding';
import ResetPassword from '@src/screens/manager/Account/ForgotPassword/ResetPassword';
import ResetPasswordSuccess from '@src/screens/manager/Account/ForgotPassword/ResetPasswordSuccess';
import MainScreen from '@src/screens/manager/Home';
import StaffPosition from '@src/screens/manager/StaffPosition/StaffPosition';
import SideMenuManager from '@src/components/SideMenuManager';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaintenanceRequest from '@src/screens/manager/MaintenanceRequest';
import NewStaffPosition from '@src/screens/manager/StaffPosition/NewStaffPosition';
import BuildingDetail from '@src/screens/manager/BuildingDetail';
import Staff from '@src/screens/manager/Staff';
import MyProfile from '@src/screens/manager/MyProfile';
import StaffDetail from '../screens/manager/StaffDetail';
import Tenant from '@src/screens/manager/Tenant';
import Notifications from '@src/screens/manager/Home/Notifications';
import TenantDetail from '@src/screens/manager/TenantDetail';
import { WIDTH } from '@src/constants/vars';
import BuildingSystem from '@src/screens/manager/BuildingSystem';
import StatusRequests from '@src/screens/manager/StatusRequests';
import RequestDetail from '@src/screens/manager/RequestDetail';
import TransferApartment from '@src/screens/manager/TransferApartment';
import Document from '@src/screens/manager/Document';
import CategoryDetails from '@src/screens/manager/CategoryDetails';
import Visitors from '@src/screens/manager/Visitors';
import NotificationDetails from '@src/screens/manager/NotificationDetails';
import NewNotification from '@src/screens/manager/NewNotification';
import NewDelivery from '@src/screens/manager/NewDelivery';
import NewCalendarEvent from '@src/screens/manager/Calendar/NewCalendarEvent';
import ProductCategory from '@src/screens/manager/ProductCategory';
import NewBuilding from '../screens/manager/NewBuilding';
import Deliveries from '@src/screens/manager/Deliveries';
import Category from '@src/screens/manager/Category';
import NewProductCategory from '@src/screens/manager/NewProductCategory';
import InviteStaff from '@src/screens/manager/InviteStaff';
import CalendarDetails from '@src/screens/manager/Calendar/CalendarDetails';
import RecurringTask from '@src/screens/manager/RecurringTask';
import RecurringTaskDetail from '@src/screens/manager/RecurringTaskDetail';
import NewCompany from '@src/screens/manager/NewCompany';
import Post from '@src/screens/manager/Post';
import DocumentDetail from '@src/screens/manager/DocumentDetail';
import PostDetail from '@src/screens/manager/Post/PostDetail';
import EditProfile from '@src/screens/manager/EditProfile';
import NewTask from '@src/screens/manager/NewTask';
import CalendarScreen from '@src/screens/manager/Calendar';
import Confirmation from '@src/screens/manager/Account/Confirmation';
import Filter from '@src/screens/manager/Filter';
import NewPost from '@src/screens/manager/Post/NewPost';
import NewApartment from '@src/screens/manager/NewApartment';
import Apartments from '@src/screens/manager/Apartments';
import ApartmentDetails from '@src/screens/manager/ApartmentDetails';
import ProductDetail from '@src/screens/manager/Home/ShoppingStore/ProductDetail';
import PersonalInfo from '@src/screens/manager/Account/SignUp/PersonalInfo';
import EventType from '@src/screens/manager/EventType';
import NewEventType from '@src/screens/manager/NewEventType';
import LoadingModal from '@src/screens/manager/LoadingModal';
import MemberDetails from '@src/screens/manager/MemberDetails';
import EditStaffPosition from '@src/screens/manager/StaffPosition/EditStaffPosition';
import NewMember from '@src/screens/manager/NewMember';
import EditMember from '@src/screens/manager/EditMember';
import EditMaintenanceCategory from '@src/screens/manager/EditMaintenanceCategory';
import EditRecurringTask from '@src/screens/manager/EditRecurringTask';
import Facilites from '@src/screens/manager/Facility/Facilities';
import NewFacility from '@src/screens/manager/Facility/NewFacility';
import FacilityDetail from '@src/screens/manager/Facility/FacilityDetail';
import EditFacility from '@src/screens/manager/Facility/EditFacility';
import NewVisitor from '@src/screens/manager/NewVisitor';
import NewCategory from '@src/screens/manager/NewCategory';
import EditProductCategory from '@src/screens/manager/EditProductCategory';
import NewRequest from '@src/screens/manager/NewRequest';
import { isManagerApp } from '@src/utils';
import SideMenuTenant from '@src/components/SideMenuTenant';
import AppTenant from '@src/screens/tenant/AppTenant';
import ForgotPasswordTenant from '@src/screens/tenant/AccountTenant/ForgotPasswordTenant';
import LoginTenant from '@src/screens/tenant/AccountTenant/LoginTenant';
import MainScreenTenant from '@src/screens/tenant/HomeTenant';
import OnboardingTenant from '@src/screens/tenant/OnboardingTenant';
import ResetPasswordTenant from '@src/screens/tenant/AccountTenant/ForgotPasswordTenant/ResetPasswordTenant';
import ResetPasswordSuccessTenant from '@src/screens/tenant/AccountTenant/ForgotPasswordTenant/ResetPasswordSuccessTenant';
import MaintenanceRequestTenant from '@src/screens/tenant/MaintenanceRequestTenant';
import MyProfileTenant from '@src/screens/tenant/MyProfileTenant';
import NotificationsTenant from '@src/screens/tenant/HomeTenant/NotificationsTenant';
import StatusRequestsTenant from '@src/screens/tenant/StatusRequestsTenant';
import RequestDetailTenant from '@src/screens/tenant/RequestDetailTenant';
import DocumentTenant from '@src/screens/tenant/DocumentTenant';
import VisitorsTenant from '@src/screens/tenant/VisitorsTenant';
import NewVisitorTenant from '@src/screens/tenant/NewVisitorTenant';
import NotificationDetailsTenant from '@src/screens/tenant/NotificationDetailsTenant';
import NewNotificationTenant from '@src/screens/tenant/NewNotificationTenant';
import DeliveriesTenant from '@src/screens/tenant/DeliveriesTenant';
import CalendarDetailsTenant from '@src/screens/tenant/CalendarTenant/CalendarDetailsTenant';
import CalendarScreenTenant from '@src/screens/tenant/CalendarTenant';
import NewCalendarEventTenant from '@src/screens/tenant/CalendarTenant/NewCalendarEventTenant';
import CategoryTenant from '@src/screens/tenant/CategoryTenant';
import NewProductCategoryTenant from '@src/screens/tenant/NewProductCategoryTenant';
import EditProductCategoryTenant from '@src/screens/tenant/EditProductCategoryTenant';
import RecurringTaskTenant from '@src/screens/tenant/RecurringTaskTenant';
import RecurringTaskDetailTenant from '@src/screens/tenant/RecurringTaskDetailTenant';
import PostTenant from '@src/screens/tenant/PostTenant';
import DocumentDetailTenant from '@src/screens/tenant/DocumentDetailTenant';
import PostDetailTenant from '@src/screens/tenant/PostTenant/PostDetailTenant';
import FilterTenant from '@src/screens/tenant/FilterTenant';
import EditProfileTenant from '@src/screens/tenant/EditProfileTenant';
import NewTaskTenant from '@src/screens/tenant/NewTaskTenant';
import ConfirmationTenant from '@src/screens/tenant/AccountTenant/ConfirmationTenant';
import NewPostTenant from '@src/screens/tenant/PostTenant/NewPostTenant';
import ApartmentsTenant from '@src/screens/tenant/ApartmentsTenant';
import ApartmentDetailsTenant from '@src/screens/tenant/ApartmentDetailsTenant';
import LoadingModalTenant from '@src/screens/tenant/LoadingModalTenant';
import MemberDetailsTenant from '@src/screens/tenant/MemberDetailsTenant';
import EditMemberTenant from '@src/screens/tenant/EditMemberTenant';
import EditMaintenanceCategoryTenant from '@src/screens/tenant/EditMaintenanceCategoryTenant';
import EditRecurringTaskTenant from '@src/screens/tenant/EditRecurringTaskTenant';
import FacilityDetailTenant from '@src/screens/tenant/FacilityTenant/FacilityDetailTenant';
import NewRequestTenant from '@src/screens/tenant/NewRequestTenant';
import SignUpTenant from '@src/screens/tenant/AccountTenant/SignUpTenant';
import PersonalInfoTenant from '@src/screens/tenant/AccountTenant/SignUpTenant/PersonalInfoTenant';
import FacilitiesTenant from '@src/screens/tenant/FacilityTenant/FacilitiesTenant';
import MyPurchaseTenant from '@src/screens/tenant/MyPurchaseTenant';
import FinancialManagementTenant from '@src/screens/tenant/FinancialManagementTenant';
import NewFamilyMemberTenant from '@src/screens/tenant/NewFamilyMemberTenant';
import NewVehicleTenant from '@src/screens/tenant/NewVehicleTenant';
import NewPetTenant from '@src/screens/tenant/NewPetTenant';
import MonthlyBillTenant from '@src/screens/tenant/HomeTenant/MonthlyBillTenant';
import MySale from '@src/screens/tenant/MySale';
import NewBankAccountTenant from '@src/screens/tenant/NewBankAccountTenant';
import EditBankAccountTenant from '@src/screens/tenant/EditBankAccountTenant';
import NewMonthlyBill from '@src/screens/manager/NewMonthlyBill';
import MonthlyBill from '@src/screens/manager/MonthlyBills';
import EditMonthlyBill from '@src/screens/manager/EditMonthlyBill';
import EditStoreTenant from '@src/screens/tenant/EditStoreTenant';
import WholeStoreDetailsTenant from '@src/screens/tenant/HomeTenant/ShoppingStoreTenant/WholeStoreDetailsTenant';
import MyShopDetailsTenant from '@src/screens/tenant/HomeTenant/ShoppingStoreTenant/MyShopDetailsTenant';
import NewProductTenant from '@src/screens/tenant/NewProductTenant';

console.disableYellowBox = true;

export const useInitialRender = (): boolean => {
  const [isInitialRender, setIsInitialRender] = useState(false);

  if (!isInitialRender) {
    setTimeout(() => setIsInitialRender(true), 1);
    return true;
  }
  return false;
};

const StackRootManager = () => {
  const MainStack = createStackNavigator();

  const forFade = ({ current }: { current: any }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <MainStack.Screen name={APP_SCREEN} component={App} />
      <MainStack.Screen name={FORGOT_PASSWORD} component={ForgotPassword} />
      <MainStack.Screen name={LOGIN} options={{ cardOverlayEnabled: false }} component={Login} />
      <MainStack.Screen name={SIGN_UP} component={SignUp} />
      <MainStack.Screen name={PERSONAL_INFO} component={PersonalInfo} />
      <MainStack.Screen name={MAIN_SCREEN} component={MainScreen} />
      <MainStack.Screen name={ONBOARDING} component={Onboarding} />
      <MainStack.Screen name={RESET_PASSWORD} component={ResetPassword} />
      <MainStack.Screen name={RESET_PASSWORD_SUCCESS} component={ResetPasswordSuccess} />
      <MainStack.Screen name={STAFF_POSITION} component={StaffPosition} />
      <MainStack.Screen name={MAINTENANCE_REQUEST} component={MaintenanceRequest} />
      <MainStack.Screen name={NEW_STAFF_POSITION} component={NewStaffPosition} />
      <MainStack.Screen name={BUILDING_DETAIL} component={BuildingDetail} />
      <MainStack.Screen name={STAFF} component={Staff} />
      <MainStack.Screen name={STAFF_DETAIL} component={StaffDetail} />
      <MainStack.Screen name={MY_PROFILE} component={MyProfile} />
      <MainStack.Screen name={TENANT} component={Tenant} />
      <MainStack.Screen name={NOTIFICATIONS} component={Notifications} />
      <MainStack.Screen name={TENANT_DETAIL} component={TenantDetail} />
      <MainStack.Screen name={BUILDIND_SYSTEM} component={BuildingSystem} />
      <MainStack.Screen name={STATUS_REQUESTS} component={StatusRequests} />
      <MainStack.Screen name={REQUEST_DETAIL} component={RequestDetail} />
      <MainStack.Screen name={TRANSFER_APARTMENT} component={TransferApartment} />
      <MainStack.Screen name={DOCUMENT} component={Document} />
      <MainStack.Screen name={CATEGORY_DETAILS} component={CategoryDetails} />
      <MainStack.Screen name={NEW_CATEGORY} component={NewCategory} />
      <MainStack.Screen name={VISITORS} component={Visitors} />
      <MainStack.Screen name={NEW_VISITOR} component={NewVisitor} />
      <MainStack.Screen name={NOTIFICATION_DETAILS} component={NotificationDetails} />
      <MainStack.Screen name={NEW_NOTIFICATION} component={NewNotification} />
      <MainStack.Screen name={NEW_BUILDING} component={NewBuilding} />
      <MainStack.Screen name={DELIVERIES} component={Deliveries} />
      <MainStack.Screen name={NEW_DELIVERY} component={NewDelivery} />
      <MainStack.Screen name={CALENDAR_DETAILS} component={CalendarDetails} />
      <MainStack.Screen name={CALENDAR_SCREEN} component={CalendarScreen} />
      <MainStack.Screen name={NEW_CALENDAR_EVENT} component={NewCalendarEvent} />
      <MainStack.Screen name={PRODUCT_CATEGORY} component={ProductCategory} />
      <MainStack.Screen name={CATEGORY} component={Category} />
      <MainStack.Screen name={NEW_PRODUCT_CATEGORY} component={NewProductCategory} />
      <MainStack.Screen name={EDIT_PRODUCT_CATEGORY} component={EditProductCategory} />
      <MainStack.Screen name={INVITE_STAFF} component={InviteStaff} />
      <MainStack.Screen name={RECURRING_TASK} component={RecurringTask} />
      <MainStack.Screen name={RECURRING_TASK_DETAIL} component={RecurringTaskDetail} />
      <MainStack.Screen name={NEW_COMPANY} component={NewCompany} />
      <MainStack.Screen name={POST} component={Post} />
      <MainStack.Screen name={DOCUMENT_DETAIL} component={DocumentDetail} />
      <MainStack.Screen name={POST_DETAIL} component={PostDetail} />
      <MainStack.Screen name={FILTER} component={Filter} />
      <MainStack.Screen name={EDIT_PROFILE} component={EditProfile} />
      <MainStack.Screen name={NEW_TASK} component={NewTask} />
      <MainStack.Screen name={CONFIRMATION} component={Confirmation} />
      <MainStack.Screen name={NEW_POST} component={NewPost} />
      <MainStack.Screen name={NEW_APARTMENT} component={NewApartment} />
      <MainStack.Screen name={APARTMENTS} component={Apartments} />
      <MainStack.Screen name={APARTMENT_DETAILS} component={ApartmentDetails} />
      <MainStack.Screen name={PRODUCT_DETAIL} component={ProductDetail} />
      <MainStack.Screen name={ENVENT_TYPE} component={EventType} />
      <MainStack.Screen name={NEW_EVENT_TYPE} component={NewEventType} />
      <MainStack.Screen
        options={{
          cardStyleInterpolator: forFade,
          cardStyle: { backgroundColor: 'transparent' },
        }}
        name={MODAL_LOADING}
        component={LoadingModal} />
      <MainStack.Screen name={MEMBER_DETAILS} component={MemberDetails} />
      <MainStack.Screen name={EDIT_STAFF_POSITION} component={EditStaffPosition} />
      <MainStack.Screen name={NEW_MEMBER} component={NewMember} />
      <MainStack.Screen name={EDIT_MEMBER} component={EditMember} />
      <MainStack.Screen name={EDIT_MAINTENANCE_CATEGORY} component={EditMaintenanceCategory} />
      <MainStack.Screen name={EDIT_RECURRING_TASK} component={EditRecurringTask} />
      <MainStack.Screen name={FACILITIES} component={Facilites} />
      <MainStack.Screen name={NEW_FACILITY} component={NewFacility} />
      <MainStack.Screen name={FACILITY_DETAIL} component={FacilityDetail} />
      <MainStack.Screen name={EDIT_FACILITY} component={EditFacility} />
      <MainStack.Screen name={NEW_REQUEST} component={NewRequest} />
      <MainStack.Screen name={NEW_MONTHLY_BILL} component={NewMonthlyBill} />
      <MainStack.Screen name={MONTHLY_BILL} component={MonthlyBill} />
      <MainStack.Screen name={EDIT_MONTHLY_BILL} component={EditMonthlyBill} />
    </MainStack.Navigator >
  );
};
//=============== TENANT ====================//
const StackRootTenant = () => {
  const MainStack = createStackNavigator();

  const forFade = ({ current }: { current: any }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <MainStack.Screen name={APP_SCREEN_TENANT} component={AppTenant} />
      <MainStack.Screen name={FORGOT_PASSWORD_TENANT} component={ForgotPasswordTenant} />
      <MainStack.Screen name={LOGIN_TENANT} options={{ cardOverlayEnabled: false }} component={LoginTenant} />
      <MainStack.Screen name={SIGN_UP_TENANT} component={SignUpTenant} />
      <MainStack.Screen name={PERSONAL_INFO_TENANT} component={PersonalInfoTenant} />
      <MainStack.Screen name={MAIN_SCREEN_TENANT} component={MainScreenTenant} />
      <MainStack.Screen name={ONBOARDING_TENANT} component={OnboardingTenant} />
      <MainStack.Screen name={RESET_PASSWORD_TENANT} component={ResetPasswordTenant} />
      <MainStack.Screen name={RESET_PASSWORD_SUCCESS_TENANT} component={ResetPasswordSuccessTenant} />
      <MainStack.Screen name={MAINTENANCE_REQUEST_TENANT} component={MaintenanceRequestTenant} />
      <MainStack.Screen name={MY_PROFILE_TENANT} component={MyProfileTenant} />
      <MainStack.Screen name={NOTIFICATIONS_TENANT} component={NotificationsTenant} />
      <MainStack.Screen name={STATUS_REQUESTS_TENANT} component={StatusRequestsTenant} />
      <MainStack.Screen name={REQUEST_DETAIL_TENANT} component={RequestDetailTenant} />
      <MainStack.Screen name={DOCUMENT_TENANT} component={DocumentTenant} />
      <MainStack.Screen name={VISITORS_TENANT} component={VisitorsTenant} />
      <MainStack.Screen name={NEW_VISITOR_TENANT} component={NewVisitorTenant} />
      <MainStack.Screen name={NOTIFICATION_DETAILS_TENANT} component={NotificationDetailsTenant} />
      <MainStack.Screen name={NEW_NOTIFICATION_TENANT} component={NewNotificationTenant} />
      <MainStack.Screen name={DELIVERIES_TENANT} component={DeliveriesTenant} />
      <MainStack.Screen name={CALENDAR_DETAILS_TENANT} component={CalendarDetailsTenant} />
      <MainStack.Screen name={CALENDAR_SCREEN_TENANT} component={CalendarScreenTenant} />
      <MainStack.Screen name={NEW_CALENDAR_EVENT_TENANT} component={NewCalendarEventTenant} />
      {/* <MainStack.Screen name={CATEGORY_TENANT} component={CategoryTenant} /> */}
      <MainStack.Screen name={NEW_PRODUCT_CATEGORY_TENANT} component={NewProductCategoryTenant} />
      <MainStack.Screen name={EDIT_PRODUCT_CATEGORY_TENANT} component={EditProductCategoryTenant} />
      <MainStack.Screen name={RECURRING_TASK_TENANT} component={RecurringTaskTenant} />
      <MainStack.Screen name={RECURRING_TASK_DETAIL_TENANT} component={RecurringTaskDetailTenant} />
      <MainStack.Screen name={POST_TENANT} component={PostTenant} />
      <MainStack.Screen name={DOCUMENT_DETAIL_TENANT} component={DocumentDetailTenant} />
      <MainStack.Screen name={POST_DETAIL_TENANT} component={PostDetailTenant} />
      <MainStack.Screen name={FILTER_TENANT} component={FilterTenant} />
      <MainStack.Screen name={EDIT_PROFILE_TENANT} component={EditProfileTenant} />
      <MainStack.Screen name={NEW_TASK_TENANT} component={NewTaskTenant} />
      <MainStack.Screen name={CONFIRMATION_TENANT} component={ConfirmationTenant} />
      <MainStack.Screen name={NEW_POST_TENANT} component={NewPostTenant} />
      <MainStack.Screen name={APARTMENTS_TENANT} component={ApartmentsTenant} />
      <MainStack.Screen name={APARTMENT_DETAILS_TENANT} component={ApartmentDetailsTenant} />
      <MainStack.Screen name={WHOLE_STORE_DETAILS_TENANT} component={WholeStoreDetailsTenant} />
      <MainStack.Screen
        options={{
          cardStyleInterpolator: forFade,
          cardStyle: { backgroundColor: 'transparent' },
        }}
        name={MODAL_LOADING_TENANT}
        component={LoadingModalTenant} />
      <MainStack.Screen name={MEMBER_DETAILS_TENANT} component={MemberDetailsTenant} />
      <MainStack.Screen name={EDIT_MEMBER_TENANT} component={EditMemberTenant} />
      <MainStack.Screen name={EDIT_MAINTENANCE_CATEGORY_TENANT} component={EditMaintenanceCategoryTenant} />
      <MainStack.Screen name={EDIT_RECURRING_TASK_TENANT} component={EditRecurringTaskTenant} />
      <MainStack.Screen name={FACILITIES_TENANT} component={FacilitiesTenant} />
      <MainStack.Screen name={FACILITY_DETAIL_TENANT} component={FacilityDetailTenant} />
      <MainStack.Screen name={NEW_REQUEST_TENANT} component={NewRequestTenant} />
      <MainStack.Screen name={MY_PURCHASE_TENANT} component={MyPurchaseTenant} />
      <MainStack.Screen name={FINANCIAL_MANAGEMENT_TENANT} component={FinancialManagementTenant} />
      <MainStack.Screen name={NEW_MEMBER_TENANT} component={NewFamilyMemberTenant} />
      <MainStack.Screen name={NEW_VEHICLE_TENANT} component={NewVehicleTenant} />
      <MainStack.Screen name={NEW_PET_TENANT} component={NewPetTenant} />
      <MainStack.Screen name={MY_SALE} component={MySale} />
      <MainStack.Screen name={NEW_BANK_ACCOUNT_TENANT} component={NewBankAccountTenant} />
      <MainStack.Screen name={EDIT_BANK_ACCOUNT_TENANT} component={EditBankAccountTenant} />
      <MainStack.Screen name={MY_SHOP_DETAILS_TENANT} component={MyShopDetailsTenant} />
      <MainStack.Screen name={EDIT_STORE_TENANT} component={EditStoreTenant} />
      <MainStack.Screen name={NEW_PRODUCT_TENANT} component={NewProductTenant} />
    </MainStack.Navigator >
  );
};

const DrawerStack = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      initialRouteName="Main"
      drawerPosition="right"
      edgeWidth={0}
      drawerStyle={{
        width: useInitialRender() ? 0 : WIDTH * 0.85,
      }}
      gestureHandlerProps={{
        maxPointers: 0, //This is props to disabled gesture handled
      }}
      drawerContent={(props: any) => {
        if (isManagerApp()) {
          return (<SideMenuManager {...props} />);
        }
        return <SideMenuTenant {...props} />;
      }}
    >
      {isManagerApp() ?
        <Drawer.Screen name="StackRootManager" component={StackRootManager} /> :
        <Drawer.Screen name="StackRootTenant" component={StackRootTenant} />}
    </Drawer.Navigator>
  );
};

export { StackRootManager, DrawerStack };
