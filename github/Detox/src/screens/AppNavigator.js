import analytics from '@react-native-firebase/analytics';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';
import {Host} from 'react-native-portalize';

import {AppContext} from '../appData/appContext/useAppContext';
import {LastModifiedProvider} from '../appData/lastModifiedContext/useLastModifiedContext';
import {IMAGES} from '../assets/images';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {ContactTradingB2CBannerContainer} from '../components/Banner/ContactTradingB2CBanner';
import CustomTabBar from '../components/TabBar/CustomTabBar';
import {TabPopup} from '../components/TabBar/TabPopup';
import {RequestSupportProvider} from '../hooks/useRequestSupport';
import {logNavi} from '../service/logService';
import AgentManagementScreen from './AgentManagement/AgentManagementScreen';
import {SignUpProvider} from './Auth/AuthComponents/useSignup';
import ChangePasswordScreen from './Auth/ForgotPassword/ChangePasswordScreen';
import ForgotPasswordConfirmOTPScreen from './Auth/ForgotPassword/ForgotPasswordConfirmOtpScreen';
import ForgotPasswordScreen from './Auth/ForgotPassword/ForgotPasswordScreen';
import ResetPasswordCompleteScreen from './Auth/ForgotPassword/ResetPasswordCompleteScreen';
import ResetPasswordScreen from './Auth/ForgotPassword/ResetPasswordScreen';
import LoginScreen from './Auth/LoginScreen';
//import screens
import RegisterAgentScreen from './Auth/RegisterAgent/RegisterAgentScreen';
import ConfirmOTPScreen from './Auth/SignUp/ConfirmOTPScreen';
import InfoAccountScreen from './Auth/SignUp/InfoAccountScreen';
import InfoTopenerScreen from './Auth/SignUp/InfoTopenerScreen';
import InputMobileScreen from './Auth/SignUp/InputMobileScreen';
import SetPasswordScreen from './Auth/SignUp/SetPasswordScreen';
import WelcomeScreen from './Auth/SignUp/WelcomeScreen';
import {useLogin} from './Auth/useLogin';
import AwardAndTrophyScreen from './AwardAndTrophy/AwardAndTrophyScreen';
import ConfirmTransactionScreen from './BookingDeposit/Confirm/ConfirmTransactionScreen';
import PaymentInfoScreen from './BookingDeposit/Confirm/PaymentInfoScreen';
import SelectPaymentMethodScreen from './BookingDeposit/Confirm/SelectPaymentMethodScreen';
import ConfirmDepositScreen from './BookingDeposit/ConfirmProperty/ConfirmDepositScreen';
import ConfirmPropertyScreen from './BookingDeposit/ConfirmProperty/ConfirmPropertyScreen';
import UpdateUserInfoTransaction from './BookingDeposit/ConfirmProperty/UpdateUserInfoTransaction';
import ViewPropertyScreen from './BookingDeposit/ConfirmProperty/ViewPropertyScreen';
import PaymentWebviewScreen from './BookingDeposit/Payment/PaymentWebviewScreen';
import RefundScreen from './BookingDeposit/Refund/RefundScreen';
import SellAgentListScreen from './BookingDeposit/SellAgentList/SellAgentListScreen';
import {BookingProvider} from './BookingDeposit/useBooking';
import CreateGeneralRequestScreen from './C2CGeneralRequest/CreateGeneralRequestScreen';
import DetailGeneralRequestScreen from './C2CGeneralRequest/DetailGeneralRequestScreen';
import ManageGeneralRequestScreen from './C2CGeneralRequest/ManageGeneralRequestScreen';
import UpdateGeneralRequestScreen from './C2CGeneralRequest/UpdateGeneralRequestScreen';
import {HotlineSupportScreen} from './Call/HotlineSupportScreen';
import {StringeeProvider} from './Call/StringeeContext';
import ChatMemberScreen from './Chat/ChatMemberScreen';
import ChatScreen from './Chat/ChatScreen';
import {CommentDetail} from './CommentDetail';
import {useMount} from './commonHooks';
import HomeScreen from './Home/HomeScreen';
import TrainingDetailSceen from './Home/TrainingHome/TrainingDetailSceen';
import {PanoramaReviewScreen} from './ImagePanorama/PanoramaReview/PanoramaReviewScreen';
import {PanoramaUpdateScreen} from './ImagePanorama/PanoramaUpdate/PanoramaUpdateScreen';
import LaunchScreen from './Launch/LaunchScreen';
import {LiveChatRoomScreen} from './LiveChat/LiveChatRoomScreen';
import {LiveChatSupportScreen} from './LiveChat/LiveChatSupportScreen';
import RequestDetailScreen from './ManageBuyRequest/ContactDetail/RequestDetailScreen';
import TradingCompleteDetailScreen from './ManageBuyRequest/ContactDetail/TradingCompleteDetailScreen';
import TradingDepositDetailScreen from './ManageBuyRequest/ContactDetail/TradingDepositDetailScreen';
import CreateContactRequestScreen from './ManageBuyRequest/CreateRequest/CreateContactRequestScreen';
import CreateContactRequestScreen2 from './ManageBuyRequest/CreateRequest/CreateContactRequestScreen2';
import ManageBuyRequestScreen from './ManageBuyRequest/ManageContactList/ManageBuyRequestScreen';
import ManageContactListScreen from './ManageBuyRequest/ManageContactList/ManageContactListScreen';
import {ContactTradingProvider} from './ManageBuyRequest/useContactTrading';
import DetailContactAdviceScreen from './ManageContactAdvice/DetailContactAdviceScreen';
import ManageContactAdviceScreen from './ManageContactAdvice/ManageContactAdviceScreen';
import DetailPaymentScreen from './ManagePayment/DetailPayment/DetailPaymentScreen';
import ManagePaymentScreen from './ManagePayment/ManagePaymentScreen';
import AgentPropertyPostScreen from './ManagePost/AgentPropertyPost/AgentPropertyPostScreen';
import ContactToAdviceScreen from './ManagePost/Contact/ContactToAdvice/ContactToAdviceScreen';
import ContactToBuyScreen from './ManagePost/Contact/ContactToBuy/ContactToBuyScreen';
import NewPostAddFacilityScreen from './ManagePost/FacilityFurniture/NewPostAddFacilityScreen';
import NewPostAddFurnitureScreen from './ManagePost/FacilityFurniture/NewPostAddFurnitureScreen';
import NewPostImagesScreen from './ManagePost/Images/NewPostImagesScreen';
import ManagePostScreen from './ManagePost/ManagePostScreen';
import GeneralDescriptionScreen from './ManagePost/NewPost/GeneralDescriptionScreen';
import NewPostContactInfoScreen from './ManagePost/NewPost/NewPostContactInfoScreen';
import NewPostSuccessScreen from './ManagePost/NewPost/NewPostSuccessScreen';
import SelectSupportAgentScreen from './ManagePost/NewPost/SelectSupportAgentScreen';
import WebStreetViewScreen from './ManagePost/NewPost/WebStreetViewScreen';
import ProjectDeliveredScreen from './ManagePost/ProjectDelivered/ProjectDeliveredScreen';
import PropertyPostCrawlerScreen from './ManagePost/PropertyPostCrawler/PropertyPostCrawlerScreen';
import PropertyPostTrackingScreen from './ManagePost/PropertyPostTracking/PropertyPostTrackingScreen';
import PropertySavedScreen from './ManagePost/PropertySavedScreen';
import GuaranteeContractDetailScreen from './ManagePost/ReviewPropertyPost/GuaranteeContractDetailScreen';
import ImageHorizontalListScreen from './ManagePost/ReviewPropertyPost/ImageHorizontalListScreen';
import ReviewPropertyPostScreen from './ManagePost/ReviewPropertyPost/ReviewPropertyPostScreen';
import ViewPropertyPostScreen from './ManagePost/ReviewPropertyPost/ViewPropertyPostScreen';
import SuggestionPostScreen from './ManagePost/SuggestionPost/SuggestionPostScreen';
import {NewPostProvider} from './ManagePost/useNewPost';
import YourPropertyPostScreen from './ManagePost/YourPropertyPost/YourPropertyPostScreen';
import {Map360Screen} from './Map360/Map360Screen';
import MessageNotificationScreen from './MessageNotification/MessageNotificationScreen';
import MoreScreen from './More/MoreScreen';
import {setRootNavigationRef} from './navigate';
import ReviewAgentScreen from './Notification/ReviewAgent/ReviewAgentScreen';
import ReviewSupportRequestAgentScreen from './Notification/ReviewAgent/ReviewSupportRequestAgentScreen';
import HandbookListScreen from './Pages/HandbookList/HandbookListScreen';
import InvestorDetail from './Pages/InvestorInformation/InvestorDetail';
import InvestorInformationList from './Pages/InvestorInformation/InvestorInformationList';
import InvestorProjectList from './Pages/InvestorInformation/InvestorProjectList';
import NewsListScreen from './Pages/NewsList/NewsListScreen';
import PageDetailQueryScreen from './Pages/PageDetail/PageDetailQueryScreen';
import PageDetailScreen from './Pages/PageDetail/PageDetailScreen';
import ListInviteActiveUser from './Pages/ShareApplication/ListInviteActiveUser';
import ShareApplicationScreen from './Pages/ShareApplication/ShareApplicationScreen';
import SubmenuPagesScreen from './Pages/Submenu/SubmenuScreen';
import CommonPaymentWebViewScreen from './Payment/CommonPaymentWebViewScreen';
import CommonSelectPaymentMethod from './Payment/CommonSelectPaymentMethodScreen';
import LoanDetailScreen from './PlusService/LoanDetailScreen';
import LoanServiceScreen from './PlusService/LoanServiceScreen';
import ManageTPFScreen from './PlusService/ManageTPFScreen';
import PlusServiceScreen from './PlusService/PlusServiceScreen';
import ServiceDetailScreen from './PlusService/ServiceDetailScreen';
import BasicProfileScreenWithNavigation from './Profile/CreateEditProfile/BasicProfileScreenWithNavigation';
import CreateUpdateProfileScreen from './Profile/CreateEditProfile/CreateUpdateProfileScreen';
import UpdateAgentScreen from './Profile/CreateEditProfile/UpdateAgentScreen';
import FollowerScreen from './Profile/FollowerScreen/FollowerScreen';
import {GuestProfileScreen} from './Profile/GuestProfileScreen';
import MemberProfileScreen from './Profile/MemberProfile/MemberProfileScreen';
import {Notification2Screen, Transaction2Screen} from './Profile/MemberProfile/RequiredLogin';
import ProfileScreen from './Profile/ProfileScreen';
import RequestResultScreen from './Profile/RequestSupport/ConsultationRequest/RequestResultScreen';
import CreateSupportRequestScreen from './Profile/RequestSupport/CreateSupportRequestScreen';
import DetailRequestSupportScreen from './Profile/RequestSupport/DetailRequestSupportScreen';
import RequestSupportScreen from './Profile/RequestSupport/RequestSupportScreen';
import SelectTopenerScreen from './Profile/RequestSupport/SelectTopenerScreen';
import SupportRequestPaymentSuccessScreen from './Profile/RequestSupport/SupportRequestPaymentSuccessScreen';
import SubscriptionInfoScreen from './Profile/Subscription/SubscriptionInfoScreen';
import SubscriptionPaymentScreen from './Profile/Subscription/SubscriptionPaymentScreen';
import YourTeamDetailScreen from './Profile/YourTeam/YourTeamDetailScreen';
import YourTeamScreen from './Profile/YourTeam/YourTeamScreen';
import MatterportScreen from './ProjectDetail/MatterportScreen';
import ProjectDetailScreen from './ProjectDetail/ProjectDetailScreen';
import StreetviewScreen from './ProjectDetail/StreetviewScreen';
import PropertyChangeConfirmScreen from './PropertyChangeConfirm/PropertyChangeConfirmScreen';
import ScreenIds from './ScreenIds';
import SearchMapAgentsScreen from './Search/SearchMap/SearchMapAgentsScreen';
import SearchMapProjectsScreen from './Search/SearchMap/SearchMapProjectsScreen';
import SearchMapPropertyPostScreen from './Search/SearchMap/SearchMapPropertyPostScreen';
import SearchMapScreen from './Search/SearchMap/SearchMapScreen';
import SearchNewsScreen from './Search/SearchNews/SearchNewsScreen';
import SearchScreen from './Search/SearchScreen';
import SearchSuggestScreen from './Search/SearchSuggestScreen';
import SlotSelectionScreen from './SlotSelection/SlotSelectionScreen';
import DetailTransactionScreen from './Transaction/DetailTransaction/DetailTransactionScreen';
import TransactionOTPScreen from './Transaction/DetailTransaction/TransactionOTPScreen';
import DetailHistoryUpdateInfoScreen from './Transaction/HistoryUpdateInfo/DetailHistoryUpdateInfoScreen';
import ListHistoryUpdateInfoScreen from './Transaction/HistoryUpdateInfo/ListHistoryUpdateInfoScreen';
import TransactionScreen from './Transaction/TransactionScreen';
import UtilitiesScreen from './Utilities360/UtilitiesScreen';
import ValuationScreen from './Valuation/ValuationScreen';
import {SegmentScreenDisplay} from './WithSegment';

