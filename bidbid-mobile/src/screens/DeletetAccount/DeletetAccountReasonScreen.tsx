import React, { ReactElement, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TextStyle,
  ViewStyle,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { colors, fonts } from '@/vars';
import { deleteAccount } from '@/redux/user/actions';

import DeletetAccountConfirmDialog from './DeletetAccountConfirmDialog';
import { RootState } from '@/redux/reducers';
import NavigationActionsService from '@/navigation/navigation';
import { DELETE_ACCOUNT_REASON } from '@/constants/app';
import { logout } from '@/redux/auth/actions';
import { SocketManager } from '@/shared/socket/socket-manager';
import { WELCOME_SCREEN } from '@/navigation/screenKeys';
import ErrorDialog from './ErrorDialog';
import { isIOS, isIphoneX } from '@/shared/devices';
import CustomButton from '@/components/CustomButton';
import IconBack from '@/components/SVG/BackSvg';
import RadioCheckedSVG from '@/components/SVG/RadioCheckedSVG';
import RadioUnCheckSVG from '@/components/SVG/RadioUnCheckSVG';

enum RadioType {
  SOMETHING_IS_BROKEN = 0,
  BREAK_FROM_BIDBID = 1,
  DONT_LIKE_BIDBID = 2,
  OTHER = 3,
}

export default function DeletetAccountReasonScreen(): ReactElement {
  const dispatch = useDispatch();

  const [showErrorMessage, setShowErrorMesssage] = useState(false);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [noteText, setNoteText] = useState('');
  const inputRef = useRef<ScrollView>(null);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onShowKeyboard);

    return () => {
      Keyboard.removeListener('keyboardDidShow', onShowKeyboard);
    };
  }, []);

  const onShowKeyboard = () => {
    inputRef.current?.scrollToEnd({ animated: true });
  };

  const { user } = useSelector((state: RootState) => {
    return state;
  });

  const [dialogConfirmVisible, setDialogConfirmVisible] = useState(false);

  const [radioChecked, setRadioChecked] = useState<RadioType>(RadioType.SOMETHING_IS_BROKEN);

  const deleteMyAccountOnPressed = () => {
    if (radioChecked !== RadioType.BREAK_FROM_BIDBID && (!noteText || noteText.trim().length < 50)) {
      setShowErrorMesssage(true);
      setTimeout(onShowKeyboard, 100);
      return;
    } else {
      setDialogConfirmVisible(true);
    }
  };

  const radioOnPressed = (raidoType: RadioType) => {
    setShowErrorMesssage(false);
    setRadioChecked(raidoType);
  };

  const onBackdropPress = () => {
    setDialogConfirmVisible(false);
  };

  const getReason = () => {
    let reason = '';
    switch (radioChecked) {
      case RadioType.SOMETHING_IS_BROKEN:
        reason = DELETE_ACCOUNT_REASON.SOMETHING_IS_BROKEN;
        break;
      case RadioType.BREAK_FROM_BIDBID:
        reason = DELETE_ACCOUNT_REASON.I_NEED_A_BREAK_FROM_BIDBID;
        break;
      case RadioType.DONT_LIKE_BIDBID:
        reason = DELETE_ACCOUNT_REASON.I_DONT_LIKE_BIDBID;
        break;
      case RadioType.OTHER:
        reason = DELETE_ACCOUNT_REASON.OTHER;
        break;
      default:
        reason = DELETE_ACCOUNT_REASON.OTHER;
        break;
    }
    return reason;
  };
  //Dialog Confirm Delegate
  const confirmOnPressedCallback = async () => {
    const userId = user.data.id;
    const reason = getReason();
    const note = radioChecked === RadioType.BREAK_FROM_BIDBID ? null : noteText?.trim?.();

    NavigationActionsService.showLoading();

    dispatch(
      deleteAccount({
        userId: userId,
        reason: reason,
        note,
        onSuccess: () => {
          dispatch(
            logout({
              onSuccess: () => {
                NavigationActionsService.hideLoading();
                SocketManager.close();
                NavigationActionsService.setRoot(WELCOME_SCREEN);
              },
              onFail: error => {
                NavigationActionsService.hideLoading();
                setTimeout(() => {
                  // alertError(error, 'ERROR', () => {});
                  setErrorMessage(error);
                  setErrorDialogVisible(true);
                }, 400);
              },
            }),
          );
        },
        onFail: error => {
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

  const renderReasonInput = (radioType: RadioType) => {
    if (radioChecked !== radioType) return null;

    return (
      <>
        <TextInput
          style={styles.textInput}
          onChangeText={text => {
            setShowErrorMesssage(false);
            setNoteText(text);
          }}
          placeholder={language('cancelMeetScreen.enterTheReason')}
          multiline={true}
          value={noteText}
          onFocus={() => {
            setShowErrorMesssage(false);
          }}
          placeholderTextColor={colors.text_light_gray}
        />
        {showErrorMessage && <Text style={styles.errorMessageStyle}>{language('deleteAccountScreen.yourReasonIsRequired')}</Text>}
      </>
    );
  };

  const body = () => {
    return (
      <>
        <Text style={styles.description}>{language('deleteAccountReasonScreen.description')}</Text>

        {/* Some thing is broken */}
        <Pressable style={styles.rowView} onPress={() => radioOnPressed(RadioType.SOMETHING_IS_BROKEN)}>
          <View style={styles.radioWrapper}>
            {radioChecked === RadioType.SOMETHING_IS_BROKEN ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
          </View>
          <Text style={styles.radioText}>{language('deleteAccountReasonScreen.somethingIsBroken')}</Text>
        </Pressable>
        {renderReasonInput(RadioType.SOMETHING_IS_BROKEN)}

        {/* Break from is BidBid */}
        <Pressable style={styles.rowView} onPress={() => radioOnPressed(RadioType.BREAK_FROM_BIDBID)}>
          <View style={styles.radioWrapper}>
            {radioChecked === RadioType.BREAK_FROM_BIDBID ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}
          </View>
          <Text style={styles.radioText}>{language('deleteAccountReasonScreen.breakFromBidBid')}</Text>
        </Pressable>
        {/* {renderReasonInput(RadioType.BREAK_FROM_BIDBID)} */}

        {/* Dont Like BidBid */}
        <Pressable style={styles.rowView} onPress={() => radioOnPressed(RadioType.DONT_LIKE_BIDBID)}>
          <View style={styles.radioWrapper}>{radioChecked === RadioType.DONT_LIKE_BIDBID ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}</View>
          <Text style={styles.radioText}>{language('deleteAccountReasonScreen.dontLikeBidBid')}</Text>
        </Pressable>
        {renderReasonInput(RadioType.DONT_LIKE_BIDBID)}

        {/* Other */}
        <Pressable style={styles.rowView} onPress={() => radioOnPressed(RadioType.OTHER)}>
          <View style={styles.radioWrapper}>{radioChecked === RadioType.OTHER ? <RadioCheckedSVG /> : <RadioUnCheckSVG />}</View>
          <Text style={styles.radioText}>{language('deleteAccountReasonScreen.other')}</Text>
        </Pressable>

        {renderReasonInput(RadioType.OTHER)}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('deleteAccountScreen.title')} titleStyle={styles.textTitle} />

      <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} style={styles.container}>
        <ScrollView ref={inputRef} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
          {body()}
        </ScrollView>

        <CustomButton
          onPress={deleteMyAccountOnPressed}
          containerStyle={styles.btnContinue}
          text={language('deleteAccountScreen.deleteMyAccount')}
          textStyle={styles.deleteMyAccountText}
        />
      </KeyboardAvoidingView>
      <DeletetAccountConfirmDialog
        isVisible={dialogConfirmVisible}
        onBackdropPress={onBackdropPress}
        confirmOnPressedCallback={confirmOnPressedCallback}
      />

      {/* Notice Modal */}
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => setErrorDialogVisible(false)}
        errorMessage={errorMessage}
        confirmOnPressed={() => {
          setErrorDialogVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  } as ViewStyle,

  rowView: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,

  radioWrapper: {
    padding: 10,
    width: 40,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,

  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  radioText: {
    textAlign: 'center',
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  description: {
    textAlign: 'left',
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 25,
    fontSize: fonts.size.s15,
    color: colors.gray_500,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  deleteMyAccountText: {
    textAlign: 'center',
    fontSize: fonts.size.s19,
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  textInput: {
    marginLeft: 50,
    marginRight: 25,
    marginTop: 10,
    minHeight: 120,
    padding: 12,
    borderRadius: 10,
    textAlign: 'justify',
    textAlignVertical: 'top',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.enter_reason,
  } as TextStyle,

  errorMessageStyle: {
    textAlign: 'left',
    marginVertical: 10,
    marginLeft: 50,
    fontSize: fonts.size.s15,
    color: colors.red_700,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,
  btnContinue: {
    backgroundColor: colors.red_700,
    paddingVertical: 13,
    marginTop: 10,
    marginBottom: isIphoneX() ? 40 : 30,
    marginHorizontal: 15,
    width: null,
    borderRadius: 36,
  },
});
