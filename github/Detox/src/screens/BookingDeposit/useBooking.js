import React, {createContext, useState} from 'react';
import {useSelector} from 'react-redux';

import {getAppLanguage} from '../../appData/appSettings/selectors';
import {getLocale} from '../../assets/localize';

type Props = {
  registerNewTransactionNotify: (props: {id: String, handler: () => {}}) => {},
  removeNewTransactionNotify: (props: {id: String}) => {},
  sendNotifyNewTransaction: () => {},
};

const initialState: Props = {
  locale: 'vn',
  // propertyPostId: '',
  // projectId: '',
  // saleAgentId: '',
  paymentMethod: '',
  paymentTransactionInfo: '',
  isChangingPaymentMethod: false,
  isBuyer: false,
  customerFullName: '',
  customerPhone: '',
  customerEmail: '',
  customerNationalId: '',
  customerNationalIdIssueDate: '',
  customerNationalIdIssuePlace: '',
  permanentAddress: '',
  nationalIdType: '',
  customerGender: '',
  customerBirthDay: '',
  customerContactAddress: '',
  propertyPost: {},
  saleAgentInfo: {},
  consultantInfo: {},
  project: {},
  paymentResult: {},
  isLoggedInUserSaleAgent: false,
  originTransaction: null,
  fundAccountId: '',
};

const intialUpdateState = {
  projectDetail: false,
};

const BookingContext = createContext(initialState);
const BookingProvider = ({children}) => {
  const appLanguage = useSelector(getAppLanguage);
  const languageCode = getLocale(appLanguage);
  const [state, setState] = useState({...initialState, locale: languageCode});
  const [needUpdateState, setNeedUpdate] = useState(intialUpdateState);
  const [newTransactionNotifies] = useState([]);

  const resetState = () => {
    setState({...initialState, locale: languageCode});
  };

  const setConfirm = confirm => {
    setState(...state, ...confirm);
  };

  const setSlotSelection = slotSection => {
    setState({
      ...state,
      saleSeasonId: slotSection.saleSeasonId,
      propertyPost: slotSection.propertyPost,
    });
  };

  const setPropertyPost = propertyPost => {
    setState({
      ...state,
      propertyPost: propertyPost,
    });
  };

  const setConsultantInfo = consultantInfo => {
    setState({
      ...state,
      consultantInfo: consultantInfo,
    });
  };

  const setAgent = agent => {
    setState({
      ...state,
      saleAgentInfo: agent,
    });
  };

  const setProject = project => {
    setState({
      ...initialState,
      project: project,
    });
  };

  const setPaymentResult = paymentResult => {
    setState({...state, paymentResult});
  };

  const setIsLoggedInUserSaleAgent = isLoggedInUserSaleAgent => {
    setState({...state, isLoggedInUserSaleAgent});
  };

  const setStateMoveDeposit = data => {
    setState({
      ...state,
      ...data.other,
      project: data.project,
    });
  };

  const setTransactionMode = newMode => {
    setState({
      ...state,
      project: {
        ...state.project,
        projectStatus: newMode,
      },
    });
  };

  const setUpdateProjectDetail = value => {
    setNeedUpdate({...needUpdateState, projectDetail: value});
  };

  const registerNewTransactionNotify = ({id, handler}) => {
    newTransactionNotifies.push({id, handler});
  };

  const removeNewTransactionNotify = ({id}) => {
    const index = newTransactionNotifies.findIndex(element => element.id === id);
    newTransactionNotifies.splice(index, 1);
  };

  const sendNotifyNewTransaction = () => {
    newTransactionNotifies.forEach(element => element.handler());
  };

  const resetCustomerDepositInfo = () => {
    setState({
      ...state,
      isBuyer: false,
      customerFullName: '',
      customerPhone: '',
      customerEmail: '',
      customerNationalId: '',
      customerNationalIdIssueDate: '',
      customerNationalIdIssuePlace: '',
      permanentAddress: '',
      customerContactAddress: '',
    });
  };

  const value: Props = {
    state,
    needUpdateState,
    setState,
    resetState,
    setConfirm,
    setProject,
    setSlotSelection,
    setAgent,
    setPropertyPost,
    setConsultantInfo,
    setPaymentResult,
    setIsLoggedInUserSaleAgent,
    setStateMoveDeposit,
    setTransactionMode,
    setUpdateProjectDetail,
    registerNewTransactionNotify,
    removeNewTransactionNotify,
    sendNotifyNewTransaction,
    resetCustomerDepositInfo,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export {BookingContext, BookingProvider};
