import React, {useEffect, useState} from 'react';

import {TRANSACTION_MODE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import ScrollViewRefresh from '../../../components/ScrollViewRefresh';
import {useMount} from '../../commonHooks';
import PropertyType from '../../ManagePost/PropertyType';
import {INITIAL_CONFIRM_PROPERTY_DATA} from './ConfirmPropertyConstants';
import ConfirmPropertyMainInfo from './ConfirmPropertyMainInfo';
import {useGetApiForConfirmProperty} from './useApiForConfirmProperty';
import useHandleDataConfirmProperty from './useHandleDataConfirmProperty';

const getScreenTitle = propertyType => {
  if (!propertyType) {
    return translate(STRINGS.DETAIL);
  }
  const screenTitle =
    propertyType === PropertyType.land
      ? translate(STRINGS.DETAIL_LAND)
      : translate(STRINGS.DETAIL_PROPERTY);
  return screenTitle;
};
const ViewPropertyScreen = ({route}) => {
  const {propertyPostId} = route?.params ?? {};
  const [data, setData] = useState(INITIAL_CONFIRM_PROPERTY_DATA);
  const [fisrtCall, setFirstCall] = useState(true);

  const {
    data: dataAPI,
    getPropertyForTransaction,
    loadingDetailProperty,
  } = useHandleDataConfirmProperty({
    propertyPostId,
    transactionMode: TRANSACTION_MODE.NOTHING,
  });

  const onSuccessCheckSaleAgent = isSaleAgent => {
    setData({...data, isSaleAgent});
  };

  const {getCheckIsSaleAgent, loadingIsSaleAgent} = useGetApiForConfirmProperty({
    propertyPostId,
    saleSeasonId: dataAPI?.saleSeasonId,
    onSuccessCheckSaleAgent,
  });

  useEffect(() => {
    if (dataAPI) {
      setData({...data, ...dataAPI});
      if (dataAPI.saleSeasonId && fisrtCall) {
        getCheckIsSaleAgent(propertyPostId, dataAPI.saleSeasonId);
        setFirstCall(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataAPI]);

  useMount(() => {
    getPropertyForTransaction({isShowSpinner: false});
  });

  const onRefresh = () => {
    getPropertyForTransaction({isShowSpinner: false});
  };

  return (
    <BaseScreen title={getScreenTitle(data.propertyType)}>
      <ScrollViewRefresh
        loading={loadingDetailProperty || loadingIsSaleAgent}
        onRefresh={onRefresh}
        showCenterText={!data.propertyType || !data.propertyCode || loadingIsSaleAgent}>
        <ConfirmPropertyMainInfo data={data} />
      </ScrollViewRefresh>
    </BaseScreen>
  );
};

export default ViewPropertyScreen;
