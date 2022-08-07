import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Team } from '@/models/common'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import { AButton } from '@/components/AButton/AButton'

interface Props {
  isEmpty: boolean
  createTeam: () => void
}

export const SelectTeamCreateButton: React.FunctionComponent<
  Props
> = React.memo(props => {
  const { isEmpty, createTeam } = props

  if (isEmpty) return null

  return (
    <>
      <AButton
        onPress={createTeam}
        title={I18n.t('createANewTeam')}
        containerStyle={styles.customContainerButton}
        titleStyle={styles.customTitleButton}
      />
      <Text style={styles.buttonDescription}>{I18n.t('youNeedConnected')}</Text>
    </>
  )
})

const styles = StyleSheet.create<any>({
  customContainerButton: {
    height: metrics.button_height,
    marginBottom: metrics.button_margin_bottom,
  },
  customTitleButton: {
    fontSize: fonts.size.m,
  },
  buttonDescription: {
    marginHorizontal: metrics.keylines_screen_edge_margin,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
})
