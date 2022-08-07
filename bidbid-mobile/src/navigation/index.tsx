import React from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { I18nProvider } from '@/i18n';

import {
  CREATE_BIRTHDAY_SCREEN,
  BID_SCREEN,
  CREATE_FIRST_NAME_SCREEN,
  CREATE_INSTAGRAM_USERNAME_SCREEN,
  CREATE_PHOTO_SCREEN,
  CREATE_SEX_SCREEN,
  HOME_SCREEN,
  SIGN_UP_LINK_SOCIAL_SCREEN,
  SIGN_UP_PHONE_SCREEN,
  SIGN_UP_VERIFY_SMS_SCREEN,
  TABS_SCREEN,
  WELCOME_SCREEN,
  PROFILE_SCREEN,
  HOME_DETAIL_SCREEN,
  MAIN_SCREEN,
  CREATE_EMAIL_SCREEN,
  CONFIRM_USER_SCREEN,
  SET_DOMAIN_SCREEN,
  CREATE_AUCTION_NORMAL_SCREEN,
  PROFILE_EDIT_GENERAL,
  PROFILE_EDIT_GENDER,
  PROFILE_EDIT_SEXUAL_ORIENTATION,
  PROFILE_EDIT_INTERESTS,
  PROFILE_EDIT_SCHOOL,
  PROFILE_EDIT_SCHOOL_SEARCH,
  PROFILE_EDIT_CITY,
  PROFILE_EDIT_CITY_SEARCH,
  PROFILE_EDIT_LANGUAGE,
  PROFILE_EDIT_LANGUAGE_SEARCH,
  PROFILE_EDIT_INSTAGRAM_USERNAME,
  PROFILE_EDIT_VIEW_IMAGE,
  CHOOSE_CHARITY_SCREEN,
  MY_AUCTION_DETAIL_SCREEN,
  MAP_SCREEN,
  SETTING_SCREEN,
  PAYMENT_ACCOUNTS_SCREEN,
  NOTIFICATION_SCREEN,
  PAYMENT_INFO_DETAIL_SCREEN,
  VERIFY_EMAIL_SCREEN,
  MODAL_LOADING,
  PLACE_A_BID,
  FILTER_GENERAL_SCREEN,
  FILTER_GENDER_SCREEN,
  FILTER_SEXUAL_ORIENTATION_SCREEN,
  FILTER_AUCTION_STATUS_SCREEN,
  FILTER_IG_USERNAME_SCREEN,
  FILTER_AGE_RANGE_SCREEN,
  CHAT_DETAIL_SCREEN,
  MESSAGE_SCREEN,
  AUCTIONS_WON_SCREEN,
  CANCEL_MEET_SCREEN,
  AUCTIONS_IN_PROGRESS_SCREEN,
  CHAT_HISTORY_SCREEN,
  ACCOUNT_SETTING_SCREEN,
  DELETE_ACCOUNT_SCREEN,
  DELETE_ACCOUNT_REASON_SCREEN,
  MOVE_AND_SCALE_SCREEN,
  NOTIFICATION_SETTING_SCREEN,
  TERM_OF_SERVICE_SCREEN,
  PRIVACY_POLICY_SCREEN,
  COUNT_DOWN_SCREEN,
  NOTIFICATION_DETAIL_SCREEN,
  SHOW_QR_CODE_SCREEN,
  SCAN_QR_CODE_SCREEN,
  REVIEW_SCREEN,
  SAFETY_SCREEN,
  PAYMENT_ADD_CARD_SCREEN,
  PAYMENT_CREATE_PAYPAL_SCREEN,
  AUCTIONS_LIKE_GONE_LIVE_SCREEN,
  PAYMENT_UPDATE_CARD_SCREEN,
  PAYMENT_UPDATE_PAYPAL_SCREEN,
  MODAL_PAYMENT,
  PAYPAL_WEB_VIEW,
  SHARE_CONTACT_SCREEN,
  FILTER_LOCATION_SCREEN,
  PROFILE_EDIT_JOB,
  PROFILE_EDIT_JOB_SEARCH,
  PROFILE_EDIT_COMPANY,
  PROFILE_EDIT_COMPANY_SEARCH,
  CREATE_CAREER_STRENGTHS_SCREEN,
  CREATE_SOCIAL_INTEREST_SCREEN,
  PROFILE_EDIT_CAREER_STRENGTHS_SCREEN,
  CREATE_PROFILE_PICTURE_SCREEN,
  CROP_PROFILE_PICTURE_SCREEN,
  PROFILE_EDIT_MY_NAME,
  FILTER_PROFILES_SCREEN,
  CREATE_AUCTION_RAFFLE_SCREEN,
  CREATE_CITY_SCREEN,
  CREATE_LANGUAGE_SCREEN,
  CREATE_LANGUAGE_SEARCH_SCREEN,
} from '@/navigation/screenKeys';
import { HomeScreen } from '@/screens/Home';
import { BidScreen } from '@/screens/Bid';
import { ProfileScreen } from '@/screens/Profile';
import { WelcomeScreen } from '@/screens/Auth/Welcome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyTabBar from '@/navigation/BottomBar';
import { SignUpPhoneScreen } from '@/screens/Auth/SignUpPhone';
import { SignUpVerifySmsScreen } from '@/screens/Auth/SignUpVerifySms';
import { SignUpLinkSocialScreen } from '@/screens/Auth/SignUpLinkSocial';
import { CreateFirstNameScreen } from '@/screens/PublicProfile/CreateFirstName';
import { CreateInstagramUsernameScreen } from '@/screens/PublicProfile/CreateInstagramUsername';
import { CreateBirthdayScreen } from '@/screens/PublicProfile/CreateBirthday';
import CreateProfilePicture from '@/screens/PublicProfile/CreateProfilePicture';
import { CreateSexScreen } from '@/screens/PublicProfile/CreateSex';
import { CreatePhotoScreen } from '@/screens/PublicProfile/CreatePhoto';
import CropProfilePicture from '@/screens/CropProfilePicture';
import { HomeDetailScreen } from '@/screens/HomeDetail';
import { App } from '@/screens/App';
import { CreateEmailScreen } from '@/screens/PublicProfile/CreateEmail';
import { ConfirmUserScreen } from '@/screens/Auth/ConfirmUser';
import { SetDomainScreen } from '@/screens/Auth/SetDomain';
import { CreateAuctionNormalScreen } from '@/screens/CreateAuction/CreateAuctionNormal';
import { ChooseCharityScreen } from '@/screens/ChooseCharity';
import RequestAdditionalCharityScreen from '@/screens/RequestAdditionalCharity';
import { MyAuctionDetailScreen } from '@/screens/MyAuctionDetail';
import { MapScreen } from '@/screens/Map';
import { ProfileEditCityScreen } from '@/screens/Profile/ProfileEditCity';
import { ProfileEditCitySearchScreen } from '@/screens/Profile/ProfileEditCitySearch';
import { ProfileEditGenderScreen } from '@/screens/Profile/ProfileEditGender';
import { ProfileEditLanguageScreen } from '@/screens/Profile/ProfileEditLanguage';
import { ProfileEditLanguageSearchScreen } from '@/screens/Profile/ProfileEditLanguageSearch';
import { ProfileEditInstagramUsernameScreen } from '@/screens/Profile/ProfileEditInstagramUsername';
import { ProfileEditSchoolScreen } from '@/screens/Profile/ProfileEditSchool';
import { ProfileEditSchoolSearchScreen } from '@/screens/Profile/ProfileEditSchoolSearch';
import { ProfileEditSexualOrientationScreen } from '@/screens/Profile/ProfileEditSexualOrientation';
import { ProfileEditInterestsScreen } from '@/screens/Profile/ProfileEditInterests';
import { ProfileEditGeneralScreen } from '@/screens/Profile/ProfileEditGeneral';
import { ProfileEditViewImage } from '@/screens/Profile/ProfileEditViewImage/ProfileEditViewImage';
import { SettingScreen } from '@/screens/Setting';
import { PaymentAccountsScreen } from '@/screens/Payment/PaymentAccounts';
import { NotificationScreen } from '@/screens/Notification';
import { PaymentCardDetailScreen } from '@/screens/Payment/PaymentInfoDetail';
import { VerifyEmailScreen } from '@/screens/PublicProfile/VerifyEmail';
import LoadingModal from '@/components/LoadingModal';
import { PlaceABid } from '@/screens/PlaceABid/PlaceABid';

