import React from 'react'
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import { ExamTimer } from '@/screens/Exam/component/ExamTimer'

export function ExamQuestion(props: any) {
  const score = `$${props.score}`
  return (
    <>
      <ExamTimer indexQuestion={props.indexQuestion} endTime={props.endTime} />
      <ImageBackground
        source={images.btnYellow2}
        style={styles.wrapScore}
        resizeMode={'stretch'}>
        <Text style={styles.score}>{score}</Text>
      </ImageBackground>

      <ImageBackground
        source={images.btnBlue2}
        style={styles.wrapQuestion}
        resizeMode={'stretch'}>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            height: metrics.screen_width / 2 - 30,
            paddingRight: 40
          }}>
          <Text style={styles.question}>
            {'Câu hỏi ' +
              (parseInt(props.indexQuestion) + 1) +
              ' :  ' +
              props.question}
          </Text>
        </ScrollView>
      </ImageBackground>
    </>
  )
}

const styles = StyleSheet.create({
  wrapScore: {
    alignItems: 'center',
    paddingHorizontal: 80,
    paddingVertical: 2,
    marginTop: -10
  },
  score: {
    fontSize: 20,
    color: colors.black,
    fontFamily: fonts.family.SSPBlackItalic,
    fontWeight: '900'
  },
  wrapQuestion: {
    width: '100%',
    flex: 1,
    paddingTop: 30,
    paddingBottom: 10,
    paddingLeft: 15,
    marginBottom: 5
  },
  question: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.family.SSPSemiBold,
    fontWeight: '600'
  }
})
