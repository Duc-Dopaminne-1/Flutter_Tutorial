import { withContext } from '@/shared/withContext'
import { fonts, images, metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeEvent } from '@/shared/event'
import { EventInfoContext } from '@/screens/EventInfo/EventInfoContext'
import { isValidPhoneNumber } from '@/shared/validator'

type Props = Partial<{
  safeEvent?: SafeEvent
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{}>

@withContext(EventInfoContext.Consumer)
export class EventInfoMainInformation extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = {}

  onPressAddress = async (safeEvent: SafeEvent) => {
    try {
      const { coordinate, venueAddress } = safeEvent

      if (!coordinate) return

      const url = Platform.select({
        ios: 'maps:?q=' + venueAddress,
        android: 'geo:?q=' + venueAddress,
      })

      const canOpen = await Linking.canOpenURL(url)

      if (canOpen) {
        await Linking.openURL(url)
      } else {
        console.warn(`Can't open map. Please try again.`)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  renderCalendar = () => {
    const { safeEvent } = this.props
    const { eventInfoDate } = safeEvent

    if (!eventInfoDate.startDate && !eventInfoDate.endDate) return null

    const startDate = eventInfoDate.startDate ? eventInfoDate.startDate : 'none'
    const endDate = eventInfoDate.endDate ? eventInfoDate.endDate : 'none'

    return (
      <View style={[styles.wrapItem, styles.calendarCustomContainer]}>
        <View style={styles.wrapImage}>
          <Image source={images.event} style={styles.image} />
        </View>

        <Text style={styles.description}>{startDate + ' - ' + endDate}</Text>
      </View>
    )
  }

  renderLocation = () => {
    const { safeEvent } = this.props
    const { venueName, venueAddress } = safeEvent

    if (!venueName && !venueAddress) return null

    return (
      <TouchableOpacity
        onPress={() => {
          this.onPressAddress(safeEvent)
        }}
        activeOpacity={0.8}
      >
        <View style={[styles.wrapItem, styles.locationCustomContainer]}>
          <View style={styles.wrapImage}>
            <Image source={images.location} style={styles.image} />
          </View>

          <Text style={styles.description}>{venueName}</Text>
        </View>
        <Text style={styles.descriptionLocation}>{venueAddress}</Text>
      </TouchableOpacity>
    )
  }

  renderIndustry = () => {
    const { safeEvent } = this.props
    const { industryName } = safeEvent

    if (!industryName) return null

    return (
      <View style={[styles.wrapItem, styles.categoryCustomContainer]}>
        <View style={styles.wrapImage}>
          <Image source={images.category} style={styles.image} />
        </View>

        <Text style={styles.description}>{industryName}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{I18n.t('mainInformation')}</Text>

        {this.renderCalendar()}
        {this.renderLocation()}
        {this.renderIndustry()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.keylines_screen_product_info_margin,
    paddingTop: metrics.keylines_screen_profile_title_margin,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapImage: {
    height: 36,
    width: 36,
    borderRadius: 2,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  image: {
    height: 16,
    width: 16,
    tintColor: colors.blue_light_grey,
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
  },
  calendarCustomContainer: {
    marginTop: metrics.keylines_screen_product_info_margin,
  },
  locationCustomContainer: {
    marginTop: metrics.keylines_screen_profile_title_margin,
  },
  descriptionLocation: {
    marginLeft: 36 + 12,
    color: colors.blue_light_grey,
  },
  categoryCustomContainer: {
    marginTop: metrics.keylines_screen_profile_title_margin,
  },
})
