import {
  APP_SCREEN,
  DRAWER,
  FORGOT_PASSWORD,
  LOGIN,
  SIGN_UP,
  LOADING_PAGE,
  CUSTOM_POPUP,
  UPLOAD_COLLECTION,
  BOOKS,
  LIBRARY_FEED,
  EXPLORE,
  SHOP,
  TELEVISION,
  BOOK_READER,
  BOOK_INFO_DETAIL,
  TERMS_OF_SERVICE,
  COPYRIGHT,
  PROFILE,
  PROFILE_OTHERS,
  ADD_COMMENT,
  EDIT_PROFILE,
  FAVORITE,
  SEARCH,
  VIDEO_DETAIL,
  IMAGE_VIEWER,
  VIDEO_MEDIA_PLAYER,
  MUSIC_PLAYER,
  CHANNEL,
  MESSAGE,
  SELECT_USER_SCREEN,
  GROUP_SETTINGS,
  ABOUT,
  BLOG,
  BLOG_DETAIL,
  PRODUCT_DETAIL,
  CART_SCREEN,
  SUBSCRIPTION_SCREEN,
  SHIPPING_DETAILS,
  SHIPPING_TYPE,
  PAYMENT_DETAILS,
  REVIEW_ORDER,
  ORDERS,
  PRIVACY,
  BUY_COINS_SCREEN,
  PAYMENT,
} from '@constants/screenKeys';
import App from './App';
import Drawer from '@src/components/Drawer';
import { Navigation } from 'react-native-navigation';
import { Provider } from 'react-redux';
import store from '@redux/store';
import LoadingPage from '@src/components/LoadingPage';
import Books from './Home/Books';
import LibraryFeed from './Home/LibraryFeed';
import Explore from './Home/Explore';
import Shop from './Home/Shop';
import Television from './Home/Television';
import UploadCollection from './Profile/UploadCollection';
import Login from './Account/Login';
import SignUp from './Account/SignUp';
import ForgotPassword from './Account/ForgotPassword';
import TermsOfService from './Infomations/TermsOfService';
import Copyright from './Infomations/Copyright';
import BookReader from './BookReader';
import BookDetail from './Details/BookDetail';
import Profile from './Profile';
import AddComment from './AddComment';
import EditProfile from './Profile/EditProfile';
import Favorite from './Profile/EditProfile/Favorite';
import Search from './Home/Explore/Search';
import VideoDeital from './Details/VideoDetail';
import { VideoMediaPlayer } from '@src/screens/Player/VideoPlayer';
import { MusicPlayer } from './Player/MusicPlayer';
import Channel from './Chat/Channel';
import Message from './Chat/Message';
import SelectUserScreen from './Chat/SelectUser';
import About from './Infomations/About';
import Blog from './Blog';
import BlogDetail from './Details/BlogDetail';
import ProductDetail from './Details/ProductDetail';
import Cart from './Cart';
import ShippingDetails from './Order/ShippingDetails';
import ShippingType from './Order/ShippingType';
import PaymentDetails from './Order/PaymentDetails';
import ReviewOrder from './Order/ReviewOrder';
import Orders from './Order';
import Privacy from './Infomations/Privacy';
import ProfileOthers from './ProfileOthers';
import BuyCoins from './BuyCoins';
import SubscriptionScreen from './SubscriptionScreen';
import Payment from './Order/Payment';
import { CustomPopup } from '@src/components/CustomPopup';
import { ImageViewerCustom } from '@src/components/ImageViewer';
import GroupSettings from './Chat/Settings';

