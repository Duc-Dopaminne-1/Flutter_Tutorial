import * as React from 'react'
import { Image, ImageBackground, StyleSheet, Text } from 'react-native'
import { images, metrics } from '@/vars'
import { userInfo } from '@/shared/UserInfo'
import { useEffect, useState } from 'react'
import { updateScoreAtHome } from '@/shared/global'

export function HomeBottomBarMoney() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const sub = updateScoreAtHome.subscribe(data => {
      setCount(count + 1)
    })

    return () => {
      sub.unsubscribe()
    }
  })

  return (
    <ImageBackground
      source={images.frame2}
      style={styles.image}
      resizeMode={'stretch'}>
      <Text style={{ color: 'white', textAlign: 'center' }}>Điểm Cao</Text>
      <Text style={{ color: 'white', textAlign: 'center' }}>
        ${userInfo.getUserInfo().scoreID.score}
      </Text>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingTop: 5,
    paddingLeft: 20,
    height: 45,
    flex: 1
  }
})
