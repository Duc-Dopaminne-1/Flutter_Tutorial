import { Event } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import {
  AsyncStorage,
  FlatList,
  Image,
  Keyboard,
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
import { HomeEventGlobalEventCard } from '@/screens/Home/Components/HomeEventGlobalEventCard'
import { changeTabSupplierList } from '@/services/global'
import { LImage } from '@/libs/LImage'
import { EventData } from '@/services/globalEvent'

type Props = {} & AppContextState

type State = Readonly<{
  currentEvent: Event
  eventTeamList: any
  eventGlobalList: any
  eventDetectedList: any
}>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class HomeEvent extends React.PureComponent<Props, State> {
  _eventGlobalSubscription: Subscription
  _locationSubscription: Subscription
  _updateEventSubscription: Subscription

  _subscriptionEventTeam: Subscription
  _resultsEventTeam: Realm.Results<any>
  _subscriptionCreateEventTeam: Subscription

  /**
   * when it true try to copy global event again when fetchTeamEvent
   * listener run
   */
  _failWhenCopyToEventTeam = false

  readonly state: State = {
    currentEvent: null,
    eventTeamList: [],
    eventGlobalList: [],
    eventDetectedList: [],
  }

  async componentDidMount() {
    this.fetchTeamEvent()
    this.fetchGlobalEvent()
    this.listenUpdateCurrentEvent()
  }

  componentWillUnmount() {
    this._subscriptionEventTeam && this._subscriptionEventTeam.unsubscribe()
    this._resultsEventTeam && this._resultsEventTeam.removeAllListeners()
    this._subscriptionCreateEventTeam &&
      this._subscriptionCreateEventTeam.unsubscribe()

    this._eventGlobalSubscription && this._eventGlobalSubscription.unsubscribe()
    this._locationSubscription && this._locationSubscription.unsubscribe()
    this._updateEventSubscription && this._updateEventSubscription.unsubscribe()
  }

  listenUpdateCurrentEvent = () => {
    this._updateEventSubscription = eventStore.updateEventSub.subscribe(
      event => {
        this.checkCurrentEventInTeamRealm(event)
      }
    )
  }

  fetchGlobalEvent = () => {
    const { globalEventFactory } = this.props
    const [subscription] = globalEventFactory.fetch({
      tab: EventData.OnBoarding,
    })

    this._eventGlobalSubscription = subscription.subscribe(events => {
      this.setState(
        {
          eventGlobalList: events,
        },
        () => {
          this.requestCurrentLocation()
        }
      )
    })
  }

  fetchTeamEvent = () => {
    const { eventFactory } = this.props
    const [subscription, results] = eventFactory.fetch(true)

    this._resultsEventTeam = results

    this._subscriptionEventTeam = subscription.subscribe(eventTeam => {
      this.setState({
        eventTeamList: eventTeam,
      })

      if (this._failWhenCopyToEventTeam) {
        this._failWhenCopyToEventTeam = false
        this.checkEventValidate().catch(() => {})
      }
    })
  }

  requestCurrentLocation = () => {
    safeLocation.checkPermission()
    this._locationSubscription && this._locationSubscription.unsubscribe()
    this._locationSubscription = safeLocation.subjectCurrentLocation.subscribe(
      data => {
        // @ts-ignore
        const { type } = data
        const { eventGlobalList } = this.state

        if (type === 'Get' && eventGlobalList) {
          this.checkEventValidate().catch(() => {})
        }
      }
    )
  }

  checkEventValidate = async () => {
    AsyncStorage.getItem('eventId').then(currentEventId => {
      const { eventGlobalList } = this.state

      /**
       * if user didn't join any event before, then display list event
       */
      if (!currentEventId) {
        this.detectEvent()
        return
      }

      /**
       * Compare the event id from store with the list global event.
       * If it exist in the list return position of that event
       * If it don't exist return -1
       */
      const eventListIndex = findIndex(eventGlobalList, (event: any) => {
        return event.id === currentEventId
      })

      /**
       * If index return -1. Then remove event id from store and show list
       * event
       */
      if (eventListIndex === -1) {
        this.removeEvent().catch(() => {})
        this.detectEvent()
        return
      }

      /**
       * Update event to current event.
       */
      // eventStore.currentEvent = eventGlobalList[eventListIndex]
      this.checkCurrentEventInTeamRealm(eventGlobalList[eventListIndex])
    })
  }

  /**
   * Filter event near the user
   */
  detectEvent = () => {
    const { eventGlobalList } = this.state
    const eventDetectedList = safeLocation.detectEvent(eventGlobalList)

    this.setState({
      eventDetectedList,
    })
  }

  removeEvent = async () => {
    await AsyncStorage.removeItem('eventId')
  }

  /**
   * Check current has exist on the team realm or not
   * If exist then do nothing
   * Else update to team realm
   */
  checkCurrentEventInTeamRealm = (event: Event) => {
    const { eventTeamList } = this.state
    const { eventFactory } = this.props

    /**
     * If event is not exist.
     */
    if (!event) {
      this.setState({
        currentEvent: null,
      })
      eventStore.clearAll()
      return
    }

    const index = findIndex(eventTeamList, item => {
      const ev1 = new SafeEvent(item)
      const ev2 = new SafeEvent(event)

      return ev1.eventId === ev2.eventId
    })

    const isUpdate = index !== -1

    /**
     * Update event data if event is already add to team before.
     * If not, create new.
     */
    this._subscriptionCreateEventTeam = eventFactory
      .copyGlobalEvent(event, isUpdate)
      .subscribe(
        eventTeam => {
          this.setState({
            currentEvent: eventTeam,
          })
          eventStore.currentEvent = eventTeam
          eventStore.currentEventGlobalId = event.id
        },
        _error => {
          this._failWhenCopyToEventTeam = true
        }
      )
  }

  onPressCheckIn = (event: Event) => {
    const { eventId } = new SafeEvent(event)

    eventStore.saveCheckInEvent(eventId).catch(() => {})
    eventStore.updateEventSub.next(event)
  }

  onPressCheckOut = () => {
    eventStore.removeCheckInEvent().catch()
    eventStore.updateEventSub.next(null)
  }

  onPressBrowseShows = () => {
    this.props.navigation.navigate('EventScreen')
  }

  onPressBrowseExhibitor = () => {
    this.props.navigation.navigate('SupplierScreen')
    changeTabSupplierList.next(0)
  }

  renderHeader = () => {
    const { eventDetectedList } = this.state
    const hasGlobalList = eventDetectedList.length > 0

    const title = hasGlobalList
      ? I18n.t('showDetectedTitle')
      : I18n.t('attendingAShowTitle')
    const content = hasGlobalList
      ? I18n.t('showDetectedDescription')
      : I18n.t('attendingAShowDescription')

    return (
      <View style={styles.wrapEmptyShow}>
        <Image
          source={images.showDetectedLogo}
          style={styles.showDetectedLogo}
        />

        <View style={styles.wrapHeaderContent}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerContent}>{content}</Text>
        </View>
      </View>
    )
  }

  renderListGlobalEvent = () => {
    const { eventDetectedList } = this.state

    return (
      <FlatList
        data={eventDetectedList}
        extraData={eventDetectedList}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        keyboardShouldPersistTaps={'always'}
        style={styles.flatList}
      />
    )
  }

  renderItem = ({ item }) => {
    return (
      <HomeEventGlobalEventCard
        event={item}
        onPressCheckIn={this.onPressCheckIn}
      />
    )
  }

  renderButton = () => {
    const { eventDetectedList } = this.state
    const hasGlobalList = eventDetectedList.length > 0
    const title = hasGlobalList
      ? I18n.t('browseAllShows')
      : I18n.t('browseShows')

    return (
      <AButton
        onPress={this.onPressBrowseShows}
        title={title}
        containerStyle={[
          styles.buttonCustomContainer,
          hasGlobalList && { marginTop: 0 },
        ]}
        titleStyle={styles.buttonCustomTitle}
      />
    )
  }

  renderEventLogo = () => {
    const { currentEvent } = this.state
    const {
      logo: { uri, id },
      primaryColor,
      secondaryColor,
    } = new SafeEvent(currentEvent)

    if (uri) {
      return (
        <View style={styles.showDetectedLogo}>
          <LImage
            source={{
              uri,
              id,
              downsampling: 200,
            }}
            // @ts-ignore
            style={styles.showDetectedLogoImage}
          />
        </View>
      )
    }

    return (
      <LinearGradient
        colors={[primaryColor, secondaryColor]}
        style={styles.showDetectedLogo}
      >
        <Image source={images.event} style={styles.defaultLogo} />
      </LinearGradient>
    )
  }

  renderEvent = () => {
    const { currentEvent } = this.state
    const { eventName, eventInfoDateVer2, supplierCount } = new SafeEvent(
      currentEvent
    )

    const startDate = eventInfoDateVer2.startDate
      ? eventInfoDateVer2.startDate
      : 'none'
    const endDate = eventInfoDateVer2.endDate
      ? eventInfoDateVer2.endDate
      : 'none'

    return (
      <>
        <View style={styles.wrapEmptyShow}>
          {this.renderEventLogo()}

          <View style={styles.wrapHeaderContent}>
            <Text style={styles.headerDescription}>
              {I18n.t('currentlyVisiting')}
            </Text>
            <Text style={styles.headerTitle}>{eventName}</Text>
            <Text style={styles.headerContent}>
              {startDate +
                ' - ' +
                endDate +
                ' • ' +
                supplierCount +
                ' ' +
                I18n.t('exhibitors')}
            </Text>
          </View>
        </View>

        <View style={styles.wrapDoubleButton}>
          <AButton
            onPress={this.onPressCheckOut}
            title={I18n.t('checkOut')}
            containerStyle={[
              styles.buttonCustomContainer,
              styles.buttonEventOneCustomContainer,
            ]}
            titleStyle={[styles.buttonEventCustomTitle]}
          />

          <AButton
            onPress={this.onPressBrowseExhibitor}
            title={I18n.t('browseExhibitors')}
            containerStyle={[
              styles.buttonCustomContainer,
              styles.buttonEventTwoCustomContainer,
            ]}
            titleStyle={[
              styles.buttonEventCustomTitle,
              { color: colors.primary_blue },
            ]}
          />
        </View>
      </>
    )
  }

  render() {
    const { currentEvent } = this.state

    if (currentEvent) {
      return <View style={styles.container}>{this.renderEvent()}</View>
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderListGlobalEvent()}
        {this.renderButton()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.keylines_screen_product_info_margin,
    padding: metrics.keylines_screen_product_info_margin,
    backgroundColor: colors.white,
  },
  wrapEmptyShow: {
    flexDirection: 'row',
  },
  showDetectedLogo: {
    width: metrics.home_event_logo,
    height: metrics.home_event_logo,
    marginRight: metrics.keylines_screen_product_info_margin,
    borderRadius: metrics.small_base,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  showDetectedLogoImage: {
    width: metrics.home_event_logo,
    height: metrics.home_event_logo,
  },
  defaultLogo: {
    height: normalize(32),
    width: normalize(32),
    tintColor: colors.white,
  },
  wrapHeaderContent: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.mxl,
  },
  headerContent: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.black_blue_text,
  },
  headerDescription: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.black_blue_text,
  },
  buttonCustomContainer: {
    margin: 0,
    marginTop: metrics.keylines_screen_product_info_margin,
    height: metrics.home_event_button_height,
    backgroundColor: colors.background,
    borderRadius: metrics.small_base,
  },
  buttonCustomTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.primary_blue,
  },
  wrapDoubleButton: {
    flexDirection: 'row',
  },
  buttonEventOneCustomContainer: {
    width: '48.5%',
    backgroundColor: colors.primary_blue,
    marginRight: metrics.base,
  },
  buttonEventTwoCustomContainer: {
    width: '48.5%',
  },
  buttonEventCustomTitle: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
  flatList: {
    marginTop: metrics.keylines_screen_profile_title_margin,
  },
})
