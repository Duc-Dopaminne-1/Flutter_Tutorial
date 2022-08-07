import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import Realm from 'realm'
import { User } from '@/models/common'
import { Subscription } from 'rxjs'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { SafeUser } from '@/shared/user'
import I18n from '@/i18n'

// init state
const initialState = {
  userInfo: null,
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

@withContext(AppContext.Consumer)
export class MenuUserName extends React.PureComponent<Props, State> {
  _userSubscription: Subscription
  _userResults: Realm.Results<User>

  _connectUserSubscription: Subscription

  _isConnectUser: boolean = false

  readonly state: State = initialState

  componentDidMount() {
    this.fetchUser()
  }

  componentWillUnmount() {
    this._userSubscription && this._userSubscription.unsubscribe()
    this._connectUserSubscription && this._connectUserSubscription.unsubscribe()

    this._userResults && this._userResults.removeAllListeners()
  }

  fetchUser = () => {
    const { userFactory } = this.props
    const [subscription, results] = userFactory.fetchFromUser()

    this._userResults = results

    this._userSubscription = subscription.subscribe(userInfo => {
      /*
        If don't have user data and check connect user is false. Then re-connect to user
      */
      if (!userInfo && !this._isConnectUser) {
        this._connectUserSubscription &&
          this._connectUserSubscription.unsubscribe()
        this.connectUSer()
      }

      if (userInfo) {
        this.setState({
          userInfo,
        })
      }

      this.setState({
        loading: false,
      })
    })
  }

  connectUSer = () => {
    const { downloadFactory } = this.props
    const [subscription] = downloadFactory.reconnectUser()

    this._connectUserSubscription = subscription.subscribe(data => {
      if (
        data.state === Realm.Sync.SubscriptionState.Complete &&
        !this._isConnectUser
      ) {
        this._isConnectUser = true
      }
    })
  }

  renderName = () => {
    const { userInfo, loading } = this.state
    const { firstName, email } = new SafeUser(userInfo)

    if (loading) return <AIndicator />

    return (
      <>
        <Text style={styles.name}>
          {I18n.t('hi') + ' '}
          <Text style={styles.boldName} numberOfLines={1}>
            {' '}
            {firstName}{' '}
          </Text>
        </Text>

        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>
      </>
    )
  }

  render() {
    return <View style={styles.container}>{this.renderName()}</View>
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: metrics.keylines_screen_profile_title_margin,
    paddingLeft: metrics.keylines_screen_profile_title_margin,
  },
  name: {
    fontSize: fonts.size.mxl,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
  },
  boldName: {
    fontSize: fonts.size.mxl,
    fontFamily: fonts.family.SSPBold,
    color: colors.dark_blue_grey,
  },
  email: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
})
