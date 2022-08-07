import React from 'react';
import {StyleSheet, View} from 'react-native';

import {SIZES} from '../../../../assets/constants/sizes';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS, normal} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import {ChatButton, PhoneButton} from '../../../../components/Button/PhoneButton';
import TextView from '../../../../components/TextView';
import ScreenIds from '../../../ScreenIds';
import {getColorByCode} from '../../ManageBuyRequestUtils';

const styles = StyleSheet.create({
  txtNegotiatePrice: {
    ...FONTS.bold,
    ...commonStyles.txtFontSize14,
    color: COLORS.STATE_ERROR,
    width: '55%',
  },
  buttonEditNegotiatePrice: {
    height: 28,
    ...HELPERS.center,
    ...METRICS.smallNormalHorizontalPadding,
    ...METRICS.tinyVerticalPadding,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_BERMUDA,
    borderRadius: 5,
  },
  textViewRightComponentContainer: {
    ...HELPERS.fillRow,
    justifyContent: 'space-between',
  },
  textEditPrice: {
    ...FONTS.fontSize12,
    lineHeight: 20,
    color: COLORS.GREY_BERMUDA,
  },
  textStatus: {
    ...FONTS.semiBold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_33,
  },
});

const RequestStatusView = ({state, isB2C = false, isSending = false, navigation, callStringee}) => {
  const {
    requestCode = '',
    status = '',
    statusCode = '',
    assigneeFullName = '',
    assigneePhoneNumber = '',
    assigneeProfilePhoto = '',
    createdDate = '',
    updatedDate = '',
    agentFullName = '',
    agentId = '',
  } = state.contactTradingInfo ?? {};
  const txtStatus = status;
  let styleStatus = styles.textStatus;
  if (isSending) {
    styleStatus = {...styleStatus, color: getColorByCode(statusCode)};
  }

  const SYMBOL_COLON = ':';

  const navigateToAgentAssign = () => {
    if (agentId) {
      navigation.navigate(ScreenIds.AgentManagement, {
        agentId: agentId,
      });
    }
  };

  const DetailView = () => {
    const onPressCall = () => {
      callStringee(assigneePhoneNumber, assigneeFullName, assigneeProfilePhoto);
    };

    const onPressChat = () => {
      callStringee(assigneePhoneNumber, assigneeFullName, assigneeProfilePhoto, false, true);
    };

    return (
      <>
        <TextView title={translate(STRINGS.CONSULTANT) + SYMBOL_COLON} value={assigneeFullName} />
        <View style={commonStyles.separatorRow4} />
        <TextView
          title={translate(STRINGS.CONSULTANT) + SYMBOL_COLON}
          customRightComponent={
            assigneePhoneNumber ? (
              <>
                <PhoneButton onPress={onPressCall} />
                <ChatButton style={{marginLeft: normal}} onPress={onPressChat} />
              </>
            ) : null
          }
          hideTitle
        />
        {isB2C && isSending && (
          <>
            <View style={commonStyles.separatorRow16} />
            <TextView
              canBeInteractive
              title={'Topener nhận yêu cầu' + SYMBOL_COLON}
              value={agentFullName}
              valueStyle={{...HELPERS.fill, ...FONTS.bold, color: COLORS.PRIMARY_A100}}
              onPress={navigateToAgentAssign}
            />
          </>
        )}
        <View style={commonStyles.separatorRow16} />
        <TextView
          title={
            translate(isSending ? 'contactTrading.detail.createDate' : STRINGS.UPDATED_DATE) +
            SYMBOL_COLON
          }
          value={isSending ? createdDate : updatedDate}
        />
      </>
    );
  };

  return (
    <>
      <TextView title={translate(STRINGS.REQUEST_CODE) + SYMBOL_COLON} value={requestCode} />
      <View style={commonStyles.separatorRow16} />
      <TextView
        title={translate(STRINGS.STATUS) + SYMBOL_COLON}
        value={txtStatus}
        valueStyle={styleStatus}
      />
      <View style={commonStyles.separatorRow16} />
      <DetailView />
    </>
  );
};

export default RequestStatusView;
