import React, { ReactElement, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import CreateAuctionDuration from '@/screens/CreateAuction/component/CreateAuctionDuration';
import CreateAuctionCategories from '@/screens/CreateAuction/component/CreateAuctionCategories';
import CreateAuctionDonate from '@/screens/CreateAuction/component/CreateAuctionDonate';
import CreateAuctionCharity from '@/screens/CreateAuction/component/CreateAuctionCharity';
import CreateAuctionDateTime from '@/screens/CreateAuction/component/CreateAuctionDateTime';
import CustomButton from '@/components/CustomButton';
import { object, string } from 'yup';
import { Formik, FormikValues } from 'formik';
import { useAlertMessage } from '@/constants/messageConstants';
import { useDispatch } from 'react-redux';
import { createAuction } from '@/redux/auction/actions';
import { alertError } from '@/shared/alert';
import { getMyAuction } from '@/shared/global';
import {
  convertMMDDYYToYYMMDD,
  convertPriceStringToFloat,
  safeObject,
  validateDonate,
  validateEntryPrice,
  validateTimeCreateAuction,
  validateTimeWeekCreateAuction,
} from '@/shared/processing';
import moment from 'moment';
import { RootState } from '@/redux/reducers';
import { useSelector } from 'react-redux';
import NavigationActionsService from '@/navigation/navigation';
import CustomConfirmModal from '@/components/CustomModal';
import CreateAuctionTypeMeet from '@/screens/CreateAuction/component/CreateAuctionTypeMeet';
import { resetValueCharity } from '@/screens/ChooseCharity';
import { TypeMG } from '@/constants/app';
import { isAndroid, isIphoneX } from '@/shared/devices';
import CreateAuctionTimeMeet from '@/screens/CreateAuction/component/CreateAuctionTimeMeet';
import CreateAuctionOfferDetail from '@/screens/CreateAuction/component/CreateAuctionOfferDetail';
import CreateAuctionEntryPrice from '@/screens/CreateAuction/component/CreateAuctionEntryPrice';
import { AUCTION_TYPE } from '@/models';

const initialValues = {
  durationId: '',
  durationTime: '',
  categories: [],
  entryPrice: '',
  donate: '',
  charities: '',
  date: '',
  time: '',
  timeMeetId: '',
  placeMeet: '',
  offerDetail: '',
};

let dataAuction = null;

export function CreateAuctionRaffleFormik(): ReactElement {
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state: RootState) => {
    return state;
  });
  const inputRef = useRef<ScrollView>(null);
  const alertMessage = useAlertMessage();

  let validationSchema = {
    durationId: string().required(alertMessage.EMPTY_CHOOSE),
    durationTime: string().required(alertMessage.EMPTY_CHOOSE),
    categories: string().required(alertMessage.LEAST_ONE),
    entryPrice: string().required(alertMessage.EMPTY_FIELD).test('entryPrice', language('entryPriceError'), validateEntryPrice),
    donate: string().required(alertMessage.EMPTY_CHOOSE).test('donate', alertMessage.EMPTY_FIELD, validateDonate),
    charities: string().required(alertMessage.EMPTY_FIELD),
    date: string()
      .test('dateWeek', language('meetGreetWeek'), validateTimeWeekCreateAuction)
      .test('date', language('meetAndGreetError'), validateTimeCreateAuction),
    time: string().required(alertMessage.EMPTY_FIELD),
    placeMeet: isOnline ? string().nullable().notRequired() : string().required(alertMessage.EMPTY_FIELD),
    timeMeetId: string().required(alertMessage.EMPTY_CHOOSE),
    typeMeet: string().required(alertMessage.EMPTY_CHOOSE),
    offerDetail: string().trim(),
  };

  let schemaValidation = object().shape(validationSchema);

  const { paymentMethodId } = user.data;

  const checkValidPayment = (): boolean => {
    return !(!paymentMethodId || paymentMethodId === 0);
  };

  const onContinue = (value: FormikValues) => {
    dataAuction = value;
    setModalVisible(true);
  };

  const onSuccess = () => {
    NavigationActionsService.hideLoading();

    resetValueCharity();
    getMyAuction.next('');
    NavigationActionsService.goBack();
    NavigationActionsService.goBack();
  };

  const onFail = (error: string) => {
    NavigationActionsService.hideLoading();
    setTimeout(() => {
      alertError(error);
    }, 400);
  };

  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const onConfirmPress = () => {
    onBackdropPress();
    setTimeout(() => {
      onCreateAuction();
    }, 500);
  };

  const onCreateAuction = () => {
    NavigationActionsService.showLoading();
    const { offerDetail, date, time, durationId, categories, entryPrice, donate, charities, placeMeet, timeMeetId } = dataAuction;

    const entryPriceMain = entryPrice ? convertPriceStringToFloat(entryPrice) : entryPrice;
    const formatTime = moment(time, 'h:mm A').format('HH:mm');
    const times = convertMMDDYYToYYMMDD(moment(date, 'L').format('MM/DD/YYYY')) + 'T' + formatTime + ':00';
    const meetDate = moment(times).toISOString();

    if (!checkValidPayment()) {
      NavigationActionsService.hideLoading();
      Alert.alert(
        language('alert.notice'),
        language('createAuctionsWithPaymentRequired'),
        [{ text: language('alert.ok'), onPress: () => {} }],
        {
          cancelable: false,
        },
      );
      return;
    }

    const data = {
      type: AUCTION_TYPE.RAFFLE,
      auctionDurationId: durationId,
      categoryIds: categories,
      entryPrice: entryPriceMain,
      donationPercentId: donate,
      charityId: charities,
      meetDate,
      meetingDurationId: timeMeetId,
      meetPlace: {
        name: placeMeet ? placeMeet.addressMain : '',
        address: placeMeet ? placeMeet.addressMain : '',
        lng: placeMeet ? placeMeet.via_Points[0].longitude : '',
        lat: placeMeet ? placeMeet.via_Points[0].latitude : '',
        placeId: placeMeet.placeId,
      },
      offering: offerDetail,
    };

    if (!placeMeet) {
      delete data['meetPlace'];
    }

    const param = safeObject(data);

    dispatch(
      createAuction({
        data: param,
        onSuccess,
        onFail: onFail,
      }),
    );
  };

  const onSelectTypePlace = (type: string, setFieldValue, setFieldError) => {
    setFieldValue('typeMeet', 'complete');
    setFieldError('typeMeet', '');
    if (type === TypeMG.Offline) {
      setFieldError('placeMeet', '');
      setIsOnline(false);
    } else if (type === TypeMG.Online) {
      setFieldValue('placeMeet', '');
      setFieldError('placeMeet', '');
      setIsOnline(true);
    } else {
      setFieldValue('placeMeet', '');
      setFieldError('placeMeet', '');
      setFieldValue('typeMeet', '');
    }
  };

  const onFocusInput = () => {
    inputRef.current?.scrollToEnd({ animated: true });
  };

  const renderBody = (errors, setFieldValue, setFieldError) => {
    return (
      <ScrollView
        ref={inputRef}
        keyboardShouldPersistTaps={'handled'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.containerScroll}
      >
        <CreateAuctionDuration isFromRaffle setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionCategories setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionEntryPrice setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionCharity setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionDonate setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionDateTime setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionTimeMeet setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
        <CreateAuctionTypeMeet
          onSelectTypePlace={onSelectTypePlace}
          setFieldError={setFieldError}
          setFieldValue={setFieldValue}
          errors={errors}
        />
        <CreateAuctionOfferDetail onFocusInput={onFocusInput} setFieldError={setFieldError} setFieldValue={setFieldValue} errors={errors} />
      </ScrollView>
    );
  };

  return (
    <Formik validateOnChange={false} initialValues={initialValues} onSubmit={onContinue} validationSchema={schemaValidation}>
      {({ handleSubmit, errors, setFieldValue, setFieldError }) => {
        return (
          <>
            {isAndroid ? (
              renderBody(errors, setFieldValue, setFieldError)
            ) : (
              <KeyboardAvoidingView behavior="padding" style={styles.wrapBody}>
                {renderBody(errors, setFieldValue, setFieldError)}
              </KeyboardAvoidingView>
            )}

            <View style={styles.wrapButton}>
              <CustomButton
                onPress={handleSubmit}
                textStyle={styles.textBtn}
                containerStyle={styles.btnContinue}
                text={language('createRaffle')}
              />
            </View>
            <CustomConfirmModal
              isVisible={modalVisible}
              title={language('editAuction')}
              textBtnConfirm={language('confirm')}
              onBackdropPress={onBackdropPress}
              onConfirmPress={onConfirmPress}
            />
          </>
        );
      }}
    </Formik>
  );
}

const styles = StyleSheet.create({
  containerScroll: {
    paddingBottom: 42,
    paddingHorizontal: 24,
  },
  wrapButton: {
    paddingTop: isIphoneX() ? 15 : 15,
    paddingBottom: isIphoneX() ? 30 : 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    shadowColor: colors.gray_shadow_beta,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 30,
  },
  btnContinue: {
    width: null,
    backgroundColor: colors.red_700,
  },
  textBtn: {
    fontSize: fonts.size.s18,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: null,
    color: colors.white,
  },
  wrapBody: {
    flex: 1,
  },
});
