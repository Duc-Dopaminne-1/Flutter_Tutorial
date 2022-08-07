import React, { ReactElement, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import ErrorMessage from '@/components/ErrorMessage';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';
import SignUpVerifySmsForMikCode from '@/screens/Auth/SignUpVerifySms/component/SignUpVerifySmsFormikCode';
import { SignUpVerifySmsContext } from '@/screens/Auth/SignUpVerifySms/SignUpVerifySmsContext';
import SignUpVerifySmsForMikTimer from '@/screens/Auth/SignUpVerifySms/component/SignUpVerifySmsFormikTimer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { throttle } from 'lodash';
import { isIOS } from '@/shared/devices';

const initialValues = {
  code: '',
};

function SignUpVerifySmsForMik(): ReactElement {
  const { onVerify } = useContext(SignUpVerifySmsContext);

  const validationSchema = object().shape({
    code: string()
      .trim()
      .test('code', language('invalidCode'), value => {
        return !(value === undefined || value === '' || value.length < 6);
      }),
  });

  const preventDoubleClick = React.useMemo(() => {
    return onVerify ? throttle(onVerify, 3000, { leading: true, trailing: false }) : undefined;
  }, []);

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableResetScrollToCoords={false}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      extraScrollHeight={isIOS ? 20 : 0}
      scrollEnabled={false}
      extraHeight={isIOS ? 500 : 0}
    >
      <View style={styles.container}>
        <Formik initialValues={initialValues} validateOnChange={false} onSubmit={preventDoubleClick} validationSchema={validationSchema}>
          {(forMikProps: FormikValues) => (
            <View>
              <SignUpVerifySmsForMikCode forMikProps={forMikProps} />
              <ErrorMessage errorValue={forMikProps.touched.code && forMikProps.errors.code} />
              <SignUpVerifySmsForMikTimer />
              <CustomButton onPress={forMikProps.handleSubmit} containerStyle={styles.btnContinue} text={language('continue')} />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default React.memo(SignUpVerifySmsForMik);

const styles = StyleSheet.create({
  btnContinue: {
    marginTop: 15,
    paddingVertical: 13,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 40,
    marginTop: 40,
  },
});
