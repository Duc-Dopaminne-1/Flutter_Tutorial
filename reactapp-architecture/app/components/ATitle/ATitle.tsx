import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export type ATitleProps = {
  title: string
  subtitle?: string

  onPressSubtitle?(): void
}

export const ATitle: React.SFC<ATitleProps> = ({
  title,
  subtitle,
  onPressSubtitle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {!!subtitle && (
        <TouchableOpacity onPress={onPressSubtitle}>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
  },
  subtitle: {
    color: colors.primary_blue,
    fontSize: fonts.size.l,
  },
})
