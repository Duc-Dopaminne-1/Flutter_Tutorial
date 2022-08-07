import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import Realm from 'realm'
import { Team } from '@/models/common'
import { Subscription } from 'rxjs'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Network } from '@/services/network'
import I18n from '@/i18n'
import { selectTeamStore } from '@/stores/selectTeamStore'

// init state
const initialState = {
  team: null,
  loading: true,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  DefaultProps &
  AppContextState

export type State = Partial<{}> & Readonly<typeof initialState>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class MenuTeam extends React.PureComponent<Props, State> {
  _teamSubscription: Subscription
  _teamResults: Realm.Results<Team>
  _networkInfo = null

  readonly state: State = initialState

  componentDidMount() {
    this.fetchTeam()

    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  componentWillUnmount() {
    this._teamSubscription && this._teamSubscription.unsubscribe()
    this._teamResults && this._teamResults.removeAllListeners()
  }

  fetchTeam = () => {
    const { teamFactory, selectedTeamId } = this.props

    const [subscription, results] = teamFactory.fetchById(selectedTeamId)

    this._teamResults = results

    this._teamSubscription = subscription.subscribe(team => {
      this.setState({
        team,
        loading: false,
      })
    })
  }

  onChangeTeam = () => {
    // if (this._networkInfo && Network.isConnected(this._networkInfo)) {
    //   this.props.navigation.navigate('SelectTeamScreen', {
    //     isChangeTeam: true,
    //   })
    //   return
    // }
    //
    // alert(I18n.t('youNeedConnected'))

    this.props.navigation.navigate('SelectTeamScreen', {
      isChangeTeam: true,
    })
  }

  renderTeam = () => {
    const { team, loading } = this.state
    const teamName = team && team.name ? team.name : ''

    if (loading) return <AIndicator />

    return (
      <>
        <Text style={styles.team} numberOfLines={1}>
          {teamName}
        </Text>

        <Image
          source={images.rightChevron}
          style={styles.icon}
          resizeMode={'contain'}
        />
      </>
    )
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onChangeTeam}
        activeOpacity={0.8}
      >
        {this.renderTeam()}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: metrics.keylines_screen_edge_margin,
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  team: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.black_blue_text,
  },
  icon: {
    height: metrics.arrow_icon_size,
    width: metrics.arrow_icon_size,
    tintColor: colors.text_light_grey,
  },
})
