import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInputOne } from '@/components/AInput/AInputOne'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { isEmpty, isValidEmail } from '@/shared/validator'
import { withContext } from '@/shared/withContext'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  Alert,
  AsyncStorage,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { pathOr } from 'ramda'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationScreenProp } from 'react-navigation'
import { AViewIpad } from '@/components/AView/AViewIpad'
import { RealmEnum } from '@/common/constants/RealmEnum'
import { auth2 } from '@/services/auth2'
import { LocalStorage } from '@/services/storage'
import { Network } from '@/services/network'

// init state
const initialState = {
  username: __DEV__ ? '' : '',
  password: __DEV__ ? '' : '',

  loading: false,
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
export class SignInScreen extends React.PureComponent<Props, State> {
  _networkInfo = null

  readonly state: State = initialState

  async componentDidMount() {
    const email = await AsyncStorage.getItem(LocalStorage.EMAIL)

    this.setState({
      username: email ? email : '',
    })

    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  onChangeText = (key: string) => (value: string) => {
    this.setState({
      [key]: value,
    })
  }

  get validateLogin() {
    const { username, password } = this.state

    // check is empty
    if (
      isEmpty(username, I18n.t('emptyEmail')) ||
      isEmpty(password, I18n.t('emptyPassword'))
    ) {
      return false
    }

    if (!isValidEmail(username)) {
      alert(I18n.t('invalidEmail'))
      this.setState({
        username: '',
      })
      return false
    }

    return true
  }

  login = async () => {
    try {
      // check validate
      if (!this.validateLogin) return
      // check network
      if (this._networkInfo && !Network.isConnected(this._networkInfo)) {
        alert(I18n.t('youNeedConnected'))
        return
      }
      Keyboard.dismiss()
      const { username, password } = this.state
      this.setState({ loading: true })

      let userRealm = null
      try {
        userRealm = await auth2.signIn(username, password)
      } catch (e) {
        this.loginErrorHandle(e)
      }

      if (userRealm) {
        this.props.addRealm(RealmEnum.UserRealm, userRealm)
        await AsyncStorage.setItem(LocalStorage.EMAIL, username)
        this.setState({ loading: false }, () => {
          this.goToScreen('LoadingScreen')
        })
      }
    } catch (e) {
      this.loginErrorHandle(e)
    }
  }

  loginErrorHandle = error => {
    if (
      pathOr<number>(0, ['response', 'status'], error) === 401 ||
      pathOr<number>(0, ['status'], error) === 401
    ) {
      Alert.alert(
        I18n.t('cannotConnect'),
        I18n.t('uHaveInputAInvalidUsernameOrPass')
      )
    } else {
      Alert.alert(I18n.t('cannotConnect'), error.message)
    }
    this.setState({ loading: false })
  }

  goToScreen = (routeName: string) => {
    this.props.navigation.navigate(routeName)
  }

  onPressForgotPassword = () => {
    Keyboard.dismiss()
    const { navigation } = this.props
    const { loading } = this.state
    !loading && navigation.navigate('ForgottenPasswordScreen')
  }

  render() {
    const { username, password, loading } = this.state
    const { navigation } = this.props

    return (
      <AViewIpad>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss()
          }}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <AHeaderOne
            title={I18n.t('welcomeBack')}
            onPressBack={() => {
              !loading && navigation.goBack(null)
            }}
          />

          <KeyboardAwareScrollView
            style={styles.wrapInput}
            keyboardShouldPersistTaps={'always'}
            extraScrollHeight={metrics.triple_base}
            enableOnAndroid={true}
          >
            {/* Username */}
            <AInputOne
              title={I18n.t('emailAddress')}
              value={username}
              onChangeText={this.onChangeText('username')}
              textInputProps={{
                keyboardType: 'email-address',
                placeholder: I18n.t('yourEmail'),
                placeholderTextColor: colors.text_light_grey,
                editable: !loading,
              }}
            />

            {/* Password */}
            <AInputOne
              title={I18n.t('password')}
              value={password}
              onChangeText={this.onChangeText('password')}
              textInputProps={{
                secureTextEntry: true,
                onSubmitEditing: this.login,
                placeholder: I18n.t('yourPassword'),
                placeholderTextColor: colors.text_light_grey,
                editable: !loading,
              }}
              containerStyle={styles.customContainer}
            />

            <View style={styles.wrapForgotPassword}>
              <TouchableOpacity onPress={this.onPressForgotPassword}>
                <Text style={styles.forgotPassword}>
                  {I18n.t('forgotPassword')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wrapButton}>
              <AButtonGradient
                title={I18n.t('signIn')}
                loading={loading}
                onPress={this.login}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </AViewIpad>
    )
  }
}

const styles = StyleSheet.create({
  wrapInput: {
    flex: 1,
    paddingTop: metrics.triple_base,
    paddingHorizontal: metrics.keylines_screen_sign_in_margin,
  },
  customContainer: {
    marginTop: metrics.keylines_screen_product_info_margin,
  },
  wrapForgotPassword: {
    marginTop: metrics.keylines_screen_product_info_margin,
    alignItems: 'flex-end',
  },
  forgotPassword: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapButton: {
    paddingTop: 24,
  },
})