const RootStack = createStackNavigator();
const AppStack = createStackNavigator();
const MainTab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const SignUpStack = createStackNavigator();
const CreateContactRequestStack = createStackNavigator();
const SubscriptionStack = createStackNavigator();
const TradingRequestDetailStack = createStackNavigator();

const CreateContactRequestNavigator = () => {
  return (
    <CreateContactRequestStack.Navigator useLegacyImplementation={true} screenOptions={{headerShown: false}}>
      <CreateContactRequestStack.Screen
        name={ScreenIds.CreateContactRequest}
        component={CreateContactRequestScreen}
      />
      <CreateContactRequestStack.Screen
        name={ScreenIds.CreateContactRequest2}
        component={CreateContactRequestScreen2}
      />
    </CreateContactRequestStack.Navigator>
  );
};

const SubscriptionNavigator = () => {
  return (
    <SubscriptionStack.Navigator useLegacyImplementation={true} screenOptions={{headerShown: false}}>
      <SubscriptionStack.Screen
        name={ScreenIds.SubscriptionInfo}
        component={SubscriptionInfoScreen}
      />
      <SubscriptionStack.Screen
        name={ScreenIds.SubscriptionPaymentScreen}
        component={SubscriptionPaymentScreen}
      />
    </SubscriptionStack.Navigator>
  );
};

