import * as React from 'react'
import {
  Alert,
  AsyncStorage,
  Keyboard,
  Platform,
  StyleSheet,
  View
} from 'react-native'
import { colors, images } from '@/vars'
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
import { postLogin } from '@/shared/ListAPI'
import { cacheUser, roleUser } from '@/constants/roleUser'

export type Props = {
  navigation?: any
  route?: object
}

let schemaValidation = yup.object().shape({
  email: yup
    .string()
    .email(AlertMessage.ERROR_EMAIL_VALIDATE)
    .required(AlertMessage.EMPTY_FIELD),
  password: yup.string().required(AlertMessage.EMPTY_FIELD)
})

export function LoginFormik(Props: Props) {
  const { navigation } = Props
  const [userSignIn, setUserSignIn] = useState({
    email: '',
    password: ''
  })

  let secondTextInput = useRef<any>(undefined)
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    const response = await postLogin({
      email: userSignIn.email,
      password: userSignIn.password,
      OS: Platform.OS === 'ios' ? 'ios' : 'android'
    })
    setTimeout(() => {
      if (response) {
        setLoading(false)
        setTimeout(() => {
          if (response.error) {
            Alert.alert('Oop!', response.message)
          } else if (response.data[0].roleID.name === roleUser.admin) {
            navigation.navigate('AdminScreen')
            return
          } else {
            AsyncStorage.setItem(
              cacheUser.UserInfo,
              JSON.stringify(response.data[0])
            )
            userInfo.setUserInfo(response.data[0])
            // http://localhost:1998/image/upload/1598774978925_1598774979000.JPG
            navigation.navigate('HomeScreen')
          }
        }, 200)
      } else {
        setLoading(false)
        setTimeout(() => {
          Alert.alert('Oop!', 'Login Không Thành Công')
        }, 500)
      }
    }, 300)
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
        onSubmit={login}
        initialValues={userSignIn}
        validationSchema={schemaValidation}>
        {({ handleSubmit, errors, setFieldValue }) => (
          <View style={{ flex: 1 }}>
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
                secondTextInput &&
                  secondTextInput.focus &&
                  secondTextInput.focus()
              }}
            />

            <TextInputComponent
              refs={input => {
                secondTextInput = input
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

            <TextButton
              onPress={() => {
                navigation.navigate('ForGotPassword')
              }}
              textButton={'Quên mật khẩu?'}
              containerStyle={styles.textButtonContainer}
            />

            <ButtonImageBackground
              onPress={handleSubmit}
              imageStyle={styles.buttonImage}
              containerStyle={{ justifyContent: 'center' }}
              text={'Đăng nhập'}
              textStyle={{ fontSize: 18 }}
              source={images.button_login_signup}
            />

            <TextButton
              onPress={() => {
                navigation.navigate('SignUpScreen')
              }}
              text={'Chưa có tài khoản?'}
              textButton={'Đăng kí ngay'}
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
