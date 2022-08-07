import * as React from 'react'
import {
  KeyboardAvoidingView,
  ImageBackground,
  StyleSheet,
  View,
  NativeModules,
  StatusBarIOS,
  Platform,
} from 'react-native'
import { images } from '@/vars'
import { useEffect, useState } from 'react'
import Orientation from 'react-native-orientation'
import LottieView from 'lottie-react-native'
import { isAndroid } from '@/shared/devices'
import {LoginFormik} from "@/screens/Login+SignUp/Login/component/LoginFormik";

const { StatusBarManager } = NativeModules

export type Props = {
  navigation?: any
  route?: object
}

export function LoginScreen(Props: Props) {
  const { navigation } = Props
  const [statusBarHeight, setStatusBarHeight] = useState(0)
  let statusBarListener: any = ''

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBarManager.getHeight((statusBarFrameData: any) => {
        setStatusBarHeight(statusBarFrameData.height)
      })
    } else {
      setStatusBarHeight(-564)
    }
    statusBarListener = StatusBarIOS.addListener(
      'statusBarFrameWillChange',
      statusBarData => {
        setStatusBarHeight(statusBarData.frame.height)
      }
    )

    return () => {
      statusBarListener &&
        statusBarListener.remove &&
        statusBarListener.remove()
    }
  }, [])

  useEffect(() => {
    Orientation.lockToPortrait()
  }, [])

  return (
    <ImageBackground
      source={images.newBackground}
      resizeMode={'stretch'}
      style={styles.container}>
      <View style={styles.wrapLogo}>
        <LottieView
          style={styles.logo}
          source={require('@/assets/icons/v2/jsonLogoAnim/data.json')}
          autoPlay
          loop
        />
      </View>

      <View style={{ flex: 0.2 }} />

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.wrapFormik}
        keyboardVerticalOffset={isAndroid ? -500 : 44 + statusBarHeight}>
        <LoginFormik navigation={navigation} />
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20
  },
  logo: {
    height: '100%',
    width: '100%'
  },
  wrapLogo: {
    flex: 1.2,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  wrapFormik: {
    flex: 1.1,
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center'
  }
})
