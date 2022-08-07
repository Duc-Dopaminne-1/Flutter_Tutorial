import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'
import { colors, fonts } from '@/vars'
import I18n from '@/i18n'
import * as React from 'react'
import { ACenter } from '@/components/ACenter/ACenter'

type ACameraNextButtonProps = Readonly<{
  hasImage: boolean
}> &
  TouchableOpacityProps

export const ACameraNextButton: React.SFC<ACameraNextButtonProps> = ({
  onPress,
  hasImage,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={hasImage ? 0.8 : 1}
      disabled={!hasImage}
    >
      <ACenter>
        <Text
          style={[styles.text, hasImage && { color: colors.primary_blue_next }]}
        >
          {I18n.t('nextLabel').toLocaleUpperCase()}
        </Text>
      </ACenter>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    color: colors.blue_grey,
    fontSize: fonts.size.xl,
  },
})
