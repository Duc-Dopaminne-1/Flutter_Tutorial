import React, { useEffect, useState } from 'react'
import {
  Alert,
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import { help5050, helpUsers, showChoose } from '@/shared/global'
import { timeShowAwnsear } from '@/screens/Exam/ExamScreen'

export function SoloExamAnswear(props: any) {
  const [chooseA, setChooseA] = useState(false)
  const [chooseB, setChooseB] = useState(false)
  const [chooseC, setChooseC] = useState(false)
  const [chooseD, setChooseD] = useState(false)

  const [opacityA, setOpacityA] = useState(false)
  const [opacityB, setOpacityB] = useState(false)
  const [opacityC, setOpacityC] = useState(false)
  const [opacityD, setOpacityD] = useState(false)

  const [transformA, setTransformA] = useState(new Animated.Value(0))
  const [transformB, setTransformB] = useState(new Animated.Value(0))
  const [transformC, setTransformC] = useState(new Animated.Value(0))
  const [transformD, setTransformD] = useState(new Animated.Value(0))

  useEffect(() => {
    const sub = showChoose.subscribe(data => {
      animationChoose(data)
    })

    const sub2 = help5050.subscribe(_data => {
      help50()
    })

    return () => {
      sub.unsubscribe()
      sub2.unsubscribe()
    }
  })

  function help50() {
    resetChoose()
    let choose = 0
    if (props.answer !== props.A && choose < 2) {
      choose++
      setOpacityA(true)
    }
    if (props.answer !== props.B && choose < 2) {
      choose++
      setOpacityB(true)
    }
    if (props.answer !== props.C && choose < 2) {
      choose++
      setOpacityC(true)
    }
    if (props.answer !== props.D && choose < 2) {
      choose++
      setOpacityD(true)
    }
  }
  function animationChoose(data) {
    if (data.answear === props.A.toString()) {
      setChooseA(true)
      animation(transformA)
    } else if (data.answear === props.B.toString()) {
      setChooseB(true)
      animation(transformB)
    } else if (data.answear === props.C.toString()) {
      setChooseC(true)
      animation(transformC)
    } else {
      setChooseD(true)
      animation(transformD)
    }
  }
  function resetChoose() {
    setChooseA(false)
    setChooseB(false)
    setChooseC(false)
    setChooseD(false)
    setOpacityA(false)
    setOpacityB(false)
    setOpacityC(false)
    setOpacityD(false)
  }

  function animation(ChooseAnimation: any) {
    const anim1 = Animated.timing(ChooseAnimation, {
      toValue: 1,
      duration: 1000
    })
    const anim2 = Animated.timing(ChooseAnimation, {
      toValue: 0,
      duration: 1000
    })
    const finalAnim = Animated.sequence([anim1, anim2])
    Animated.loop(finalAnim).start()
    setTimeout(() => {
      ChooseAnimation.stopAnimation()
      resetChoose()
    }, timeShowAwnsear)
  }
  function showAlert(choose: string) {
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
            if (choose === 'A') {
              setChooseA(true)
              props.onChoose(props.A.toString())
            } else if (choose === 'B') {
              setChooseB(true)
              props.onChoose(props.B.toString())
            } else if (choose === 'C') {
              setChooseC(true)
              props.onChoose(props.C.toString())
            } else {
              setChooseD(true)
              props.onChoose(props.D.toString())
            }
          }
        }
      ],
      {
        cancelable: false
      }
    )
  }

  const rotateA = transformA.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
    outputRange: [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1]
  })
  const rotateB = transformB.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
    outputRange: [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1]
  })

  const rotateC = transformC.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
    outputRange: [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1]
  })
  const rotateD = transformD.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
    outputRange: [1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1]
  })

  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        marginTop: 15,
        justifyContent: 'space-around'
      }}>
      <View>
        <Animated.View
          style={{
            opacity: rotateA
          }}>
          <TouchableOpacity
            onPress={() => {
              if (chooseA || opacityA) return
              showAlert('A')
            }}>
            <ImageBackground
              source={chooseA ? images.btnGreen : images.btnWhite}
              style={[styles.wrapAnswear, opacityA ? { opacity: 0.3 } : {}]}
              resizeMode={'stretch'}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                horizontal>
                <Text style={styles.step}> A: </Text>
                <Text style={styles.answear}>{props.A}</Text>
              </ScrollView>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: rotateB
          }}>
          <TouchableOpacity
            onPress={() => {
              if (chooseB || opacityB) return
              showAlert('B')
            }}>
            <ImageBackground
              source={chooseB ? images.btnGreen : images.btnWhite}
              style={[styles.wrapAnswear, opacityB ? { opacity: 0.3 } : {}]}
              resizeMode={'stretch'}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                horizontal>
                <Text style={styles.step}> B: </Text>
                <Text style={styles.answear}>{props.B}</Text>
              </ScrollView>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <View>
        <Animated.View
          style={{
            opacity: rotateC
          }}>
          <TouchableOpacity
            onPress={() => {
              if (chooseC || opacityC) return
              showAlert('C')
            }}>
            <ImageBackground
              source={chooseC ? images.btnGreen : images.btnWhite}
              style={[styles.wrapAnswear, opacityC ? { opacity: 0.3 } : {}]}
              resizeMode={'stretch'}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                horizontal>
                <Text style={styles.step}> C: </Text>
                <Text style={styles.answear}>{props.C}</Text>
              </ScrollView>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: rotateD
          }}>
          <TouchableOpacity
            onPress={() => {
              if (chooseD || opacityD) return
              showAlert('D')
            }}>
            <ImageBackground
              source={chooseD ? images.btnGreen : images.btnWhite}
              style={[styles.wrapAnswear, opacityD ? { opacity: 0.3 } : {}]}
              resizeMode={'stretch'}>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: 'center' }}
                horizontal>
                <Text style={styles.step}> D: </Text>
                <Text style={styles.answear}>{props.D}</Text>
              </ScrollView>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapAnswear: {
    flexDirection: 'row',
    alignItems: 'center',
    width: metrics.screen_height / 2 - 50,
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginBottom: 5
  },
  step: {
    color: colors.orange_yellow,
    fontSize: 22,
    fontFamily: fonts.family.SSPBold,
    fontWeight: '900'
  },
  answear: {
    fontSize: 14,
    color: colors.black,
    fontFamily: fonts.family.SSPRegular,
    fontWeight: '600'
  }
})
