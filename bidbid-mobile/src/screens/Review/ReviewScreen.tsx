import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { StyleSheet, ViewStyle, KeyboardAvoidingView, View, Platform, Keyboard } from 'react-native';
import { colors } from '@/vars';
import { useDispatch, useSelector } from 'react-redux';
import { sendReview } from '@/redux/reviews/actions';
import { RootState } from '@/redux/reducers';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import NavigationActionsService from '@/navigation/navigation';
import ReviewTitle from './ReviewTitle';
import ReviewRatting from './ReviewRatting';
import ReviewOnTimeMG from './ReviewOnTimeMG';
import ReviewAllowMessage from './ReviewAllowMessage';
import ReviewAnyMoreThought from './ReviewAnyMoreThought';
import ReviewSubmitView from './ReviewSubmitView';
import ReviewHowLate from './ReviewHowLate';
import ReviewCommunicateViaText from './ReviewCommunicateViaText';
import ThankYouFeedbackDialog from './ThankYouFeedbackDialog';
import ErrorDialog from '../DeletetAccount/ErrorDialog';
import { language } from '@/i18n';
import { notificationService } from '@/shared/notification';
import CustomConfirmModal from '@/components/CustomModal';
import { isAndroid } from '@/shared/devices';
import { shareContacts } from '@/shared/shareContacts';
import Contacts from 'react-native-contacts';
import { SHARE_CONTACT_SCREEN } from '@/navigation/screenKeys';
import { updateSettingReview } from '@/redux/app/actions';
import { set } from '@/services/storage';
import { IS_FIRST_REVIEW } from '@/constants/app';
import { getStatusFirstReview } from '@/redux/app/selector';
import { getListRoom } from '@/redux/messages/actions';
import { getAuctionDetail } from '@/redux/myBids/actions';

export const LateTimeEmum = {
  UNDER_15_MIN: 'UNDER_15_MIN',
  BETWEEN_15_AND_30_MINN: 'BETWEEN_15_AND_30_MINN',
  OVER_30_MIN: 'OVER_30_MIN',
};

interface ScrollViewValue {
  current: any;
}

