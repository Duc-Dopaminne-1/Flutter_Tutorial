import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Team } from '@/models/common'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'

interface Props {
  isEmpty: boolean
}

export const SelectTeamListHeader: React.FunctionComponent<Props> = React.memo(
  props => {
    const { isEmpty } = props

    if (isEmpty) return null

    return (
      <View style={styles.container}>
        <Text style={styles.text}>{I18n.t('myTeams')}</Text>
      </View>
    )
  }
)

const styles = StyleSheet.create<any>({
  container: {
    marginLeft: metrics.keylines_screen_edge_margin,
    marginBottom: metrics.keylines_screen_profile_title_margin,
  },
  text: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
})
