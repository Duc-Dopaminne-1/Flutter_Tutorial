import React, { ReactElement, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { SignUpPhoneFormik } from '@/screens/Auth/SignUpPhone/component/SignUpPhoneFormik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CustomWrapHeader } from '@/components/CustomWrapHeader';
import { GlobalProps } from '@/shared/Interface';
import DefaultText from '@/components/CustomText/DefaultText';
import NavigationActionsService from '@/navigation/navigation';
import { CREATE_FIRST_NAME_SCREEN, WELCOME_SCREEN } from '@/navigation/screenKeys';
import { saveProfile } from '@/redux/createProfile/actions';

export function SignUpPhoneScreen(prop: GlobalProps): ReactElement {
  const isAutoLinkSocial = prop.route.params ? prop.route.params?.isAutoLinkSocial : false;
  const isChangePhone = prop.route.params ? prop.route.params?.isChangePhone : false;

  const onSkip = useCallback(() => {
    NavigationActionsService.dispatchAction(
      saveProfile({
        isSkipPhoneNumber: true,
      }),
    );
    NavigationActionsService.push(CREATE_FIRST_NAME_SCREEN);
  }, []);

  const onBack = useCallback(() => {
    if (isChangePhone) {
      NavigationActionsService.goBack();
      return;
    }
    NavigationActionsService.setRoot(WELCOME_SCREEN);
  }, []);

  const renderSkipText = useMemo(() => {
    if (isChangePhone) return null;
    return <DefaultText style={styles.skipText}>{language('skip')}</DefaultText>;
  }, []);

  return (
    <View style={styles.container}>
      <SafeArea />
      <CustomWrapHeader
        onBack={onBack}
        subButtonText={renderSkipText}
        onPressSubIcon={onSkip}
        title={isChangePhone ? language('phoneNumber') : language('myNumberIs')}
        titleStyle={styles.txtTitle}
      />
      <View style={styles.wrapBody}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          extraScrollHeight={20}
          scrollEnabled={false}
          extraHeight={500}
        >
          <SignUpPhoneFormik isChangePhone={isChangePhone} isAutoLinkSocial={isAutoLinkSocial} />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  wrapBody: {
    flex: 1,
    marginTop: 80,
    paddingHorizontal: 45,
  },
  txtTitle: {
    fontSize: fonts.size.s22,
  },
  skipText: {
    color: colors.blue_700,
    fontSize: fonts.size.s16,
    marginHorizontal: 15,
  },
});
