import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {AppContext} from '../../../../../appData/appContext/appContext';
import {CONSTANTS, MAX_LENGTH} from '../../../../../assets/constants';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {FONTS} from '../../../../../assets/theme/fonts';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import CustomFooterButtons from '../../../../../components/Button/CustomFooterButtons';
import WhiteBoxInput from '../../../../../components/WhiteBoxInput';
import LabelSectionLimited from '../../../../ManagePost/NewPost/NewPostComponents/LabelSectionLimited';
import {useCreateSupportRequestFromCT} from '../../../hooks';

const styles = StyleSheet.create({
  // inputs
  textInputNote: {
    ...commonStyles.inputBorderStyle,
    height: CONSTANTS.INPUT_DESCRIPTION_HEIGHT,
  },

  // Buttons
  sendBtn: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  cancelBtn: {
    flex: 1,
    ...METRICS.resetPadding,
    minWidth: null,
    paddingTop: 13,
    paddingBottom: 13,
    borderWidth: 0,
    backgroundColor: COLORS.GRAY_ED,
  },

  // Text
  modalTitle: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.BLACK_31,
    ...METRICS.marginBottom,
  },
  serviceName: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
    ...METRICS.verticalMargin,
  },
  cancelText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
  sendText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.NEUTRAL_WHITE,
  },
});

const SendServiceRequestModalContainer = ({
  serviceName,
  serviceId,
  contactTradingId,
  onPressCancel,
  onSentRequest,
}) => {
  const [note, setNote] = useState('');
  const {showAppModal} = useContext(AppContext);

  const onSuccessRequest = () => {
    showAppModal({
      isVisible: true,
      message: translate(STRINGS.YOUR_REQUEST_HAS_BEEN_CREATED_SUCCESSFULLY),
      onOkHandler: onSentRequest,
    });
  };

  const {createSupportRequest} = useCreateSupportRequestFromCT({onSuccess: onSuccessRequest});

  const onRequestingService = () => {
    createSupportRequest({
      contactTradingId,
      requestDescription: note,
      requestTypeId: serviceId,
    });
  };

  return (
    <>
      <View style={METRICS.padding}>
        <Text style={styles.modalTitle}>{translate('contactTrading.createServiceRequest')}</Text>
        <Text style={styles.serviceName}>{serviceName}</Text>
        <LabelSectionLimited
          leftProps={{title: translate(STRINGS.NOTE), isRequired: false}}
          rightProps={{
            title: `${note.length}/${MAX_LENGTH.NOTE}`,
            isRequired: false,
          }}
        />
        <WhiteBoxInput
          textInputStyle={styles.textInputNote}
          placeholder={translate('contactTrading.enterNote')}
          multiline
          onChangeText={setNote}
          value={note}
          maxLength={MAX_LENGTH.NOTE}
          alignTop={true}
        />
      </View>
      <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
        <CustomFooterButtons
          cancelButtonStyle={styles.cancelBtn}
          cancelTextStyle={styles.cancelText}
          nextButtonStyle={[styles.sendBtn]}
          nextTextStyle={[styles.sendText]}
          cancelButtonTitle={translate('common.cancel')}
          nextButtonTitle={translate('common.send')}
          onPressCancel={onPressCancel}
          onPressNext={onRequestingService}
        />
      </View>
    </>
  );
};

export default SendServiceRequestModalContainer;
