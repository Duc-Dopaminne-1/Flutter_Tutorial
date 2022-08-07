import isEmpty from 'lodash/isEmpty';
import {useContext} from 'react';

import {
  PaymentMethod,
  PaymentUnit,
  useGetTransactionPaymentMethodConfigsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {FETCH_POLICY} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import ArrayUtils from '../../../utils/ArrayUtils';

const mapPaymentConfigsToUI = (rawData: Array, fundAccounts: Array, paymentUnits: Array) => {
  if (ArrayUtils.hasArrayData(rawData)) {
    const resultMapping = rawData?.map(item => {
      let formatDataItem = {};
      const common = {
        id: item?.paymentMethod,
        paymentMethod: item?.paymentMethod,
        isActive: item?.isActive,
        checked: false,
        paymentMethodOrder: item?.paymentMethodOrder,
      };

      if (item?.paymentMethod === PaymentMethod.Cash) {
        let availableFundAccounts = [];
        if (
          ArrayUtils.hasArrayData(fundAccounts) &&
          ArrayUtils.hasArrayData(item?.transactionPaymentUnitDtos)
        ) {
          availableFundAccounts = fundAccounts.filter(a =>
            item?.transactionPaymentUnitDtos?.some(
              b => b?.paymentUnitCode === a.fundAccountCode && b?.isActive,
            ),
          );
        }
        formatDataItem = {
          title: translate('common.cash'),
          description: translate('transaction.cashTransferDescription'),
          transactionPaymentUnitDtos: availableFundAccounts,
        };
      } else if (item?.paymentMethod === PaymentMethod.Banktransfer) {
        let availableBankUnits = [];
        if (ArrayUtils.hasArrayData(item?.transactionPaymentUnitDtos)) {
          availableBankUnits = item?.transactionPaymentUnitDtos
            ?.filter(e => e?.isActive)
            ?.map(p => {
              const findItem = paymentUnits.find(f => f?.paymentUnitCode === p?.paymentUnitCode);
              const isBidv = String(findItem?.paymentUnitName).toUpperCase() === PaymentUnit.Bidv;
              return {
                id: p?.paymentUnitCode,
                paymentUnit: isBidv ? PaymentUnit.Bidv : null,
                image: isBidv ? IMAGES.LOGO_BIDV : null,
                checked: isBidv,
              };
            });
        }
        formatDataItem = {
          title: translate('common.bankTransfer'),
          description: translate('transaction.nationalBankTransferDescription'),
          transactionPaymentUnitDtos: availableBankUnits,
        };
      } else {
        let availablePaymentUnits = [];
        if (
          ArrayUtils.hasArrayData(item?.transactionPaymentUnitDtos) &&
          ArrayUtils.hasArrayData(paymentUnits)
        ) {
          availablePaymentUnits = item?.transactionPaymentUnitDtos
            ?.filter(e => e?.isActive)
            ?.map(p => {
              const findItem = paymentUnits.find(f => f?.paymentUnitCode === p?.paymentUnitCode);
              return {
                id: p?.transactionPaymentUnitId,
                isActive: p?.isActive,
                paymentUnit: !isEmpty(findItem?.paymentUnitName)
                  ? String(findItem?.paymentUnitName).toUpperCase()
                  : null,
                paymentMethod: p?.paymentMethod,
              };
            });
        }
        formatDataItem = {
          title: translate('common.payWithVNPay'),
          description: translate('transaction.vnpayTransferDescription'),
          transactionPaymentUnitDtos: availablePaymentUnits,
        };
      }
      return {...common, ...formatDataItem};
    });

    return resultMapping;
  }

  return [];
};

const useGetTransactionPaymentConfigs = ({onSuccess}) => {
  const {getMasterData} = useContext(AppContext);
  const {fundAccounts, paymentUnits} = getMasterData();

  const onSuccessGetConfigs = data => {
    if (!data) return;
    const dataMappingConfigs = mapPaymentConfigsToUI(
      data?.edges,
      fundAccounts?.edges,
      paymentUnits?.edges,
    );

    onSuccess && onSuccess(dataMappingConfigs);
  };

  const {startApi: getPaymentConfigsQuery, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetTransactionPaymentMethodConfigsLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'transactionPaymentMethodConfigs',
    onSuccess: onSuccessGetConfigs,
    showSpinner: false,
  });

  const getPaymentConfigsByTransaction = ({transactionType}) => {
    getPaymentConfigsQuery({variables: {where: {transactionType, isActive: true}}});
  };

  return {getPaymentConfigsByTransaction, loading};
};

export {mapPaymentConfigsToUI, useGetTransactionPaymentConfigs};
