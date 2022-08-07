import React, {Fragment, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {SupportRequestContactTradingDto} from '../../../../api/graphql/generated/graphql';
import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomTabView, {TAB_TYPE} from '../../../../components/CustomTabView';
import TextView from '../../../../components/TextView';
import ArrayUtils from '../../../../utils/ArrayUtils';
import {SupportRequestList} from '../../type';

const styles = StyleSheet.create({
  // Text
  sectionTitle: {
    fontSize: 20,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
  },
  sendRequestText: {
    ...FONTS.bold,
    ...FONTS.fontSize12,
    color: COLORS.PRIMARY_A100,
  },

  // containers
  container: {
    marginTop: 8,
    width: '100%',
    ...METRICS.horizontalPadding,
    paddingVertical: 12,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  serviceInfoContainer: {
    borderColor: COLORS.GREY_F0,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: SIZES.BORDER_RADIUS_8,
    width: '100%',
    padding: 12,
  },
  serviceItemContainer: {
    paddingVertical: 16,
  },
  sendRequestBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  separator: {height: 1, width: '100%', backgroundColor: COLORS.GREY_F0},
});

const ITEM_HEIGHT_COLLAPSE = 63;
const ITEM_HEIGHT_EXPAND = 160;
const TAB_BAR_HEIGHT = 50;

const routeKey = {
  transaction: 'transaction',
  financial: 'financial',
};

const routeTitle = {
  transaction: translate('contactTrading.transactionSupport'),
  financial: translate('contactTrading.financial'),
};

const tabs = [
  {
    key: routeKey.transaction,
    title: routeTitle.transaction,
  },
  {
    key: routeKey.financial,
    title: routeTitle.financial,
  },
];

const mapRequests = (requests: Array<SupportRequestContactTradingDto>) => {
  if (!requests || requests?.length === 0) {
    return [];
  }
  return {
    transactionServices: requests.filter(
      e => e.businessCategoryTypeName === translate('contactTrading.transactionSupport'),
    ),
    financialServices: requests.filter(
      e => e.businessCategoryTypeName === translate('contactTrading.financial'),
    ),
  };
};

// calculate list height based on list's data
const getListHeight = (list1Data, list2Data) => {
  if (!list1Data && !list2Data) {
    return 0;
  }

  const list1ItemHeight = list1Data
    .map(e => (e.supportRequestId ? ITEM_HEIGHT_EXPAND : ITEM_HEIGHT_COLLAPSE))
    .reduce((a, b) => a + b, 0);

  const list2ItemHeight = list2Data
    .map(e => (e.supportRequestId ? ITEM_HEIGHT_EXPAND : ITEM_HEIGHT_COLLAPSE))
    .reduce((a, b) => a + b, 0);

  // Get the height of the longest list
  return Math.max(list1ItemHeight, list2ItemHeight);
};

const ServiceItem = ({
  supportRequestId,
  supportRequestCode,
  supportRequestStatusDescription,
  assigneeFullName,
  requestTypeDescription,
  onPressSendRequest,
  requestTypeId,
  disableSendRequest,
}) => {
  const onRequestingService = () => {
    onPressSendRequest && onPressSendRequest(requestTypeDescription, requestTypeId);
  };

  const disableStyle = disableSendRequest && {opacity: 0.3};

  if (supportRequestId) {
    // Item height = 160
    return (
      <View style={METRICS.verticalPadding}>
        <Text style={commonStyles.blackText14}>{requestTypeDescription}</Text>
        <View style={commonStyles.separatorRow8} />
        <View style={styles.serviceInfoContainer}>
          <TextView
            title={`${translate(STRINGS.REQUEST_CODE)}:`}
            customRightComponent={
              <View style={[HELPERS.fillRow, HELPERS.mainEnd]}>
                <Text style={commonStyles.blackText14}>{supportRequestCode}</Text>
              </View>
            }
          />
          <View style={commonStyles.separatorRow8} />
          <TextView
            title={`${translate(STRINGS.STATUS)}:`}
            customRightComponent={
              <View style={[HELPERS.fillRow, HELPERS.mainEnd]}>
                <Text style={commonStyles.blackText14}>{supportRequestStatusDescription}</Text>
              </View>
            }
          />
          <View style={commonStyles.separatorRow8} />
          <TextView
            title={`${translate('contactTrading.supportStaff')}:`}
            customRightComponent={
              <View style={[HELPERS.fillRow, HELPERS.mainEnd]}>
                <Text style={commonStyles.blackText14}>{assigneeFullName}</Text>
              </View>
            }
          />
        </View>
      </View>
    );
  }
  return (
    // Item height = 63
    <TextView
      containerStyle={styles.serviceItemContainer}
      title={requestTypeDescription}
      titleStyle={commonStyles.blackText14}
      customRightComponent={
        <View style={[HELPERS.fillRow, HELPERS.mainEnd]}>
          <TouchableOpacity
            style={[styles.sendRequestBtn, disableStyle]}
            onPress={onRequestingService}
            disabled={disableSendRequest}>
            <Text style={styles.sendRequestText}>{translate('contactTrading.sendRequest')}</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

const renderScene = ({
  route,
  supportRequests,
  onChangeHeight,
  onPressSendRequest,
  disableSendRequest,
}: {
  supportRequests: SupportRequestList,
}) => {
  const onTransactionTab = route.key === routeKey.transaction;

  //TODO: integreate contact services
  const listData = onTransactionTab
    ? supportRequests.transactionServices
    : supportRequests.financialServices;

  const onListRendered = event => {
    const onTabIndex = onTransactionTab ? 0 : 1;
    onChangeHeight(onTabIndex, event.nativeEvent.layout.height);
  };

  return (
    <View onLayout={onListRendered}>
      {listData.map((item, index) => (
        <Fragment key={index}>
          <ServiceItem
            key={index}
            {...item}
            disableSendRequest={disableSendRequest}
            onPressSendRequest={onPressSendRequest}
          />
          {index !== listData.length - 1 && <View style={styles.separator} />}
        </Fragment>
      ))}
    </View>
  );
};

const ServicesView = ({
  hide,
  supportRequests,
  onPressSendServiceRequest,
  disableSendRequest,
}: {
  hide: Boolean,
  supportRequests: SupportRequestContactTradingDto,
  onPressSendServiceRequest: Function,
}) => {
  const [listState, setListState] = useState({
    list1Height: 0,
    list2Height: 0,
    tabIndexOnFocus: 0,
  });

  const mappedRequests = mapRequests(supportRequests);

  const onChangeHeight = (listIndex, height = 0) => {
    if (listIndex === 0) {
      setListState({...listState, list1Height: height});
    } else {
      setListState({...listState, list2Height: height});
    }
  };

  const onChangeTab = ({index}) => {
    setListState({...listState, tabIndexOnFocus: index});
  };

  const listContainerHeight =
    TAB_BAR_HEIGHT +
    getListHeight(mappedRequests.transactionServices, mappedRequests.financialServices);

  if (hide || !ArrayUtils.hasArrayData(supportRequests)) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{translate('home.plusService.services')}</Text>
      <View style={{height: listContainerHeight}}>
        <CustomTabView
          routes={tabs}
          renderScene={({route}) =>
            renderScene({
              onChangeHeight,
              supportRequests: mappedRequests,
              route,
              onPressSendRequest: onPressSendServiceRequest,
              disableSendRequest: disableSendRequest,
            })
          }
          type={TAB_TYPE.PRIMARY_ORANGE}
          onIndexChange={onChangeTab}
          tabBarStyle={[METRICS.resetMargin, METRICS.smallMarginTop]}
          isLazy
        />
      </View>
    </View>
  );
};

export default ServicesView;
