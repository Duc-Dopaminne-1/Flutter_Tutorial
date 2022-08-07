import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { SafeAreaView, StyleSheet, Text } from 'react-native'
import I18n from '@/i18n'
import { DrawerActions, NavigationScreenProp } from 'react-navigation'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import Realm from 'realm'
import { User } from '@/models/common'
import { Subscription } from 'rxjs'
import { SafeUser } from '@/shared/user'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInput } from '@/components/AInput/AInput'
import { isValidPhoneNumber } from '@/shared/validator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'

// init state
const initialState = {
  userInfo: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  companyName: '',
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

export type State = Partial<{
  [key: string]: any
}> &
  Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class UserInfoScreen extends React.PureComponent<Props, State> {
  _userSubscription: Subscription
  _updateUserSubscription: Subscription
  _userResults: Realm.Results<User>
  _isGoBack: boolean = false

  readonly state: State = initialState

  componentDidMount() {
    this.fetchUser()
  }

  componentWillUnmount() {
    this._userSubscription && this._userSubscription.unsubscribe()
    this._updateUserSubscription && this._updateUserSubscription.unsubscribe()
    this._userResults && this._userResults.removeAllListeners()
  }

  fetchUser = () => {
    const { userFactory } = this.props

    const [subscription, results] = userFactory.fetchFromUser()

    this._userResults = results

    this._userSubscription = subscription.subscribe(userInfo => {
      if (userInfo) {
        const {
          firstName,
          lastName,
          email,
          phoneNumber,
          companyName,
        } = new SafeUser(userInfo as any)

        this.setState({
          userInfo,
          firstName,
          lastName,
          email,
          phoneNumber,
          companyName,
        })
      }
    })
  }

  onChangeText = (key: string) => (value: string) => {
    this.setState({
      [key]: value,
    })
  }

  onCheckValidate = (key: string) => () => {
    if (key === 'firstName' || key === 'lastName') {
      if (!this.state[key].trim().length) {
        !this._isGoBack && alert(I18n.t('emptyNameAlert'))
        return
      }
    }

    if (key === 'phoneNumber') {
      if (this.state[key] && !isValidPhoneNumber(this.state[key])) {
        !this._isGoBack && alert(I18n.t('invalidPhoneNumber'))
        this.onChangeText('phoneNumber')('')
        return
      }
    }

    this.submit(key, this.state[key])
  }

  submit = (key: string, value: string) => {
    const { userFactory } = this.props
    const { userInfo } = this.state
    const { id } = new SafeUser(userInfo)

    if (!id) return

    this._updateUserSubscription = userFactory
      .updateToUser(id, { [key]: value })
      .subscribe(() => {})
  }

  goBackAndCloseMenu = () => {
    this.props.navigation.navigate(
      'HomeScreen',
      {},
      this.props.navigation.dispatch(DrawerActions.toggleDrawer()) as any
    )
  }

  render() {
    const { firstName, lastName, email, phoneNumber, companyName } = this.state

    return (
      <SafeAreaView style={styles.container}>
        <AHeaderOne
          title={I18n.t('profile')}
          onPressBack={this.goBackAndCloseMenu}
        />

        <KeyboardAwareScrollView
          style={styles.infoField}
          keyboardShouldPersistTaps={'always'}
          extraScrollHeight={metrics.triple_base}
          enableOnAndroid={true}
        >
          <Text style={styles.title}>{I18n.t('myProfile')}</Text>

          {/* First Name */}
          <AInput
            title={I18n.t('firstName').toUpperCase()}
            value={firstName}
            onChangeText={this.onChangeText('firstName')}
            onEndEditing={this.onCheckValidate('firstName')}
            containerStyle={styles.customTextInputContainer}
          />

          {/* Last Name */}
          <AInput
            title={I18n.t('lastName').toUpperCase()}
            value={lastName}
            onChangeText={this.onChangeText('lastName')}
            onEndEditing={this.onCheckValidate('lastName')}
            containerStyle={styles.customTextInputContainer}
          />

          {/* Email */}
          <AInput
            title={I18n.t('email').toUpperCase()}
            value={email}
            editable={false}
            containerStyle={styles.customTextInputContainer}
          />

          {/* Phone Number */}
          <AInput
            title={I18n.t('phoneNumber').toUpperCase()}
            value={phoneNumber}
            returnKeyType={'done'}
            keyboardType={'numeric'}
            onChangeText={this.onChangeText('phoneNumber')}
            onEndEditing={this.onCheckValidate('phoneNumber')}
            containerStyle={styles.customTextInputContainer}
          />

          {/* Company Name */}
          <AInput
            title={I18n.t('companyName').toUpperCase()}
            value={companyName}
            editable={false}
            containerStyle={styles.customTextInputContainer}
          />
        </KeyboardAwareScrollView>

        <ANetworkStatus fillAbsolute />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  infoField: {
    marginTop: metrics.profile_screen_margin_top,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
  },
  title: {
    fontSize: fonts.size.xl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
    marginBottom: metrics.base,
  },
  customTextInputContainer: {
    flex: 0,
  },
})
