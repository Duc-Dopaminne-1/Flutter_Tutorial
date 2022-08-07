import * as React from 'react'
import {
  ImageBackground,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle
} from 'react-native'
import { colors, fonts } from '@/vars'

type Props = {
  containerStyle?: ViewStyle
  source?: number
  onPress?: () => void
  text?: string
  imageStyle?: ImageStyle
  textStyle?: TextStyle
}

export function ButtonImageBackground(Props: Props) {
  const { containerStyle, source, onPress, text, imageStyle, textStyle } = Props

  return (
    <TouchableOpacity style={containerStyle} onPress={onPress}>
      <ImageBackground
        source={source}
        resizeMode={'stretch'}
        style={[styles.btnImage, imageStyle]}>
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 26,
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
  btnImage: {
    paddingHorizontal: 15,
    paddingVertical: 10
  }
})
