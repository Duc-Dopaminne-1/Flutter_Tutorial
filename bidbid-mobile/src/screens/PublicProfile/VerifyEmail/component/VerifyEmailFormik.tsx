import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import CustomButton from '@/components/CustomButton';
import { language } from '@/i18n';
import ErrorMessage from '@/components/ErrorMessage';
import { Formik, FormikValues } from 'formik';
import { object, string } from 'yup';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { throttle } from 'lodash';
import { VerifyEmailContext } from '@/screens/PublicProfile/VerifyEmail/VerifyEmailContext';
import VerifyEmailForMikCode from '@/screens/PublicProfile/VerifyEmail/component/VerifyEmailFormikCode';
import VerifyEmailForMikTimer from '@/screens/PublicProfile/VerifyEmail/component/VerifyEmailFormikTimer';

const initialValues = {
  code: '',
};

function VerifyEmailForMik() {
  const { onVerify } = useContext(VerifyEmailContext);

  const validationSchema = object().shape({
    code: string()
      .trim()
      .test('code', language('invalidCode'), value => {
        return !(value === undefined || value === '' || value.length < 6);
      }),
  });

  const preventDoubleClick = React.useMemo(() => (onVerify ? throttle(onVerify, 3000, { leading: true, trailing: false }) : undefined), []);

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      extraScrollHeight={20}
      scrollEnabled={false}
      extraHeight={500}
    >
      <View style={styles.container}>
        <Formik initialValues={initialValues} validateOnChange={false} onSubmit={preventDoubleClick} validationSchema={validationSchema}>
          {(forMikProps: FormikValues) => (
            <View>
              <VerifyEmailForMikCode forMikProps={forMikProps} />
              <ErrorMessage errorValue={forMikProps.touched.code && forMikProps.errors.code} />
              <VerifyEmailForMikTimer />
              <CustomButton onPress={forMikProps.handleSubmit} containerStyle={styles.btnContinue} text={language('continue')} />
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAwareScrollView>
  );
}

export default React.memo(VerifyEmailForMik);

const styles = StyleSheet.create({
  btnContinue: {
    width: null,
    backgroundColor: colors.pink_red,
    marginTop: 20,
    paddingVertical: 13,
  },
  container: {
    flex: 1,
    paddingHorizontal: 40,
  },
});
