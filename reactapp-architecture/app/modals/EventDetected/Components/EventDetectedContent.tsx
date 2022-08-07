import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { StyleSheet, Text, View, Image, ImageRequireSource } from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import { AButton } from '@/components/AButton/AButton'

// init state
const initialState = {}

// default props
const defaultProps = {
  eventName: '',
}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  eventName: string
  onPressYes: () => void
  onPressNo: () => void
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> & Readonly<{}>

export class EventDetectedContent extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  renderRow = (text: string, icon: ImageRequireSource) => {
    return (
      <View style={styles.row}>
        <Image source={icon} resizeMode={'contain'} style={styles.icon} />
        <Text style={styles.text}>{text}</Text>
      </View>
    )
  }

  render() {
    const { eventName, onPressYes, onPressNo } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.title} numberOfLines={2}>
          {I18n.t('areYouAttending')} {eventName}?
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {I18n.t('checkInTheShow')}
        </Text>

        <View style={styles.wrapContent}>
          {this.renderRow(I18n.t('exhibitorsListing'), images.company)}
          {this.renderRow(I18n.t('boothNumbers'), images.location)}
          {this.renderRow(I18n.t('companiesDetails'), images.businessCard)}
        </View>

        <View style={styles.wrapBottom}>
          <AButton
            onPress={onPressYes}
            title={I18n.t('yesCheckInEvent')}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
          />

          <AButton
            onPress={onPressNo}
            title={I18n.t('noCheckInEvent')}
            containerStyle={[
              styles.buttonContainer,
              { backgroundColor: colors.close_icon_gray, marginTop: 12 },
            ]}
            titleStyle={[styles.buttonText, { color: colors.blue_light_grey }]}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.home_event_edge_margin_3,
    paddingVertical: metrics.home_event_edge_margin,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  description: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
    marginTop: metrics.home_event_edge_margin,
  },
  wrapContent: {
    flex: 1,
    paddingTop: metrics.home_event_edge_margin_3,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    height: metrics.event_detected_icon_size,
    width: metrics.event_detected_icon_size,
    tintColor: colors.primary_blue,
    marginRight: metrics.double_base,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
  },
  wrapBottom: {
    height: metrics.event_detected_bottom_height,
    paddingVertical: metrics.home_event_edge_margin_3,
  },
  buttonContainer: {
    height: metrics.event_detected_button_height,
    margin: 0,
  },
  buttonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
