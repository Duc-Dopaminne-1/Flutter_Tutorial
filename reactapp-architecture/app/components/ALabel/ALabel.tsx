import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import { colors, fonts, metrics } from '@/vars'

export type ALabelProps = {
  backgroundColor: string
  label: string
  color: string
  wrapperStyle?: any
}

export const ALabel: React.SFC<ALabelProps> = ({
  backgroundColor,
  label,
  color,
  wrapperStyle,
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.wrapper, wrapperStyle, { backgroundColor }]}>
        <View
          style={[
            styles.dot,
            {
              backgroundColor: color,
            },
          ]}
        />
        <Text style={[styles.text, { color }]}>{label.toUpperCase()}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
  },
  wrapper: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.validated,
  },
  dot: {
    width: metrics.supplier_card_dot_size,
    height: metrics.supplier_card_dot_size,
    borderRadius: metrics.supplier_card_dot_size / 2,
    backgroundColor: colors.white,
  },
  text: {
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
    marginLeft: 6,
    color: colors.white,
  },
})
