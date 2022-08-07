import React, {useContext, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux/lib/hooks/useSelector';

import {useGetUserByIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {getUser} from '../../../appData/user/selectors';
import {FETCH_POLICY, MAX_LENGTH} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomFooterButtons from '../../../components/Button/CustomFooterButtons';
import CustomCheckbox from '../../../components/Checkbox/CustomCheckbox';
import DropdownWithTitle from '../../../components/DropdownWithTitle';
import InputSection from '../../../components/InputSection';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import RequiredLabel from '../../../components/RequiredLabel';
import logService from '../../../service/logService';
import ValidateInput from '../../../utils/ValidateInput';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import {NewPostContext} from '../useNewPost';
import DownloadDocumentView from './DownloadDocumentView';

const BULLET_POINT_SIZE = 5;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    ...METRICS.horizontalPadding,
  },
  screenTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
  },
  bulletPoint: {
    height: BULLET_POINT_SIZE,
    width: BULLET_POINT_SIZE,
    borderRadius: SIZES.BORDER_RADIUS_50,
    backgroundColor: COLORS.BLACK_31,
    marginTop: 8,
    marginRight: 6,
  },
  infoText: {
    ...FONTS.fontSize14,
    ...FONTS.regular,
    color: COLORS.BLACK_31,
    textAlign: 'left',
  },
  declineButton: {
    flex: 1,
    // eslint-disable-next-line no-undefined
    minWidth: undefined,
    ...METRICS.resetPadding,
    paddingTop: 13,
    paddingBottom: 13,
    borderWidth: 0,
    backgroundColor: COLORS.GRAY_ED,
  },
  agreeButton: {
    flex: 1,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  agreeButtonDisabled: {
    backgroundColor: COLORS.PRIMARY_A20,
  },
  agreeText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.NEUTRAL_WHITE,
  },
  agreeTextDisabled: {
    color: COLORS.PRIMARY_A40,
  },
  declineContractHeader: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.BLACK_31,
    marginBottom: 28,
  },
  declineReasonLabel: {
    ...FONTS.regular,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
  declineText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
  declineReasonTextLength: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.GRAY_A3,
  },
  agreementAssuranceContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
});

const DECLINE_REASONS = [
  {
    id: 0,
    name: 'Không còn nhu cầu đăng tin',
    checked: false,
  },
  {
    id: 1,
    name: 'Không đồng ý với hợp đồng',
    checked: false,
  },
  {
    id: 2,
    name: 'Khác',
    checked: false,
  },
];

