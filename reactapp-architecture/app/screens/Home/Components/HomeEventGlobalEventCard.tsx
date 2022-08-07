import { Event } from '@/models/global'
import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import {
  AsyncStorage,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Subscription } from 'rxjs'
import { eventStore } from '@/stores/eventStore'
import { SafeEvent } from '@/shared/event'
import { colors, fonts, images, metrics, normalize } from '@/vars'
import I18n from '@/i18n'
import Realm from 'realm'
import { findIndex } from 'lodash'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { withNavigation } from 'react-navigation'
import { AButton } from '@/components/AButton/AButton'
import { safeLocation } from '@/shared/location'
import moment from 'moment'
import LinearGradient from 'react-native-linear-gradient'

type Props = {
  event: Event
  onPressCheckIn: (value: any) => void
}

type State = Readonly<{}>

export class HomeEventGlobalEventCard extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = {}

  renderLogo = () => {
    const { event } = this.props
    const {
      logo: { uri },
      primaryColor,
      secondaryColor,
    } = new SafeEvent(event)

    if (uri) {
      return (
        <View style={styles.wrapLogo}>
          <Image source={{ uri }} style={styles.logo} />
        </View>
      )
    }

    return (
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        style={styles.wrapLogo}
      >
        <Image source={images.event} style={styles.defaultLogo} />
      </LinearGradient>
    )
  }

  renderContent = () => {
    const { event } = this.props
    const {
      eventName,
      eventInfoDateVer2,
      venueAddress,
      industryName,
    } = new SafeEvent(event)

    const startDate = eventInfoDateVer2.startDate
      ? eventInfoDateVer2.startDate
      : 'none'
    const endDate = eventInfoDateVer2.endDate
      ? eventInfoDateVer2.endDate
      : 'none'

    return (
      <View style={styles.wrapContent}>
        <Text style={styles.date}>{startDate + ' - ' + endDate}</Text>
        <Text style={styles.eventName}>{eventName}</Text>
        <Text style={styles.description}>
          {venueAddress + ' - ' + industryName}
        </Text>
      </View>
    )
  }

  renderButtonCheckIn = () => {
    return (
      <AButton
        onPress={() => {
          this.props.onPressCheckIn(this.props.event)
        }}
        title={I18n.t('checkIn')}
        containerStyle={styles.buttonCustomContainer}
        titleStyle={styles.buttonCustomTitle}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLogo()}
        {this.renderContent()}
        {this.renderButtonCheckIn()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    marginBottom: metrics.keylines_screen_profile_title_margin,
  },
  wrapLogo: {
    width: normalize(48),
    height: normalize(48),
    marginRight: metrics.keylines_screen_product_info_margin,
    borderRadius: metrics.small_base,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  defaultLogo: {
    height: normalize(24),
    width: normalize(24),
    tintColor: colors.white,
  },
  wrapContent: {
    flex: 1,
  },
  date: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    color: colors.primary_blue,
  },
  eventName: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xxl,
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    color: colors.blue_light_grey,
  },
  buttonCustomContainer: {
    height: normalize(36),
    width: '25%',
    borderRadius: metrics.small_base,
  },
  buttonCustomTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
})
