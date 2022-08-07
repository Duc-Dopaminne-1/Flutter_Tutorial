import { AButton } from '@/components/AButton/AButton'
import { AIcon } from '@/components/AIcon/AIcon'
import I18n from '@/i18n'
import { colors, fonts, images } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = Readonly<{
  onPress(): void
}>

export const ContactCardEmpty: React.SFC<Props> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <AIcon source={images.user} size={24} color={colors.light_blue_grey} />
      <Text style={styles.label}>{I18n.t('noContact')}</Text>
      <AButton
        onPress={onPress}
        title={I18n.t('newContact')}
        titleStyle={{
          fontSize: fonts.size.m,
          color: colors.white,
        }}
        containerStyle={{
          paddingVertical: 6,
          paddingHorizontal: 12,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    marginBottom: 12,
    fontStyle: 'italic',
    color: colors.text_light_grey,
  },
})
