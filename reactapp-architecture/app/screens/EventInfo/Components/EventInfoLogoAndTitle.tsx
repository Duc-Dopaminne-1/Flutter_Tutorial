import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { withContext } from '@/shared/withContext'
import { EventInfoContext } from '../EventInfoContext'
import LinearGradient from 'react-native-linear-gradient'
import { SafeEvent } from '@/shared/event'
import I18n from '@/i18n'
import { LImage } from '@/libs/LImage'

type Props = Readonly<{
  safeEvent?: SafeEvent
}>

@withContext(EventInfoContext.Consumer)
export class EventInfoLogoAndTitle extends React.PureComponent<Props> {
  renderLogo = () => {
    const { safeEvent } = this.props
    const {
      logo: { uri, id },
      primaryColor,
      secondaryColor,
    } = safeEvent

    if (uri) {
      return (
        <View style={styles.wrapLogo}>
          <LImage
            source={{
              uri,
              id,
              downsampling: 200,
            }}
            // @ts-ignore
            style={styles.image}
          />
        </View>
      )
    }

    return (
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        style={styles.wrapLogo}
      >
        <Image source={images.event} style={styles.logo} />
      </LinearGradient>
    )
  }

  renderTitle = () => {
    const { safeEvent } = this.props
    const { eventName, boothsLength } = safeEvent
    const exhibitorsText =
      boothsLength > 0
        ? boothsLength + ' ' + I18n.t('exhibitors')
        : I18n.t('noExhibitors')

    return (
      <View style={styles.wrapTitle}>
        <Text style={styles.title} numberOfLines={2}>
          {eventName}
        </Text>
        <Text style={styles.exhibitors} numberOfLines={2}>
          {exhibitorsText}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLogo()}
        {this.renderTitle()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    paddingTop: metrics.keylines_screen_product_info_margin,
    paddingHorizontal: metrics.keylines_screen_product_info_margin,
  },
  wrapLogo: {
    height: metrics.event_info_logo_size,
    width: metrics.event_info_logo_size,
    borderRadius: metrics.small_base,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: colors.white,
  },
  image: {
    height: metrics.event_info_logo_size,
    width: metrics.event_info_logo_size,
  },
  wrapTitle: {
    flex: 1,
    paddingHorizontal: metrics.keylines_screen_product_info_margin,
  },
  title: {
    fontSize: fonts.size.mxl,
    fontFamily: fonts.family.SSPSemiBold,
  },
  exhibitors: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.primary_blue,
    marginTop: 8,
  },
})
