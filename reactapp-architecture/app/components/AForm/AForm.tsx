import { colors, metrics } from '@/vars'
import { fonts } from '@/vars/fonts'
import * as React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { Platforms } from '@/shared/platforms'

type AFormProps = {
  title?: string
  subTitle?: string
  onPress?: () => void
  children?: JSX.Element
  contentStyle?: StyleProp<ViewStyle>
  titleContainer?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  textLabelStyle?: StyleProp<TextStyle>
  titleButton?: StyleProp<TextStyle>
}

export const AForm: React.SFC<AFormProps> = props => {
  const {
    title,
    subTitle,
    onPress,
    children,
    contentStyle,
    titleContainer,
    containerStyle,
    textLabelStyle,
    titleButton,
  } = props
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.titleContainer, titleContainer]}>
        <Text style={[styles.textLabel, textLabelStyle]}>{title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={[styles.titleButton, titleButton]}>{subTitle}</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.contentStyle, contentStyle]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.keylines_screen_edge_margin,
    backgroundColor: colors.white,
    ...Platforms.shared().select({
      android: {
        borderRadius: metrics.afrom_container_border_radius,
      },
      ios: {
        borderRadius: metrics.afrom_container_border_radius,
      },
    }),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: metrics.afrom_title_container_border_bottom_width,
    borderBottomColor: colors.background_status_bar,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  textLabel: {
    color: colors.black,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  titleButton: {
    color: colors.primary_blue,
    fontSize: fonts.size.m,
    fontWeight: '600',
  },
  contentStyle: {
    borderBottomColor: colors.pale_grey,
    borderBottomWidth: metrics.afrom_contentstyle_border_bottom_width,
    paddingHorizontal: metrics.afrom_contentstyle_padding_horizontal,
  },
})
