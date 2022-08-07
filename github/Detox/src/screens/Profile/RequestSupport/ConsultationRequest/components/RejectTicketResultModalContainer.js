import {useNavigation} from '@react-navigation/native';
import React, {forwardRef, useContext, useRef, useState} from 'react';
import {Text, View} from 'react-native';

import {
  OffsetPagingOfSupportServiceTicketResultUpdateReasonDto,
  useGetsupportServiceTicketResultUpdateReasonsLazyQuery,
} from '../../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../../api/graphql/useGraphqlApiLazy';
import {AppContext} from '../../../../../appData/appContext/appContext';
import {
  FETCH_POLICY,
  MAX_LENGTH,
  REJECT_TICKET_RESULT_REASONS_BY_NAME_TO_ID,
} from '../../../../../assets/constants';
import {translate} from '../../../../../assets/localize';
import {STRINGS} from '../../../../../assets/localize/string';
import {COLORS} from '../../../../../assets/theme/colors';
import {FONTS} from '../../../../../assets/theme/fonts';
import {HELPERS} from '../../../../../assets/theme/helpers';
import {METRICS} from '../../../../../assets/theme/metric';
import {commonStyles} from '../../../../../assets/theme/styles';
import CustomFooterButtons from '../../../../../components/Button/CustomFooterButtons';
import DropdownWithTitle from '../../../../../components/DropdownWithTitle';
import InputSection from '../../../../../components/InputSection';
import ModalWithModalize from '../../../../../components/Modal/ModalWithModalize';
import ValidateInput from '../../../../../utils/ValidateInput';
import {useMount} from '../../../../commonHooks';
import {useRequesterRejectTicketResult} from '../../hooks';
import {RejectTicketResultModalContainerProps} from '../../type';

const validateInputs = inputsValue => {
  const {reasonId, reasonNote} = inputsValue ?? {};

  const errors = {
    rejectReasonPicker: ValidateInput.checkRequiredField(reasonId),
    rejectReasonNote:
      reasonId === REJECT_TICKET_RESULT_REASONS_BY_NAME_TO_ID.Other
        ? ValidateInput.checkRequiredField(reasonNote)
        : '',
  };

  let isValid = true;
  for (const error in errors) {
    if (errors[error]) {
      isValid = false;
    }
  }

  return {
    ...errors,
    isValid,
  };
};

export const useRejectTicketResultView = (props: RejectTicketResultModalContainerProps) => {
  const {ticketId} = props;
  const rejectTicketResultModal = useRef();

  const openModal = () => {
    rejectTicketResultModal?.current?.open();
  };

  const closeModal = () => {
    rejectTicketResultModal?.current?.close();
  };

  return {
    view: <RejectTicketResultModalContainer ticketId={ticketId} ref={rejectTicketResultModal} />,
    openModal,
    closeModal,
  };
};

const RejectTicketResultModalContainer = forwardRef(
  (props: RejectTicketResultModalContainerProps, ref) => {
    const {ticketId} = props;
    const navigation = useNavigation();

    const {showAppModal, showErrorAlert} = useContext(AppContext);
    const [reasons, setReasons] = useState([]);
    const [chosenReason, setChosenReason] = useState({});
    const [reasonNote, setReasonNote] = useState('');
    const [errors, setErrors] = useState({
      rejectReasonPicker: '',
      rejectReasonNote: '',
    });

    const rejectTicketResultModal = useRef();

    const onSuccessResponse = res => {
      if (res.errorCode === 0) {
        showAppModal({
          isVisible: true,
          title: '',
          message: translate(STRINGS.UPDATE_STATUS_SUCCESSFULLY),
          onOkHandler: () => {
            closeModal();
            navigation.canGoBack() && navigation.goBack();
          },
        });
      } else {
        showErrorAlert(res.errorMessage);
      }
    };

    const {rejectTicketResult} = useRequesterRejectTicketResult({onSuccess: onSuccessResponse});

    const {startApi} = useGraphqlApiLazy({
      graphqlApiLazy: useGetsupportServiceTicketResultUpdateReasonsLazyQuery,
      dataField: 'supportServiceTicketResultUpdateReasons',
      queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
      onSuccess: (res: OffsetPagingOfSupportServiceTicketResultUpdateReasonDto) => {
        if (res?.edges?.length > 0) {
          const mappedReasons = res.edges.map(e => ({
            id: e.supportServiceTicketResultUpdateReasonId,
            name: e.supportServiceTicketResultUpdateReasonDescription,
            checked: false,
          }));
          setReasons(mappedReasons);
        }
      },
    });

    useMount(() => {
      startApi();
    });

    const onChooseRejectReason = item => {
      setChosenReason(item);
      setReasonNote('');
    };

    const onSubmit = () => {
      const inputErrors = validateInputs({
        reasonNote,
        reasonId: chosenReason?.id,
      });
      if (inputErrors.isValid) {
        rejectTicketResult(ticketId, reasonNote, chosenReason?.id);
      } else {
        setErrors(inputErrors);
      }
    };

    const closeModal = () => {
      if (ref) {
        ref.current?.close();
      } else {
        rejectTicketResultModal?.current?.close();
      }
    };

    const showInput = chosenReason?.id === REJECT_TICKET_RESULT_REASONS_BY_NAME_TO_ID.Other;

    return (
      <ModalWithModalize getModalRef={ref ? ref : rejectTicketResultModal}>
        <View style={[HELPERS.fullWidth, METRICS.padding]}>
          <Text style={{...commonStyles.blackTextBold12, ...FONTS.fontSize24}}>
            {translate('common.notAgree')}
          </Text>
          <DropdownWithTitle
            colorTheme={COLORS.PRIMARY_A100}
            style={METRICS.mediumMarginTop}
            inputStyle={commonStyles.inputBorderWithIcon}
            title={translate(STRINGS.REASON)}
            headerStyles={commonStyles.blackText14}
            dropdownTitle={translate(STRINGS.PLEASE_SELECT)}
            popupTitle={translate(STRINGS.REASON)}
            items={reasons}
            error={translate(errors?.rejectReasonPicker)}
            showSearchBox={false}
            itemSelected={onChooseRejectReason}
            isRequired
          />
          {showInput && (
            <InputSection
              headerTitle={translate('common.enterReason') + ':'}
              headerStyles={{...commonStyles.blackText14, color: COLORS.BRAND_GREY}}
              inputStyle={commonStyles.multilineInput}
              value={reasonNote}
              onChangeText={setReasonNote}
              isRequired
              multiline
              showMultilineInputView
              showLimitedLength
              maxLength={MAX_LENGTH.NOTE}
              error={errors?.rejectReasonNote}
            />
          )}
        </View>
        <View
          style={[
            commonStyles.footerContainer,
            commonStyles.borderTop,
            METRICS.resetPaddingBottom,
          ]}>
          <CustomFooterButtons
            cancelButtonTitle={translate(STRINGS.CLOSE)}
            nextButtonTitle={translate(STRINGS.CONFIRM)}
            onPressCancel={closeModal}
            onPressNext={onSubmit}
          />
        </View>
      </ModalWithModalize>
    );
  },
);

export default RejectTicketResultModalContainer;
