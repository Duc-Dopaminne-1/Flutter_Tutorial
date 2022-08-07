import React, {useState} from 'react';
import {View} from 'react-native';

import {useGetBanksLazyQuery} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {
  CONSTANTS,
  CONTACT_STATUS_ID,
  CONTACT_TRADING_DEPOSIT_STATUS,
  FETCH_POLICY,
} from '../../../../assets/constants';
import {translate} from '../../../../assets/localize';
import {STRINGS} from '../../../../assets/localize/string';
import {COLORS} from '../../../../assets/theme/colors';
import {METRICS} from '../../../../assets/theme/metric';
import {commonStyles} from '../../../../assets/theme/styles';
import CustomFooterButtons from '../../../../components/Button/CustomFooterButtons';
import CustomAgreementComponent from '../../../../components/CustomAgreementComponent';
import ImageViewer from '../../../../components/Image/ImageViewer';
import KeyboardScrollView from '../../../../components/KeyboardScrollView';
import {usePhotoViewer} from '../../../../hooks/usePhotoViewer';
import {getMapImagesForFullscreenView} from '../../../../utils/ImageUtil';
import {useMount} from '../../../commonHooks';
import {TradingDepositAction} from '../TradingDepositDetailScreen';
import TradingDepositInput1Container from './TradingDepositInput1Container';
import TradingDepositInput2Container from './TradingDepositInput2Container';

const TradingDepositDetailContainer = ({
  state,
  dispatch,
  errorState,
  onPressCancelFooterButton,
  onPressNextFooterButton,
  isSending,
}) => {
  const [focusedInput, setFocusedInput] = useState();

  const {startApi: getBanks, data: banks} = useGraphqlApiLazy({
    graphqlApiLazy: useGetBanksLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'banks',
  });

  useMount(() => {
    getBanks({variables: {pageSize: 100}});
  });

  const photoViewer = usePhotoViewer();
  const images = getMapImagesForFullscreenView(state.contactTradingInfo?.deposit?.attachment);
  const depositStatus = state?.contactTradingInfo?.deposit?.depositStatus;
  const contactIsNotCompleted =
    state?.contactTradingInfo?.contactTradingStatusId !== CONTACT_STATUS_ID.Completed;

  const showBottomButton =
    (state?.canEdit &&
      contactIsNotCompleted &&
      depositStatus !== CONTACT_TRADING_DEPOSIT_STATUS.accepted &&
      depositStatus !== CONTACT_TRADING_DEPOSIT_STATUS.signed) ||
    (!isSending && depositStatus === CONTACT_TRADING_DEPOSIT_STATUS.sent);

  const cancelTitle = isSending ? translate(STRINGS.CANCEL) : translate('common.notAgree');
  const nextTitle = isSending ? translate(STRINGS.SAVE) : translate(STRINGS.AGREE);

  const disabledNext = !isSending && !state?.isAgree;

  const onCheckAgreement = value => {
    dispatch({
      type: TradingDepositAction.SET_AGREEMENT_STATUS,
      payload: value,
    });
  };

  const onFocusInput = inputName => {
    setFocusedInput(inputName);
  };

  const onBlurInput = () => {
    setFocusedInput();
  };

  return (
    <>
      <KeyboardScrollView
        keyboardShouldPersistTaps="never"
        extraScrollHeight={CONSTANTS.EXTRA_KEYBOARD_SCROLL_FOR_HEADER}>
        <TradingDepositInput1Container
          state={state}
          dispatch={dispatch}
          errors={errorState}
          banks={banks?.edges ?? []}
          focusedInput={focusedInput}
          onFocusInput={onFocusInput}
          onBlurInput={onBlurInput}
        />
        <View style={commonStyles.separatorRow8} />
        <TradingDepositInput2Container
          state={state}
          dispatch={dispatch}
          errors={errorState}
          photoViewer={photoViewer}
          focusedInput={focusedInput}
          onFocusInput={onFocusInput}
          onBlurInput={onBlurInput}
        />
      </KeyboardScrollView>
      {showBottomButton && (
        <>
          {isSending || (
            <CustomAgreementComponent
              containerStyle={[METRICS.horizontalPadding, METRICS.smallMarginBottom]}
              isAgree={state?.isAgree}
              checkValue={onCheckAgreement}
              agreementFistText={translate('contactTrading.agreementFist')}
            />
          )}
          <View style={[commonStyles.footerContainer, commonStyles.borderTop]}>
            <CustomFooterButtons
              cancelButtonTitle={cancelTitle}
              nextButtonTitle={nextTitle}
              onPressCancel={onPressCancelFooterButton}
              onPressNext={onPressNextFooterButton}
              disabledNext={disabledNext}
              nextTextStyle={disabledNext && {color: COLORS.PRIMARY_A40}}
              nextButtonStyle={disabledNext && {backgroundColor: COLORS.PRIMARY_A20}}
            />
          </View>
        </>
      )}
      <ImageViewer
        visible={photoViewer?.state?.visible}
        images={images.map(item => ({url: item.uri}))}
        hideStatusBar={false}
        initialIndex={photoViewer?.state?.index}
        onDismiss={photoViewer?.onDismissImageViewer}
        hideShareButton={false}
        shareText={translate('common.share')}
      />
    </>
  );
};

export default TradingDepositDetailContainer;
