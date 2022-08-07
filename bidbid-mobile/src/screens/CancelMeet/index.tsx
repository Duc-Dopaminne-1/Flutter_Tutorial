import React, { ReactElement, useState } from 'react';
import {
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ImageStyle,
  TextInput,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { GlobalProps } from '@/shared/Interface';
import { useDispatch, useSelector } from 'react-redux';
import { cancelMeet } from '@/redux/myBids/actions';
import NavigationActionsService from '@/navigation/navigation';
import { BID_SCREEN } from '@/navigation/screenKeys';
import { CancelAuction } from '@/models';
import { UserInit } from '@/redux/user/reducer';
import CustomConfirmModal from '@/components/CustomModal';
import { getUser } from '@/redux/user/actions';
import ErrorDialog from '../DeletetAccount/ErrorDialog';
import { isIOS } from '@/shared/devices';
import { getTransactionsRequired } from '@/redux/payment/actions';
import IconBack from '@/components/SVG/BackSvg';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';

export function CancelMeetScreen(props: GlobalProps): ReactElement {
  const dispatch = useDispatch();
  const auctionId = props.route.params ? props.route.params?.auctionId : '';
  const auctionCreatorId = props.route.params ? props.route.params?.auctionCreatorId : '';

  const { id } = useSelector((state: UserInit) => state.user.data);

  //State
  const [radioChangedMyMindSelected, setRadioChangedMyMind] = useState(false);
  const [radioOtherSelected, setRadioOtherSelected] = useState(false);
  const [showErrorMessage, setShowErrorMesssage] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const iconRadioChangedMyMind = radioChangedMyMindSelected ? <RadioCheckedSVG /> : <RadioUnCheckSVG />;
  const iconRadioOtherSelected = radioOtherSelected ? <RadioCheckedSVG /> : <RadioUnCheckSVG />;
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const description =
    auctionCreatorId === id ? language('cancelMeetScreen.biddeeDescription') : language('cancelMeetScreen.bidderDescription');

  const cancelMeetButtonOnPress = () => {
    // if (!radioChangedMyMindSelected && !radioOtherSelected) {
    //   alertError(language('pleaseSelect'), language('error'), null);
    //   return;
    // }

    if (!radioChangedMyMindSelected && !radioOtherSelected) {
      setShowErrorMesssage(true);
      return;
    } else if (radioOtherSelected && (!noteText || noteText.length < 1)) {
      setShowErrorMesssage(true);
      return;
    }

    if (auctionCreatorId === id) {
      onConfirmPress();
    } else {
      setModalVisible(true);
    }
  };

  //CancelMeetConfirmModal Delegate
  const onBackdropPress = () => {
    setModalVisible(false);
  };

  const onConfirmPress = () => {
    setModalVisible(false);
    NavigationActionsService.showLoading();
    let reason = '';
    let note = '';
    if (radioChangedMyMindSelected) {
      reason = CancelAuction.CHANGED_MY_MIND;
    } else {
      reason = CancelAuction.OTHER;
      note = noteText;
    }

    dispatch(
      cancelMeet({
        note,
        reason,
        auctionId,
        onSuccess: () => {
          NavigationActionsService.hideLoading();
          NavigationActionsService.push(BID_SCREEN);
          NavigationActionsService.dispatchAction(getUser({}));

          NavigationActionsService.dispatchAction(
            getTransactionsRequired({
              onSuccess: NavigationActionsService.checkPaymentIssue,
            }),
          );
        },
        onFail: (error: string) => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            // alertError(error, 'ERROR', () => {});
            setErrorMessage(error);
            setErrorDialogVisible(true);
          }, 400);
        },
      }),
    );
  };

  return (
    <KeyboardAvoidingView keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })} style={styles.container} behavior="height">
      <View style={styles.root}>
        <SafeArea />
        <CustomHeader leftIcon={<IconBack />} title={language('cancelMeetScreen.title')} titleStyle={styles.textTitle} />
        <ScrollView style={styles.container}>
          <Text style={styles.desc}>{description}</Text>
          <Pressable
            style={styles.changedMyMindView}
            onPress={() => {
              setRadioChangedMyMind(true);
              setRadioOtherSelected(false);
              setShowErrorMesssage(false);
            }}
          >
            <View style={styles.wrapper_radio_icon}>{iconRadioChangedMyMind}</View>
            <Text style={styles.textStyle}>{language('cancelMeetScreen.iChangedMyMind')}</Text>
          </Pressable>

          <Pressable
            style={styles.otherView}
            onPress={() => {
              setRadioChangedMyMind(false);
              setRadioOtherSelected(true);
            }}
          >
            <View style={styles.wrapper_radio_icon}>{iconRadioOtherSelected}</View>
            <Text style={styles.textStyle}>{language('cancelMeetScreen.other')}</Text>
          </Pressable>
          {showErrorMessage && <Text style={styles.errorMessageStyle}>{language('deleteAccountScreen.yourReasonIsRequired')}</Text>}
          {radioOtherSelected && (
            <>
              <TextInput
                style={styles.textInput}
                onChangeText={text => {
                  setShowErrorMesssage(false);
                  setNoteText(text);
                }}
                value={noteText}
                placeholder={language('cancelMeetScreen.enterTheReason')}
                multiline={true}
                placeholderTextColor={colors.text_light_gray}
              />
            </>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.cancelMeetButton} onPress={cancelMeetButtonOnPress}>
          <Text style={styles.cancelMeetText}>
            {auctionCreatorId === id ? language('cancelMeetGreet') : language('cancelMeetScreen.title')}
          </Text>
        </TouchableOpacity>
      </View>

      <CustomConfirmModal
        isVisible={modalVisible}
        title={auctionCreatorId === id ? language('cancelMeetScreen.modalBiddeeDecs') : language('cancelMeetScreen.modalBidderDecs')}
        textBtnConfirm={language('cancelMeetScreen.confirm')}
        onBackdropPress={onBackdropPress}
        onConfirmPress={onConfirmPress}
      />

      {/* Error Modal */}
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => setErrorDialogVisible(false)}
        errorMessage={errorMessage}
        confirmOnPressed={() => {
          setErrorDialogVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  } as ViewStyle,

  container: {
    flex: 1,
  } as ViewStyle,
  textTitle: {
    color: colors.gray_last_time,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  desc: {
    marginHorizontal: 20,
    lineHeight: 22,
    textAlign: 'auto',
    marginTop: 32,
    color: colors.gray_last_time,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  changedMyMindView: {
    marginHorizontal: 15,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  wrapper_radio_icon: {
    height: 25,
    width: 25,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  textStyle: {
    color: colors.gray_last_time,
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  otherView: {
    marginHorizontal: 15,
    flexDirection: 'row',
    marginTop: 22,
    alignItems: 'center',
  } as ViewStyle,

  textInput: {
    marginLeft: 50,
    marginRight: 15,
    marginTop: 10,
    minHeight: 120,
    padding: 12,
    borderRadius: 5,
    textAlign: 'justify',
    textAlignVertical: 'top',
    fontSize: fonts.size.s16,
    fontFamily: fonts.family.PoppinsRegular,
    color: colors.gray_last_time,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.green_border_beta,
    backgroundColor: colors.white,
  } as TextStyle,

  cancelMeetButton: {
    height: 48,
    marginBottom: 42,
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.red_700,
  } as ViewStyle,

  cancelMeetText: {
    fontSize: fonts.size.s18,
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
    alignItems: 'center',
  } as TextStyle,

  errorMessageStyle: {
    textAlign: 'left',
    marginVertical: 10,
    marginLeft: 50,
    fontSize: fonts.size.s15,
    color: colors.red_700,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
});
