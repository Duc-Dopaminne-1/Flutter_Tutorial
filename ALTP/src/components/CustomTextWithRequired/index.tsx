import { View, StyleProp, TextStyle, ViewStyle } from 'react-native'
import styles from './styles'
import { Text } from 'react-native'
import React from 'react'

interface Props {
  text: string
  style?: StyleProp<TextStyle>
  numberOfLines?: number
  styleContainer?: StyleProp<ViewStyle>
}

const CustomTextRequired = (props: Props) => {
  const { text, style, numberOfLines = 0, styleContainer } = props

  return (
    <View style={[styles.container, styleContainer]}>
      <Text
        style={[styles.title, style]}
        allowFontScaling={false}
        numberOfLines={numberOfLines}>
        {text}
      </Text>
      <Text style={styles.textRequired} allowFontScaling={false}>
        (*)
      </Text>
    </View>
  )
}

export { CustomTextRequired }
