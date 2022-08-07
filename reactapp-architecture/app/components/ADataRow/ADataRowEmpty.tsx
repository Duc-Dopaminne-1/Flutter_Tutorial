import { colors, fonts, metrics } from '@/vars/index'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import I18n from '@/i18n'

export type ADataRowEmptyProps = {
  description: string
  onPress: () => void
  title: string
  containerStyle?: StyleProp<ViewStyle>
  buttonText?: string
}

export const ADataRowEmpty: React.SFC<ADataRowEmptyProps> = props => {
  const { title, description, onPress, containerStyle, buttonText } = props

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.wrapEmpty}>
        <Text style={styles.description}>{description}</Text>

        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

ADataRowEmpty.defaultProps = {
  buttonText: I18n.t('add'),
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
    borderRadius: metrics.supplier_border_radius,
    // paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingTop: metrics.keylines_screen_edge_margin,
  },
  title: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapEmpty: {
    marginTop: metrics.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    color: colors.light_blue_grey,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  button: {
    width: 87,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.close_icon_gray,
  },
  buttonText: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
