import React, { useState } from 'react'
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { images, metrics } from '@/vars'
import Orientation from 'react-native-orientation'
import { help5050, helpUsers, showModalHelp } from '@/shared/global'

export function SoloExamHeader(prop: any) {
  const { navigation, exit } = prop
  const [help50, setHelp50] = useState(false)
  const [helpUSer, setHelpUSer] = useState(false)

  function onBack() {
    Alert.alert(
      'Alert',
      'Are you sure?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Yes',
          style: 'cancel',
          onPress: () => {
            exit && exit()
            Orientation.lockToPortrait()
            navigation.navigate('HomeScreen')
          }
        }
      ],
      {
        cancelable: false
      }
    )
  }

  function helpUser() {
    Alert.alert(
      'HELP',
      `Đáp Án của khán giả là : ${prop.answer}`,
      [
        {
          text: 'OK',
          style: 'cancel',
          onPress: () => {}
        }
      ],
      {
        cancelable: false
      }
    )
  }

  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingTop: 10,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity
          onPress={() => {
            if (help50) return

            help5050.next()
            setHelp50(true)
          }}>
          <Image
            source={
              !help50 ? images.icon_half_ball : images.icon_half_ball_disable
            }
            resizeMode={'contain'}
            style={[styles.imageHelp]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (helpUSer) return

            Object.keys(prop.listData).map(key => {
              if (prop.listData[key] === prop.answer) {
                if (key === 'A') showModalHelp.next(0)
                if (key === 'B') showModalHelp.next(1)
                if (key === 'C') showModalHelp.next(2)
                if (key === 'D') showModalHelp.next(3)
              }
            })
            setHelpUSer(true)
          }}>
          <Image
            source={
              !helpUSer
                ? images.icon_guests_ball
                : images.icon_guests_ball_disable
            }
            resizeMode={'contain'}
            style={[styles.imageHelp]}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{ position: 'absolute', left: metrics.screen_height / 2 - 60 }}>
        <Image source={images.app} style={[styles.image]} />
      </View>

      <TouchableOpacity style={styles.wrapClose} onPress={onBack}>
        <Image source={images.close} style={styles.imageClose} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100
  },
  imageHelp: {
    height: 50,
    width: 50,
    marginRight: 10
  },
  wrapClose: {
    height: 100,
    width: 100,
    alignItems: 'flex-end'
  },
  imageClose: {
    height: 40,
    width: 40,

    marginTop: 10
  }
})