const TradingRequestDetailNavigator = () => {
  return (
    <TradingRequestDetailStack.Navigator
      useLegacyImplementation={true}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <TradingRequestDetailStack.Screen
        name={ScreenIds.RequestDetail}
        component={RequestDetailScreen}
      />
      <TradingRequestDetailStack.Screen
        name={ScreenIds.TradingDepositDetail}
        component={TradingDepositDetailScreen}
      />
      <TradingRequestDetailStack.Screen
        name={ScreenIds.TradingCompleteDetail}
        component={TradingCompleteDetailScreen}
      />
    </TradingRequestDetailStack.Navigator>
  );
};

const MainTabNavigator = ({navigation}) => {
  setRootNavigationRef(navigation);
  const {notLoggedIn} = useLogin();
  const {showMenu, scrollHomePageToTop} = React.useContext(AppContext);

  return (
    <Host>
      <MainTab.Navigator
        useLegacyImplementation={true}
        tabBar={props => <CustomTabBar {...props} />}
        safeAreaInsets={['bottom']}
        screenOptions={{
          headerShown: false,
          activeTintColor: COLORS.PRIMARY_A100,
          labelStyle: {...FONTS.regular},
          lazy: true,
          tabBarActiveTintColor: COLORS.PRIMARY_A100,
          tabBarInactiveBackgroundColor: COLORS.TEXT_DARK_40,
        }}>
        <MainTab.Screen
          name={ScreenIds.Home}
          component={HomeScreen}
          options={{
            tabBarLabel: STRINGS.HOME,
            tabBarIconName: IMAGES.IC_TRANGCHU_LINEAR,
            tabBarIconNameActive: IMAGES.IC_TRANGCHU_FILL,
          }}
          listeners={() => ({
            tabPress: () => {
              const isFirstTimeView = !navigation.getParent()?.getState()?.routes[0]?.state
                ?.routes[0].state;
              const wasOnHomePage =
                navigation.getParent()?.getState()?.routes[0]?.state?.routes[0]?.state?.index === 0;

              if (wasOnHomePage || isFirstTimeView) {
                scrollHomePageToTop();
              }
            },
          })}
        />
        <MainTab.Screen
          name={ScreenIds.Transaction}
          component={notLoggedIn ? Transaction2Screen : TransactionScreen}
          options={{
            tabBarLabel: STRINGS.TRANSACTION,
            tabBarIconName: IMAGES.IC_GIAODICH_LINEAR,
            tabBarIconNameActive: IMAGES.IC_GIAODICH_FILL,
          }}
        />
        <MainTab.Screen
          name={'TabPopup'}
          component={TabPopup}
          options={{
            tabBarLabel: STRINGS.PLUS,
            tabBarIconName: IMAGES.IC_MENU_HOME,
          }}
          listeners={() => ({
            tabPress: e => {
              e.preventDefault();
              showMenu(true);
            },
          })}
        />
        <MainTab.Screen
          name={ScreenIds.MessageNotification}
          component={notLoggedIn ? Notification2Screen : MessageNotificationScreen}
          options={{
            tabBarLabel: STRINGS.MESSAGE,
            tabBarIconName: IMAGES.IC_MESSAGE_LINEAR,
            tabBarIconNameActive: IMAGES.IC_MESSAGE_FILL_BOTTOM_TAB,
          }}
        />
        <MainTab.Screen
          name={ScreenIds.Profile}
          component={notLoggedIn ? GuestProfileScreen : ProfileScreen}
          options={{
            tabBarLabel: STRINGS.PROFILE,
            tabBarIconName: IMAGES.IC_NGUOIDUNG_LINEAR,
            tabBarIconNameActive: IMAGES.IC_NGUOIDUNG_FILL,
          }}
        />
      </MainTab.Navigator>
    </Host>
  );
};

