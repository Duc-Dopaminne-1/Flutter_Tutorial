import * as React from 'react'
import {
  Alert,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, fonts, images } from '@/vars'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import { TextInputComponent } from '@/components/TextInput'
import { Formik } from 'formik'
import { TextButton } from '@/components/textButton/textButton'
import { useState } from 'react'
import { useRef } from 'react'
import { userInfo } from '@/shared/UserInfo'
import { AlertMessage } from '@/constants/messageConstants'
import * as yup from 'yup'
import Spinner from '@/components/Spinner'
import { postLogin, postSignUp } from '@/shared/ListAPI'
import { roleUser } from '@/constants/roleUser'

export type Props = {
  navigation?: any
  route?: object
}

let schemaValidation = yup.object().shape({
  email: yup
    .string()
    .email(AlertMessage.ERROR_EMAIL_VALIDATE)
    .required(AlertMessage.EMPTY_FIELD),
  password: yup.string().required(AlertMessage.EMPTY_FIELD),
  name: yup.string().required(AlertMessage.EMPTY_FIELD)
})

export function SignUpFormik(Props: Props) {
  const { navigation } = Props
  const [userSignIn, setUserSignIn] = useState({
    name: '',
    email: '',
    password: ''
  })
  let secondTextInput = useRef<any>(null)
  let threeTextInput = useRef<any>(null)
  const [loading, setLoading] = useState(false)

  async function signUp() {
    setLoading(true)
    const response = await postSignUp({
      name: userSignIn.name,
      email: userSignIn.email,
      password: userSignIn.password,
      OS: Platform.OS === 'ios' ? 'ios' : 'android'
    })
    setTimeout(() => {
      if (response) {
        console.log('**** SIGNUP', response)
        setLoading(false)
        if (response.error || response.data === 'email đã tồn tại') {
          setTimeout(() => {
            Alert.alert('Oop!', response.data)
          }, 500)
          return
        }
        userInfo.setUserInfo(response.data)
        navigation.navigate('HomeScreen')
      } else {
        setLoading(false)
        setTimeout(() => {
          Alert.alert('Oop!', 'Đăng Kí Không Thành Công')
        }, 500)
      }
    }, 500)
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
        onSubmit={signUp}
        initialValues={userSignIn}
        validationSchema={schemaValidation}>
        {({ handleSubmit, errors, setFieldValue }) => (
          <View style={{ flex: 1 }}>
            <TextInputComponent
              styleContainerConfig={{ marginBottom: -10 }}
              styleFormConfig={{ height: 40 }}
              value={userSignIn.name}
              icon={images.icon_account}
              onChangeText={(text: string) => {
                setFieldValue('name', text)
                setUserSignIn(prevState => {
                  return { ...prevState, name: text }
                })
              }}
              placeholder={'your name'}
              isError={!!errors.name}
              errorText={errors.name}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                secondTextInput &&
                  secondTextInput.focus &&
                  secondTextInput.focus()
              }}
            />

            <TextInputComponent
              styleContainerConfig={{ marginBottom: -10 }}
              styleFormConfig={{ height: 40 }}
              value={userSignIn.email}
              icon={images.icon_account}
              onChangeText={(text: string) => {
                setFieldValue('email', text)
                setUserSignIn(prevState => {
                  return { ...prevState, email: text }
                })
              }}
              placeholder={'Hello@gmail.com'}
              keyboardType={'email-address'}
              isError={!!errors.email}
              errorText={errors.email}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                threeTextInput && threeTextInput.focus && threeTextInput.focus()
              }}
              refs={input => {
                secondTextInput = input
              }}
            />

            <TextInputComponent
              refs={input => {
                threeTextInput = input
              }}
              value={userSignIn.password}
              icon={images.icon_password}
              styleFormConfig={{ height: 40 }}
              onChangeText={(text: string) => {
                setFieldValue('password', text)
                setUserSignIn(prevState => {
                  return { ...prevState, password: text }
                })
              }}
              placeholder={'Password123'}
              secureTextEntry={true}
              isError={errors.password ? true : false}
              errorText={errors.password}
              returnKeyType={'done'}
              onSubmitEditing={() => {
                handleSubmit()
                Keyboard.dismiss()
              }}
            />

            <ButtonImageBackground
              onPress={handleSubmit}
              imageStyle={styles.buttonImage}
              containerStyle={{ justifyContent: 'center', marginTop: 15 }}
              text={'Đăng Kí'}
              textStyle={{ fontSize: 18 }}
              source={images.button_login_signup}
            />

            <TextButton
              onPress={() => {
                navigation.goBack()
              }}
              text={'Đã có tải khoản?'}
              textButton={'Đăng nhập'}
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
