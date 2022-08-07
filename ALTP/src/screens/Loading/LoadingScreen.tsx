import React, { useEffect } from 'react'
import { AsyncStorage } from 'react-native'
import { cacheUser } from '@/constants/roleUser'
import { userInfo } from '@/shared/UserInfo'

export function LoadingScreen({ navigation }) {
  useEffect(() => {
    (async function anyNameFunction() {
      const result = await AsyncStorage.getItem(cacheUser.UserInfo)
      const data = JSON.parse(result)
      userInfo.setUserInfo(data)
      if (data) {
        navigation.navigate('HomeScreen')
      } else {
        navigation.navigate('LoginScreen')
      }
    })()
  }, [])

  return null
}
