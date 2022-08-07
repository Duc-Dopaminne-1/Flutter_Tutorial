import {ids} from './ids';

const ScreenIds = {
  //Launching Screen:
  Launching: 'Launching',

  //AuthFlow
  AuthStack: 'AuthStack',
  Login: ids.login.screenId,
  Signup: 'Signup',
  RegisterAgent: 'RegisterAgent',
  ForgotPassword: 'ForgotPassword',
  ForgotPasswordConfirmOtp: 'ForgotPasswordConfirmOtp',
  ResetPassword: 'ResetPassword',
  ConfirmOTP: 'ConfirmOTP',
  SetPassword: 'SetPassword',
  Welcome: 'WelcomeScreen',
  InputMobile: 'InputMobile',
  ResetPasswordComplete: 'ResetPasswordComplete',
  ChangePassword: 'ChangePassword',
  StepSignUp: 'StepSignUp',
  InfoAccount: 'InfoAccount',
  InfoTopener: 'InfoTopener',

  //MainStack - Tabs - & other screen
  MainStack: 'MainStack',
  MainTab: 'MainTab',
  Home: 'Home',
  Transaction: 'Transaction',
  Notification: 'Notification',
  MessageNotification: 'MessageNotification',
  Profile: 'Profile',
  MemberProfile: 'MemberProfile',
  More: 'More',

  //Other screens of Main stack
  PersonList: 'PeronList',
  AgentManagement: 'AgentManagement',

  // Profile
  CreateUpdateProfile: 'CreateUpdateProfile',
  UpdateAgentProfile: 'UpdateAgentProfile',
  BasicProfile: 'BasicProfile',
  FollowerProfile: 'FollowerProfile',
  BasicProfileNavigation: 'BasicProfileNavigation',

  // Manage Post
  ManagePost: 'ManagePost',
  YourPropertyPost: 'YourPropertyPost',
  PropertyPostSaved: 'PropertyPostSaved',
  PropertyPostTracking: 'PropertyPostTracking',
  PropertyPostCrawler: 'PropertyPostCrawler',
  GeneralDescription: 'GeneralDescription',
  NewPostImages: 'NewPostImages',
  NewPostContactInfo: 'NewPostContactInfo',
  NewPostFacilityList: 'NewPostFacilityList',
  NewPostAddFacility: 'NewPostAddFacility',
  NewPostFurnitureList: 'NewPostFurnitureList',
  NewPostAddFurniture: 'NewPostAddFurniture',
  NewPostSuccessScreen: 'NewPostSuccessScreen',
  PostDetail: 'PostDetail',
  PostSuccess: 'PostSuccess',
  Matterport: 'MatterPort',
  Streetview: 'Streetview',
  ImageHorizontalList: 'ImageHorizontalList',
  NewPostCaptchaScreen: 'NewPostCaptchaScreen',
  SelectSupportAgentScreen: 'SelectSupportAgentScreen',
  WebStreetView: 'WebStreetView',

  // Your Team
  YourTeam: 'YourTeam',
  YourTeamDetail: 'YourTeamDetail',

  // Property post detail
  ReviewPropertyPost: 'ReviewPropertyPost',
  ViewPropertyPost: 'ViewPropertyPost',
  UpdatePropertyPost: 'UpdatePropertyPost',
  GuaranteeContractDetail: 'GuaranteeContractDetail',
  GuaranteeContractOTP: 'GuaranteeContractOTP',

  ProjectDetail: 'ProjectDetail',
  // Search
  Search: 'Search',
  SearchFilter: 'SearchFilter',
  SearchSuggest: 'SearchSuggest',
  AgentProperty: 'AgentProperty',
  SearchMapPropertyPost: 'SearchMapPropertyPost',
  SearchMapProjects: 'SearchMapProjects',
  SearchMapAgents: 'SearchMapAgents',
  ProjectDelivered: 'ProjectDelivered',

  SearchFilterAgent: 'SearchFilterAgent',

  AwardAndTrophy: 'AwardAndTrophy',

  ConfirmTransaction: 'ConfirmTransaction',
  TransactionOTPScreen: 'TransactionOTPScreen',
  SlotSelection: 'SlotSelection',
  SuggestionPost: 'SuggestionPost',
  SelectPaymentMethod: 'SelectPaymentMethod',

  SellAgentList: 'SellAgentList',
  PropertyChangeConfirm: 'PropertyChangeConfirm',

  ConfirmProperty: 'ConfirmProperty',
  PaymentInfo: 'PaymentInfo',
  ViewProperty: 'ViewProperty',

  PaymentWebview: 'PaymentWebview',
  SearchMap: 'SearchMap',
  DetailTransaction: 'DetailTransaction',
  ConfirmDepositScreen: 'ConfirmDepositScreen',

  DetailHistoryUpdateInfoScreen: 'DetailHistoryUpdateInfoScreen',
  ListHistoryUpdateInfoScreen: 'ListHistoryUpdateInfoScreen',

  // Static pages
  NewList: 'NewList',
  HandbookList: 'HandbookList',
  PageDetail: 'PageDetail',
  PageDetailQuery: 'PageDetailQuery',
  RecuitmentList: 'RecuitmentList',
  SubmenuPages: 'SubmenuPages',
  ContactToAdvice: 'ContactToAdvice',
  ContactToBuy: 'ContactToBuy',
  RefundScreen: 'RefundScreen',
  ReviewAgent: 'ReviewAgent',
  ReviewSupportRequestAgent: 'ReviewSupportRequestAgent',
  PlusService: 'PlusService',
  ManageTPF: 'ManageTPF',
  ShareApplication: 'ShareApplication',
  ListInviteActiveUser: 'ListInviteActiveUser',
  LoanService: 'LoanService',
  LoanDetail: 'LoanDetail',
  ServiceDetail: 'ServiceDetail',

  // Manage request
  ManageContactList: 'ManageContactList',
  ManageBuyRequest: 'ManageBuyRequest',
  RequestDetailStack: 'RequestDetailStack',
  RequestDetail: 'RequestDetail',
  CreateContactRequest: 'CreateContactRequest',
  CreateContactRequest2: 'CreateContactRequest2',
  CreateContactRequestStack: 'CreateContactRequestStack',
  TradingDepositDetail: 'TradingDepositDetail',
  TradingCompleteDetail: 'TradingCompleteDetail',
  UpdateContactTradingDepositStatusStack: 'UpdateContactTradingDepositStatusStack',

  // Subscription
  SubscriptionStack: 'SubscriptionStack',
  SubscriptionInfo: 'SubscriptionInfoScreen',
  SubscriptionPaymentScreen: 'SubscriptionPaymentScreen',

  // Payment
  ManagePayment: 'ManagePayment',
  DetailPayment: 'DetailPayment',

  HotlineSupport: 'HotlineSupport',
  LiveChatSupport: 'LiveChatSupport',
  LiveChatRoom: 'LiveChatRoom',
  Chat: 'Chat',
  ChatMember: 'ChatMember',

  ManageContactAdvice: 'ManageContactAdvice',
  DetailContactAdvice: 'DetailContactAdvice',

  RequestSupport: 'RequestSupport',
  DetailRequestSupport: 'DetailRequestSupport',
  DetailConsultationRequestStack: 'DetailConsultationRequestStack',
  DetailConsultationResult: 'DetailConsultationResult',
  CreateSupportRequest: 'CreateSupportRequest',
  SupportRequestPaymentSuccess: 'SupportRequestPaymentSuccess',
  SelectTopener: 'SelectTopener',

  CommonPaymentWebView: 'CommonPaymentWebView',
  CommonSelectPaymentMethod: 'CommonSelectPaymentMethod',

  TrainingDetailSceen: 'TrainingDetailSceen',
  InvestorInformationList: 'InvestorInformationList',
  InvestorDetail: 'InvestorDetail',
  InvestorProjectList: 'InvestorProjectList',

  Map360: 'Map360',
  SearchNewsScreen: 'SearchNewsScreen',

  CommentDetail: 'CommentDetail',
  UpdateUserInfoTransaction: 'UpdateUserInfoTransaction',

  // Image 360
  ImagePanoramaReview: 'ImagePanoramaReview',
  ImagePanoramaUpdate: 'ImagePanoramaUpdate',

  // Utilities
  Utilities360: 'UtilitiesScreen',

  // Valuatation
  Valuatation: 'Valuatation',

  // LHMC
  ManageGeneralRequestScreen: 'ManageGeneralRequestScreen',
  CreateGeneralRequestScreen: 'CreateGeneralRequestScreen',
  DetailGeneralRequestScreen: 'DetailGeneralRequestScreen',
  UpdateGeneralRequestScreen: 'UpdateGeneralRequestScreen',
};

export default ScreenIds;
