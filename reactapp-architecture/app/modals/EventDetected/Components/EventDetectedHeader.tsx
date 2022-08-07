import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors, fonts } from '@/vars'

// init state
const initialState = {}

// default props
const defaultProps = {
  eventName: '',
}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  backgroundColor: string
  eventName: string
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState> & Readonly<{}>

export class EventDetectedHeader extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    const { backgroundColor, eventName } = this.props

    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={styles.title}>{I18n.t('welcomeTo')}</Text>

        <Text style={styles.name} numberOfLines={1}>
          {eventName}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 78,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
  name: {
    fontSize: fonts.size.xlxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
})