export default function ReviewScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const scrollViewRef: ScrollViewValue = useRef() || { current: {} };
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { reviews } = useSelector((state: RootState) => {
    return state;
  });
  const reviewObject = (reviews.data && reviews.data[0]) || {};

  const { auction } = reviewObject;
  const [rating, setRatting] = useState(0); //0 is Un-Selected,  1 - 5 values
  const [partnerOnTime, setPartnerOnTime] = useState(-1); //-1, 1, 0
  const [chattingWhenLate, setChattingWhenLate] = useState(-1); //-1, 1, 0
  const [continueAllowingMessage, setContinueAllowingMessage] = useState(-1); //-1, 1, 0
  const [thankYouFeedbackDialogVisible, setThankYouFeedbackDialogVisible] = useState(false);
  const [modalVisibleShareContact, setModalVisibleShareContact] = useState(false);
  const [lateTimeSelected, setLateTimeSelected] = useState('');
  const [noteText, setNoteText] = useState('');
  const shouldHideFormReview = useRef(false);

  useEffect(() => {
    notificationService.setStatusZoom(true);

    return () => {
      notificationService.setStatusZoom(false);
    };
  }, []);

  const onBackdropPressed = () => {
    setThankYouFeedbackDialogVisible(false);
    if (getStatusFirstReview()) {
      setTimeout(() => {
        setModalVisibleShareContact(true);
      }, 700);
      return;
    }
    navigation.canGoBack() && navigation.goBack();
  };

  const checkValid = () => {
    let valid = true;
    let errorMessage = '';

    if (rating === 0) {
      errorMessage = language('reviewScreen.ratingIsRequired');
      valid = false;
    } else if (partnerOnTime === -1) {
      errorMessage = language('reviewScreen.onTimeIsRequired');
      valid = false;
    } else if (partnerOnTime === 0 && chattingWhenLate === -1) {
      errorMessage = language('reviewScreen.communicateViaTextIsRequired');
      valid = false;
    } else if (chattingWhenLate === 0 && lateTimeSelected === '') {
      errorMessage = language('reviewScreen.howLateIsRequired');
      valid = false;
    } else if (continueAllowingMessage === -1) {
      errorMessage = language('reviewScreen.continueAllowMessageIsRequired');
      valid = false;
    } else if (rating <= 2 && noteText.trim().length === 0) {
      errorMessage = language('reviewScreen.anyThoughts');
      valid = false;
    } else {
      errorMessage = '';
      valid = true;
    }
    if (!valid) {
      setErrorMessage(errorMessage);
      setErrorDialogVisible(true);
    }
    return valid;
  };

  const submitOnPressed = () => {
    if (checkValid()) {
      NavigationActionsService.showLoading();
      let information = {
        partnerOnTime: partnerOnTime === 1 ? true : false,
      };

      if (partnerOnTime === 0) information['chattingWhenLate'] = chattingWhenLate === 1 ? true : false;
      if (chattingWhenLate === 0) information['lateTime'] = lateTimeSelected;

      dispatch(
        sendReview({
          auctionId: auction.id,
          score: rating,
          keepContact: continueAllowingMessage === 1 ? true : false,
          note: noteText,
          information: information,
          callback: {
            onSuccess: () => {
              NavigationActionsService.hideLoading();
              NavigationActionsService.dispatchAction(getListRoom({}));
              NavigationActionsService.dispatchAction(
                getAuctionDetail({
                  auctionId: auction.id,
                }),
              );
              setTimeout(() => {
                shouldHideFormReview.current = true;
                setThankYouFeedbackDialogVisible(true);
              }, 400);
            },
            onFail: error => {
              NavigationActionsService.hideLoading();
              setTimeout(() => {
                setErrorMessage(error);
                setErrorDialogVisible(true);
              }, 400);
            },
          },
        }),
      );
    }
  };

  const keyboardDidShow = () => {
    scrollViewRef && scrollViewRef.current.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', keyboardDidShow);

    return () => {
      Keyboard.removeListener('keyboardDidShow', keyboardDidShow);
    };
  }, []);

  const onBackdropPressModalShareContact = () => {
    handleDisableShare();
    setModalVisibleShareContact(false);
    navigation.canGoBack() && navigation.goBack();
  };

  const getContact = () => {
    Contacts.getAll()
      .then(contacts => {
        handleDisableShare();
        shareContacts.filterContact(contacts);
        setModalVisibleShareContact(false);
        navigation.canGoBack() && navigation.goBack();
        NavigationActionsService.push(SHARE_CONTACT_SCREEN);
      })
      .catch(async _e => {
        handleDisableShare();
        setModalVisibleShareContact(false);
        navigation.canGoBack() && navigation.goBack();
      });
  };

  const handleDisableShare = () => {
    set(IS_FIRST_REVIEW, 'false');
    NavigationActionsService.dispatchAction(
      updateSettingReview({
        data: false,
      }),
    );
  };

  const onConfirmPressModalShareContact = async () => {
    if (isAndroid) {
      if (await shareContacts.hasAndroidPermission()) {
        getContact();
      } else {
        handleDisableShare();
      }
    } else {
      getContact();
    }
  };

  return (
    <KeyboardAvoidingView style={styles.wrapModal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, shouldHideFormReview.current && styles.viewHide]}>
        {/* Title */}
        <ReviewTitle />
        <ScrollView style={styles.scrollView} ref={scrollViewRef}>
          {/* Ratting View */}
          <ReviewRatting reviewObject={reviewObject} rating={rating} ratingSelectedCallBack={rating => setRatting(rating)} />

          {/* On time for the Meet & Greet */}
          <ReviewOnTimeMG
            reviewObject={reviewObject}
            partnerOnTime={partnerOnTime}
            partnerOnTimeSelected={flag => setPartnerOnTime(flag)}
          />

          {/* Did they communicate via text they were running late? */}
          {!partnerOnTime && (
            <ReviewCommunicateViaText
              reviewObject={reviewObject}
              chattingWhenLateSelected={chattingWhenLate}
              chattingWhenLateSelectedOnPressed={flag => setChattingWhenLate(flag)}
            />
          )}

          {/* How late were they */}
          {!chattingWhenLate && (
            <ReviewHowLate
              reviewObject={reviewObject}
              lateTimeSelected={lateTimeSelected}
              lateTimeSelectedOnPressed={value => setLateTimeSelected(value)}
            />
          )}

          {/* Continue Allowing Message View */}
          <ReviewAllowMessage
            reviewObject={reviewObject}
            continueAllowingMessage={continueAllowingMessage}
            continueAllowingMessageOnPressed={flag => setContinueAllowingMessage(flag)}
          />

          {/* Any more thoughts View */}
          <ReviewAnyMoreThought
            reviewObject={reviewObject}
            noteText={noteText}
            textInputCallback={text => {
              setNoteText(text);
            }}
          />
        </ScrollView>

        <CustomConfirmModal
          isVisible={modalVisibleShareContact}
          title={language('wantShareBidBid')}
          subTitle={language('shareLater')}
          textBtnCancel={language('no')}
          textBtnConfirm={language('yes')}
          onBackdropPress={onBackdropPressModalShareContact}
          onConfirmPress={onConfirmPressModalShareContact}
        />

        {/* Submit View */}
        <ReviewSubmitView submitOnPressed={submitOnPressed} />

        <ErrorDialog
          title={language('reviewScreen.errorTitle')}
          isVisible={errorDialogVisible}
          onBackdropPress={() => setErrorDialogVisible(false)}
          errorMessage={errorMessage}
          confirmOnPressed={() => {
            setErrorDialogVisible(false);
          }}
        />
      </View>
      <ThankYouFeedbackDialog isVisible={thankYouFeedbackDialogVisible} onBackdropPress={onBackdropPressed} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapModal: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  scrollView: {
    flex: 1,
  } as ViewStyle,

  container: {
    padding: 10,
    flex: 1,
    maxHeight: '85%',
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  viewHide: {
    opacity: 0,
  },
});
