import React, {useContext, useEffect, useState} from 'react';
import {View} from 'react-native';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {BUY_REQUEST_TYPE, CONSTANTS, MAX_LENGTH} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomTabView, {TAB_TYPE} from '../../../components/CustomTabView';
import {NewPostStyles} from '../../ManagePost/NewPost/NewPostComponents/NewPostConstant';
import SearchHeader from '../../Search/components/SearchHeader';
import BuyRequestUtil from '../BuyRequestUtil';
import RequestListView from './ManageBuyRequestComponents/RequestListView';

const routes = [
  {key: BUY_REQUEST_TYPE.SENT, title: translate(STRINGS.SENT)},
  {key: BUY_REQUEST_TYPE.RECEIVED, title: translate(STRINGS.RECEIVED)},
];

const ManageBuyRequestC2CScreen = ({
  filterSentData,
  onChangeTab,
  filterReceivedData,
  showFilter = () => {},
  onKeywordChange,
}) => {
  const {getMasterData} = useContext(AppContext);
  const masterData = getMasterData();
  const [isSending, setIsSending] = useState(true);
  const [requestParams, setRequestParams] = useState(
    BuyRequestUtil.filterDataToQueryParams({filterData: filterSentData}),
  );

  const [requestReceivedParams, setRequestReceivedParams] = useState(
    BuyRequestUtil.filterDataToQueryParams({filterData: filterReceivedData}),
  );

  const onIndexChange = ({key}) => {
    setIsSending(key === BUY_REQUEST_TYPE.SENT);
    onChangeTab(key === BUY_REQUEST_TYPE.SENT ? 0 : 1);
  };

  const getQuerySettingsByRoute = route => {
    const sentRequestInput = {
      where: {...requestParams},
      order_by: {
        createdDatetime: 'DESC',
      },
    };

    const receivedRequestInput = {
      where: {...requestReceivedParams},
      order_by: {
        updatedDatetime: 'DESC',
      },
    };

    if (filterSentData.keywords) {
      sentRequestInput.keywords = filterSentData.keywords;
    }
    if (filterReceivedData.keywords) {
      receivedRequestInput.keywords = filterReceivedData.keywords;
    }

    if (route.key === BUY_REQUEST_TYPE.SENT) {
      return sentRequestInput;
    }
    return receivedRequestInput;
  };

  useEffect(() => {
    const newQuery = BuyRequestUtil.filterDataToQueryParams({filterData: filterSentData});
    setRequestParams(newQuery);
  }, [filterSentData]);

  useEffect(() => {
    const newReceivedQuery = BuyRequestUtil.filterDataToQueryParams({
      filterData: filterReceivedData,
    });
    setRequestReceivedParams(newReceivedQuery);
  }, [filterReceivedData]);

  const renderScene = ({route}) => {
    const isSentType = route.key === BUY_REQUEST_TYPE.SENT;
    const filter = getQuerySettingsByRoute(route);
    return (
      <RequestListView
        masterData={masterData}
        filter={filter}
        isB2C={false}
        isSentType={isSentType}
      />
    );
  };

  return (
    <>
      <CustomTabView
        type={TAB_TYPE.PRIMARY_ORANGE}
        routes={routes}
        renderScene={renderScene}
        onIndexChange={onIndexChange}
        isLazy={true}
        childComponent={
          <>
            <View style={[commonStyles.headerBarShadowContainer, METRICS.smallNormalPaddingBottom]}>
              <View style={commonStyles.headerBarShadow} />
            </View>
            <View style={[NewPostStyles.viewWithIndex, METRICS.smallMarginBottom]}>
              <SearchHeader
                style={{height: CONSTANTS.INPUT_HEIGHT}}
                renderLeft={false}
                container={METRICS.resetPadding}
                placeholder={translate('contactTrading.searchPlaceHolder')}
                customStyle={commonStyles.inputSearch}
                onFilterPress={showFilter}
                onChangeKeyword={onKeywordChange}
                maxLength={MAX_LENGTH.INPUT_50}
                value={isSending ? filterSentData?.keywords : filterReceivedData?.keywords}
                delayTimeout={1000}
              />
            </View>
          </>
        }
      />
    </>
  );
};

export default ManageBuyRequestC2CScreen;
