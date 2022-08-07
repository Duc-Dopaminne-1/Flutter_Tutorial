import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { ProfileContext } from '@/screens/Profile/ProfileContext'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  teamMember?: any
}> &
  Partial<NavigationInjectedProps<{}>> &
  DefaultProps

export type State = Readonly<typeof initialState>

@(withNavigation as any)
@withContext(ProfileContext.Consumer)
export class ProfileTeamMember extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  checkFirstName = (value: string) => {
    return value.length > 0 ? value + ' ' : ''
  }

  renderItem = ({ item }) => {
    const { firstName, lastName } = item

    const fullName = this.checkFirstName(firstName) + lastName

    return (
      <View style={styles.wrapItem}>
        <Text style={styles.teamMemberName}>{fullName}</Text>
      </View>
    )
  }

  changeTeam = () => {
    this.props.navigation.navigate('SelectTeamScreen', {
      isChangeTeam: true,
    })
  }

  render() {
    const { teamMember } = this.props
    const data = teamMember && teamMember.length > 0 ? teamMember : []

    return (
      <View>
        <View style={styles.container}>
          <View style={styles.wrapTeamMemberParent}>
            <ATitle title={I18n.t('teamMembers')} />
            {/* <TouchableOpacity onPress={this.changeTeam}>
              <Text style={styles.textChangeTeam}>Change Team</Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.wrapTeamMember}>
            <FlatList
              data={data}
              extraData={data}
              keyExtractor={item => item.id}
              renderItem={this.renderItem}
              scrollEnabled={false}
              contentContainerStyle={styles.flatListContainer}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.profile_margin_top,
    backgroundColor: colors.white,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    paddingTop: metrics.keylines_screen_edge_margin,
  },
  wrapTeamMember: {
    marginTop: 20,
  },
  wrapItem: {
    height: metrics.profile_team_member_item_height,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    borderBottomColor: colors.close_icon_gray,
    justifyContent: 'center',
  },
  teamMemberName: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
  wrapTeamMemberParent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 6,
  },
  textChangeTeam: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
