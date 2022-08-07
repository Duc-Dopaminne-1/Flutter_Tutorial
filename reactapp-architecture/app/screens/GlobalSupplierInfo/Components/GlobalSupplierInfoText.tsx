import * as React from 'react'
import { Text, View, StyleProp, ViewStyle, TextStyle } from 'react-native'

type Props = {
  text?: string
  wrapTextStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export class GlobalSupplierInfoText extends React.PureComponent<Props> {
  render() {
    const { text, textStyle, wrapTextStyle } = this.props
    return (
      <View style={wrapTextStyle}>
        <Text style={textStyle}>{text}</Text>
      </View>
    )
  }
}
