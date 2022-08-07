import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  ContactTradingType,
  UpdateContactTradingNegotiationStatusInput,
} from '../../../../../api/graphql/generated/graphql';
import {
  APP_CURRENCY,
  CONSTANTS,
  GLOBAL_ACTIONS,
  KEY_BOARD_TYPE,
} from '../../../../../assets/constants';
import {SIZES} from '../../../../../assets/constants/sizes';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {FONTS} from '../../../../../assets/theme/fonts';
import {HELPERS} from '../../../../../assets/theme/helpers';
import {METRICS, small} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import Avatar from '../../../../../components/Avatar';
import CustomBottomButton from '../../../../../components/Button/CustomBottomButton';
import {ChatButton, PhoneButton} from '../../../../../components/Button/PhoneButton';
import DropdownWithTitle from '../../../../../components/DropdownWithTitle';
import InputSection from '../../../../../components/InputSection';
import ModalWithModalize from '../../../../../components/Modal/ModalWithModalize';
import TextView from '../../../../../components/TextView';
import WhiteBoxInput from '../../../../../components/WhiteBoxInput';
import MeasureUtils from '../../../../../utils/MeasureUtils';
import NumberUtils from '../../../../../utils/NumberUtils';
import {getDatePickerDateString} from '../../../../../utils/TimerCommon';
import {getHeaderLimited} from '../../../../../utils/UiUtils';
import ValidateInput from '../../../../../utils/ValidateInput';
import ValidateInputMessage from '../../../../../utils/ValidateInputMessage';
import LabelSectionLimited from '../../../../ManagePost/NewPost/NewPostComponents/LabelSectionLimited';
import {NewPostStyles} from '../../../../ManagePost/NewPost/NewPostComponents/NewPostConstant';
import {
  CONTACT_ACTIONS,
  CONTACT_FIELD,
  REQUEST_DETAIL_ACTIONS,
} from '../../../DetailRequestConstant';
import useGetDetailContactTradingC2C from '../../../hooks/useGetDetailContactTradingC2C';
import useUpdateContactTradingNegotiateC2C from '../../../hooks/useUpdateContactTradingNegotiateC2C';
import useUpdateContactTradingRejectC2C from '../../../hooks/useUpdateContactTradingRejectC2C';
import useUpdateContactTradingRejectedDepositC2C from '../../../hooks/useUpdateContactTradingRejectedDepositC2C';

const styles = StyleSheet.create({
  statusPickerContainer: {
    width: '100%',
    ...METRICS.horizontalPadding,
    ...METRICS.paddingBottom,
  },
  container: {
    ...HELPERS.colCenter,
    width: '100%',
    ...METRICS.mediumVerticalPadding,
    ...METRICS.largeHorizontalPadding,
  },
  textGray14: {
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
    textAlign: 'center',
    color: COLORS.BRAND_GREY,
  },
  textBlack14: {
    ...commonStyles.txtFontSize14,
    ...FONTS.regular,
    textAlign: 'center',
    color: COLORS.BLACK_33,
  },
  textInputDescription: {
    ...commonStyles.inputBorderStyle,
    height: CONSTANTS.INPUT_DESCRIPTION_HEIGHT,
  },
  textDesc: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderRadius: CONSTANTS.INPUT_BORDER_RADIUS,
    borderColor: COLORS.GREY_E4,
    marginTop: small,
    padding: CONSTANTS.INPUT_PADDING_15,
    overflow: 'hidden',
  },
  justifyText: {
    textAlign: 'justify',
  },
  inputRightContainer: {
    paddingStart: 16,
    justifyContent: 'center',
  },
});

export const MODAL_TYPE = {
  DEFAULT: 1,
  ASSIGNEE: 2,
  REJECT: 3,
  NEGOTIATE: 4,
  REJECT_DEPOSIT: 5,
  REJECT_REASON: 6,
};

