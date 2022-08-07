import * as React from 'react'
import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, fonts, images } from '@/vars'
import { AdminHeader } from '@/screens/Admin/component/AdminHeader'
import { useState } from 'react'

type Props = {
  navigation?: object
  route?: object
  onPressLevel?: (data: number) => void
}

export function AdminLevel(Props: Props) {
  const { onPressLevel } = Props
  const [isLevel, setIsLevel] = useState({
    one: true,
    two: false,
    three: false
  })

  const onPressOne = () => {
    const data = {
      one: true,
      two: false,
      three: false
    }
    setIsLevel(data)
    onPressLevel(1)
  }

  const onPressTwo = () => {
    const data = {
      one: false,
      two: true,
      three: false
    }
    setIsLevel(data)
    onPressLevel(2)
  }

  const onPressThree = () => {
    const data = {
      one: false,
      two: false,
      three: true
    }
    setIsLevel(data)
    onPressLevel(3)
  }
  return (
    <>
      <View
        style={{
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingVertical: 10,
          flexDirection: 'row',
          width: '100%'
        }}>
        <Text style={styles.text}>Level : </Text>

        <TouchableOpacity
          onPress={onPressOne}
          style={[
            styles.textLevel,
            isLevel.one ? { borderColor: 'yellow' } : {}
          ]}>
          <Text style={[styles.text, isLevel.one ? { color: 'yellow' } : {}]}>
            1
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressTwo}
          style={[
            styles.textLevel,
            isLevel.two ? { borderColor: 'yellow' } : {}
          ]}>
          <Text style={[styles.text, isLevel.two ? { color: 'yellow' } : {}]}>
            2
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onPressThree}
          style={[
            styles.textLevel,
            isLevel.three ? { borderColor: 'yellow' } : {}
          ]}>
          <Text style={[styles.text, isLevel.three ? { color: 'yellow' } : {}]}>
            3
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 20
  },
  text: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.family.SSPSemiBold,
    shadowColor: 'black',
    alignSelf: 'center',
    shadowOpacity: 0.8,
    shadowRadius: 3,
    shadowOffset: {
      width: 1,
      height: 2
    },
    elevation: 2
  },
  textLevel: {
    marginLeft: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'white',
    height: 30,
    width: 30
  }
})
