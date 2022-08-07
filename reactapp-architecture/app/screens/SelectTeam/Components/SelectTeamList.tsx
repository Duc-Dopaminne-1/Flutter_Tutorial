import * as React from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import { Team } from '@/models/common'
import { fonts, metrics } from '@/vars'
import { SelectTeamListItem } from '@/screens/SelectTeam/Components/SelectTeamListItem'
import { SelectTeamListHeader } from '@/screens/SelectTeam/Components/SelectTeamListHeader'
import { SelectTeamContext } from '@/screens/SelectTeam/SelectTeamContext'
import { SelectTeamCreateButton } from '@/screens/SelectTeam/Components/SelectTeamCreateButton'
import { ACenter } from '@/components/ACenter/ACenter'

interface Props {
  teamData: Team[]
  errorMessage: string
}

export const SelectTeamList: React.FunctionComponent<Props> = props => {
  const { selectTeam, createTeam } = React.useContext(SelectTeamContext)
  const { teamData, errorMessage } = props
  const isEmpty = teamData && teamData.length <= 0

  /**
   * Render item
   */
  const renderItem = ({ item }) => {
    return <SelectTeamListItem team={item} selectTeam={selectTeam} />
  }

  /**
   * Render list header
   */
  const renderHeader = () => {
    return <SelectTeamListHeader isEmpty={isEmpty} />
  }

  /**
   * Render list footer
   */
  const renderFooter = () => {
    return <SelectTeamCreateButton isEmpty={isEmpty} createTeam={createTeam} />
  }

  /**
   * Render empty list
   */
  const renderEmptyList = () => {
    if (!errorMessage) {
      return (
        <SelectTeamCreateButton isEmpty={isEmpty} createTeam={createTeam} />
      )
    }

    return (
      <ACenter>
        <Text style={styles.emptyText}>{errorMessage}</Text>
      </ACenter>
    )
  }

  /**
   * Check and change style if list is empty
   */
  const contentContainerStyle = isEmpty
    ? styles.wrapEmptyText
    : styles.flatListContainer

  return (
    <FlatList
      data={teamData}
      extraData={teamData}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyList}
      style={styles.flatList}
      contentContainerStyle={contentContainerStyle}
      bounces={false}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create<any>({
  flatList: {
    flex: 1,
    paddingTop: metrics.triple_base,
  },
  flatListContainer: {
    paddingBottom: metrics.triple_base + metrics.double_base,
  },
  wrapEmptyText: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fonts.size.m,
  },
})
