import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React from 'react';
import {useSelector} from 'react-redux';

import {getUserEmail} from '../../../../appData/user/selectors';
import {CONTACT_STATUS_ID, CONTACT_STATUS_STYLE} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {dateToString, FORMAT_DATE} from '../../../../utils/TimerCommon';
import {useFormatPrice} from '../../../Home/useFormatPrice';
import ScreenIds from '../../../ScreenIds';
import {TrackingActions} from '../../../WithSegment';
import {DEPOSIT_STATUS_LINK_DESC} from '../../DetailRequestConstant';
import ContactTradingItem, {ContactTradingItemB2C} from './ContactTradingItem';

const ContactTradingView = ({contactTrading, isSending, onHandler = () => {}}) => {
  const {track} = useAnalytics();
  const navigation = useNavigation();
  const {formatPrice} = useFormatPrice();

  const dateString = dateToString(
    isSending ? contactTrading?.createdDatetime : contactTrading?.updatedDatetime,
    FORMAT_DATE.TRANSACTION_DATE_TIME,
  );

  const contactStatus = contactTrading?.contactTradingStatusId;
  const depositStatus = contactTrading?.deposit?.depositStatus;
  const depositStatusName =
    (depositStatus &&
      contactStatus !== CONTACT_STATUS_ID.Completed &&
      ` - ${DEPOSIT_STATUS_LINK_DESC[depositStatus]}`) ||
    '';

  const data = {
    date: dateString,
    price: formatPrice(contactTrading?.propertyPrice),
    ...contactTrading,
    statusObject: CONTACT_STATUS_STYLE[contactStatus],
    depositStatusName,
  };

  const onPressItem = () => {
    track(TrackingActions.buyRequestDetailClicked, {
      request_id: data?.contactTradingCode,
      request_status: CONTACT_STATUS_STYLE[contactTrading?.contactTradingStatusId].name,
      request_product: data?.propertyCode,
    });

    navigation.navigate(ScreenIds.RequestDetailStack, {
      screen: ScreenIds.RequestDetail,
      params: {
        requestId: data?.contactTradingId,
        contactTradingCode: data?.contactTradingCode,
        isSending,
        onHandler,
      },
    });
  };

  return <ContactTradingItem data={data} onPress={onPressItem} isSending={isSending} />;
};

export const SentRequestItemB2C = ({contactTrading, isSending}) => {
  const userEmail = useSelector(getUserEmail);
  const {track} = useAnalytics();
  const navigation = useNavigation();

  const mappingItemSent = (data, dateString) => {
    const isRequester = data?.customerEmail === userEmail;

    return {
      ...data,
      date: dateString,
      isRequester: isRequester,
      itemType: translate(STRINGS.BUY_PROPERTY),
      postType: translate(STRINGS.PROJECT),
      status: contactTrading?.contactTradingB2CStatusDescription,
    };
  };

  const createdDateString = dateToString(
    contactTrading.requestDate,
    FORMAT_DATE.TRANSACTION_DATE_TIME,
  );
  const mappingItem = mappingItemSent(contactTrading, createdDateString);

  const onPressItem = selectedItem => {
    const contactTradingB2CId = selectedItem.contactTradingB2CId;

    track(TrackingActions.buyRequestDetailClicked, {
      request_id: mappingItem?.contactTradingB2CCode,
      request_status: mappingItem?.status,
      request_product: mappingItem?.projectInfoDto?.propertyPostCode,
    });

    navigation.navigate(ScreenIds.RequestDetailStack, {
      screen: ScreenIds.RequestDetail,
      params: {
        requestId: contactTradingB2CId,
        isSending: isSending,
        isB2C: true,
      },
    });
  };

  return (
    <ContactTradingItemB2C
      isSending={isSending}
      data={mappingItem}
      statusCode={contactTrading?.contactTradingB2CStatusName}
      onPress={() => onPressItem(contactTrading)}
    />
  );
};

export default ContactTradingView;
