import * as React from 'react'
import { ImageBackground, Platform, StyleSheet, View } from 'react-native'
import { images } from '@/vars'
import { HomeHeader } from '@/screens/Home/component/HomeHeader'
import { HomeButton } from '@/screens/Home/component/HomeButton'
import { HomeBottomBar } from '@/screens/Home/component/HomeBottomBar'
import { useEffect } from 'react'
import firebase from 'react-native-firebase'
import { ModalHelp } from '@/screens/Modal/ModalHelp'
import DeviceInfo from 'react-native-device-info'
import { userInfo } from '@/shared/UserInfo'
import { postUpdateFCM } from '@/shared/ListAPI'

type Props = {
  navigation?: object
  route?: object
}

export function HomeScreen(Props: Props) {
  const { navigation } = Props

  const getToken = async () => {
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        console.log('**** Tokem mobile', fcmToken)
        console.log('**** get TOken', userInfo.getUserInfo())
        postUpdateFCM({
          id: userInfo.getUserInfo().fcmID,
          token: fcmToken
        })
      })
  }

  useEffect(() => {
    let notificationListener = null
    if (Platform.OS === 'android') {
      try {
        firebase
          .messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              getToken().then()
            }
          })
      } catch (error) {
        console.log(error)
      }

      notificationListener = firebase
        .notifications()
        .onNotification((notifications: any) => {
          const channel = new firebase.notifications.Android.Channel(
            'test-channel',
            'Test Channel',
            firebase.notifications.Android.Importance.High
          ).setDescription('My apps test channel')
          // Create the channel
          firebase.notifications().android.createChannel(channel)
          const notification = new firebase.notifications.Notification()
            .setNotificationId(notifications.notificationId)
            .setTitle(notifications.title)
            .setBody(notifications.body)
            .setData(notifications.data)
          notification.android
            .setChannelId(channel.channelId)
            .setSound('default')
          firebase.notifications().displayNotification(notification)
        })
    }

    return () => {
      notificationListener && notificationListener()
    }
  }, [])

  return (
    <ImageBackground source={images.bg1} style={styles.container}>
      <View style={{ flex: 1 }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <HomeButton navigation={navigation} />
      </View>

      <HomeBottomBar navigation={navigation} />
      <ModalHelp />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