const AgentInfoContainer = ({state, modalRef, callStringee}) => {
  const {
    assigneeFullName = '',
    assigneeEmail = '',
    assigneePhoneNumber = '',
    assigneeProfilePhoto = null,
  } = state.contactTradingInfo ?? {};

  const onPressCall = () => {
    callStringee(assigneePhoneNumber, assigneeFullName, assigneeProfilePhoto);
  };

  const onPressChat = () => {
    callStringee(assigneePhoneNumber, assigneeFullName, assigneeProfilePhoto, false, true);
  };

  const AVATAR_SIZE = 72;
  return (
    <ModalWithModalize getModalRef={modalRef}>
      <View style={styles.container}>
        <Text style={styles.textGray14}>{translate(STRINGS.ASSIGNEE_INFO)}</Text>
        <View style={commonStyles.separatorRow24} />
        <Avatar
          size={AVATAR_SIZE}
          url={assigneeProfilePhoto}
          name={assigneeFullName}
          nameStyle={METRICS.smallNormalMarginTop}
        />
        <View style={commonStyles.separatorRow4} />
        <Text style={styles.textBlack14}>{assigneeEmail}</Text>
        <View style={commonStyles.separatorRow4} />
        <View style={HELPERS.row}>
          <PhoneButton onPress={onPressCall} />
          <ChatButton style={styles.chatButton} onPress={onPressChat} />
        </View>
        <View style={commonStyles.separatorRow24} />
        <Text style={styles.textGray14}>{translate(STRINGS.ASSIGNEE_NOTE)}</Text>
      </View>
    </ModalWithModalize>
  );
};

const RejectReasonContainer = ({data, onPressCancel}) => {
  return (
    <>
      <View style={[styles.statusPickerContainer, METRICS.marginTop]}>
        <Text style={[commonStyles.blackTextBold20, FONTS.fontSize24]}>
          {translate(STRINGS.REASON)}
        </Text>
        <Text style={[commonStyles.grayText14, METRICS.mediumMarginTop]}>
          {data?.rejectedDatetime}
        </Text>
        <Text style={[commonStyles.blackText14, METRICS.tinyMarginTop, styles.justifyText]}>
          {data?.rejectedReason ?? '--'}
        </Text>
      </View>
      <CustomBottomButton
        leftTitle={translate(STRINGS.CLOSE)}
        onPressLeftButton={onPressCancel}
        showButtonRight={false}
      />
    </>
  );
};

