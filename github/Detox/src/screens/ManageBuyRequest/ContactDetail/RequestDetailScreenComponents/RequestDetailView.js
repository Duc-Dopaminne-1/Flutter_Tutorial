import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONTACT_STATUS_ID, CONTACT_TRADING_DEPOSIT_STATUS} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomButton from '../../../../components/Button/CustomButton';
import TimeLineList, {TimeLineType} from '../../../../components/List/TimeLineList';
import ScrollViewRefresh from '../../../../components/ScrollViewRefresh';
import TextView from '../../../../components/TextView';
import NumberUtils from '../../../../utils/NumberUtils';
import {DEPOSIT_STATUS_LINK_DESC} from '../../DetailRequestConstant';
import ContactList from './ContactList';
import CustomContactFooter from './CustomContactFooter';
import PropertyInfoView from './PropertyInfoView';
import RequestDetailBodyView from './RequestDetailBodyView';
import ServicesView from './ServicesView';

const styles = StyleSheet.create({
  timelineContainer: {
    ...METRICS.horizontalPadding,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingBottom: 12,
    paddingTop: 24,
  },
  statusTitle: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.TEXT_DARK_10,
  },
  detailText: {
    color: COLORS.PRIMARY_A100,
    ...FONTS.fontSize14,
    ...FONTS.regular,
  },
  timelineNodeContainer: {
    height: 48,
    flex: 1,
    paddingTop: 4,
  },
  timelineSectionContainer: {
    ...HELPERS.rowSpaceBetween,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  lastTimelineNode: {height: 24},
  contactListContainer: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    marginTop: 8,
  },
});

const timelineProps = {
  waiting: {
    type: TimeLineType.Waiting,
    iconStyle: {
      tintColor: COLORS.PRIMARY_A100,
    },
  },
  done: {
    type: TimeLineType.Done,
    iconSource: IMAGES.IC_TL_DONE_NEW,
  },
  inactive: {
    type: TimeLineType.InActive,
    iconStyle: {
      borderWidth: SIZES.BORDER_WIDTH_2,
    },
  },
  fail: {
    type: TimeLineType.Fail,
  },
};

export const TimelineTitleView = ({
  title,
  linkTitle = translate(STRINGS.DETAIL),
  linkTitleStyle,
  onPressLink = () => {},
  containerStyle,
  visibleLink,
  disabled = false,
  showArrow = true,
}) => {
  return (
    <View style={[styles.timelineNodeContainer, containerStyle]}>
      <TextView
        title={title}
        titleStyle={styles.statusTitle}
        containerStyle={styles.timelineSectionContainer}
        customRightComponent={
          visibleLink &&
          linkTitle && (
            <TouchableOpacity
              style={[HELPERS.row, HELPERS.mainEnd, HELPERS.fill]}
              disabled={disabled}
              onPress={onPressLink}>
              <Text numberOfLines={1} style={[styles.detailText, linkTitleStyle]}>
                {linkTitle}
              </Text>
              {showArrow && (
                <Image source={IMAGES.ARROW_RIGHT_LINEAR} style={METRICS.marginStart} />
              )}
            </TouchableOpacity>
          )
        }
      />
    </View>
  );
};

const getTimelineViews = ({
  data,
  onPressNegotiation,
  onPressDeposit,
  onPressComplete,
  onPressRejectReason,
}) => {
  const {contactTradingStatusId, negotiationPrice, deposit: {depositStatus = ''} = {}} = data ?? {};
  let stepWaiting = timelineProps.waiting;
  let stepConnected = timelineProps.inactive;
  let stepNegotiate = timelineProps.inactive;
  let stepDeposit = timelineProps.inactive;
  let stepComplete = timelineProps.inactive;

  // should show link titles
  let enabledConnected = false;
  let enabledNegotiation = false;
  let enabledDeposit = false;
  let enableComplete = false;

  // links' sub titles
  let connectLinkTitle = '';
  let depositLinkTitle = translate(STRINGS.DETAIL);

  switch (contactTradingStatusId) {
    case CONTACT_STATUS_ID.Waiting:
      stepWaiting = timelineProps.waiting;
      break;
    case CONTACT_STATUS_ID.Connected:
      stepWaiting = timelineProps.done;
      stepConnected = timelineProps.waiting;
      break;
    case CONTACT_STATUS_ID.Rejected:
      stepWaiting = timelineProps.done;
      stepConnected = timelineProps.fail;
      enabledConnected = true;
      connectLinkTitle = translate(STRINGS.REASON);
      break;
    case CONTACT_STATUS_ID.Negotiate:
      stepWaiting = timelineProps.done;
      stepConnected = timelineProps.done;
      stepNegotiate = timelineProps.waiting;
      enabledNegotiation = true;
      break;
    case CONTACT_STATUS_ID.Deposited:
      stepWaiting = timelineProps.done;
      stepConnected = timelineProps.done;
      stepNegotiate = timelineProps.done;
      enabledNegotiation = NumberUtils.isValidIntNumber(negotiationPrice);
      enabledDeposit = true;
      depositLinkTitle = DEPOSIT_STATUS_LINK_DESC[depositStatus];
      switch (depositStatus) {
        case CONTACT_TRADING_DEPOSIT_STATUS.signed:
          stepDeposit = timelineProps.done;
          stepComplete = timelineProps.waiting;
          break;
        case CONTACT_TRADING_DEPOSIT_STATUS.rejected:
          stepDeposit = timelineProps.fail;
          break;
        case CONTACT_TRADING_DEPOSIT_STATUS.accepted:
          stepDeposit = timelineProps.waiting;
          break;
        default:
          stepDeposit = timelineProps.waiting;
          break;
      }
      break;
    case CONTACT_STATUS_ID.Completed:
      stepWaiting = timelineProps.done;
      stepConnected = timelineProps.done;
      stepNegotiate = timelineProps.done;
      stepDeposit = timelineProps.done;
      stepComplete = timelineProps.done;

      enabledNegotiation = NumberUtils.isValidIntNumber(negotiationPrice);
      enabledDeposit = true;
      enableComplete = true;
      break;
  }

  return [
    {
      ...stepWaiting,
      view: <TimelineTitleView title={translate('contactTrading.status.waiting')} />,
    },
    {
      ...stepConnected,
      view: (
        <TimelineTitleView
          title={translate('contactTrading.status.connected')}
          linkTitle={connectLinkTitle}
          visibleLink={enabledConnected}
          onPressLink={onPressRejectReason}
        />
      ),
    },
    {
      ...stepNegotiate,
      view: (
        <TimelineTitleView
          linkTitle={translate(STRINGS.DETAIL)}
          title={translate('contactTrading.status.negotiate')}
          visibleLink={enabledNegotiation}
          onPressLink={onPressNegotiation}
        />
      ),
    },
    {
      ...stepDeposit,
      view: (
        <TimelineTitleView
          title={translate('contactTrading.status.deposit')}
          linkTitle={depositLinkTitle}
          visibleLink={enabledDeposit}
          onPressLink={onPressDeposit}
        />
      ),
    },
    {
      ...stepComplete,
      view: (
        <TimelineTitleView
          title={translate('contactTrading.status.complete')}
          linkTitle={translate(STRINGS.DETAIL)}
          containerStyle={styles.lastTimelineNode}
          visibleLink={enableComplete}
          onPressLink={onPressComplete}
        />
      ),
    },
  ];
};

