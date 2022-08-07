import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import I18n from '@/i18n'
import { colors, fonts, metrics } from '@/vars'
import { SampleInfoDetailForm } from './SampleInfoDetailForm'
import { SampleInfoDetailCustomField } from '@/screens/SampleInfo/Components/SampleInfoDetailCustomField'
import { Sample } from '@/models/team'

// init state
const initialState = {
  selectedUserId: null,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  sample?: Sample
} & DefaultProps

export type State = Readonly<typeof initialState>

export class SampleInfoDetail extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.space} />
        <Text style={styles.title}>{I18n.t('sampleDetails')}</Text>

        <SampleInfoDetailForm />
        <SampleInfoDetailCustomField />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  space: {
    height: 12,
    flex: 1,
    backgroundColor: colors.light_white_gray,
  },
  title: {
    marginTop: metrics.triple_base,
    marginHorizontal: metrics.keylines_screen_edge_margin,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
  },
})
