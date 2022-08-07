import * as React from 'react'
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import { SupplierEmptyCard } from '@/screens/Supplier/Components/SupplierEmptyCard'
import { CameraMode } from '@/common/constants/CameraMode'
import { navigation } from '@/navigation/navigation'
import {
  createSupplierNavigation,
  CreateSupplierRef,
} from '@/navigation/createSupplierNavigation'
import { supplierStore, SupplierStoreRef } from '@/stores/supplierStore'
import { eventStore } from '@/stores/eventStore'
import { Subscription } from 'rxjs'
import { AButton } from '@/components/AButton/AButton'
import { email } from '@/common/constants/Email'

type Props = Readonly<{}>

export class SupplierExhibitorEmpty extends React.PureComponent<Props> {
  onPressEmail = async () => {
    const title = 'Hello'
    const body = 'I would like to have exhibitors.'
    const url = `mailto:${email}?subject=${title}&body=${body}`

    const canOpen = await Linking.canOpenURL(url)

    if (canOpen) {
      await Linking.openURL(url)
    } else {
      alert(I18n.t('canOpenMailApp'))
    }
  }

  onPressOK = () => {}

  renderLogo = () => {
    return (
      <View style={styles.wrapLogo}>
        <Image
          source={images.exhibitorLogo}
          style={styles.logo}
          resizeMode={'contain'}
        />
      </View>
    )
  }

  renderText = () => {
    return (
      <View style={styles.wrapText}>
        <Text style={styles.title}>{I18n.t('exhibitorNotAvailable')}</Text>

        <Text style={styles.description}>
          {I18n.t('weDonHaveExhibitorsForThisShow')}
        </Text>
      </View>
    )
  }

  renderFooter = () => {
    return (
      <View style={styles.wrapFooter}>
        <AButton
          onPress={this.onPressEmail}
          title={I18n.t('emailUs')}
          containerStyle={[styles.buttonContainer, styles.buttonOneContainer]}
          titleStyle={styles.buttonOneTitle}
        />
        {/*<AButton*/}
        {/*  onPress={this.onPressOK}*/}
        {/*  title={I18n.t('ok')}*/}
        {/*  containerStyle={styles.buttonContainer}*/}
        {/*/>*/}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLogo()}
        {this.renderText()}
        {this.renderFooter()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
  },
  wrapLogo: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: metrics.exhibitor_modal_logo_size,
    width: metrics.exhibitor_modal_logo_size,
  },
  wrapText: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    textAlign: 'center',
    marginTop: metrics.exhibitor_modal_description_text_margin,
  },
  wrapFooter: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    // paddingHorizontal: metrics.keylines_screen_profile_title_margin,
  },
  buttonContainer: {
    height: metrics.exhibitor_modal_button_height,
    margin: 0,
    width: metrics.exhibitor_modal_button_width,
    borderRadius: metrics.small_base,
  },
  buttonOneContainer: {
    // marginRight: metrics.keylines_screen_product_info_margin,
    backgroundColor: colors.close_icon_gray,
  },
  buttonOneTitle: {
    color: colors.blue_light_grey,
  },
})
