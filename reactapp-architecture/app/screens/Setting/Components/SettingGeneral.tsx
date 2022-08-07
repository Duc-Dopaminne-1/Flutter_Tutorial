import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Switch, Text, View } from 'react-native'
import I18n from '@/i18n'
import { NavigationScreenProp } from 'react-navigation'
import { AInput } from '@/components/AInput/AInput'
import { settingStore } from '@/stores/settingStore'
import { copyProductStore } from '@/stores/copyProductStore'

// init state
const initialState = {
  statePhoto: false,
  stateBusinessCard: false,
  stateCopyProduct: false,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  DefaultProps

const type = {
  photo: 'PHOTO',
  businessCard: 'BUSINESS_CARD',
  copyProduct: 'COPY_PRODUCT',
}

export type State = Partial<{}> & Readonly<typeof initialState>

export class SettingGeneral extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  componentDidMount() {
    this.setState({
      statePhoto: settingStore.savePicture,
      stateBusinessCard: settingStore.businessCard,
      stateCopyProduct: settingStore.copyProduct,
    })
  }

  changeValue = (typeValue: string) => (state: boolean) => {
    if (typeValue === type.photo) {
      this.setState({
        statePhoto: state,
      })
      settingStore.savePicture = state
      settingStore.setPictureToStore(state)

      return
    }
    if (typeValue === type.businessCard) {
      this.setState({
        stateBusinessCard: state,
      })
      settingStore.businessCard = state
      settingStore.setBusinessCardToStore(state)

      return
    }
    if (typeValue === type.copyProduct) {
      this.setState({
        stateCopyProduct: state,
      })
      settingStore.copyProduct = state
      settingStore.setCopyProductToStore(state)

      if (!state) {
        copyProductStore.clear()
      }

      return
    }
  }

  renderSwitchCustom = (value, onValueChange) => {
    return (
      <View style={styles.wrapSwitch}>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    )
  }

  renderSwitchPhoto = () => {
    const { statePhoto } = this.state

    return (
      <View style={styles.wrapComponent}>
        <View style={styles.wrapText}>
          <Text style={styles.componentTitle} numberOfLines={1}>
            {I18n.t('photos').toUpperCase()}
          </Text>

          <Text style={styles.componentDescription} numberOfLines={1}>
            {I18n.t('savePictureToGallery')}
          </Text>
        </View>

        {this.renderSwitchCustom(statePhoto, this.changeValue(type.photo))}
      </View>
    )
  }

  renderSwitchBusinessCard = () => {
    const { stateBusinessCard } = this.state

    return (
      <View style={styles.wrapComponent}>
        <View style={styles.wrapText}>
          <Text style={styles.componentTitle} numberOfLines={1}>
            {I18n.t('businessCard').toUpperCase()}
          </Text>

          <Text style={styles.componentDescription} numberOfLines={1}>
            {I18n.t('saveBusinessCardWhenCreate')}
          </Text>
        </View>

        {this.renderSwitchCustom(
          stateBusinessCard,
          this.changeValue(type.businessCard)
        )}
      </View>
    )
  }

  renderSwitchCopyProduct = () => {
    const { stateCopyProduct } = this.state

    return (
      <View style={styles.wrapComponent}>
        <View style={styles.wrapText}>
          <Text style={styles.componentTitle} numberOfLines={1}>
            {I18n.t('copyProductInfo').toUpperCase()}
          </Text>

          <Text style={styles.componentDescription} numberOfLines={1}>
            {I18n.t('copyProductInfoDescription')}
          </Text>
        </View>

        {this.renderSwitchCustom(
          stateCopyProduct,
          this.changeValue(type.copyProduct)
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('generalSettings')}</Text>

        {this.renderSwitchPhoto()}

        {this.renderSwitchBusinessCard()}

        {this.renderSwitchCopyProduct()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.setting_screen_margin_top,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  wrapComponent: {
    marginTop: metrics.double_base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.pale_grey,
  },
  wrapText: {
    flex: 1,
  },
  componentTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.s,
    color: colors.text_light_grey,
  },
  componentDescription: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.black,
    marginTop: metrics.small_base,
  },
  wrapSwitch: {
    paddingLeft: 10,
  },
})
