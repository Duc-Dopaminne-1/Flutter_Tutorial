import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type SelectUnitTabProps = {
  title: string
  children: JSX.Element | JSX.Element[]
}

export const AModalTab: React.SFC<SelectUnitTabProps> = ({
  title,
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapTitle}>
        <Text style={styles.title}>{title}</Text>
      </View>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wrapTitle: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 37,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.black_blue_text,
  },
})
