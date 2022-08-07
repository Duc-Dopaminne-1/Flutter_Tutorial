import isEmpty from 'lodash/isEmpty';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {FONTS} from '../../../../assets/theme/fonts';
import {normal} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import FilterButton from '../../../../components/Button/FilterButton';
import {ChatButton, PhoneButton} from '../../../../components/Button/PhoneButton';
import TextView from '../../../../components/TextView';
import ActionReceivedEmailById from '../../hooks/useGetReceivedEmailById';
import ActionReceivedPhoneById from '../../hooks/useGetReceivedPhoneById';
import TractContactTradingB2C from '../../hooks/useTrackContactTradingB2C';

const ViewType = {
  emai: 'email',
  phone: 'phone-number',
};

const styles = StyleSheet.create({
  textHeader1: {
    ...FONTS.bold,
    ...FONTS.fontSize18,
  },
});

const RequestContactView = ({state, isB2C = false, isSending = false, callStringee}) => {
  const {
    contactTradingId = '',
    fullName = '',
    phoneNumber = '',
    email = '',
    buyerFullName = '',
    buyerEmail = '',
    buyerPhoneNumber = '',
  } = state?.contactTradingInfo ?? {};
  const isAtleastGoldUser = state?.isAtleastGoldUser ?? false;
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const onSuccessGetEmail = () => {
    setShowEmail(true);
  };

  const onSuccessGetPhone = () => {
    setShowPhone(true);
  };

  const {startGetReceivedEmailById} = ActionReceivedEmailById({
    onSuccessResponse: onSuccessGetEmail,
  });

  const {startGetReceivedPhoneById} = ActionReceivedPhoneById({
    onSuccessResponse: onSuccessGetPhone,
  });

  const {startTractContactTradingB2C} = TractContactTradingB2C({
    onSuccessResponse: type => {
      type === ViewType.emai ? onSuccessGetEmail() : onSuccessGetPhone();
    },
  });

  const onShowContact = ({isEmail = false}) => {
    if (!isEmpty(contactTradingId)) {
      if (isB2C) {
        startTractContactTradingB2C({
          contactTradingB2CId: contactTradingId,
          viewType: isEmail ? ViewType.emai : ViewType.phone,
        });
      } else {
        if (isEmail) {
          !showEmail && startGetReceivedEmailById(contactTradingId);
        } else {
          !showPhone && startGetReceivedPhoneById(contactTradingId);
        }
      }
    }
  };

  const onPressCall = () => {
    callStringee(phoneNumber, fullName, '', true);
  };
  const onPressChat = () => {
    callStringee(phoneNumber, fullName, '', true, true);
  };

  const SYMBOL_COLON = ':';
  const ContactView = () => {
    if (isSending) {
      return (
        <>
          <View style={commonStyles.separatorRow16} />
          <TextView
            title={translate(STRINGS.PHONE_NUMBER) + SYMBOL_COLON}
            value={buyerPhoneNumber || '-'}
          />
          <View style={commonStyles.separatorRow16} />
          <TextView title={translate(STRINGS.EMAIL) + SYMBOL_COLON} value={buyerEmail || '-'} />
        </>
      );
    } else {
      if (isAtleastGoldUser) {
        return (
          <>
            <View style={commonStyles.separatorRow16} />
            <TextView
              title={translate(STRINGS.PHONE_NUMBER) + SYMBOL_COLON}
              customRightComponent={
                <>
                  <PhoneButton onPress={onPressCall} />
                  <ChatButton style={{marginLeft: normal}} onPress={onPressChat} />
                </>
              }
            />
            <View style={commonStyles.separatorRow16} />
            <TextView
              title={translate(STRINGS.EMAIL) + SYMBOL_COLON}
              value={email}
              customRightComponent={
                <FilterButton
                  title={showEmail ? email : translate(STRINGS.SHOW_EMAIL)}
                  onPress={() => onShowContact({isEmail: true})}
                />
              }
            />
          </>
        );
      } else {
        return <></>;
      }
    }
  };

  return (
    <>
      <Text style={styles.textHeader1}>{translate(STRINGS.REQUESTER_CONTACT_INFO)}</Text>
      <View style={commonStyles.separatorRow16} />
      <TextView
        title={translate(STRINGS.FULLNAME) + SYMBOL_COLON}
        value={isSending ? buyerFullName : fullName}
      />
      <ContactView />
    </>
  );
};

export default RequestContactView;
