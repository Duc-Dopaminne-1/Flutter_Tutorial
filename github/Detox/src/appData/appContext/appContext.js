import {createContext} from 'react';

import {TOAST_MESSAGE_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {Props as ConfirmDialogProps} from '../../components/ConfirmDialog';

type Props = {
  isLoggedIn: Boolean,
  showAppSpinner: () => {},
  showMessageAlert: (title: String, message: String) => {},
  showToastInfo: (messageType: String, message: String, title: String) => {},
  showErrorAlert: (message: String, onOkHandler?: () => {}) => {},
  showAppModal: (props: ConfirmDialogProps) => {},
  setIsLoggedIn: (isLoggedIn: Boolean) => {},
  contactTradingB2CNotifications: [
    {
      id: String,
      message: String,
    },
  ],
  readContactTradingB2CNotification: (id: string) => {},
  receiveContactTradingB2CNotification: ({id: string, message: string}) => {},
};

export const initUserInfo = {
  firstName: '',
  lastName: '',
  userName: '',
  phoneNumber: '',
  email: '',
  dob: '',
  gender: '',
  userId: '',
  pushNotificationId: '',
  profilePhoto: '',
  updatedDatetime: '',
  createdDatetime: '',
};

export const initialState: Props = {
  appSpinner: {
    spinning: false,
    text: translate(STRINGS.LOADING),
  },
  appModal: {
    isVisible: false,
    title: '',
    message: '',
  },
  showToastInfo: {
    messageType: TOAST_MESSAGE_TYPE.success,
    message: '',
    title: '',
  },
  isOnline: false,
  firstLoginEver: false,
  isAgent: false,
  masterData: {},
  unReadNotification: 0,
  userInfo: initUserInfo,
  isAppLoaded: false,
  isLoggedIn: false,
  summaryNoti: {},
  contactTradingB2CNotifications: [],
};

export const AppContext = createContext(initialState);
