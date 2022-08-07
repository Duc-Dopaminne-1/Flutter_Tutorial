import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { metrics } from '@/vars'

const Timer = 15
let counterLocal = Timer
export function SoloExamTimer(prop: any) {
  const [counter, setCounter] = useState(Timer)

  useEffect((): any => {
    const interval = setInterval(() => {
      if (counterLocal > 0) {
        setCounter(seconds => {
          counterLocal = seconds - 1
          return counterLocal
        })
        return
      }
      clearInterval(interval)
      prop.onTime()
    }, 1000)

    counterLocal = Timer
    setCounter(Timer)

    return () => clearInterval(interval)
  }, [prop.indexQuestion])

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
