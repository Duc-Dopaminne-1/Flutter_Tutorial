import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Team } from '@/models/common'
import { colors, fonts, images, metrics } from '@/vars'

interface Props {
  team: Team
  selectTeam: (team: Team) => void
}

export const SelectTeamListItem: React.FunctionComponent<Props> = React.memo(
  props => {
    const { team, selectTeam } = props
    const isPending = !team.realmPath

    if (isPending) return null

    return (
      <TouchableOpacity
        onPress={() => {
          selectTeam(team)
        }}
        style={styles.container}
      >
        <View style={styles.row}>
          <View style={styles.wrapIcon}>
            <Image source={images.team} style={styles.icon} />
          </View>

          <Text style={styles.itemText}>{team.name}</Text>
        </View>

        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }
)

const styles = StyleSheet.create<any>({
  container: {
    height: metrics.row_height,
    justifyContent: 'space-between',
    marginBottom: metrics.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.medium_base,
    marginLeft: 27,
  },
  icon: {
    height: metrics.icon_team,
    width: metrics.icon_team,
    tintColor: colors.primary_blue,
  },
  itemText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
  },
  separator: {
    height: 1,
    backgroundColor: colors.pale_grey,
    marginLeft: metrics.separator_margin,
  },
})
