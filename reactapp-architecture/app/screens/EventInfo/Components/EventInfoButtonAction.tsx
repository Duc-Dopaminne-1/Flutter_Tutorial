import { withContext } from '@/shared/withContext'
import * as React from 'react'
import {
  DrawerActions,
  NavigationInjectedProps,
  withNavigation,
} from 'react-navigation'
import { EventInfoContext } from '../EventInfoContext'
import { SafeEvent } from '@/shared/event'
import { AsyncStorage, Image, StyleSheet, Text, View } from 'react-native'
import { AButton } from '@/components/AButton/AButton'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import { ExhibitorsNotAvailable } from '@/modals/ExhibitorsNotAvailable/ExhibitorsNotAvailable'
import { CheckInEvent } from '@/modals/CheckInEvent/CheckInEvent'
import { eventStore } from '@/stores/eventStore'
import { Subscription } from 'rxjs'
import { openModalCheckInEventSuccess } from '@/services/global'

type Props = Readonly<{
  event?: any
  safeEvent?: SafeEvent
  isCheckIn?: boolean
}> &
  Partial<NavigationInjectedProps<{}>>

@withContext(EventInfoContext.Consumer)
@(withNavigation as any)
export class EventInfoButtonAction extends React.PureComponent<Props> {
  _modalExhibitor: React.RefObject<ExhibitorsNotAvailable> = React.createRef()
  // _modalCheckInEvent: React.RefObject<CheckInEvent> = React.createRef()
  _subscriptionCreateEventTeam: Subscription

  componentWillUnmount() {
    this._subscriptionCreateEventTeam &&
      this._subscriptionCreateEventTeam.unsubscribe()
  }

  onPressCheckIn = () => {
    const { safeEvent, event, navigation } = this.props
    const { eventId } = safeEvent

    eventStore.saveCheckInEvent(eventId).catch(() => {})

    /**
     * Call update event to current event and on realm if this event
     * don't exist in teamRealm data.
     * Function update event is stay at HomeEvent.tsx
     */
    eventStore.updateEventSub.next(event)

    navigation.navigate('HomeScreen', {}, navigation.dispatch(
      DrawerActions.closeDrawer()
    ) as any)
    openModalCheckInEventSuccess.next({
      safeEvent,
      isOpen: true,
    })
  }

  onPressCheckOut = () => {
    eventStore.removeCheckInEvent().catch(() => {})

    /**
     * Call update event to current event. Function update event is stay at
     * HomeEvent.tsx
     * Pass null value to remove current event
     */
    eventStore.updateEventSub.next(null)
  }

  onPressSeeExhibitors = () => {
    const { safeEvent, navigation } = this.props
    const { boothsLength, eventId } = safeEvent

    if (boothsLength > 0) {
      navigation.navigate('ExhibitorsScreen', { eventId })
      // changeTabSupplierList.next(0)
    } else {
      this._modalExhibitor.current && this._modalExhibitor.current.open()
    }
  }

  renderYouAreCheckIn = () => {
    const { isCheckIn } = this.props

    if (!isCheckIn) return null

    return (
      <View style={styles.YouAreCheckInContainer}>
        <Image
          source={images.checked}
          style={styles.YouAreCheckInIcon}
          resizeMode={'contain'}
        />
        <Text style={styles.YouAreCheckInText}>You are checked-in!</Text>
      </View>
    )
  }

  renderButtonCheckIn = () => {
    const { isCheckIn } = this.props

    return (
      <AButton
        title={
          isCheckIn ? I18n.t('checkOutWithLine') : I18n.t('checkInWithLine')
        }
        onPress={isCheckIn ? this.onPressCheckOut : this.onPressCheckIn}
        containerStyle={[
          styles.customButtonContainer,
          styles.buttonOneContainer,
        ]}
        titleStyle={[styles.customButtonTitle]}
      />
    )
  }

  renderTextDescription = () => {
    const { isCheckIn } = this.props

    if (isCheckIn) return null

    return <Text style={styles.description}>{I18n.t('checkInToTheShow')}</Text>
  }

  render() {
    const { safeEvent } = this.props

    return (
      <View style={styles.container}>
        {this.renderYouAreCheckIn()}

        <View style={styles.wrapButton}>
          {this.renderButtonCheckIn()}

          <AButton
            title={'See Exhibitors'}
            onPress={this.onPressSeeExhibitors}
            containerStyle={[
              styles.customButtonContainer,
              styles.buttonTwoContainer,
            ]}
            titleStyle={[styles.customButtonTitle, styles.buttonTwoCustomText]}
          />
        </View>

        {this.renderTextDescription()}

        {/* Modal */}
        <ExhibitorsNotAvailable ref={this._modalExhibitor} />
        {/*<CheckInEvent ref={this._modalCheckInEvent} safeEvent={safeEvent} />*/}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingHorizontal: metrics.keylines_screen_product_info_margin,
    paddingTop: metrics.event_info_header_action_margin_top,
  },
  YouAreCheckInContainer: {
    flex: 1,
    flexDirection: 'row',
    height: metrics.event_info_header_action_button_height,
    backgroundColor: colors.green_background,
    borderRadius: metrics.event_info_header_action_button_border_radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: metrics.keylines_screen_product_info_margin,
  },
  YouAreCheckInIcon: {
    height: metrics.event_info_checked_icon_size,
    width: metrics.event_info_checked_icon_size,
    marginRight: metrics.keylines_screen_product_info_margin,
  },
  YouAreCheckInText: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.green_text,
  },
  wrapButton: {
    flexDirection: 'row',
  },
  customButtonContainer: {
    height: metrics.event_info_header_action_button_height,
    borderRadius: metrics.event_info_header_action_button_border_radius,
    margin: 0,
  },
  customButtonTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  buttonOneContainer: {
    flex: 1.6,
    marginRight: metrics.keylines_screen_product_info_margin,
  },
  buttonTwoContainer: {
    flex: 1,
    backgroundColor: colors.close_icon_gray,
  },
  buttonTwoCustomText: {
    color: colors.blue_light_grey,
  },
  description: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    color: colors.blue_light_grey,
    marginTop: 8,
  },
})
