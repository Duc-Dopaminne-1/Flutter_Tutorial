import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {View} from 'react-native';

import {
  useC2CContactTradingCreatedByAgentLazyQuery,
  useC2CContactTradingReceivedByAgentLazyQuery,
  useContactTradingB2CAssigneeByCurrentUserLazyQuery,
  useContactTradingB2CCreatedByCurrentUserLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {EMPTY_TYPE} from '../../../../assets/constants';
import {FONT_REGULAR} from '../../../../assets/fonts';
import {METRICS} from '../../../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../../../components/LazyList';
import {SCREEN_SIZE} from '../../../../utils/ImageUtil';
import MeasureUtils from '../../../../utils/MeasureUtils';
import ContactTradingView, {SentRequestItemB2C} from './ContactTradingView';

const RequestListView = ({filter, isB2C = true, isSentType = true, onChangeTotal, masterData}) => {
  const [shouldRefresh, setShouldRefresh] = useState(0);

  const getExtendC2C = isB2C ? null : {shouldRefresh: shouldRefresh};

  const setRefresh = () => {
    setShouldRefresh(shouldRefresh + 1);
  };
  // c2c
  const querySettingC2C = {
    queryParam: filter,
    useQuery: isSentType
      ? useC2CContactTradingCreatedByAgentLazyQuery
      : useC2CContactTradingReceivedByAgentLazyQuery,
    responseDataKey: isSentType
      ? 'c2cContactTradingCreatedByAgent'
      : 'c2cContactTradingReceivedByAgent',
  };

  // b2c
  const querySettingB2C = {
    queryParam: filter,
    useQuery: isSentType
      ? useContactTradingB2CCreatedByCurrentUserLazyQuery
      : useContactTradingB2CAssigneeByCurrentUserLazyQuery,
    responseDataKey: isSentType
      ? 'contactTradingB2CCreatedByCurrentUser'
      : 'contactTradingB2CAssigneeByCurrentUser',
  };

  const querySetting = isB2C ? querySettingB2C : querySettingC2C;

  const onDataChange = ({totalCount}) => {
    onChangeTotal && onChangeTotal(totalCount);
  };

  const ItemHeight = async item => {
    const customerNameSize = await MeasureUtils.measureTextSize({
      fontSize: 14,
      fontFamily: FONT_REGULAR,
      text: item?.customerFullName,
      width: ((SCREEN_SIZE.WIDTH - 64) * 2) / 3,
      lineInfoForLine: 2,
    });

    const requesterNameSize = await MeasureUtils.measureTextSize({
      fontSize: 14,
      fontFamily: FONT_REGULAR,
      text: item?.requesterFullName,
      width: ((SCREEN_SIZE.WIDTH - 64) * 2) / 3,
      lineInfoForLine: 2,
    });

    const interestedAreaSize = await MeasureUtils.measureTextSize({
      fontSize: 14,
      fontFamily: FONT_REGULAR,
      text: `${item?.districtName}, ${item?.cityName}`,
      width: ((SCREEN_SIZE.WIDTH - 64) * 2) / 3,
      lineInfoForLine: 1,
    });

    if (isB2C) {
      return 240;
    } else {
      if (isSentType) {
        return 199 + customerNameSize?.height + interestedAreaSize?.height;
      } else {
        return 170 + customerNameSize?.height + requesterNameSize?.height;
      }
    }
  };

  const extractArrayMapper = response => {
    const requestList = response[querySetting.responseDataKey]?.edges ?? [];
    if (!requestList && !Array.isArray(requestList)) {
      return [];
    }

    return requestList;
  };

  const renderItem = ({item}) => {
    if (isB2C) {
      return (
        <SentRequestItemB2C
          isSending={isSentType}
          masterData={masterData}
          isB2C={isB2C}
          contactTrading={item}
        />
      );
    }
    return (
      <ContactTradingView isSending={isSentType} contactTrading={item} onHandler={setRefresh} />
    );
  };

  return (
    <>
      <View style={METRICS.marginTop} />
      <LazyList
        {...getExtendC2C}
        renderItem={renderItem}
        useQuery={querySetting.useQuery}
        queryOptions={{
          variables: {
            ...querySetting.queryParam,
          },
        }}
        itemHeight={ItemHeight}
        uniqueKey={'contactTradingId'}
        extractArray={response => extractArrayMapper(response)}
        extractTotalCount={response => response[querySetting.responseDataKey]?.totalCount ?? 0}
        onDataChange={onDataChange}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
        emptyType={EMPTY_TYPE.BUY_REQUEST}
      />
    </>
  );
};

RequestListView.propTypes = {
  filter: PropTypes.object,
};

export default RequestListView;