const RejectContainer = ({data, dispatch, onPressConfirm, onPressCancel}) => {
  const OTHER = 'Other';
  const [state, setState] = useState({
    isSelected: data?.rejectReasons?.some(e => e.checked),
    isOther: data?.rejectReasons?.some(e => e?.checked && e?.key === OTHER),
    focus: false,
    rejectReason: data?.rejectReason,
    rejectReasonId: data?.rejectReasonId,
    error: {
      rejectReasonId: '',
      rejectReason: '',
    },
  });

  const isValid = () => {
    if (state?.isOther && isEmpty(data?.rejectReason)) {
      setState({
        ...state,
        error: {
          ...state?.error,
          rejectReason: ValidateInputMessage.checkRequiredFieldMessage(data.rejectReason),
        },
      });
      return false;
    }
    return true;
  };

  useEffect(() => {
    const isOther = data?.rejectReasons?.some(e => e?.checked && e?.key === OTHER);
    setState({
      ...state,
      isOther: isOther,
      isSelected: data?.rejectReasons?.some(e => e.checked),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.rejectReasons]);

  const onChooseRejectReason = item => {
    if (item?.id) {
      const isOther = item?.key === OTHER;
      const payload = {rejectReasonId: item?.id, rejectReason: isOther ? data?.rejectReason : ''};

      dispatch({type: REQUEST_DETAIL_ACTIONS.SET_CONTACT_TRADING_INFO, payload: payload});
      setState({
        ...state,
        rejectReasonId: item?.id,
        isOther,
        error: {
          ...state?.error,
          rejectReason: '',
        },
      });
    }
  };
  const onChangeTextDescription = text => {
    setState({
      ...state,
      rejectReason: text,
      error: {
        rejectReason: ValidateInputMessage.checkRequiredFieldMessage(text),
      },
    });
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: 'rejectReason',
      payload: text,
    });
  };

  const onPressSave = () => {
    if (isValid()) {
      onPressConfirm();
    }
  };
  return (
    <>
      <View style={[styles.statusPickerContainer, METRICS.marginTop]}>
        <Text style={[commonStyles.blackTextBold20, FONTS.fontSize24]}>
          {translate('common.decline')}
        </Text>
        <Text style={[commonStyles.blackText14, METRICS.mediumMarginTop]}>
          {translate('contactTrading.pleaseSelectRejectReason')}
        </Text>
        <DropdownWithTitle
          colorTheme={COLORS.PRIMARY_A100}
          style={METRICS.smallMarginTop}
          inputStyle={commonStyles.inputBorderWithIcon}
          title={translate(STRINGS.REASON)}
          headerStyles={commonStyles.blackText14}
          dropdownTitle={translate(STRINGS.PLEASE_SELECT)}
          popupTitle={translate(STRINGS.REASON)}
          items={data?.rejectReasons}
          error={state?.error?.rejectReasonId}
          showSearchBox={false}
          itemSelected={onChooseRejectReason}
          dropdownPlaceHolderStyle={
            state?.isSelected ? commonStyles.blackText14 : NewPostStyles.dropdownPlaceholder
          }
          isRequired
        />

        {state?.isOther && (
          <>
            <LabelSectionLimited
              leftProps={{
                title: translate(STRINGS.NOTE),
                isRequired: true,
              }}
              rightProps={{
                title: getHeaderLimited(state?.rejectReason, 500),
                titleStyle: {color: COLORS.GRAY_A3},
                isRequired: false,
              }}
            />
            <WhiteBoxInput
              textInputStyle={
                state?.focus
                  ? [styles.textInputDescription, {borderColor: COLORS.PRIMARY_A100}]
                  : styles.textInputDescription
              }
              placeholder={translate('common.enterReason')}
              multiline={true}
              onChangeText={onChangeTextDescription}
              value={data?.rejectReason}
              maxLength={500}
              error={state?.error?.rejectReason}
              alignTop={true}
              onFocus={() => setState({...state, focus: true})}
              onBlur={() => setState({...state, focus: false})}
            />
          </>
        )}
      </View>
      <CustomBottomButton
        onPressLeftButton={onPressCancel}
        onPressRightButton={onPressSave}
        rightTitle={translate('common.send')}
      />
    </>
  );
};

