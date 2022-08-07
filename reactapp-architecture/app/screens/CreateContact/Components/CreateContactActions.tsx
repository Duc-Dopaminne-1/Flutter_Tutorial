import { AControl } from '@/components/AControl/AControl'
import { AControlButton } from '@/components/AControl/AControlButton'
import I18n from '@/i18n'
import { isValidEmail, isValidPhoneNumber } from '@/shared/validator'
import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import { Linking, Platform, StyleSheet, View } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import { CustomAlert } from '@/shared/alert'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

type Props = Readonly<{
  email: string
  phoneNumber: string
  name: string

  onDelete(): void
}>

@DelayRender({ delay: 200 })
export class CreateContactActions extends React.PureComponent<Props> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()

  onCall = async () => {
    try {
      const { phoneNumber } = this.props

      if (!phoneNumber.trim() || !isValidPhoneNumber(phoneNumber)) {
        return
      }
      const url = `tel:${phoneNumber}`
      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        await Linking.openURL(url)
      } else {
        alert(`Can't open call app. Please try again.`)
      }
    } catch (e) {
      alert(e)
    }
  }

  sendEmail = async () => {
    try {
      const { email, name } = this.props

      if (!email || !name || !isValidEmail(email)) {
        return
      }

      const url = `mailto:${email}?subject=Hello${' ' + name}`

      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        await Linking.openURL(url)
      } else {
        alert(`Can't open mail app. Please try again.`)
      }
    } catch (e) {
      alert(e)
    }
  }

  confirmDelete = () => {
    CustomAlert.alertYesNo({
      message: I18n.t('deleteSupplierContactConfirm'),
      onPressYes: this.props.onDelete,
      onPressNo: () => {},
    })
  }

  onPress = (index: number) => {
    if (index === 0) {
      this.confirmDelete()
      return
    }
  }

  getBgColor = (value: string) => {
    return !!value ? colors.primary_blue : colors.light_blue_grey
  }

  render() {
    const { email, phoneNumber } = this.props
    return (
      <View style={styles.contain}>
        <AControl>
          <AControlButton
            source={images.phone}
            title={I18n.t('call')}
            onPress={this.onCall}
            wrapperStyle={{
              backgroundColor: this.getBgColor(phoneNumber),
            }}
          />
          <AControlButton
            source={images.email}
            title={I18n.t('sendEmail')}
            containerStyle={styles.buttonContainer}
            onPress={this.sendEmail}
            wrapperStyle={{
              backgroundColor: this.getBgColor(email),
            }}
          />
          <AControlButton
            source={images.more}
            title={I18n.t('more')}
            onPress={() => {
              this._actionSheet.current.show()
            }}
          />

          <ActionSheet
            ref={this._actionSheet}
            title={I18n.t('more').capitalize()}
            options={[I18n.t('delete'), I18n.t('cancel')]}
            destructiveButtonIndex={0}
            cancelButtonIndex={1}
            onPress={this.onPress}
          />
        </AControl>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  contain: {
    marginVertical: 24,
  },
  buttonContainer: {
    marginHorizontal: metrics.medium_base,
  },
  wrapperButton: {
    backgroundColor: colors.light_blue_grey,
  },
})