const TextWithBulletPoint = ({text}) => {
  return (
    <View style={HELPERS.row}>
      <View style={styles.bulletPoint} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
};

const getCopyObjsFromArray = arr => {
  if (!arr || !arr?.length) {
    return [];
  }
  return arr.map(e => ({...e}));
};

const initialErrorDeclineModal = {
  reason: '',
  reasonDetail: '',
};

const initialDeclineInputsState = {
  reason: null,
  reasonDetail: '',
};

const validateInputs = objOfValues => {
  const errors = {...initialErrorDeclineModal};
  let isOtherReason = false;
  let isValidInputs = true;
  for (const [key, value] of Object.entries(objOfValues)) {
    if (key === 'reason') {
      if (value?.id === 2) {
        isOtherReason = true;
      }
      errors[key] = value ? '' : ValidateInput.checkRequiredField('');
    } else {
      errors[key] = ValidateInput.checkRequiredField(value);
    }
  }
  for (const [key, value] of Object.entries(errors)) {
    if (!isOtherReason && (key === 'reason' || value !== '')) {
      isValidInputs = false;
    }
  }
  return {errors, isValidInputs};
};

const getErrors = (showError, error, initError) => {
  return showError ? error : initError;
};

const DeclineModalView = ({hideDeclineModal}) => {
  const [inputState, setInputState] = useState({...initialDeclineInputsState});
  const [errors, setErrors] = useState({...initialErrorDeclineModal});
  const [showError, setShowError] = useState(false);

  const declineReasons = useMemo(() => getCopyObjsFromArray(DECLINE_REASONS), []);

  const onPressConfirm = () => {
    if (!showError) {
      setShowError(true);
    }
    const {errors: updatedErrors, isValidInputs} = validateInputs(inputState);
    setErrors(updatedErrors);
    logService.log(isValidInputs);
    // if (isValidInputs) {
    // }
  };
  const updateFieldAndError = (field, value) => {
    const updateInputState = {
      ...inputState,
      [field]: value,
    };
    setInputState(updateInputState);
    setErrors(validateInputs(updateInputState).errors);
  };

  return (
    <>
      <View style={[HELPERS.fullWidth, METRICS.padding]}>
        <Text style={styles.declineContractHeader}>
          {translate('propertyPost.guaranteeContractInfo.declineContract')}
        </Text>
        <DropdownWithTitle
          inputStyle={{...commonStyles.dropdownInput, ...{borderColor: COLORS.GRAY_C9}}}
          title={translate(STRINGS.REASON)}
          headerStyles={styles.declineReasonLabel}
          dropdownTitle={translate(STRINGS.SELECT_REASON)}
          dropdownPlaceHolderStyle={COLORS.GRAY_A3}
          items={declineReasons}
          onChosen={item => updateFieldAndError('reason', item)}
          error={getErrors(showError, translate(errors.reason), initialErrorDeclineModal.reason)}
          isRequired
        />
        {inputState.reason?.id === 2 && (
          <>
            <View style={[HELPERS.rowSpaceBetween, METRICS.marginTop]}>
              <RequiredLabel
                title={translate('common.enterReason')}
                titleStyle={styles.declineReasonLabel}
              />
              <Text
                style={
                  styles.declineReasonTextLength
                }>{`${inputState.reasonDetail.length}/${MAX_LENGTH.NOTE}`}</Text>
            </View>
            <InputSection
              inputStyle={commonStyles.multilineInput}
              customStyle={METRICS.resetPaddingVertical}
              placeholder={translate('propertyPost.guaranteeContractInfo.enterReasonPlaceholder')}
              placeHolderColor={COLORS.GRAY_A3}
              value={inputState.reasonDetail}
              onChangeText={text => updateFieldAndError('reasonDetail', text)}
              showMultilineInputView
              error={getErrors(
                showError,
                errors.reasonDetail,
                initialErrorDeclineModal.reasonDetail,
              )}
              maxLength={MAX_LENGTH.NOTE}
              isRequired
            />
          </>
        )}
      </View>
      <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
        <CustomFooterButtons
          cancelButtonStyle={styles.declineButton}
          cancelTextStyle={styles.declineText}
          nextButtonStyle={styles.agreeButton}
          nextTextStyle={styles.agreeText}
          cancelButtonTitle={translate('common.abort')}
          nextButtonTitle={translate(STRINGS.CONFIRM)}
          onPressCancel={hideDeclineModal}
          onPressNext={onPressConfirm}
        />
      </View>
    </>
  );
};

const GuaranteeContractDetailScreen = ({navigation}) => {
  const {state} = useContext(NewPostContext);
  const [isAgreedAgreement, setIsAgreedAgreement] = useState(false);
  const userInfo = useSelector(getUser);
  const declineModal = useRef(null);

  const [getUserInfo, {data: agentInfo}] = useGetUserByIdLazyQuery({...FETCH_POLICY.NETWORK_ONLY});

  useMount(() => {
    getUserInfo({variables: {userId: userInfo.id}});
  });

  const onPressDecline = () => {
    declineModal.current?.open();
  };

  const hideDeclineModal = () => {
    declineModal.current?.close();
  };

  const onPressAgree = () => {
    const mobilePhone = agentInfo?.userById?.userDto?.phoneNumber ?? '';

    navigation.navigate(ScreenIds.GuaranteeContractOTP, {
      mobilePhone,
      nextScreenId: ScreenIds.ViewPropertyPost,
      inviteCode: '',
    });
  };

  const getModals = () => (
    <>
      <ModalWithModalize getModalRef={declineModal} handlePosition="outside">
        <DeclineModalView hideDeclineModal={hideDeclineModal} navigation={navigation} />
      </ModalWithModalize>
    </>
  );
  const modals = useMemo(getModals, []);

  return (
    <BaseScreen
      title={translate('propertyPost.contractAndPayment')}
      showHeaderShadow
      containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
      modals={modals}>
      <View style={styles.container}>
        <Text style={styles.screenTitle}>{translate('propertyPost.contractInfo')}</Text>
        <View style={commonStyles.separatorRow16} />
        <TextWithBulletPoint text={translate('propertyPost.guaranteeContractInfo.info1')} />
        <TextWithBulletPoint text={translate('propertyPost.guaranteeContractInfo.info2')} />
        <TextWithBulletPoint text={translate('propertyPost.guaranteeContractInfo.info3')} />
        <View style={commonStyles.separatorRow16} />
        <DownloadDocumentView document={state.originState?.guaranteedPackage?.contractDocument} />
      </View>
      <View style={styles.agreementAssuranceContainer}>
        <CustomCheckbox
          iconCheckedColor={COLORS.PRIMARY_A100}
          title={translate('propertyPost.guaranteeContractInfo.agreementAssuranceDescription')}
          onChange={setIsAgreedAgreement}
        />
      </View>
      <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
        <CustomFooterButtons
          cancelButtonStyle={styles.declineButton}
          cancelTextStyle={styles.declineText}
          nextButtonStyle={[styles.agreeButton, isAgreedAgreement || styles.agreeButtonDisabled]}
          nextTextStyle={[styles.agreeText, isAgreedAgreement || styles.agreeTextDisabled]}
          cancelButtonTitle={translate('common.decline')}
          nextButtonTitle={translate(STRINGS.AGREE)}
          disabledNext={!isAgreedAgreement}
          onPressCancel={onPressDecline}
          onPressNext={onPressAgree}
        />
      </View>
    </BaseScreen>
  );
};

export default GuaranteeContractDetailScreen;