export const registerAllScreens = () => {
  Navigation.registerComponentWithRedux(APP_SCREEN, () => App, Provider, store);
  Navigation.registerComponentWithRedux(DRAWER, () => Drawer, Provider, store);
  Navigation.registerComponentWithRedux(LOADING_PAGE, () => LoadingPage, Provider, store);
  Navigation.registerComponentWithRedux(CUSTOM_POPUP, () => CustomPopup, Provider, store);

  Navigation.registerComponentWithRedux(LOGIN, () => Login, Provider, store);
  Navigation.registerComponentWithRedux(SIGN_UP, () => SignUp, Provider, store);
  Navigation.registerComponentWithRedux(FORGOT_PASSWORD, () => ForgotPassword, Provider, store);

  Navigation.registerComponentWithRedux(BOOKS, () => Books, Provider, store);
  Navigation.registerComponentWithRedux(TELEVISION, () => Television, Provider, store);
  Navigation.registerComponentWithRedux(LIBRARY_FEED, () => LibraryFeed, Provider, store);
  Navigation.registerComponentWithRedux(EXPLORE, () => Explore, Provider, store);
  Navigation.registerComponentWithRedux(SHOP, () => Shop, Provider, store);

  Navigation.registerComponentWithRedux(CART_SCREEN, () => Cart, Provider, store);
  Navigation.registerComponentWithRedux(PRODUCT_DETAIL, () => ProductDetail, Provider, store);
  Navigation.registerComponentWithRedux(UPLOAD_COLLECTION, () => UploadCollection, Provider, store);
  Navigation.registerComponentWithRedux(BOOK_INFO_DETAIL, () => BookDetail, Provider, store);

  Navigation.registerComponentWithRedux(ADD_COMMENT, () => AddComment, Provider, store);

  Navigation.registerComponentWithRedux(TERMS_OF_SERVICE, () => TermsOfService, Provider, store);
  Navigation.registerComponentWithRedux(PRIVACY, () => Privacy, Provider, store);
  Navigation.registerComponentWithRedux(COPYRIGHT, () => Copyright, Provider, store);
  Navigation.registerComponentWithRedux(ABOUT, () => About, Provider, store);

  Navigation.registerComponentWithRedux(PROFILE, () => Profile, Provider, store);
  Navigation.registerComponentWithRedux(PROFILE_OTHERS, () => ProfileOthers, Provider, store);
  Navigation.registerComponentWithRedux(EDIT_PROFILE, () => EditProfile, Provider, store);
  Navigation.registerComponentWithRedux(FAVORITE, () => Favorite, Provider, store);
  Navigation.registerComponentWithRedux(SEARCH, () => Search, Provider, store);

  Navigation.registerComponentWithRedux(VIDEO_DETAIL, () => VideoDeital, Provider, store);

  Navigation.registerComponentWithRedux(BOOK_READER, () => BookReader, Provider, store);

  Navigation.registerComponentWithRedux(IMAGE_VIEWER, () => ImageViewerCustom, Provider, store);
  Navigation.registerComponentWithRedux(VIDEO_MEDIA_PLAYER, () => VideoMediaPlayer, Provider, store);
  Navigation.registerComponentWithRedux(MUSIC_PLAYER, () => MusicPlayer, Provider, store);

  Navigation.registerComponentWithRedux(CHANNEL, () => Channel, Provider, store);
  Navigation.registerComponentWithRedux(MESSAGE, () => Message, Provider, store);
  Navigation.registerComponentWithRedux(SELECT_USER_SCREEN, () => SelectUserScreen, Provider, store);
  Navigation.registerComponentWithRedux(GROUP_SETTINGS, () => GroupSettings, Provider, store);

  Navigation.registerComponentWithRedux(BLOG, () => Blog, Provider, store);
  Navigation.registerComponentWithRedux(BLOG_DETAIL, () => BlogDetail, Provider, store);

  Navigation.registerComponentWithRedux(SHIPPING_DETAILS, () => ShippingDetails, Provider, store);
  Navigation.registerComponentWithRedux(SHIPPING_TYPE, () => ShippingType, Provider, store);
  Navigation.registerComponentWithRedux(PAYMENT_DETAILS, () => PaymentDetails, Provider, store);
  Navigation.registerComponentWithRedux(REVIEW_ORDER, () => ReviewOrder, Provider, store);
  Navigation.registerComponentWithRedux(ORDERS, () => Orders, Provider, store);
  Navigation.registerComponentWithRedux(PAYMENT, () => Payment, Provider, store);

  Navigation.registerComponentWithRedux(BUY_COINS_SCREEN, () => BuyCoins, Provider, store);

  Navigation.registerComponentWithRedux(SUBSCRIPTION_SCREEN, () => SubscriptionScreen, Provider, store);
};