import { FilterGeneralScreen } from '@/screens/Filter/FilterGeneralScreen/FilterGeneralScreen';
import { FilterGenderScreen } from '@/screens/Filter/FilterGenderScreen/FilterGenderScreen';
import FilterSexualOrientationScreen from '@/screens/Filter/FilterSexualOrientationScreen/FilterSexualOrientationScreen';
import { FilterAuctionStatusScreen } from '@/screens/Filter/FilterAuctionSatusScreen/FilterAuctionStatusScreen';
import { FilterIGUsernameScreen } from '@/screens/Filter/FilterIGUsernameScreen/FilterIGUsernameScreen';
import { FilterAgeRangeScreen } from '@/screens/Filter/FilterAgeRangeScreen/FilterAgeRangeScreen';
import { ChatScreen } from '../screens/Message/ListChanel';
import { ChatDetailScreen } from '../screens/Message/ChatDetail';
import { AuctionsWonScreen } from '@/screens/AuctionsWon';
import { AuctionsLikeGoneLiveScreen } from '@/screens/AuctionsLikeGoneLive';
import { CancelMeetScreen } from '@/screens/CancelMeet';
import { AuctionsInProgressScreen } from '@/screens/AuctionsInProgress';
import { ChatHistoryScreen } from '../screens/Message/ListChanelHistory';
import { AccountSettingScreen } from '../screens/AccountSetting';

