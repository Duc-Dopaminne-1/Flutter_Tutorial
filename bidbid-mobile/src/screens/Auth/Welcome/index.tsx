import React, { ReactElement, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts, screenHeight } from '@/vars';
import { WelcomeSocial } from '@/screens/Auth/Welcome/component/WelcomeSocial';
import { language } from '@/i18n';
import CustomHeaderTitle from '@/components/CustomHeaderTitle';
import { SignUpPhoneFormik } from '@/screens/Auth/SignUpPhone/component/SignUpPhoneFormik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { WelcomePolicy } from '@/screens/Auth/Welcome/component/WelcomePolicy';
import LogoSvg from '@/components/Icon/LogoSvg';
import { isAndroid, isIOS, isIphoneX } from '@/shared/devices';
import { appVersion } from '@/shared/appVersion';
import { useSelector } from 'react-redux';
import { AppInit } from '@/redux/app/reducer';
import ImgWelcomeSVG from '@/components/SVG/ImgWelcomeSVG';
import NavigationActionsService from '@/navigation/navigation';
import { CREATE_AUCTION_NORMAL_SCREEN } from '@/navigation/screenKeys';

export function WelcomeScreen(): ReactElement {
  const appMinVersion = useSelector((state: AppInit) => state.app.setting.APP_VERSION_MINIMUM);
  // NavigationActionsService.push(CREATE_AUCTION_NORMAL_SCREEN);
  useEffect(() => {
    async function checkVersion() {
      await appVersion.checkVersion();
    }

    checkVersion().then(_r => {});
  }, [appMinVersion]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapBody}>
        <SafeArea backgroundColor={colors.black} />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          extraScrollHeight={20}
          scrollEnabled={false}
          keyboardOpeningTime={0}
          extraHeight={100}
          enableOnAndroid={true}
        >
          <View style={styles.headerContainer}>
            <ImgWelcomeSVG height={screenHeight / 5} />
            <CustomHeaderTitle titleStyle={styles.textTitle} title={language('welcome_to')} />
            <LogoSvg width={110} height={30} style={styles.logo} />
          </View>

          <View style={styles.wrapSignIn}>
            <SignUpPhoneFormik isFocusInput={false} wrapButton={styles.wrapBtnContinue} isAutoLinkSocial={false} />
          </View>
        </KeyboardAwareScrollView>

        <WelcomeSocial />
        <WelcomePolicy containerStyle={styles.policyContainer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapBody: {
    height: screenHeight,
    backgroundColor: colors.white,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  textTitle: {
    fontSize: fonts.size.s34,
    fontFamily: fonts.family.PoppinsSemiBold,
    color: colors.gray_900,
    fontWeight: isIOS ? '600' : 'bold',
    marginTop: 10,
  },
  wrapBtnContinue: {
    marginHorizontal: 20,
    marginTop: 30,
  },
  wrapSignIn: {
    marginTop: 50,
    marginHorizontal: 45,
    justifyContent: 'center',
  },
  policyContainer: {
    marginTop: isIphoneX() ? 35 : 30,
    marginHorizontal: 50,
    paddingBottom: isAndroid ? 0 : isIphoneX() ? 35 : 20,
  },
  logo: {
    padding: 20,
  },
});
