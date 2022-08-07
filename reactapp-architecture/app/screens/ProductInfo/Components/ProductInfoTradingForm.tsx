import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  children: JSX.Element | JSX.Element[]
  title: string
}

export const ProductInfoTradingForm: React.SFC<Props> = ({
  children,
  title,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.medium_base,
  },
  title: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