// Gets the current screen from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  logNavi(route);

  return route.name;
};

const MainStackScreen = () => (
  <AppStack.Navigator useLegacyImplementation={true} screenOptions={{headerShown: false}}>
    <AppStack.Screen name={ScreenIds.Launching} component={LaunchScreen} />
    <AppStack.Screen
      name={ScreenIds.UpdateUserInfoTransaction}
      component={UpdateUserInfoTransaction}
    />
    <AppStack.Screen name={ScreenIds.PaymentWebview} component={PaymentWebviewScreen} />
    <AppStack.Screen name={ScreenIds.CommonPaymentWebView} component={CommonPaymentWebViewScreen} />
    <AppStack.Screen
      name={ScreenIds.CommonSelectPaymentMethod}
      component={CommonSelectPaymentMethod}
    />
    <AppStack.Screen name={ScreenIds.MainTab} component={MainTabNavigator} />
    <AppStack.Screen name={ScreenIds.AgentManagement} component={AgentManagementScreen} />
    <AppStack.Screen name={ScreenIds.ConfirmDepositScreen} component={ConfirmDepositScreen} />
    <AppStack.Screen name={ScreenIds.PaymentInfo} component={PaymentInfoScreen} />

    <AppStack.Screen name={ScreenIds.InvestorInformationList} component={InvestorInformationList} />
    <AppStack.Screen name={ScreenIds.InvestorDetail} component={InvestorDetail} />
    <AppStack.Screen name={ScreenIds.InvestorProjectList} component={InvestorProjectList} />

    <AppStack.Screen
      name={ScreenIds.DetailConsultationResult}
      component={RequestResultScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen name={ScreenIds.CreateUpdateProfile} component={CreateUpdateProfileScreen} />
    <AppStack.Screen
      name={ScreenIds.UpdateAgentProfile}
      component={UpdateAgentScreen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen name={ScreenIds.MemberProfile} component={MemberProfileScreen} />
    <AppStack.Screen
      name={ScreenIds.BasicProfileNavigation}
      component={BasicProfileScreenWithNavigation}
    />
    <AppStack.Screen
      name={ScreenIds.RegisterAgent}
      component={RegisterAgentScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen
      name={ScreenIds.FollowerProfile}
      component={FollowerScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen
      name={ScreenIds.RequestSupport}
      component={RequestSupportScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen
      name={ScreenIds.DetailRequestSupport}
      component={DetailRequestSupportScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen
      name={ScreenIds.SupportRequestPaymentSuccess}
      component={SupportRequestPaymentSuccessScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen
      name={ScreenIds.SelectTopener}
      component={SelectTopenerScreen}
      options={{gestureEnabled: false}}
    />

    <AppStack.Screen
      name={ScreenIds.CreateSupportRequest}
      component={CreateSupportRequestScreen}
      options={{gestureEnabled: false}}
    />

    <AuthStack.Screen name={ScreenIds.CommentDetail} component={CommentDetail} />
    <AuthStack.Screen name={ScreenIds.TrainingDetailSceen} component={TrainingDetailSceen} />
    <AuthStack.Screen name={ScreenIds.ChangePassword} component={ChangePasswordScreen} />
    <AppStack.Screen name={ScreenIds.ManagePost} component={ManagePostScreen} />
    <AppStack.Screen name={ScreenIds.YourPropertyPost} component={YourPropertyPostScreen} />
    <AppStack.Screen name={ScreenIds.PropertyPostSaved} component={PropertySavedScreen} />
    <AppStack.Screen name={ScreenIds.PropertyPostTracking} component={PropertyPostTrackingScreen} />
    <AppStack.Screen name={ScreenIds.PropertyPostCrawler} component={PropertyPostCrawlerScreen} />
    <AppStack.Screen name={ScreenIds.YourTeam} component={YourTeamScreen} />
    <AppStack.Screen name={ScreenIds.YourTeamDetail} component={YourTeamDetailScreen} />
    <AppStack.Screen
      name={ScreenIds.GeneralDescription}
      component={GeneralDescriptionScreen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen name={ScreenIds.ReviewPropertyPost} component={ReviewPropertyPostScreen} />
    <AppStack.Screen name={ScreenIds.NewPostImages} component={NewPostImagesScreen} />
    <AppStack.Screen name={ScreenIds.SelectPaymentMethod} component={SelectPaymentMethodScreen} />
    <AppStack.Screen name={ScreenIds.NewPostAddFacility} component={NewPostAddFacilityScreen} />
    <AppStack.Screen name={ScreenIds.NewPostAddFurniture} component={NewPostAddFurnitureScreen} />
    <AppStack.Screen name={ScreenIds.NewPostSuccessScreen} component={NewPostSuccessScreen} />
    <AppStack.Screen name={ScreenIds.NewPostContactInfo} component={NewPostContactInfoScreen} />
    <AppStack.Screen name={ScreenIds.WebStreetView} component={WebStreetViewScreen} />
    <AppStack.Screen
      name={ScreenIds.SelectSupportAgentScreen}
      component={SelectSupportAgentScreen}
    />
    <AppStack.Screen
      name={ScreenIds.ViewPropertyPost}
      component={ViewPropertyPostScreen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen
      name={ScreenIds.GuaranteeContractDetail}
      component={GuaranteeContractDetailScreen}
    />
    <AppStack.Screen name={ScreenIds.GuaranteeContractOTP} component={ConfirmOTPScreen} />
    <AppStack.Screen name={ScreenIds.ProjectDetail} component={ProjectDetailScreen} />
    <AppStack.Screen name={ScreenIds.Matterport} component={MatterportScreen} />
    <AppStack.Screen name={ScreenIds.Streetview} component={StreetviewScreen} />
    <AppStack.Screen name={ScreenIds.ImageHorizontalList} component={ImageHorizontalListScreen} />
    <AppStack.Screen name={ScreenIds.Search} component={SearchScreen} />
    <AppStack.Screen name={ScreenIds.AgentProperty} component={AgentPropertyPostScreen} />
    <AppStack.Screen
      name={ScreenIds.SearchMapPropertyPost}
      component={SearchMapPropertyPostScreen}
    />
    <AppStack.Screen name={ScreenIds.SearchMapProjects} component={SearchMapProjectsScreen} />
    <AppStack.Screen name={ScreenIds.SearchSuggest} component={SearchSuggestScreen} />
    <AppStack.Screen
      name={ScreenIds.SearchMapAgents}
      component={SearchMapAgentsScreen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen name={ScreenIds.ProjectDelivered} component={ProjectDeliveredScreen} />
    <AppStack.Screen name={ScreenIds.AwardAndTrophy} component={AwardAndTrophyScreen} />
    <AppStack.Screen name={ScreenIds.SuggestionPost} component={SuggestionPostScreen} />
    <AppStack.Screen name={ScreenIds.ConfirmTransaction} component={ConfirmTransactionScreen} />
    <AppStack.Screen name={ScreenIds.SlotSelection} component={SlotSelectionScreen} />
    <AppStack.Screen name={ScreenIds.SellAgentList} component={SellAgentListScreen} />
    <AppStack.Screen
      name={ScreenIds.PropertyChangeConfirm}
      component={PropertyChangeConfirmScreen}
    />
    <AppStack.Screen name={ScreenIds.ConfirmProperty} component={ConfirmPropertyScreen} />
    <AppStack.Screen
      name={ScreenIds.SearchMap}
      component={SearchMapScreen}
      options={{
        animationEnabled: false,
        gestureEnabled: false,
      }}
    />
    <AppStack.Screen name={ScreenIds.More} component={MoreScreen} />
    <AppStack.Screen name={ScreenIds.HotlineSupport} component={HotlineSupportScreen} />
    <AppStack.Screen name={ScreenIds.LiveChatSupport} component={LiveChatSupportScreen} />
    <AppStack.Screen
      name={ScreenIds.LiveChatRoom}
      component={LiveChatRoomScreen}
      options={{
        gestureEnabled: false,
      }}
    />
    <AppStack.Screen
      name={ScreenIds.Chat}
      component={ChatScreen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen name={ScreenIds.ChatMember} component={ChatMemberScreen} />
    <AppStack.Screen name={ScreenIds.DetailTransaction} component={DetailTransactionScreen} />
    <AppStack.Screen name={ScreenIds.NewList} component={NewsListScreen} />
    <AppStack.Screen name={ScreenIds.HandbookList} component={HandbookListScreen} />
    <AppStack.Screen
      name={ScreenIds.PageDetail}
      options={{animationEnabled: false}}
      component={PageDetailScreen}
    />
    <AppStack.Screen name={ScreenIds.PageDetailQuery} component={PageDetailQueryScreen} />
    <AppStack.Screen name={ScreenIds.SubmenuPages} component={SubmenuPagesScreen} />
    <AppStack.Screen name={ScreenIds.ContactToAdvice} component={ContactToAdviceScreen} />
    <AppStack.Screen name={ScreenIds.ContactToBuy} component={ContactToBuyScreen} />
    <AppStack.Screen name={ScreenIds.RefundScreen} component={RefundScreen} />
    <AppStack.Screen name={ScreenIds.ReviewAgent} component={ReviewAgentScreen} />
    <AppStack.Screen name={ScreenIds.ViewProperty} component={ViewPropertyScreen} />
    <AppStack.Screen
      name={ScreenIds.ReviewSupportRequestAgent}
      component={ReviewSupportRequestAgentScreen}
    />
    <AppStack.Screen name={ScreenIds.PlusService} component={PlusServiceScreen} />
    <AppStack.Screen name={ScreenIds.ManageTPF} component={ManageTPFScreen} />
    <AppStack.Screen name={ScreenIds.LoanService} component={LoanServiceScreen} />
    <AppStack.Screen name={ScreenIds.LoanDetail} component={LoanDetailScreen} />
    <AppStack.Screen name={ScreenIds.ServiceDetail} component={ServiceDetailScreen} />
    <AppStack.Screen
      name={ScreenIds.ShareApplication}
      component={ShareApplicationScreen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen
      name={ScreenIds.ListInviteActiveUser}
      component={ListInviteActiveUser}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen name={ScreenIds.ManageContactList} component={ManageContactListScreen} />
    <AppStack.Screen name={ScreenIds.ManageBuyRequest} component={ManageBuyRequestScreen} />
    <AppStack.Screen
      name={ScreenIds.RequestDetailStack}
      component={TradingRequestDetailNavigator}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen
      name={ScreenIds.CreateContactRequestStack}
      component={CreateContactRequestNavigator}
    />
    <AppStack.Screen name={ScreenIds.ManageContactAdvice} component={ManageContactAdviceScreen} />
    <AppStack.Screen name={ScreenIds.DetailContactAdvice} component={DetailContactAdviceScreen} />
    <AppStack.Screen name={ScreenIds.SubscriptionStack} component={SubscriptionNavigator} />
    <AppStack.Screen name={ScreenIds.ManagePayment} component={ManagePaymentScreen} />
    <AppStack.Screen name={ScreenIds.DetailPayment} component={DetailPaymentScreen} />
    <AppStack.Screen name={ScreenIds.TransactionOTPScreen} component={TransactionOTPScreen} />

    <AppStack.Screen
      name={ScreenIds.DetailHistoryUpdateInfoScreen}
      component={DetailHistoryUpdateInfoScreen}
    />
    <AppStack.Screen
      name={ScreenIds.ListHistoryUpdateInfoScreen}
      component={ListHistoryUpdateInfoScreen}
    />
    <AppStack.Screen
      name={ScreenIds.Map360}
      component={Map360Screen}
      options={{gestureEnabled: false}}
    />
    <AppStack.Screen name={ScreenIds.SearchNewsScreen} component={SearchNewsScreen} />
    <AppStack.Screen name={ScreenIds.ImagePanoramaReview} component={PanoramaReviewScreen} />
    <AppStack.Screen name={ScreenIds.ImagePanoramaUpdate} component={PanoramaUpdateScreen} />
    <AppStack.Screen name={ScreenIds.Utilities360} component={UtilitiesScreen} />
    <AppStack.Screen name={ScreenIds.Valuatation} component={ValuationScreen} />
    <AppStack.Screen
      name={ScreenIds.ManageGeneralRequestScreen}
      component={ManageGeneralRequestScreen}
    />
    <AppStack.Screen
      name={ScreenIds.CreateGeneralRequestScreen}
      component={CreateGeneralRequestScreen}
    />
    <AppStack.Screen
      name={ScreenIds.DetailGeneralRequestScreen}
      component={DetailGeneralRequestScreen}
    />
    <AppStack.Screen
      name={ScreenIds.UpdateGeneralRequestScreen}
      component={UpdateGeneralRequestScreen}
    />
  </AppStack.Navigator>
);

const AuthStackScreen = () => (
  <AuthStack.Navigator useLegacyImplementation={true} screenOptions={{headerShown: false}}>
    <AuthStack.Screen name={ScreenIds.Login} component={LoginScreen} />
    <AuthStack.Screen name={ScreenIds.InputMobile} component={InputMobileScreen} />
    <AuthStack.Screen name={ScreenIds.ConfirmOTP} component={ConfirmOTPScreen} />
    <AuthStack.Screen name={ScreenIds.SetPassword} component={SetPasswordScreen} />
    <AuthStack.Screen
      name={ScreenIds.Welcome}
      options={{gestureEnabled: false}}
      component={WelcomeScreen}
    />
    <AuthStack.Screen name={ScreenIds.ForgotPassword} component={ForgotPasswordScreen} />
    <AuthStack.Screen
      name={ScreenIds.ForgotPasswordConfirmOtp}
      component={ForgotPasswordConfirmOTPScreen}
    />
    <AuthStack.Screen
      name={ScreenIds.RegisterAgent}
      component={RegisterAgentScreen}
      options={{gestureEnabled: false}}
    />
    <AuthStack.Screen name={ScreenIds.ResetPassword} component={ResetPasswordScreen} />
    <AuthStack.Screen
      name={ScreenIds.ResetPasswordComplete}
      component={ResetPasswordCompleteScreen}
    />
    <AuthStack.Screen name={ScreenIds.ContactToAdvice} component={ContactToAdviceScreen} />
    <AuthStack.Screen name={ScreenIds.StepSignUp} component={SignUpStackScreen} />
  </AuthStack.Navigator>
);

const SignUpStackScreen = () => (
  <SignUpProvider>
    <SignUpStack.Navigator
      useLegacyImplementation={true}
      screenOptions={{
        headerShown: false,
        mode: 'card',
      }}>
      <SignUpStack.Screen name={ScreenIds.InfoAccount} component={InfoAccountScreen} />
      <SignUpStack.Screen name={ScreenIds.InfoTopener} component={InfoTopenerScreen} />
    </SignUpStack.Navigator>
  </SignUpProvider>
);

const RootStackScreen = () => (
  <RootStack.Navigator
    useLegacyImplementation={true}
    screenOptions={{
      headerShown: false,
      mode: 'card',
    }}>
    <RootStack.Screen name={ScreenIds.MainStack} component={MainStackScreen} />
    <RootStack.Screen name={ScreenIds.AuthStack} component={AuthStackScreen} />
  </RootStack.Navigator>
);

const AppNavigator = () => {
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const {screen} = useAnalytics();

  useMount(() => {
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
  });

  const onStateChange = state => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);

    if (previousRouteName !== currentRouteName) {
      analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName,
      });

      if (SegmentScreenDisplay[currentRouteName]) {
        screen(SegmentScreenDisplay[currentRouteName]);
      }
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName;
  };

  return (
    <LastModifiedProvider>
      <BookingProvider>
        <NewPostProvider>
          <RequestSupportProvider>
            <ContactTradingProvider>
              <StringeeProvider>
                <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
                  <RootStackScreen />
                </NavigationContainer>
                <ContactTradingB2CBannerContainer />
              </StringeeProvider>
            </ContactTradingProvider>
          </RequestSupportProvider>
        </NewPostProvider>
      </BookingProvider>
    </LastModifiedProvider>
  );
};

export default AppNavigator;
