import * as React from 'react'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors, deviceWidth, fonts, images } from '@/vars'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import Spinner from '@/components/Spinner'
import { closeSocketIO, startSocketIO } from '@/shared/socket'

export function HomeButton(Props: any) {
  const { navigation } = Props
  const [loading, setLoading] = useState(false)

  function onPressStart() {
    navigation.navigate('ExamScreen')
  }

  async function onPressSolo() {
    setLoading(true)
    startSocketIO(data => {
      setLoading(false)
      navigation.navigate('SoloExamScreen', { data })
    })
  }

  function onPressOut() {
    closeSocketIO()
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Spinner
        loading={loading}
        dimBackground={false}
        showText={true}
        text="Tìm kiếm đối thủ"
        onPressOut={onPressOut}
      />
      <ButtonImageBackground
        onPress={onPressStart}
        imageStyle={{
          paddingVertical: 10,
          paddingHorizontal: 60
        }}
        containerStyle={{
          justifyContent: 'center',
          marginBottom: 20,
          marginRight: -15
        }}
        text={'Chơi Đơn'}
        textStyle={{ fontSize: 18, textAlign: 'center', marginLeft: -15 }}
        source={images.btnOrangeYelowWhite}
      />

      <ButtonImageBackground
        onPress={onPressSolo}
        imageStyle={{
          paddingVertical: 10,
          paddingHorizontal: 60
        }}
        containerStyle={{ justifyContent: 'center', marginRight: -15 }}
        text={'Chơi Solo'}
        textStyle={{ fontSize: 18, marginLeft: -15 }}
        source={images.btnBlueWhite}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',

    flex: 1,
    marginTop: 50,
    width: deviceWidth
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.xxxl,
    fontFamily: fonts.family.SSPSemiBold
  },
  btnImage: {
    height: 80,
    width: 220,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
