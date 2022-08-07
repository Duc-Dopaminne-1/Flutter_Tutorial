import {Text, View} from "react-native";
import React from "react";
import { QuestionType } from "../constants";

export const convertQuestion = (question, questionText, wrapQuestion, numberOfLines) => {
    if(question.type !== QuestionType.BLANK_QUESTION) {
        return (
            <Text style={questionText} numberOfLines={numberOfLines} >{question.question}</Text>
        )
    }
    let questions = question.question

    let indexFirstKey = questions.indexOf('[*]')
    let indexSecondKey = questions.indexOf('[**]')
    let firstText = ''
    let middleText = ''
    let lastText = ''
    
    if( indexSecondKey > indexFirstKey || indexSecondKey === -1) {
        // first test
        if (indexFirstKey < 0) {
            if (indexSecondKey < 0) {
                firstText = questions
            } else {
                firstText = questions.substr(0 , indexSecondKey -1 )
            }
        } else {
            firstText = questions.substr(0 , indexFirstKey )
        }

        // middle test
        if (indexFirstKey > -1) {
            if (indexSecondKey < 0) {
                middleText = questions.substr(indexFirstKey + 3  , questions.length )
            } else {
                middleText = questions.substr(indexFirstKey + 3  , indexSecondKey - indexFirstKey - 4 )
            }

        } else {
            middleText = ''
        }

        // last test
        if (indexSecondKey > -1) {
            lastText = questions.substr(indexSecondKey + 4  , questions.length)
        } else {
            lastText = ''
        }

        return (
            <>
                <View style={wrapQuestion} >
                    <Text style={questionText} numberOfLines={numberOfLines}>{firstText}
                        {indexFirstKey > -1 && question.answers.map((data, index) => {
                            if(index !== question.answers.length -1) {
                                return (
                                    <>
                                        {index === 0 ? ( <Text style={questionText} >[</Text>) : null}
                                        <Text style={questionText}>{data}</Text>
                                        <Text style={questionText}>/</Text>
                                    </>
                                )
                            }
                            return (
                                <>
                                    <Text style={questionText}>{data}]</Text>
                                </>
                            )
                        })}
                        <Text style={questionText}>{middleText} </Text>
                        {
                            indexSecondKey > -1 ? (
                                <View
                                    style={{
                                        height: 10,
                                        width: 50,
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                    }}
                                />
                            ) : null
                        }
                        <Text style={questionText}>{lastText}</Text>
                    </Text>
                </View>
            </>
        )
    } else {
          indexFirstKey = questions.indexOf('[**]')
          indexSecondKey = questions.indexOf('[*]')

        if (indexFirstKey < 0) {
            if (indexSecondKey < 0) {
                firstText = questions
            } else {
                firstText = questions.substr(0 , indexSecondKey -1 )
            }
        } else {
            firstText = questions.substr(0 , indexFirstKey )
        }
        // middle test
        if (indexFirstKey > -1) {
            if (indexSecondKey < 0) {
                middleText = questions.substr(indexFirstKey + 4  , questions.length )
            } else {
                middleText = questions.substr(indexFirstKey + 4 , indexSecondKey - indexFirstKey - 5 )
            }

        } else {
            middleText = ''
        }
        // last test
        if (indexSecondKey > -1) {
            lastText = questions.substr(indexSecondKey + 3  , questions.length)
        } else {
            lastText = ''
        }

        return (
            <>
                <View style={wrapQuestion} >
                    <Text style={questionText} numberOfLines={numberOfLines}>{firstText}
                        {
                            indexSecondKey > -1 ? (
                                <View
                                    style={{
                                        height: 10,
                                        width: 50,
                                        borderBottomColor: 'black',
                                        borderBottomWidth: 1,
                                    }}
                                />
                            ) : null
                        }
                        <Text style={questionText}>{middleText} </Text>
                        {indexFirstKey > -1 && question.answers.map((data, index) => {
                            if(index !== question.answers.length -1) {
                                return (
                                    <>
                                        {index === 0 ? ( <Text style={questionText} >[</Text>) : null}
                                        <Text style={questionText}>{data}</Text>
                                        <Text style={questionText}>/</Text>
                                    </>
                                )
                            }
                            return (
                                <>
                                    <Text style={questionText}>{data}]</Text>
                                </>
                            )
                        })}
                        <Text style={questionText}>{lastText}</Text>
                    </Text>
                </View>
            </>
        )
    }
}