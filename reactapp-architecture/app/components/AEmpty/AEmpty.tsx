import * as React from 'react'
import { colors, fonts } from '@/vars'
import { Text, View, StyleSheet } from 'react-native'
import I18n from '@/i18n'

type AEmptyProps = Readonly<{
  message?: string
}>

export const AEmpty: React.SFC<AEmptyProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

AEmpty.defaultProps = {
  message: I18n.t('plsSelectOneOfTheseItem'),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.border_header,
    paddingHorizontal: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: fonts.size.l,
  },
})
