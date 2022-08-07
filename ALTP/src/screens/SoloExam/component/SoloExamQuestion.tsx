import React from 'react'
import { ImageBackground, ScrollView, StyleSheet, Text } from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import { WAR } from '@/screens/SoloExam/SoloExamScreen'

export function SoloExamQuestion(props: any) {
  return (
    <>
      {/*<SoloExamTimer*/}
      {/*    indexQuestion={props.indexQuestion}*/}
      {/*    onTime={props.onTime} />*/}
      <ImageBackground
        source={images.btnYellow2}
        style={styles.wrapScore}
        resizeMode={'stretch'}>
        <Text style={styles.score}>{WAR}</Text>
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
