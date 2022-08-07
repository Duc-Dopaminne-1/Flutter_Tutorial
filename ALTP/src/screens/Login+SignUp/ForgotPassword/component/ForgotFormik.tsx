import * as React from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { colors, images } from '@/vars'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import { TextInputComponent } from '@/components/TextInput'
import { Formik } from 'formik'
import { TextButton } from '@/components/textButton/textButton'
import { useState } from 'react'
import axios from 'axios'
import { AlertMessage } from '@/constants/messageConstants'
import * as yup from 'yup'
import Spinner from '@/components/Spinner'
import { postForgotPassword } from '@/shared/ListAPI'

export type Props = {
  navigation?: any
  route?: object
}

let schemaValidation = yup.object().shape({
  email: yup
    .string()
    .email(AlertMessage.ERROR_EMAIL_VALIDATE)
    .required(AlertMessage.EMPTY_FIELD)
})

export function ForgotFormik(Props: Props) {
  const { navigation } = Props
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendEmail() {
    setLoading(true)
    const data = await postForgotPassword({
      email: email
    })
    if (data) {
      setLoading(false)
      setTimeout(() => {
        Alert.alert(
          'Alert',
          'Check email to get new Password',
          [
            {
              text: 'Ok',
              style: 'cancel',
              onPress: () => {
                // Props.sendMain()
              }
            }
          ],
          {
            cancelable: false
          }
        )
      }, 200)
    } else {
      setLoading(false)
      setTimeout(() => {
        Alert.alert('Oop!', 'Some thing went wrong')
      }, 500)
    }
  }

  return (
    <>
      <Spinner
        loading={loading}
        dimBackground={true}
        showText={true}
        text="Loading"
      />
      <Formik
        validateOnChange={false}
        onSubmit={sendEmail}
        initialValues={{ email }}
        validationSchema={schemaValidation}>
        {({ handleSubmit, errors, setFieldValue }) => (
          <View style={{ flex: 1 }}>
            <TextInputComponent
              styleContainerConfig={{ marginBottom: 20 }}
              styleFormConfig={{ height: 40 }}
              value={email}
              onChangeText={(text: string) => {
                setFieldValue('email', text)
                setEmail(text)
              }}
              placeholder={'Hello@flexhelp.co'}
              keyboardType={'email-address'}
              isError={!!errors.email}
              errorText={errors.email}
              returnKeyType={'done'}
            />

            <ButtonImageBackground
              onPress={handleSubmit}
              imageStyle={styles.buttonImage}
              containerStyle={{ justifyContent: 'center' }}
              text={'Send your Email'}
              textStyle={{ fontSize: 18 }}
              source={images.button_login_signup}
            />

            <TextButton
              onPress={() => {
                navigation.goBack()
              }}
              text={'Đã có tài khoản?'}
              textButton={'Đăng nhập ngay'}
              buttonTextStyle={styles.buttonTextStyle}
            />
          </View>
        )}
      </Formik>
    </>
  )
}

const styles = StyleSheet.create({
  buttonImage: {
    alignItems: 'center',
    paddingVertical: 8
  },
  textButtonContainer: {
    justifyContent: 'flex-end'
  },
  buttonTextStyle: {
    color: colors.yellow
  }
})
