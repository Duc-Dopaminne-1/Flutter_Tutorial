import {useContext, useRef, useState} from 'react';

import {
  useCreateTopenerBankAccountFoMutation,
  useDeleteTopenerBankAccountFoMutation,
  useGetBanksLazyQuery,
  useGetTopenerBankAccountsByCurrentUserFoLazyQuery,
  useUpdateTopenerBankAccountFoMutation,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../appData/appContext/appContext';
import {FETCH_POLICY} from '../assets/constants';
import {translate} from '../assets/localize';
import {Message} from '../assets/localize/message/Message';
import {STRINGS} from '../assets/localize/string';
import {useMount} from '../screens/commonHooks';
import ValidateInput from '../utils/ValidateInput';
import useMergeState from './useMergeState';

const initialState = {
  bankAccountBranch: '',
  bankAccountHolderName: '',
  bankAccountNumber: '',
  bankId: '',
  isDefault: true,
  recordVersion: '',
  topenerBankAccountId: '',
  isUpdate: false,
  errors: null,
};

export const useTopenerBank = () => {
  const modalRef = useRef(null);
  const [listBanks, setListBanks] = useState([]);
  const {showAppModal, showMessageAlert, showToastInfo} = useContext(AppContext);
  const [state, setState] = useMergeState(initialState);
  const [listTopenerBanks, setListTopenerBanks] = useState([]);

  const {startApi: getBanks} = useGraphqlApiLazy({
    graphqlApiLazy: useGetBanksLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'banks.edges',
    onSuccess: data => {
      const banks = data?.map(item => ({
        ...item,
        bankFullName: `${item?.bankName} (${item?.bankCode})`,
      }));
      setListBanks(banks);
    },
  });

  const {startApi: getTopenerBank} = useGraphqlApiLazy({
    graphqlApiLazy: useGetTopenerBankAccountsByCurrentUserFoLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getTopenerBankAccountsByCurrentUserFO.edges',
    onSuccess: response => {
      const dataMapper = response?.map(e => {
        let bankInfo = '';
        const bankMatch = listBanks?.find(bank => bank.bankId === e.bankId);
        if (bankMatch) {
          bankInfo = {
            bankName: bankMatch.bankName,
            bankCode: bankMatch.bankCode,
          };
        }
        return {
          ...e,
          ...bankInfo,
        };
      });
      setListTopenerBanks(dataMapper);
    },
  });

  const {startApi: createTopenerBank} = useGraphqlApiLazy({
    graphqlApiLazy: useCreateTopenerBankAccountFoMutation,
    showSpinner: true,
    onSuccess: response => {
      onSuccessCreateAndUpdateBank(response);
    },
  });
  const {startApi: deleteTopenerBank} = useGraphqlApiLazy({
    graphqlApiLazy: useDeleteTopenerBankAccountFoMutation,
    showSpinner: true,
    onSuccess: () => {
      const newList = listTopenerBanks.filter(
        el => el.topenerBankAccountId !== state.topenerBankAccountId,
      );
      setListTopenerBanks(newList);
      showToastInfo({
        title: translate(STRINGS.DEFAULT_MODAL_TITLE),
        message: translate('agent.bank.messages.deleteSuccess'),
      });
    },
  });

  const {startApi: updateTopenerBank} = useGraphqlApiLazy({
    graphqlApiLazy: useUpdateTopenerBankAccountFoMutation,
    showSpinner: true,
    onSuccess: response => {
      onSuccessCreateAndUpdateBank(response, true);
    },
  });

  const createBank = () => {
    const errors = errorsForm();
    if (errors) {
      setState({errors});
      return;
    }
    const {bankAccountBranch, bankAccountHolderName, bankAccountNumber, bankId, isDefault} = state;
    createTopenerBank({
      variables: {
        input: {
          bankAccountBranch,
          bankAccountHolderName,
          bankAccountNumber,
          bankId,
          isDefault,
        },
      },
    });
  };

  const deleteBank = item => {
    const {recordVersion, topenerBankAccountId, isDefault} = item;
    if (isDefault && listTopenerBanks.length > 1) {
      showMessageAlert(
        translate('agent.bank.deleteInfoDefault'),
        translate('agent.bank.subDeleteInfoDefault'),
      );
    } else {
      showAppModal({
        isVisible: true,
        title: translate('agent.bank.deleteInfo'),
        message: translate('agent.bank.deleteInfoBank'),
        cancelText: translate('agent.bank.button.cancel'),
        okText: translate('agent.bank.button.continue'),
        onOkHandler: () => {
          setState({topenerBankAccountId});
          deleteTopenerBank({
            variables: {
              input: {
                recordVersion,
                topenerBankAccountId,
              },
            },
          });
        },
      });
    }
  };

  const updateBank = () => {
    const errors = errorsForm();
    if (errors) {
      setState({errors});
      return;
    }
    const {
      bankAccountBranch,
      bankAccountHolderName,
      bankAccountNumber,
      bankId,
      isDefault,
      recordVersion,
      topenerBankAccountId,
    } = state;
    updateTopenerBank({
      variables: {
        input: {
          bankAccountBranch,
          bankAccountHolderName,
          bankAccountNumber,
          bankId,
          isDefault,
          recordVersion,
          topenerBankAccountId,
        },
      },
    });
  };

  const onChangeDefaultBank = item => {
    const {
      bankAccountBranch,
      bankAccountHolderName,
      bankAccountNumber,
      bankId,
      isDefault,
      recordVersion,
      topenerBankAccountId,
    } = item;
    if (!isDefault) {
      updateTopenerBank({
        variables: {
          input: {
            bankAccountBranch,
            bankAccountHolderName,
            bankAccountNumber,
            bankId,
            isDefault: true,
            recordVersion,
            topenerBankAccountId,
          },
        },
      });
    }
  };

  const onSuccessCreateAndUpdateBank = (response, isUpdate = false) => {
    const {errorCode, errorMessage, errorMessageCode} = isUpdate
      ? response.updateTopenerBankAccountFO
      : response.createTopenerBankAccountFO;
    if (errorCode) {
      if (errorMessageCode === Message.FO_TOPENER_BANK_ACCOUNT_ERR_001) {
        setState({errors: {...state.errors, bankAccountNumber: errorMessage}});
      } else {
        showMessageAlert(translate('agent.bank.deleteInfoDefault'), errorMessage);
      }
    } else {
      let message = translate('agent.bank.messages.createSuccess');
      if (isUpdate) {
        message = translate('agent.bank.messages.updateSuccess');
      }
      showToastInfo({
        title: translate(STRINGS.DEFAULT_MODAL_TITLE),
        message,
      });
      getTopenerBank();
      closeModal();
    }
  };

  useMount(() => {
    fetchData();
  });

  const fetchData = () => {
    Promise.all([
      getBanks({variables: {pageSize: 100}}),
      getTopenerBank({variables: {page: 1, pageSize: 5}}),
    ]);
  };

  const openModal = item => {
    if (item) {
      setState({
        ...item,
        isUpdate: true,
        errors: null,
      });
    } else {
      setState(initialState);
    }
    modalRef?.current?.open();
  };

  const closeModal = () => {
    modalRef?.current?.close();
  };

  const onChangeData = (value, key) => {
    setState({
      [key]: value,
      errors: null,
    });
  };

  const errorsForm = () => {
    const errBankId = ValidateInput.checkRequiredField(state.bankId);
    const errBankAccountBranch = ValidateInput.checkRequiredField(state.bankAccountBranch);
    const errBankAccountNumber = ValidateInput.validateAccountNumber(state.bankAccountNumber);
    const errBankAccountHolderName = ValidateInput.checkRequiredField(state.bankAccountHolderName);
    const errors = {
      bankId: translate(errBankId),
      bankAccountBranch: errBankAccountBranch,
      bankAccountNumber: errBankAccountNumber,
      bankAccountHolderName: errBankAccountHolderName,
    };
    const isError = Object.values(errors).some(e => e);
    if (isError) {
      return errors;
    }
    return isError;
  };

  return {
    modalRef,
    listBanks: listBanks ?? [],
    state,
    listTopenerBanks,
    openModal,
    onChangeData,
    createBank,
    deleteBank,
    updateBank,
    onChangeDefaultBank,
  };
};