const RequestDetailView = ({
  state,
  supportRequests,
  loading,
  isSending,
  isB2C,
  onRefreshGetDetail,
  onCompleteRequest,
  onChangeNote,
  onPressCallStringee,
  formatPrice,
  navigation,
  onPressSendServiceRequest,
  onPressNegotiation,
  onPressDeposit,
  onPressComplete,
  onPressRightButton,
  onPressLeftButton,
  onPressRejectReason,
  onPressCallCallback,
  onPressChatCallback,
  onPressProperty,
  onPressAgentAvatar,
}) => {
  const {propertyPostInfo, contactInfoList, contactTradingStatusId} =
    state.contactTradingInfo ?? {};

  const getVisibleButton = () => {
    let isVisible = false;

    if (isSending) {
      isVisible =
        contactTradingStatusId === CONTACT_STATUS_ID.Connected ||
        contactTradingStatusId === CONTACT_STATUS_ID.Negotiate;
    } else {
      isVisible = contactTradingStatusId === CONTACT_STATUS_ID.Waiting;
    }

    return isVisible;
  };

  if (isB2C) {
    return (
      <ScrollViewRefresh
        loading={loading}
        showCenterText={isEmpty(state?.contactTradingInfo)}
        loadingText={translate(STRINGS.LOADING)}
        onRefresh={onRefreshGetDetail}>
        <RequestDetailBodyView
          isSending={isSending}
          state={state}
          onChangeNote={onChangeNote}
          isB2C={isB2C}
          callStringee={onPressCallStringee}
        />
        {!isSending && (
          <View style={commonStyles.footerContainer}>
            <CustomButton
              style={commonStyles.buttonConfirm}
              title={translate(STRINGS.COMPLETE_PROCESS)}
              titleStyle={{...FONTS.bold}}
              onPress={onCompleteRequest}
            />
          </View>
        )}
      </ScrollViewRefresh>
    );
  }

  const contactIsWaiting = contactTradingStatusId === CONTACT_STATUS_ID.Waiting;
  const contactIsRejected = contactTradingStatusId === CONTACT_STATUS_ID.Rejected;

  const disableSupportRequests = !isSending || contactIsRejected || contactIsWaiting;

  return (
    <>
      <ScrollViewRefresh
        loading={loading}
        showCenterText={isEmpty(state?.contactTradingInfo)}
        loadingText={translate(STRINGS.LOADING)}
        onRefresh={onRefreshGetDetail}>
        <TimeLineList
          style={styles.timelineContainer}
          mainColor={COLORS.PRIMARY_A100}
          views={getTimelineViews({
            data: state?.contactTradingInfo,
            isSending,
            onPressNegotiation,
            onPressDeposit,
            onPressComplete,
            onPressRejectReason,
          })}
        />
        <ContactList
          containerStyle={styles.contactListContainer}
          contacts={contactInfoList}
          onPressAvatar={onPressAgentAvatar}
          navigation={navigation}
          onPressCallCallback={onPressCallCallback}
          onPressChatCallback={onPressChatCallback}
        />
        <PropertyInfoView
          data={propertyPostInfo}
          formatPrice={formatPrice}
          onPressProperty={onPressProperty}
        />
        <ServicesView
          disableSendRequest={disableSupportRequests}
          supportRequests={supportRequests}
          onPressSendServiceRequest={onPressSendServiceRequest}
        />
        <View style={METRICS.mediumMarginBottom} />
      </ScrollViewRefresh>
      {getVisibleButton() && !isB2C && (
        <CustomContactFooter
          state={state?.contactTradingInfo}
          isSending={isSending}
          onPressRightButton={onPressRightButton}
          onPressLeftButton={onPressLeftButton}
        />
      )}
    </>
  );
};

export default RequestDetailView;
