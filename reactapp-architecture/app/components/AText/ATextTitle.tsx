import { colors, fonts } from '@/vars'
import * as React from 'react'
import {
  RegisteredStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import I18n from '@/i18n'

export type ATextTitleProps = {
  title: string
  buttonText: string
  onPress: () => void
  containerStyle?: StyleProp<ViewStyle>
}

export class ATextTitle extends React.PureComponent<ATextTitleProps> {
  static defaultProps = {}

  render() {
    const { title, buttonText, onPress, containerStyle } = this.props

    return (
      <View style={[styles.Container, containerStyle]}>
        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={onPress}>
          <Text style={styles.editText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  Container: {
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  editText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.primary_blue,
  },
})
