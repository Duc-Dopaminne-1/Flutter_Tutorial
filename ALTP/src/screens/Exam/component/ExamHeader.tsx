import React, { useState } from 'react'
import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { images, metrics } from '@/vars'
import Orientation from 'react-native-orientation'
import { help5050, helpUsers, showModalHelp } from '@/shared/global'

export function ExamHeader(props: any) {
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
            Orientation.lockToPortrait()
            props.navigation.navigate('HomeScreen')
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
      `Đáp Án của khán giả là : ${props.answer}`,
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

            Object.keys(props.listData).map(key => {
              if (props.listData[key] === props.answer) {
                if (key === 'A') showModalHelp.next(0)
                if (key === 'B') showModalHelp.next(1)
                if (key === 'C') showModalHelp.next(2)
                if (key === 'D') showModalHelp.next(3)
              }
            })

            // showModalHelp.next(props.answer)
            // console.log('**** 11111', props.listData)
            // console.log('**** 22222', props.answer)
            // helpUser()
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
    height: 40,
    width: 40,
    marginRight: 10,
    marginTop: 5
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
