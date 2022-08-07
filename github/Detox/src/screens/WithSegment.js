import {AnalyticsProvider, createClient} from '@segment/analytics-react-native/src';
import {AppsflyerPlugin} from '@segment/analytics-react-native-plugin-appsflyer';
import React from 'react';

import {getConfigs} from '../configs';
import logService from '../service/logService';
import {useMount} from './commonHooks';
import ScreenIds from './ScreenIds';

export type UserTraits = {
  email: String,
  createdAt: Date,
  gender: 'male' | 'female',
  signup_source: 'ios' | 'android',
  optin_location: 'signup' | 'signin' | 'update_profile',
  firstName: String,
  lastName: String,
  updated_at: Date,
  birthday: Date,
  phone_number: Number,
  user_name: String,
  referral_code: String,
  group: String,
  last_sign_in: Date,
};

export const TrackingActions = {
  productClicked: 'Product Clicked',
  productsListViewed: 'Products List Viewed',
  consultancyRequestClicked: 'Consultancy Request Clicked',
  consultancySubmitted: 'Consultancy Submitted',
  productViewed: 'Product Viewed',
  productFollowClicked: 'Product Follow Clicked',
  loanSubmitted: 'Loan Submitted',

  // Contact Agent
  callButtonClicked: 'Call Button Clicked',
  messagesButtonClicked: 'Messages Button Clicked',

  // Property Post C2C
  commentSubmitted: 'Comment Submitted',
  sendContactSubmitted: 'Send Contact Submitted',
  createBuyRequestSucceeded: 'Create Buy Request Succeeded',
  loanReviewClicked: 'Loan Review Clicked',

  // Home
  chatButtonClicked: 'Chat Button Clicked',
  productsSearched: 'Products Searched',
  projectButtonClicked: 'Project Button Clicked',
  buyButtonClicked: 'Buy Button Clicked',
  agentButtonClicked: 'Agent Button Clicked',
  serviceButtonClicked: 'Service Button Clicked',
  topenerClicked: 'Topener Clicked',
  newsClicked: 'News Clicked',

  // Profile
  profileUpdated: 'Profile Updated',
  topenerUpgradeClicked: 'Topener Upgrade Clicked',
  topenerUpgradePayment: 'Topener Upgrade Payment',
  topenerUpgradeSuccedded: 'Topener Upgrade Succeeded',

  // Contact trading
  buyRequestDetailClicked: 'Buy Request Detail Clicked',

  // Create property post
  createPostClicked: 'Create Post Clicked',
  createPostStep1: 'Create Post - Product info - Step 1',
  createPostStep2: 'Create Post - Images - Step 2',
  createPostStep3: 'Create Post - Consultant Selected - Step 3',
  createPostStep4: 'Create Post - Owner information - Step 4',
  createPostSucceeded: 'Create Post - Succeeded',

  // Project
  apartmentsViewed: 'Apartments viewed',
  apartmentSelected: 'Order - Apartment Selected',
  // ---- Deposit
  projectOrderReviewInfo: 'Order - Review Info',
  projectOrderAgentSelected: 'Order - Agent Selected ',
  projectOrderBuyerConfirmed: 'Order - Buyer Confirmed',
  projectOrderPaymentConfirmed: 'Order - Payment Confirmed',
  projectOrderPaymentChose: 'Order - Payment Chose',
  projectOrderSucceeded: 'Order - Succeeded',
  // ---- Booking
  projectContactToBuyReviewInfo: 'Contact Request - Review Info',
  projectContactToBuySubmitRegister: 'Contact Request - Submit Register',
  projectContactToBuySucceeded: 'Contact Request - Succeeded',
};

export const SegmentScreenDisplay = {
  [ScreenIds.Home]: 'Home',
  [ScreenIds.SearchSuggest]: 'Search',
  [ScreenIds.Transaction]: 'Transaction',
  [ScreenIds.Notification]: 'Notification',
  [ScreenIds.Profile]: 'Profile',
  [ScreenIds.Login]: 'Login',
  [ScreenIds.Signup]: 'Register',
  [ScreenIds.MessageNotification]: 'Chat',

  [ScreenIds.ViewPropertyPost]: 'Product',
  [ScreenIds.ContactToAdvice]: 'Consultant',
  [ScreenIds.ProjectDetail]: 'Project details',
  [ScreenIds.SlotSelection]: 'Apartments list',
  [ScreenIds.ConfirmProperty]: 'Order - Review Info - Step 2',
  [ScreenIds.SellAgentList]: 'Order - Agent Selected - Step 3',
  [ScreenIds.ConfirmTransaction]: 'Order - Buyer Confirmed - Step 4',
  [ScreenIds.SelectPaymentMethod]: 'Order - Payment Confirmed - Step 5',
  [ScreenIds.PaymentInfo]: 'Order - Successful - Step 6',

  [ScreenIds.ContactToBuy]: 'Send Contact',

  [ScreenIds.ManageContactAdvice]: 'Consultant Request',
  [ScreenIds.ManagePayment]: 'Payment management',

  [ScreenIds.ManageContactList]: 'Contact trading',
  [ScreenIds.Transaction]: 'Transaction',
  [ScreenIds.CreateUpdateProfile]: 'Update user profile',
  [ScreenIds.UpdateAgentProfile]: 'Update Topener profile',
  [ScreenIds.ProjectDelivered]: 'Assigned project',
  [ScreenIds.YourPropertyPost]: 'My post',
  [ScreenIds.PropertyPostSaved]: 'Saved post',
  [ScreenIds.PropertyPostTracking]: 'Followed post',
  [ScreenIds.SuggestionPost]: 'Suggested post',
};

export const Category = {
  buy: 'buy',
  rent: 'rent',
  profile: 'profile',
  project: 'project',
  product: 'product',
  send: 'send',
  received: 'received',
  home: 'home',
  createPostStep1: 'create post - step 1',
  createPostStep2: 'create post - step 2',
  createPostStep3: 'create post - step 3',
};

export const ClickLocation = {
  home: 'Home',
  productListPage: 'Products List Page',
  productPage: 'Product page',
  readyForSale: 'Ready for sale',
  myPost: 'My post',
  savedPost: 'Saved post',
  followedPost: 'Followed post',
  suggestedPost: 'Suggested post',
  buyRequestPage: 'Buy request page',
  product: 'Product',
  postPage: 'Post page',
};

const AppsFlyerPlugin = new AppsflyerPlugin();

const segmentClient = createClient({
  writeKey: getConfigs().segment.key,
  trackAppLifecycleEvents: true,
  debug: false,
});

segmentClient.add({plugin: AppsFlyerPlugin});

const WithSegment = WrappedComponent => {
  useMount(() => {
    if (segmentClient) {
      logService.log('Segment is ready');
    } else {
      logService.error('Something went wrong with Segment');
    }
  });

  return (
    <AnalyticsProvider client={segmentClient}>
      <WrappedComponent />
    </AnalyticsProvider>
  );
};

export default WithSegment;
