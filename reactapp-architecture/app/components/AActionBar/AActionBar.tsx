import { AIcon } from '@/components/AIcon/AIcon'
import I18n from '@/i18n'
import { navigation } from '@/navigation/navigation'
import { colors, fonts, images } from '@/vars'
import React from 'react'
import {
  Keyboard,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native'
import { Direction } from '@/common/constants/Direction'

export type AActionBarProps = {
  onMove?(direction: Direction): void
  onClear?(): void
  onComplete?(): void
  hideClearButton?: boolean
  clearTextStyle?: StyleProp<TextStyle>
  useFromModal?: boolean
  withoutNavigation?: boolean
  hideUpDownClear?: boolean
}

export const AActionBar: React.SFC<AActionBarProps> = ({
  onMove,
  onClear,
  onComplete,
  hideClearButton,
  hideUpDownClear,
  clearTextStyle,
  withoutNavigation,
  useFromModal,
}) => {
  return (
    <View
      style={[
        styles.container,
        hideUpDownClear && { justifyContent: 'flex-end' },
      ]}
    >
      {!hideUpDownClear && (
        <View style={styles.row}>
          <AIcon
            style={styles.iconUpContainer}
            source={images.chevronBottom}
            size={24}
            iconStyle={{
              transform: [
                {
                  rotate: '180deg',
                },
              ],
            }}
            onPress={() => {
              if (useFromModal && !withoutNavigation) {
                navigation.moveHandler(Direction.Up)
              }

              onMove && onMove(Direction.Up)
            }}
          />
          <AIcon
            style={styles.iconDownContainer}
            source={images.chevronBottom}
            size={24}
            spacer
            onPress={() => {
              if (useFromModal && !withoutNavigation) {
                navigation.moveHandler(Direction.Down)
              }

              onMove && onMove(Direction.Down)
            }}
          />
          {!hideClearButton && (
            <TouchableOpacity onPress={onClear}>
              <Text style={[styles.text, clearTextStyle]}>
                {I18n.t('clear')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.row}>
        <TouchableOpacity onPress={onComplete}>
          <Text style={[styles.text, styles.textDone]}>{I18n.t('done')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

AActionBar.defaultProps = {
  onComplete: () => {
    Keyboard.dismiss()
  },
  onMove: () => {},
  onClear: navigation.clearHandler,
  useFromModal: false,
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.modal_small_header_bg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.pale_grey,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  text: {
    color: colors.blue_light_grey,
    fontSize: 16,
    marginLeft: 23,
    fontFamily: fonts.family.SSPSemiBold,
  },
  textDone: {
    color: colors.primary_blue,
    marginRight: 4,
    paddingVertical: 9,
  },
  iconDownContainer: {
    paddingVertical: 9,
  },
  iconUpContainer: {
    paddingVertical: 9,
  },
})
