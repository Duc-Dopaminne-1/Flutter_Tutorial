import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type ContactCardAvatarProps = Readonly<{
  title: string
}>

export const ContactCardAvatar: React.SFC<ContactCardAvatarProps> = ({
  title,
}) => {
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {},
  outer: {
    height: 32,
    width: 32,
    borderRadius: 32 / 2,
    borderWidth: 1,
    borderColor: colors.primary_blue,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    padding: 2,
    height: 26,
    width: 26,
    borderRadius: 26 / 2,
    backgroundColor: colors.avatar_bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: colors.primary_blue,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
