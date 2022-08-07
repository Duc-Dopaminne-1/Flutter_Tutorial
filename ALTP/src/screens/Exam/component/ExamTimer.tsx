import React, { useEffect, useState } from 'react'
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import axios from 'axios'
import { userInfo } from '@/shared/UserInfo'

const Timer = 5
export function ExamTimer(prop: any) {
  let timerInterval = null

  const [counter, setCounter] = useState(Timer)

  useEffect((): any => {
      console.log('**** RENDER useEffect 1')
      setCounter(Timer)
    timerInterval = setInterval(tick, 1000)
    return () => {
      clearInterval(timerInterval)
    }
  }, [prop.indexQuestion])


  function tick() {
      setCounter(counter => {
          if (counter <= 0) {
              console.log('**** RENDER useEffect 1')
              clearInterval(timerInterval)
              prop.endTime()
              return counter
          }
          return counter - 1
      })


  }

  return (
    <View
      style={{
        position: 'absolute',
        right: metrics.screen_height / 6,
        top: metrics.screen_width / 6,
        borderWidth: 2,
        borderRadius: 30,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white'
      }}>
        {console.log('**** RENDER TIME')}
      <Text
        style={{
          fontSize: 30,
          color: 'white',
          fontWeight: '600',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        {counter}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({})