const NegotiateContainer = ({state, dispatch, onPressConfirm, onPressCancel}) => {
  const contactInfo = state?.contactTradingInfo;
  const propertyPrice = contactInfo?.propertyPostInfo?.price;
  const propertyCode = contactInfo?.propertyPostInfo?.propertyCode;
  const type = state[CONTACT_FIELD.action];

  const propertyPriceFormat = NumberUtils.formatNumberToCurrencyNumber(propertyPrice ?? 0, 0);
  let negotiationPriceText = '';
  if (type === CONTACT_ACTIONS.VIEW_STATUS) {
    negotiationPriceText = NumberUtils.formatNumberToCurrencyNumber(
      contactInfo?.negotiationPrice,
      0,
    );
  } else if (type === CONTACT_ACTIONS.EDIT_STATUS) {
    negotiationPriceText = NumberUtils.formatNumberToCurrencyNumber(state?.negotiationPrice, 0);
  }
  const [viewState, setViewState] = useState({
    focus: {
      price: false,
      note: false,
    },
    negotiationDescription:
      type === CONTACT_ACTIONS.VIEW_STATUS
        ? contactInfo?.negotiationDescription
        : state?.negotiationDescription,
    negotiationPrice: negotiationPriceText,
  });

  const isValid = () => {
    if (isEmpty(viewState?.negotiationPrice)) {
      setViewState({
        ...viewState,
        error: {
          negotiationPrice: ValidateInput.checkRequiredField(viewState.negotiationPrice),
        },
      });
      return false;
    }
    return true;
  };

  const onChangeText = text => {
    const unformattedSuggestedValue = NumberUtils.parseIntValue(NumberUtils.removeAllComma(text));
    if (MeasureUtils.isValidPriceValue(unformattedSuggestedValue)) {
      let textPrice = '';
      if (unformattedSuggestedValue !== 0) {
        textPrice = NumberUtils.formatNumberToCurrencyNumber(unformattedSuggestedValue, 0);
      }
      setViewState({
        ...viewState,
        negotiationPrice: textPrice,
        error: {
          negotiationPrice: ValidateInput.checkRequiredField(textPrice),
        },
      });
      dispatch({
        type: GLOBAL_ACTIONS.FIELD,
        fieldName: 'negotiationPrice',
        payload: unformattedSuggestedValue,
      });
    }
  };

  const onChangeTextDescription = text => {
    setViewState({
      ...viewState,
      negotiationDescription: text,
    });
    dispatch({
      type: GLOBAL_ACTIONS.FIELD,
      fieldName: 'negotiationDescription',
      payload: text,
    });
  };

  // eslint-disable-next-line sonarjs/no-identical-functions
  function onPressSend() {
    if (isValid()) {
      onPressConfirm();
    }
  }
  const disableStyle =
    type === CONTACT_ACTIONS.VIEW_STATUS ? {backgroundColor: COLORS.GREY_ED} : {};

  return (
    <>
      <View style={[styles.statusPickerContainer, METRICS.marginTop]}>
        <Text
          style={[commonStyles.blackTextBold20, FONTS.fontSize24, METRICS.normalPlusMarginBottom]}>
          {translate('contactTrading.negotiatePrice')}
        </Text>
        <Text style={commonStyles.blackTextBold20}>{translate(STRINGS.PRODUCT_INFORMATION)}</Text>
        <TextView
          title={translate(STRINGS.PROPERTY_CODE_DESC)}
          containerStyle={[HELPERS.mainSpaceBetween, METRICS.marginTop, METRICS.smallMarginBottom]}
          value={propertyCode || '--'}
        />
        <TextView
          title={translate(STRINGS.CURRENT_PRICE)}
          containerStyle={[HELPERS.mainSpaceBetween, METRICS.normalPlusMarginBottom]}
          value={`${propertyPriceFormat} ${APP_CURRENCY}`}
        />
        <Text style={commonStyles.blackTextBold20}>
          {translate('contactTrading.negotiationInformation')}
        </Text>

        <InputSection
          headerTitle={translate(STRINGS.SUGGESTED_PRICE_RANGE)}
          placeholder={translate('contactTrading.suggestedPricePlaceholder')}
          headerStyles={commonStyles.blackText14}
          inputContainerStyle={
            viewState?.focus?.price
              ? {...commonStyles.input, borderColor: COLORS.PRIMARY_A100}
              : commonStyles.input
          }
          value={`${viewState.negotiationPrice}`}
          keyboardType={KEY_BOARD_TYPE.INT_NUMBER}
          error={viewState?.error?.negotiationPrice}
          isRequired={true}
          editable={type !== CONTACT_ACTIONS.VIEW_STATUS}
          onChangeText={onChangeText}
          onFocus={() => setViewState({...viewState, focus: {...viewState.focus, price: true}})}
          onBlur={() => setViewState({...viewState, focus: {...viewState.focus, price: false}})}
          customRightComponent={
            <View style={styles.inputRightContainer}>
              <Text style={commonStyles.blackText14}>{APP_CURRENCY}</Text>
            </View>
          }
        />

        <LabelSectionLimited
          leftProps={{
            title: translate(STRINGS.NOTE),
            isRequired: false,
          }}
          rightProps={{
            title: getHeaderLimited(viewState?.negotiationDescription, 500),
            titleStyle: {color: COLORS.GRAY_A3},
            isRequired: false,
          }}
        />
        {type === CONTACT_ACTIONS.VIEW_STATUS && (
          <Text
            style={[commonStyles.grayText14, styles.textDesc, styles.justifyText, disableStyle]}>
            {viewState?.negotiationDescription ?? ''}
          </Text>
        )}
        {type === CONTACT_ACTIONS.VIEW_STATUS || (
          <WhiteBoxInput
            textInputStyle={
              viewState?.focus?.note
                ? [styles.textInputDescription, {borderColor: COLORS.PRIMARY_A100}]
                : [styles.textInputDescription, disableStyle]
            }
            placeholder={
              type !== CONTACT_ACTIONS.VIEW_STATUS ? translate('contactTrading.enterNote') : ''
            }
            multiline={true}
            onChangeText={onChangeTextDescription}
            value={viewState?.negotiationDescription}
            maxLength={500}
            alignTop={true}
            editable={type !== CONTACT_ACTIONS.VIEW_STATUS}
            onFocus={() => setViewState({...viewState, focus: {...viewState.focus, note: true}})}
            onBlur={() => setViewState({...viewState, focus: {...viewState.focus, note: false}})}
          />
        )}
      </View>
      <CustomBottomButton
        onPressLeftButton={onPressCancel}
        onPressRightButton={onPressSend}
        rightTitle={translate('common.send')}
        leftTitle={translate(type === CONTACT_ACTIONS.VIEW_STATUS ? STRINGS.CLOSE : STRINGS.CANCEL)}
        showButtonRight={type !== CONTACT_ACTIONS.VIEW_STATUS}
      />
    </>
  );
};

