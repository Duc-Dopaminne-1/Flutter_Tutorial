import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {BUY_REQUEST_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {HELPERS} from '../../../assets/theme/helpers';
import CustomTabView, {TAB_TYPE} from '../../../components/CustomTabView';
import {useMount} from '../../commonHooks';
import BuyRequestUtil from '../BuyRequestUtil';
import useGetReceivedRequests from '../hooks/useGetReceivedRequests';
import RequestListView from './ManageBuyRequestComponents/RequestListView';

const styles = StyleSheet.create({
  contentContainer: {
    ...HELPERS.fill,
  },
});

const routes = [
  {key: BUY_REQUEST_TYPE.SENT, title: translate(STRINGS.SENT)},
  {key: BUY_REQUEST_TYPE.RECEIVED, title: translate(STRINGS.RECEIVED)},
];

const ManageBuyRequestB2CScreen = ({filterData}) => {
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();

  const [totalSentRequests, setTotalSentRequests] = useState(0);
  const [totalReceivedRequests, setTotalReceivedRequests] = useState(0);

  const [requestParams, setRequestParams] = useState(
    BuyRequestUtil.mapFilterDataToQueryParamsB2C(filterData),
  );

  const onSuccessGetReceivedRequests = response => {
    const receivedTotalCount = response?.totalCount ?? 0;
    setTotalReceivedRequests(receivedTotalCount);
  };
  const [getReceivedRequestsB2C] = useGetReceivedRequests({
    onSuccess: onSuccessGetReceivedRequests,
    showSpinner: false,
  });

  const renderSceneB2C = ({route}) => {
    const isSentType = route.key === BUY_REQUEST_TYPE.SENT;
    const filter = requestParams;
    const setTotalNumber = total => {
      if (isSentType) {
        setTotalSentRequests(total);
      } else {
        setTotalReceivedRequests(total);
      }
    };
    return (
      <RequestListView
        masterData={masterData}
        filter={filter}
        isB2C={true}
        isSentType={isSentType}
        onChangeTotal={total => setTotalNumber(total)}
      />
    );
  };

  useEffect(() => {
    let newQuery = {};
    newQuery = BuyRequestUtil.mapFilterDataToQueryParamsB2C(filterData);
    setRequestParams(newQuery);
  }, [filterData]);

  useMount(() => {
    getReceivedRequestsB2C();
  });

  return (
    <View style={styles.contentContainer}>
      <CustomTabView
        type={TAB_TYPE.BUTTONS}
        routes={routes}
        itemsCount={[totalSentRequests, totalReceivedRequests]}
        renderScene={renderSceneB2C}
        isLazy={true}
      />
    </View>
  );
};

export default ManageBuyRequestB2CScreen;
