import * as React from 'react'
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import { colors, fonts, images } from '@/vars'

export type Props = {
  navigation?: any
  route?: object
  text?: string
  textButton?: string
  buttonTextStyle?: TextStyle
  containerStyle?: ViewStyle
  onPress?: () => void
}

export function TextButton(Props: Props) {
  const { text, textButton, buttonTextStyle, containerStyle, onPress } = Props
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={[styles.buttonText, buttonTextStyle]}> {textButton}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 13
  },
  title: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.family.SSPSemiBold
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: 14,
    textDecorationLine: 'underline'
  }
})