import DeletetAccountScreen from '@/screens/DeletetAccount/DeletetAccountScreen';
import DeletetAccountReasonScreen from '@/screens/DeletetAccount/DeletetAccountReasonScreen';

import MoveAndScaleScreen from '@/screens/MoveAndScale/MoveAndScaleScreen';
import { NotificationSettingScreen } from '../screens/NotificationSetting';

import TermOfServiceScreen from '@/screens/TermOfService/TermOfServiceScreen';
import PrivacyPolicyScreen from '@/screens/PrivacyPolicy/PrivacyPolicyScreen';
import SafetyScreen from '@/screens/Safety/SafetyScreen';

import CountDownScreen from '@/screens/CountDown/CountDownScreen';
import { NotificationDetailScreen } from '../screens/NotificationDetail';
import ShowQRCodeScreen from '@/screens/ShowQRCode/ShowQRCodeScreen';
import ScanQRCodeScreen from '@/screens/ScanQRCode/ScanQRCodeScreen';

import ReviewScreen from '@/screens/Review/ReviewScreen';
import { PaymentAddCardScreen } from '../screens/Payment/PaymentCard/PaymentAddCard';
import { PaymentCreatePaypal } from '../screens/Payment/PaymentPaypal/PaymentCreatePaypal';
import { PaymentUpdateCardScreen } from '../screens/Payment/PaymentCard/PaymentUpdateCard';
import { PaymentUpdatePaypalScreen } from '../screens/Payment/PaymentPaypal/PaymentUpdatePaypal';
import ModalPayment from '../components/ModalPayment';
import PaypalWebView from '../components/ModalPayment/PaypalWebView';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducers';
import { ShareContactScreen } from '../screens/ShareContact';
import FilterLocationScreen from '../screens/Filter/FilterLocationScreen';
import { ProfileEditJobScreen } from '../screens/Profile/ProfileEditJob';
import { ProfileEditJobSearchScreen } from '../screens/Profile/ProfileEditJobSearch';
import { ProfileEditCompanyScreen } from '../screens/Profile/ProfileEditCompany';
import { ProfileEditCompanySearch } from '../screens/Profile/ProfileEditCompanySearch';
import { CareerStrengthsScreen } from '../screens/PublicProfile/CareerStrengths';
import { SocialInterestsScreen } from '../screens/PublicProfile/SocialInterests';
import { ProfileEditCareerStrengthsScreen } from '../screens/Profile/ProfileEditCareerStrengths';
import {
  CREATE_CATEGORIES_SCREEN,
  MEET_AND_GREET_HISTORY_SCREEN,
  PROFILE_EDIT_CATEGORY_SCREEN,
  REQUEST_ADDITIONAL_CHARITY_SCREEN,
} from './screenKeys';
import { CreateCategoriesScreen } from '../screens/PublicProfile/CreateCategories';
import { ProfileEditCategoryScreen } from '../screens/Profile/ProfileEditCategoryScreen';
import { ProfileEditMyNameScreen } from '../screens/Profile/ProfileEditMyName';
import { MeetAndGreetHistoryScreen } from '../screens/MeetAndGreetHistory';
import { FilterProfilesScreen } from '../screens/Filter/FilterProfilesScreen/FilterProfilesScreen';
import { CreateCityScreen } from '../screens/PublicProfile/CreateCity';
import { CreateLanguageScreen } from '../screens/PublicProfile/CreateLanguage';
import { CreateLanguageSearchScreen } from '../screens/PublicProfile/CreateLanguageSearch';
import { CreateAuctionRaffleScreen } from '../screens/CreateAuction/CreateAuctionRaffle';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const TabStack = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const BidStack = createStackNavigator();
const ChatStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const PlaceABidStack = createStackNavigator();
const FilterStack = createStackNavigator();
const ReviewStack = createStackNavigator();

const navigatorOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};

const forFade = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const hideHeader = { headerShown: false, gestureEnabled: false };

const trasactionLeftToRight = () => ({ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS });

const optionsLoading = {
  headerShown: false,
  gestureEnabled: false,
  cardStyleInterpolator: forFade,
  cardStyle: { backgroundColor: 'transparent' },
};

const StackRootManager = () => {
  useSelector((state: RootState) => state.app.locale);

  const HomeStackScreen = () => (
    <HomeStack.Navigator screenOptions={hideHeader}>
      <HomeStack.Screen name={HOME_SCREEN} component={HomeScreen} />
    </HomeStack.Navigator>
  );

  const BidStackScreen = () => (
    <BidStack.Navigator screenOptions={hideHeader}>
      <BidStack.Screen name={BID_SCREEN} component={BidScreen} />
    </BidStack.Navigator>
  );

  const ChatStackScreen = () => (
    <ChatStack.Navigator screenOptions={hideHeader}>
      <ChatStack.Screen name={MESSAGE_SCREEN} component={ChatScreen} />
    </ChatStack.Navigator>
  );

  const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={hideHeader}>
      <ProfileStack.Screen name={PROFILE_SCREEN} component={ProfileScreen} />
    </ProfileStack.Navigator>
  );

  const TabsScreen = () => {
    const isEnableLocationGlobal = useSelector((rootState: RootState) => rootState.app.isEnableLocation);
    return (
      <TabStack.Navigator
        initialRouteName={HOME_SCREEN}
        tabBar={props => {
          if (isEnableLocationGlobal) return <MyTabBar {...props} />;
          return null;
        }}
      >
        <TabStack.Screen name={HOME_SCREEN} component={HomeStackScreen} />
        <TabStack.Screen name={BID_SCREEN} component={BidStackScreen} />
        <TabStack.Screen name={NOTIFICATION_SCREEN} component={NotificationScreen} />
        <TabStack.Screen name={MESSAGE_SCREEN} component={ChatStackScreen} />
        <TabStack.Screen name={PROFILE_SCREEN} component={ProfileStackScreen} />
      </TabStack.Navigator>
    );
  };

  const PlaceABidStackScreen = props => (
    <PlaceABidStack.Navigator mode="modal" screenOptions={navigatorOptions}>
      <PlaceABidStack.Screen name={PLACE_A_BID} component={PlaceABid} options={{ headerShown: false }} initialParams={props.route.params} />
    </PlaceABidStack.Navigator>
  );

  const ReviewStackScreen = () => (
    <ReviewStack.Navigator mode="modal" screenOptions={navigatorOptions}>
      <ReviewStack.Screen name={REVIEW_SCREEN} component={ReviewScreen} options={{ headerShown: false }} />
    </ReviewStack.Navigator>
  );

  const FilterStackScreen = () => (
    <FilterStack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: 'transparent', opacity: 1 },
        cardOverlayEnabled: true,
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <FilterStack.Screen name={FILTER_GENERAL_SCREEN} component={FilterGeneralScreen} options={{ headerShown: false }} />
      <FilterStack.Screen name={FILTER_LOCATION_SCREEN} component={FilterLocationScreen} options={trasactionLeftToRight} />
      <FilterStack.Screen name={FILTER_GENDER_SCREEN} component={FilterGenderScreen} options={trasactionLeftToRight} />
      <FilterStack.Screen
        name={FILTER_SEXUAL_ORIENTATION_SCREEN}
        component={FilterSexualOrientationScreen}
        options={trasactionLeftToRight}
      />
      <FilterStack.Screen name={FILTER_AGE_RANGE_SCREEN} component={FilterAgeRangeScreen} options={trasactionLeftToRight} />
      <FilterStack.Screen name={FILTER_AUCTION_STATUS_SCREEN} component={FilterAuctionStatusScreen} options={trasactionLeftToRight} />
      <FilterStack.Screen name={FILTER_PROFILES_SCREEN} component={FilterProfilesScreen} options={trasactionLeftToRight} />
      <FilterStack.Screen name={FILTER_IG_USERNAME_SCREEN} component={FilterIGUsernameScreen} options={trasactionLeftToRight} />
    </FilterStack.Navigator>
  );

  const AuthStackScreen = () => (
    <MainStack.Navigator screenOptions={hideHeader}>
      <MainStack.Screen name={MAIN_SCREEN} component={App} />

      <MainStack.Screen name={MAP_SCREEN} component={MapScreen} />
      <MainStack.Screen name={NOTIFICATION_SETTING_SCREEN} component={NotificationSettingScreen} />
      <MainStack.Screen name={PAYMENT_ADD_CARD_SCREEN} component={PaymentAddCardScreen} />
      <MainStack.Screen name={PAYMENT_UPDATE_CARD_SCREEN} component={PaymentUpdateCardScreen} />
      <MainStack.Screen name={PAYMENT_CREATE_PAYPAL_SCREEN} component={PaymentCreatePaypal} />
      <MainStack.Screen name={PAYMENT_UPDATE_PAYPAL_SCREEN} component={PaymentUpdatePaypalScreen} />
      <MainStack.Screen name={NOTIFICATION_DETAIL_SCREEN} component={NotificationDetailScreen} />
      <MainStack.Screen name={VERIFY_EMAIL_SCREEN} component={VerifyEmailScreen} />
      <MainStack.Screen name={PAYMENT_INFO_DETAIL_SCREEN} component={PaymentCardDetailScreen} />
      <MainStack.Screen name={MODAL_LOADING} component={LoadingModal} options={optionsLoading} />
      <MainStack.Screen name={PAYMENT_ACCOUNTS_SCREEN} component={PaymentAccountsScreen} />
      <MainStack.Screen name={SETTING_SCREEN} component={SettingScreen} />
      <MainStack.Screen name={WELCOME_SCREEN} component={WelcomeScreen} />
      <MainStack.Screen name={ACCOUNT_SETTING_SCREEN} component={AccountSettingScreen} />
      <MainStack.Screen name={CHOOSE_CHARITY_SCREEN} component={ChooseCharityScreen} />
      <MainStack.Screen name={REQUEST_ADDITIONAL_CHARITY_SCREEN} component={RequestAdditionalCharityScreen} />
      <MainStack.Screen name={CREATE_AUCTION_NORMAL_SCREEN} component={CreateAuctionNormalScreen} />
      <MainStack.Screen name={CREATE_AUCTION_RAFFLE_SCREEN} component={CreateAuctionRaffleScreen} />
      <MainStack.Screen name={SET_DOMAIN_SCREEN} component={SetDomainScreen} />
      <MainStack.Screen name={SIGN_UP_PHONE_SCREEN} component={SignUpPhoneScreen} />
      <MainStack.Screen name={CHAT_DETAIL_SCREEN} component={ChatDetailScreen} />
      <MainStack.Screen name={CONFIRM_USER_SCREEN} component={ConfirmUserScreen} />
      <MainStack.Screen name={SIGN_UP_VERIFY_SMS_SCREEN} component={SignUpVerifySmsScreen} />
      <MainStack.Screen name={SIGN_UP_LINK_SOCIAL_SCREEN} component={SignUpLinkSocialScreen} />
      <MainStack.Screen name={CREATE_EMAIL_SCREEN} component={CreateEmailScreen} />
      <MainStack.Screen name={CREATE_FIRST_NAME_SCREEN} component={CreateFirstNameScreen} />
      <MainStack.Screen name={CREATE_INSTAGRAM_USERNAME_SCREEN} component={CreateInstagramUsernameScreen} />
      <MainStack.Screen name={CREATE_BIRTHDAY_SCREEN} component={CreateBirthdayScreen} />
      <MainStack.Screen name={CREATE_SEX_SCREEN} component={CreateSexScreen} />
      <MainStack.Screen name={MY_AUCTION_DETAIL_SCREEN} component={MyAuctionDetailScreen} />
      <MainStack.Screen name={CREATE_PHOTO_SCREEN} component={CreatePhotoScreen} />
      <MainStack.Screen name={CREATE_CATEGORIES_SCREEN} component={CreateCategoriesScreen} />
      <MainStack.Screen name={CREATE_LANGUAGE_SCREEN} component={CreateLanguageScreen} />
      <MainStack.Screen name={CREATE_LANGUAGE_SEARCH_SCREEN} component={CreateLanguageSearchScreen} />
      <MainStack.Screen name={CREATE_CAREER_STRENGTHS_SCREEN} component={CareerStrengthsScreen} />
      <MainStack.Screen name={CREATE_SOCIAL_INTEREST_SCREEN} component={SocialInterestsScreen} />
      <MainStack.Screen name={CREATE_CITY_SCREEN} component={CreateCityScreen} />
      <MainStack.Screen name={TABS_SCREEN} component={TabsScreen} options={{ animationEnabled: false }} />
      <MainStack.Screen name={CHAT_HISTORY_SCREEN} component={ChatHistoryScreen} />
      <MainStack.Screen name={HOME_DETAIL_SCREEN} component={HomeDetailScreen} />

      <MainStack.Screen name={PROFILE_EDIT_GENERAL} component={ProfileEditGeneralScreen} />
      <MainStack.Screen name={PROFILE_EDIT_GENDER} component={ProfileEditGenderScreen} />
      <MainStack.Screen name={PROFILE_EDIT_INTERESTS} component={ProfileEditInterestsScreen} />
      <MainStack.Screen name={PROFILE_EDIT_SEXUAL_ORIENTATION} component={ProfileEditSexualOrientationScreen} />
      <MainStack.Screen name={PROFILE_EDIT_CAREER_STRENGTHS_SCREEN} component={ProfileEditCareerStrengthsScreen} />
      <MainStack.Screen name={PROFILE_EDIT_CATEGORY_SCREEN} component={ProfileEditCategoryScreen} />
      <MainStack.Screen name={PROFILE_EDIT_SCHOOL} component={ProfileEditSchoolScreen} />
      <MainStack.Screen name={PROFILE_EDIT_SCHOOL_SEARCH} component={ProfileEditSchoolSearchScreen} />
      <MainStack.Screen name={PROFILE_EDIT_CITY} component={ProfileEditCityScreen} />
      <MainStack.Screen name={PROFILE_EDIT_COMPANY} component={ProfileEditCompanyScreen} />
      <MainStack.Screen name={PROFILE_EDIT_COMPANY_SEARCH} component={ProfileEditCompanySearch} />
      <MainStack.Screen name={PROFILE_EDIT_JOB} component={ProfileEditJobScreen} />
      <MainStack.Screen name={PROFILE_EDIT_JOB_SEARCH} component={ProfileEditJobSearchScreen} />
      <MainStack.Screen name={PROFILE_EDIT_CITY_SEARCH} component={ProfileEditCitySearchScreen} />
      <MainStack.Screen name={PROFILE_EDIT_LANGUAGE} component={ProfileEditLanguageScreen} />
      <MainStack.Screen name={PROFILE_EDIT_LANGUAGE_SEARCH} component={ProfileEditLanguageSearchScreen} />
      <MainStack.Screen name={PROFILE_EDIT_MY_NAME} component={ProfileEditMyNameScreen} />
      <MainStack.Screen name={PROFILE_EDIT_INSTAGRAM_USERNAME} component={ProfileEditInstagramUsernameScreen} />
      <MainStack.Screen name={PROFILE_EDIT_VIEW_IMAGE} component={ProfileEditViewImage} />
      <MainStack.Screen name={MODAL_PAYMENT} component={ModalPayment} options={optionsLoading} />
      <MainStack.Screen name={PAYPAL_WEB_VIEW} component={PaypalWebView} options={optionsLoading} />
      <MainStack.Screen
        name={PLACE_A_BID}
        component={PlaceABidStackScreen}
        options={navigatorOptions}
        initialParams={{ isFromHomeDetail: false }}
      />
      <MainStack.Screen name={FILTER_GENERAL_SCREEN} component={FilterStackScreen} options={navigatorOptions} />
      <MainStack.Screen name={AUCTIONS_WON_SCREEN} component={AuctionsWonScreen} />
      <MainStack.Screen name={SHARE_CONTACT_SCREEN} component={ShareContactScreen} />
      <MainStack.Screen name={AUCTIONS_LIKE_GONE_LIVE_SCREEN} component={AuctionsLikeGoneLiveScreen} />
      <MainStack.Screen name={AUCTIONS_IN_PROGRESS_SCREEN} component={AuctionsInProgressScreen} />
      <MainStack.Screen name={CANCEL_MEET_SCREEN} component={CancelMeetScreen} />
      <MainStack.Screen name={DELETE_ACCOUNT_SCREEN} component={DeletetAccountScreen} />
      <MainStack.Screen name={DELETE_ACCOUNT_REASON_SCREEN} component={DeletetAccountReasonScreen} />
      <MainStack.Screen name={MOVE_AND_SCALE_SCREEN} component={MoveAndScaleScreen} />
      <MainStack.Screen name={TERM_OF_SERVICE_SCREEN} component={TermOfServiceScreen} />
      <MainStack.Screen name={PRIVACY_POLICY_SCREEN} component={PrivacyPolicyScreen} />
      <MainStack.Screen name={SAFETY_SCREEN} component={SafetyScreen} />
      <MainStack.Screen name={COUNT_DOWN_SCREEN} component={CountDownScreen} />
      <MainStack.Screen name={SHOW_QR_CODE_SCREEN} component={ShowQRCodeScreen} />
      <MainStack.Screen name={SCAN_QR_CODE_SCREEN} component={ScanQRCodeScreen} />
      <MainStack.Screen name={REVIEW_SCREEN} component={ReviewStackScreen} options={navigatorOptions} />
      <MainStack.Screen name={CREATE_PROFILE_PICTURE_SCREEN} component={CreateProfilePicture} initialParams={{ photos: [] }} />
      <MainStack.Screen name={CROP_PROFILE_PICTURE_SCREEN} component={CropProfilePicture} />
      <MainStack.Screen name={MEET_AND_GREET_HISTORY_SCREEN} component={MeetAndGreetHistoryScreen} />
    </MainStack.Navigator>
  );

  return (
    <I18nProvider>
      <RootStack.Navigator screenOptions={hideHeader}>
        <RootStack.Screen
          name="Auth"
          component={AuthStackScreen}
          options={{
            animationEnabled: false,
          }}
        />
      </RootStack.Navigator>
    </I18nProvider>
  );
};
export { StackRootManager };
