import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts, metrics } from '@/vars'
import LinearGradient from 'react-native-linear-gradient'

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
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> & Readonly<{}>

export class CheckInEventHeader extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    const { eventName } = this.props

    return (
      <LinearGradient
        colors={[colors.product_info_camera_btn_bottom, colors.pink_blue]}
        start={{ x: 0.9, y: 0.1 }}
        end={{ x: 0.1, y: 0.1 }}
        style={styles.container}
      >
        <Text style={styles.title}>{I18n.t('welcomeTo')}</Text>

        <Text style={styles.name} numberOfLines={1}>
          {eventName}
        </Text>
      </LinearGradient>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: metrics.check_in_event_modal_header_height,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
  name: {
    fontSize: fonts.size.mxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
})
