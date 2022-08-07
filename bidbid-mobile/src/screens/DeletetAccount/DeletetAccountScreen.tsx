import React, { ReactElement, useState } from 'react';
import { StyleSheet, TextStyle, ViewStyle, View, Text, Pressable } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { colors, fonts } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { DELETE_ACCOUNT_REASON_SCREEN } from '@/navigation/screenKeys';
import PauseAccountConfirmDialog from './PauseAccountConfirmDialog';
import NavigationActionsService from '@/navigation/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { pauseAccount, unPauseAccount } from '@/redux/user/actions';
import { RootState } from '@/redux/reducers';
import { activeToggleUserPaused, isUserPaused } from '@/shared/processing';
import ErrorDialog from './ErrorDialog';
import { isIOS } from '@/shared/devices';
import IconBack from '@/components/SVG/BackSvg';
import DeleteAccountImageSVG from '@/components/SVG/DeleteAccountImageSVG';

export default function DeletetAccountConfirmDialog(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => {
    return state;
  });
  const { pauses } = user.data;
  const [dialogConfirmVisible, setDialogConfirmVisible] = useState(false);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const pauseMyAccountOnPressed = () => {
    setDialogConfirmVisible(true);
  };

  const onBackdropPress = () => {
    setDialogConfirmVisible(false);
  };

  const deleteMyAccountOnPressed = () => {
    navigation.navigate(DELETE_ACCOUNT_REASON_SCREEN);
  };

  const pauseMyAccountClick = activeToggleUserPaused(pauses) ? pauseMyAccountOnPressed : () => {};
  const pauseMyAccountOpacity = activeToggleUserPaused(pauses) ? 1 : 0.5;

  //Dialog Confirm Delegate
  const confirmOnPressedCallback = async () => {
    NavigationActionsService.showLoading();
    if (!isUserPaused(pauses)) {
      dispatch(
        pauseAccount({
          onSuccess: () => {
            NavigationActionsService.hideLoading();
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
    } else {
      dispatch(
        unPauseAccount({
          onSuccess: () => {
            NavigationActionsService.hideLoading();
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
    }
  };

  const descriptionButton = isUserPaused(pauses)
    ? language('deleteAccountScreen.unPauseMyAccount')
    : language('deleteAccountScreen.pauseMyAccount');

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomHeader leftIcon={<IconBack />} title={language('deleteAccountScreen.title')} titleStyle={styles.textTitle} />
      <View style={styles.mainContain}>
        <View style={styles.deleteAccountWrapperImg}>
          <DeleteAccountImageSVG />
        </View>
        <Text style={styles.title}>{language('deleteAccountScreen.pauseMyAccount')}</Text>
        <Text style={styles.description}>{language('deleteAccountScreen.pauseMyAccountDecs')}</Text>

        <View style={styles.bottomView}>
          <Pressable style={[styles.pauseMyAccountButtonView, { opacity: pauseMyAccountOpacity }]} onPress={pauseMyAccountClick}>
            <Text style={styles.pauseMyAccountText}>{descriptionButton}</Text>
          </Pressable>

          <Pressable style={styles.deleteMyAccountButtonView} onPress={deleteMyAccountOnPressed}>
            <Text style={styles.deleteMyAccountText}>{language('deleteAccountScreen.deleteMyAccount')}</Text>
          </Pressable>
        </View>
      </View>

      <PauseAccountConfirmDialog
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

  mainContain: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,

  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  } as TextStyle,

  deleteAccountWrapperImg: {
    marginTop: 60,
    alignItems: 'center',
  } as ViewStyle,

  title: {
    marginTop: 20,
    fontSize: fonts.size.s20,
    color: colors.black,
    fontFamily: fonts.family.SSPBold,
  } as TextStyle,

  description: {
    textAlign: 'center',
    marginTop: 15,
    width: '60%',
    fontSize: fonts.size.s15,
    color: colors.bg_tab,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  bottomView: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 120,
    bottom: 40,
    alignItems: 'center',
    // backgroundColor: 'red',
  } as ViewStyle,

  pauseMyAccountButtonView: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  pauseMyAccountText: {
    textAlign: 'center',
    fontSize: fonts.size.s19,
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
  } as TextStyle,

  deleteMyAccountButtonView: {
    width: '85%',
    height: 50,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: colors.white,
  } as ViewStyle,

  deleteMyAccountText: {
    textAlign: 'center',
    fontSize: fonts.size.s19,
    color: colors.black,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,
});
