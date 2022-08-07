import React, {forwardRef, useContext, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AppContext} from '../../../../appData/appContext/appContext';
import {MAX_LENGTH} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {FONTS} from '../../../../assets/theme/fonts';
import {HELPERS} from '../../../../assets/theme/helpers';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomFooterButtons from '../../../../components/Button/CustomFooterButtons';
import InputSection from '../../../../components/InputSection';
import ModalWithModalize, {useModalize} from '../../../../components/Modal/ModalWithModalize';
import TextView from '../../../../components/TextView';
import {getPriceWithCurrency} from '../../../../utils/RenderUtil';
import {useRequestRefundSupportRequest} from '../hooks';
import {GetPaymentInfoInput, RefundInfo} from '../type';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...METRICS.horizontalPadding,
    ...METRICS.paddingTop,
  },
  infoView: {
    width: '100%',
    ...METRICS.verticalPadding,
  },
});

const InfoRow = ({title, value}) => {
  return (
    <TextView
      title={title}
      valueLines={5}
      containerStyle={[HELPERS.mainSpaceBetween, METRICS.smallMarginBottom]}
      valueStyle={{...HELPERS.fill, ...HELPERS.textRight}}
      value={value || '--'}
    />
  );
};

const RefundContainer = ({
  supportServiceName,
  supportServicePrice,
  paymentMethod,
  refundAmount,
  note,
  onChangeNote,
  onClosePress,
  onSendPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[commonStyles.blackTextBold20, FONTS.fontSize24]}>
        {translate('supportRequest.refund.title')}
      </Text>
      <View style={commonStyles.separatorRow16} />
      <View style={styles.infoView}>
        <InfoRow title={`${translate('supportRequest.service')}:`} value={supportServiceName} />
        <InfoRow
          title={`${translate('supportRequest.servicePrice')}:`}
          value={getPriceWithCurrency(supportServicePrice)}
        />
        <InfoRow title={`${translate('common.paymentMethod')}:`} value={paymentMethod} />
        <InfoRow
          title={`${translate('supportRequest.refundAmount')}:`}
          value={getPriceWithCurrency(refundAmount)}
        />
        <View style={commonStyles.separatorRow16} />
        <InputSection
          headerTitle={translate(STRINGS.NOTE)}
          placeholder={translate('common.enterNote')}
          inputStyle={commonStyles.multilineInput}
          value={note}
          onChangeText={onChangeNote}
          showMultilineInputView
          showLimitedLength
          maxLength={MAX_LENGTH.NOTE}
        />
      </View>
      <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
        <CustomFooterButtons
          cancelButtonTitle={translate('common.close')}
          nextButtonTitle={translate('common.send')}
          onPressCancel={onClosePress}
          onPressNext={onSendPress}
        />
      </View>
    </View>
  );
};

const RefundPopup = forwardRef((props: RefundInfo, ref) => {
  const {
    supportServiceName = '',
    supportServicePrice = '',
    paymentMethod = '',
    refundAmount = '',
    executorId = '',
    ticketId = '',
    userId = '',
    supportTypeId = '',
    propertyPostId = '',
    onRefundSuccess,
    paymentCode = '',
  } = props ?? {};

  const {showAppModal} = useContext(AppContext);

  const [note, setNote] = useState('');

  const popup = useRef();

  const popupRef = ref ? ref : popup;

  const {closeModal} = useModalize(popupRef);

  const {requestRefund} = useRequestRefundSupportRequest();

  const sendBtnPressedHanlder = () => {
    const info: GetPaymentInfoInput = {
      ticketId,
      propertyPostId,
      executorId,
      userId,
      amount: refundAmount,
      supportTypeId,
      paymentMethod,
      paymentCode,
      requestNoted: note,
    };

    const onSuccess = () => {
      onRefundSuccess();
      showAppModal({
        isVisible: true,
        message: translate(STRINGS.YOUR_REQUEST_HAS_BEEN_CREATED_SUCCESSFULLY),
        onOkHandler: closeModal,
      });
    };

    requestRefund({
      info,
      onSuccess,
    });
  };

  return (
    <ModalWithModalize getModalRef={popupRef}>
      <RefundContainer
        supportServiceName={supportServiceName}
        supportServicePrice={supportServicePrice}
        paymentMethod={paymentMethod}
        refundAmount={refundAmount}
        note={note}
        onChangeNote={setNote}
        onClosePress={closeModal}
        onSendPress={sendBtnPressedHanlder}
      />
    </ModalWithModalize>
  );
});

export default RefundPopup;
