import React, { useEffect, useState } from 'react'
import { Alert, ImageBackground, StyleSheet, View } from 'react-native'
import { images } from '@/vars'
import { SoloExamHeader } from '@/screens/SoloExam/component/SoloExamHeader'
import { SoloExamAnswear } from '@/screens/SoloExam/component/SoloExamAnswear'
import { SoloExamQuestion } from '@/screens/SoloExam/component/SoloExamQuestion'
import Orientation from 'react-native-orientation'
import { showChoose, updateScoreAtHome } from '@/shared/global'
import { userInfo } from '@/shared/UserInfo'
import { postUpdateScore } from '@/shared/ListAPI'
import { SoloExamTimer } from '@/screens/SoloExam/component/SoloExamTimer'
import {
  doneExaming,
  loseExaming,
  nextQuestion,
  readySolo
} from '@/shared/socket'
import { useRoute } from '@react-navigation/native'
import { ExamHeader } from '@/screens/Exam/component/ExamHeader'
export const timeShowAwnsear = 4000
let chooseLocal = ''
let listDataLocal = []
let nextQuestionIndex = 0
let isExit = false
let isAnswearWrong = false
export const WAR = 1000

const typeClose = {
  lose: -1,
  out: -2
}

export function SoloExamScreen(Props: any) {
  const { navigation } = Props
  const route = useRoute()
  const {
    data: { emailA, emailB, _id, data }
  } = route.params as any
  let [listData, setListData] = useState([])
  const [indexQuestion, setIndexQuestion] = useState(0)
  const [isDisableButton, setIsDisableButton] = useState(false)

  useEffect(() => {
    Orientation.lockToLandscape()
  }, [])

  useEffect(() => {
    nextQuestion(_id, 0, handleNextQuestion)
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

  const endTime = () => {
    if (nextQuestionIndex === typeClose.out) {
      return
    }
    showChoose.next({ answear: listDataLocal[indexQuestion].answer.toString() })
    setIsDisableButton(true)
    if (
      chooseLocal.toString() !== listDataLocal[indexQuestion].answer.toString()
    ) {
      loseExaming(_id, typeClose.lose)
      gameOver()
      return
    }
    if (indexQuestion === listDataLocal.length - 1) {
      winner()
      return
    }
    nextQuestion(_id, indexQuestion + 1, handleNextQuestion)
    setTimeout(() => {
      if (
        nextQuestionIndex === typeClose.lose ||
        nextQuestionIndex === typeClose.out
      ) {
        winner()
        return
      }
      setIndexQuestion(nextQuestionIndex)
      setIsDisableButton(false)
    }, timeShowAwnsear)
  }

  const handleNextQuestion = nextIndex => {
    if (nextIndex === 0) {
      listDataLocal = data
      setListData(data)
      setIndexQuestion(nextIndex)
      return
    }
    if (!isExit && nextIndex === typeClose.out) {
      winner()
    }
    nextQuestionIndex = nextIndex
  }

  function winner() {
    Alert.alert(
      'You are Winner',
      `Your Score: ${WAR}`,
      [
        {
          text: 'Go Home',
          style: 'cancel',
          onPress: async () => {
            doneExaming(_id)
            await updateScoreAPI(WAR + userInfo.getUserInfo().scoreID.score)
            const data = userInfo.getUserInfo()
            data.scoreID.score = WAR + userInfo.getUserInfo().scoreID.score
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
      `Your Score: ${0}`,
      [
        {
          text: 'Go Home',
          style: 'cancel',
          onPress: () => {
            doneExaming(_id)
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

  const exit = () => {
    isExit = true
    loseExaming(_id, typeClose.out)
  }

  return (
    <ImageBackground
      source={images.HomePage_GamePlayBackground_H}
      style={styles.container}
      resizeMode={'stretch'}>
      <SoloExamHeader
        exit={exit}
        listData={listData[indexQuestion]}
        answer={listData.length > 0 ? listData[indexQuestion].answer : ''}
        navigation={navigation}
      />

      <SoloExamTimer indexQuestion={indexQuestion} onTime={endTime} />

      <SoloExamQuestion
        score={indexQuestion * 100}
        indexQuestion={indexQuestion}
        question={listData.length > 0 ? listData[indexQuestion].content : ''}
      />

      <View pointerEvents={isDisableButton ? 'none' : 'auto'}>
        <SoloExamAnswear
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
