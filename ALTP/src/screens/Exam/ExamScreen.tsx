import React, { useEffect, useState } from 'react'
import { Alert, ImageBackground, StyleSheet, View } from 'react-native'
import { images } from '@/vars'
import { ExamHeader } from '@/screens/Exam/component/ExamHeader'
import { ExamAnswear } from '@/screens/Exam/component/ExamAnswear'
import { ExamQuestion } from '@/screens/Exam/component/ExamQuestion'
import Orientation from 'react-native-orientation'
import { showChoose, updateScoreAtHome } from '@/shared/global'
import { userInfo } from '@/shared/UserInfo'
import {
  getQuestionNormal,
  getUserInfo,
  postUpdateScore
} from '@/shared/ListAPI'

export const timeShowAwnsear = 4000
let chooseLocal = ''

export function ExamScreen(Props: any) {
  const { navigation } = Props

  useEffect(() => {
    Orientation.lockToLandscape()
  }, [])

  const [listData, setListData] = useState([])
  const [indexQuestion, setIndexQuestion] = useState(0)
  const [isDisableButton, setIsDisableButton] = useState(false)

  useEffect(() => {
    ;(async function getListQuestion() {
      const result = await getQuestionNormal()
      if (result) {
        setListData(result.data)
      } else {
        Alert.alert('Oop!', 'Some thing went wrong!')
      }
    })()
  }, [])

  async function updateScoreAPI(score: number) {
    await postUpdateScore({
      id: userInfo.getUserInfo().scoreID._id,
      score: score.toString()
    })
  }

  function onChoose(choose: string) {
    chooseLocal = choose
    setIsDisableButton(true)
  }

  function endTime() {
    console.log('**** DATA', listData)
    showChoose.next({ answear: listData[indexQuestion].answer.toString() })

    setIsDisableButton(true)

    if (chooseLocal.toString() !== listData[indexQuestion].answer.toString()) {
      gameOver()
      return
    }

    if (indexQuestion === listData.length - 1) {
      winner()
      return
    }
    setTimeout(() => {
      setIndexQuestion(indexQuestion + 1)
      setIsDisableButton(false)
    }, timeShowAwnsear)
  }

  function winner() {
    Alert.alert(
      'You are Winner',
      `Your Score: ${indexQuestion * 100}`,
      [
        {
          text: 'Go Home',
          style: 'cancel',
          onPress: async () => {
            await updateScoreAPI(
              indexQuestion * 100 + userInfo.getUserInfo().scoreID.score
            )
            const data = userInfo.getUserInfo()
            data.scoreID.score =
              indexQuestion * 100 + userInfo.getUserInfo().scoreID.score
            userInfo.setUserInfo(data)
            updateScoreAtHome.next()
            Orientation.lockToPortrait()
            Props.navigation.goBack()
          }
        }
      ],
      {
        cancelable: false
      }
    )
  }

  function gameOver() {
    Alert.alert(
      'Game Over!',
      `Your Score: ${indexQuestion * 100}`,
      [
        {
          text: 'Go Home',
          style: 'cancel',
          onPress: async () => {
            await updateScoreAPI(
              indexQuestion * 100 + userInfo.getUserInfo().scoreID.score
            )
            const data = userInfo.getUserInfo()
            data.scoreID.score =
              indexQuestion * 100 + userInfo.getUserInfo().scoreID.score
            userInfo.setUserInfo(data)
            updateScoreAtHome.next()
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

  return (
    <ImageBackground
      source={images.HomePage_GamePlayBackground_H}
      style={styles.container}
      resizeMode={'stretch'}>
      {    console.log('**** DATA 22', listData)}
      <ExamHeader
        navigation={navigation}
        answer={listData.length > 0 ? listData[indexQuestion].answer : ''}
        listData={listData[indexQuestion]}
      />

      <ExamQuestion
        score={indexQuestion * 100}
        endTime={endTime}
        indexQuestion={indexQuestion}
        question={listData.length > 0 ? listData[indexQuestion].content : ''}
      />

      <View pointerEvents={isDisableButton ? 'none' : 'auto'}>
        <ExamAnswear
          onChoose={onChoose}
          indexQuestion={indexQuestion}
          answer={listData.length > 0 ? listData[indexQuestion].answer : ''}
          A={listData.length > 0 ? listData[indexQuestion].A : ''}
          B={listData.length > 0 ? listData[indexQuestion].B : ''}
          C={listData.length > 0 ? listData[indexQuestion].C : ''}
          D={listData.length > 0 ? listData[indexQuestion].D : ''}
        />
      </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    marginTop: -20,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})
