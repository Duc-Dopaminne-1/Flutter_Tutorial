import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { StyleSheet, Text, View, Image, ImageRequireSource } from 'react-native'
import { colors, fonts, images, metrics } from '@/vars'
import { AButton } from '@/components/AButton/AButton'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  onPressGotIt: () => void
}> &
  DefaultProps

export type State = Readonly<typeof initialState> & Readonly<{}>

export class CheckInEventContent extends React.PureComponent<Props, State> {
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
    const { onPressGotIt } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.wrapBody}>
          <Text style={styles.title} numberOfLines={1}>
            {I18n.t('youAreNowCheckIn')}
          </Text>

          <Text style={styles.description} numberOfLines={1}>
            {I18n.t('youNowHaveAccess')}
          </Text>

          <View style={styles.wrapContent}>
            {this.renderRow(I18n.t('exhibitorsListing'), images.company)}
            {this.renderRow(I18n.t('boothNumbers'), images.location)}
            {this.renderRow(I18n.t('companiesDetails'), images.businessCard)}
          </View>
        </View>

        <View style={styles.wrapBottom}>
          <AButton
            onPress={onPressGotIt}
            title={I18n.t('gotIt')}
            containerStyle={styles.buttonContainer}
            titleStyle={styles.buttonText}
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
  wrapBody: {
    flex: 5,
  },
  title: {
    fontSize: fonts.size.mxl,
    fontFamily: fonts.family.SSPSemiBold,
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
  },
  row: {
    marginBottom: metrics.check_in_event_modal_item_margin_bottom,
    flexDirection: 'row',
  },
  icon: {
    height: metrics.check_in_event_modal_icon_size,
    width: metrics.check_in_event_modal_icon_size,
    tintColor: colors.primary_blue,
    marginRight: metrics.double_base,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
  },
  wrapBottom: {
    flex: 1,
  },
  buttonContainer: {
    height: metrics.exhibitor_modal_button_height,
    margin: 0,
    borderRadius: metrics.small_base,
  },
  buttonText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
