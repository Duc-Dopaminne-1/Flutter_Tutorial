import * as React from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { colors, fonts, images } from '@/vars'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { Event } from '@/models/global'
import { SafeEvent } from '@/shared/event'
import { navigation } from '@/navigation/navigation'
import LinearGradient from 'react-native-linear-gradient'
import { LImage } from '@/libs/LImage'

type Props = {
  event?: Event
} & Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class EventCard extends React.PureComponent<Props, State> {
  readonly state: State = {}

  onPressCard = (eventId: string, eventName: string) => {
    navigation.navigate('EventInfoScreen', {
      eventId,
      eventName,
    })
  }

  renderLogo = (uri, id) => {
    const { primaryColor, secondaryColor } = new SafeEvent(this.props.event)

    if (uri) {
      return (
        <View style={styles.wrapIconChild}>
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
        style={styles.wrapIconChild}
      >
        <Image source={images.event} style={styles.logo} />
      </LinearGradient>
    )
  }

  render() {
    const { event } = this.props
    const {
      eventInfoDate,
      eventId,
      eventName,
      industryName,
      logo: { uri, id },
    } = new SafeEvent(event)

    return (
      <TouchableHighlight
        style={styles.container}
        onPress={() => {
          this.onPressCard(eventId, eventName)
        }}
        underlayColor={colors.light_grey}
      >
        <>
          <View style={styles.wrapIcon}>{this.renderLogo(uri, id)}</View>
          <View style={styles.wrapAllText}>
            <View style={styles.wrapDateText}>
              <Text style={styles.dateText}>
                {eventInfoDate.startDate + ' - ' + eventInfoDate.endDate}
              </Text>
            </View>
            <View style={styles.wrapVenueName}>
              <Text style={styles.venueName}>{eventName}</Text>
            </View>
            <View style={styles.wrapDateText}>
              <Text style={styles.textIndusTry}>{industryName}</Text>
            </View>
          </View>
        </>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 28,
  },
  wrapIcon: {
    marginTop: 4,
    width: 104,
    alignItems: 'center',
  },
  wrapIconChild: {
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    height: 84,
    width: 84,
  },
  logo: {
    height: 32,
    width: 32,
    tintColor: colors.white,
  },
  wrapAllText: {
    flex: 1,
    flexDirection: 'column',
    marginRight: 18,
  },
  wrapDateText: {
    marginBottom: 4,
  },
  dateText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.primary_blue,
  },
  wrapVenueName: {
    marginBottom: 4,
    paddingRight: 10,
  },
  venueName: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
    fontWeight: '600',
    color: colors.dark_blue_grey,
  },
  textIndusTry: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
})