const ModalsContainer = ({
  modalType = MODAL_TYPE.DEFAULT,
  state,
  dispatch,
  callStringee,
  assigneeModalRef,
  negotiateModalRef,
  rejectCTModalRef,
  rejectDepositCTModalRef,
  rejectReasonModalRef,
  requestId,
  isSending,
  handleOnDoneUpdate,
}) => {
  const {getContactTradingC2C} = useGetDetailContactTradingC2C(isSending);

  const closeModal = () => {
    switch (modalType) {
      case MODAL_TYPE.ASSIGNEE:
        assigneeModalRef.current?.close();
        break;
      case MODAL_TYPE.NEGOTIATE:
        negotiateModalRef.current?.close();
        break;
      case MODAL_TYPE.REJECT:
        rejectCTModalRef.current?.close();
        break;
      case MODAL_TYPE.REJECT_DEPOSIT:
        rejectDepositCTModalRef.current?.close();
        break;
      case MODAL_TYPE.REJECT_REASON:
        rejectReasonModalRef.current?.close();
        break;
      default:
        return;
    }
  };

  const onDoneChangeContactTradingStatus = response => {
    if (response && response.errorCode === 0) {
      getContactTradingC2C(requestId, true);
      closeModal();
      handleOnDoneUpdate(response);
    }
  };

  const [rejectContactTradingC2C] = useUpdateContactTradingRejectC2C({
    onSuccess: response => {
      onDoneChangeContactTradingStatus(response);
    },
  });

  const [negotiateContactTradingC2C] = useUpdateContactTradingNegotiateC2C({
    onSuccess: response => {
      onDoneChangeContactTradingStatus(response);
    },
  });

  const [rejectDepositContactTradingC2C] = useUpdateContactTradingRejectedDepositC2C({
    onSuccess: response => {
      onDoneChangeContactTradingStatus(response);
    },
  });

  const onRejectDepositContactTrading = () => {
    const data = {
      contactTradingId: state?.contactTradingInfo?.contactTradingId,
      recordVersion: state?.contactTradingInfo?.recordVersion,
      depositRejectReason: state?.rejectReason,
      depositRejectReasonId: state?.rejectReasonId,
    };

    rejectDepositContactTradingC2C({...data});
  };

  const onRejectContactTrading = () => {
    const data = {
      contactTradingId: state?.contactTradingInfo?.contactTradingId,
      recordVersion: state?.contactTradingInfo?.recordVersion,
      rejectReason: state?.rejectReason,
      rejectReasonId: state?.rejectReasonId,
    };

    rejectContactTradingC2C({...data});
  };

  const onNegotiateContactTrading = () => {
    const input: UpdateContactTradingNegotiationStatusInput = {
      contactTradingId: state?.contactTradingInfo?.contactTradingId,
      contactType: ContactTradingType.Buy,
      recordVersion: state?.contactTradingInfo?.recordVersion,
      negotiationDate: moment().valueOf(),
      negotiationDescription:
        state?.negotiationDescription ?? state?.contactTradingInfo?.negotiationDescription,
      negotiationPrice: state?.negotiationPrice ?? state?.contactTradingInfo?.negotiationPrice,
    };

    negotiateContactTradingC2C(input);
  };

  switch (modalType) {
    case MODAL_TYPE.ASSIGNEE:
      return (
        <AgentInfoContainer state={state} modalRef={assigneeModalRef} callStringee={callStringee} />
      );
    case MODAL_TYPE.REJECT:
    case MODAL_TYPE.REJECT_DEPOSIT:
      const isModalRejectCT = modalType === MODAL_TYPE.REJECT;
      return (
        <ModalWithModalize
          getModalRef={isModalRejectCT ? rejectCTModalRef : rejectDepositCTModalRef}>
          <RejectContainer
            data={state}
            dispatch={dispatch}
            onPressCancel={closeModal}
            onPressConfirm={
              isModalRejectCT ? onRejectContactTrading : onRejectDepositContactTrading
            }
          />
        </ModalWithModalize>
      );
    case MODAL_TYPE.NEGOTIATE:
      const updateInfoToState = () => {
        const contactInfo = state?.contactTradingInfo;
        if (state[CONTACT_FIELD.action] !== CONTACT_ACTIONS.VIEW_STATUS) {
          const data =
            state[CONTACT_FIELD.action] === CONTACT_ACTIONS.SET_STATUS
              ? {negotiationPrice: '', negotiationDescription: '', [CONTACT_FIELD.action]: ''}
              : {
                  negotiationPrice: contactInfo?.negotiationPrice,
                  negotiationDescription: contactInfo?.negotiationDescription,
                  [CONTACT_FIELD.action]: '',
                };
          dispatch({type: REQUEST_DETAIL_ACTIONS.SET_CONTACT_TRADING_INFO, payload: data});
        }
      };

      return (
        <ModalWithModalize onClosed={updateInfoToState} getModalRef={negotiateModalRef}>
          <NegotiateContainer
            state={state}
            dispatch={dispatch}
            onPressCancel={closeModal}
            onPressConfirm={onNegotiateContactTrading}
          />
        </ModalWithModalize>
      );
    case MODAL_TYPE.REJECT_REASON:
      const {rejectReason, updatedDatetime} = state?.contactTradingInfo ?? {};
      const info = {
        rejectedReason: rejectReason ?? '',
        rejectedDatetime: getDatePickerDateString(updatedDatetime),
      };

      return (
        <ModalWithModalize getModalRef={rejectReasonModalRef}>
          <RejectReasonContainer data={info} onPressCancel={closeModal} />
        </ModalWithModalize>
      );
    default:
      return null;
  }
};

export default ModalsContainer;
