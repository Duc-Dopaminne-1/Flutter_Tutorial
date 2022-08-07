import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AHeader } from '@/components/AHeader/AHeader'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { selectPlatform } from '@/shared/devices'

type Props = Readonly<{
  isCreateContact: boolean
  headerTitle: string
  loadingSelectImage: boolean
  onPressLeftWhenCreate: () => void
  onPressLeftWhenUpdate: () => void
  onPressRight: () => void
}>

export class CreateContactHeader extends React.PureComponent<Props> {
  renderLeft = () => {
    const { isCreateContact, onPressLeftWhenCreate } = this.props

    if (!isCreateContact) return null

    return (
      <TouchableOpacity
        style={styles.wrapLeftButton}
        onPress={onPressLeftWhenCreate}
      >
        <Text style={styles.wrapButtonText} numberOfLines={1}>
          {I18n.t('cancel')}
        </Text>
      </TouchableOpacity>
    )
  }

  renderRight = () => {
    const { loadingSelectImage, onPressRight } = this.props

    if (loadingSelectImage) {
      return (
        <View style={styles.wrapRightButton}>
          <AIndicator size={25} />
        </View>
      )
    }

    return (
      <TouchableOpacity style={styles.wrapRightButton} onPress={onPressRight}>
        <Text style={styles.wrapButtonText}>{I18n.t('save')}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const { isCreateContact, headerTitle, onPressLeftWhenUpdate } = this.props

    return (
      <AHeader
        renderBackButtonIOS={!isCreateContact}
        onPressIconLeft={onPressLeftWhenUpdate}
        title={headerTitle}
        renderLeft={this.renderLeft}
        renderRight={isCreateContact && this.renderRight}
        containerStyle={styles.headerContainerCustom}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  headerContainerCustom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border_header,
    paddingBottom: metrics.small_base,
    height: selectPlatform({
      ios: 60 + metrics.small_base,
      android: 77 + metrics.small_base,
      iPhoneX: 80 + metrics.small_base,
    }),
  },
  wrapLeftButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 7,
  },
  wrapRightButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  wrapButtonText: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPRegular,
    color: colors.back_button_ios_color,
  },
})
