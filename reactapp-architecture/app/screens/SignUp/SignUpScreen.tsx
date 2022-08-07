import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInputOne } from '@/components/AInput/AInputOne'
import I18n from '@/i18n'
import { StatusCode } from '@/services/api'
import { isEmpty, isValidEmail } from '@/shared/validator'
import { colors, metrics } from '@/vars'
import { pathOr } from 'ramda'
import * as React from 'react'
import {
  AsyncStorage,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationScreenProp } from 'react-navigation'
import { AViewIpad } from '@/components/AView/AViewIpad'
import { auth2 } from '@/services/auth2'
import { LocalStorage } from '@/services/storage'
import { Network } from '@/services/network'
import {
  signUpNavigation,
  SignUpNavigationRef,
} from '@/navigation/signUpNavigation'
import { Direction } from '@/common/constants/Direction'

// init state
const initialState = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',

  loading: false,

  errMsg: '',
  errFirstName: '',
  errLastName: '',
  errEmail: '',
  errPassword: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type SignUpScreenProps = Partial<{
  navigation: NavigationScreenProp<any, any>
}> &
  DefaultProps

export type SignUpScreenState = Readonly<typeof initialState>

export class SignUpScreen extends React.PureComponent<
  SignUpScreenProps,
  SignUpScreenState
> {
  _networkInfo = null

  readonly state: SignUpScreenState = initialState

  static navigationOptions = {
    title: 'Sign Up',
  }

  componentDidMount() {
    Network.connectionChange().subscribe(info => {
      this._networkInfo = info
    })
  }

  parseErrors = response => {
    const errors = pathOr({}, ['data', 'errors'], response)
    const errorsMessage = Object.values(errors).map((err: any) => err.msg)
    return errorsMessage.length > 0
      ? errorsMessage[0]
      : I18n.t('somethingWentWrong')
  }

  onChangeText = (key: string) => (text: string) => {
    // @ts-ignore
    this.setState({
      [key]: text,
    })

    switch (key) {
      case 'firstName':
        if (this.state.errFirstName.length > 0) {
          this.setState({ errFirstName: '' })
        }
        break
      case 'lastName':
        if (this.state.errLastName.length > 0) {
          this.setState({ errLastName: '' })
        }
        break
      case 'username':
        if (this.state.errEmail.length > 0) {
          this.setState({ errEmail: '' })
        }
        break
      case 'password':
        if (this.state.errPassword.length > 0) {
          this.setState({ errPassword: '' })
        }
        break
      default:
        break
    }
  }

  onSubmitEditing = (
    key: 'username' | 'password' | 'firstName' | 'lastName'
  ) => {
    console.log(key)
    const isValid = this.checkValidate(key)

    isValid && signUpNavigation.moveHandler(Direction.Down)
  }

  checkName = (key: 'firstName' | 'lastName') => {
    const value = this.state[key]
    const isFirstName = key === 'firstName'

    // Check string isn't empty
    if (!isEmpty(value)) {
      return true
    }

    if (isFirstName) {
      this.setState({
        errFirstName: I18n.t('emptyFirstName'),
      })
    } else {
      this.setState({
        errLastName: I18n.t('emptyLastName'),
      })
    }

    return false
  }

  checkEmail = () => {
    const { username } = this.state

    if (isEmpty(username)) {
      this.setState({
        errEmail: I18n.t('emptyEmail'),
      })
      return false
    }
    if (!isValidEmail(username.toLowerCase())) {
      this.setState({
        errEmail: I18n.t('invalidEmail'),
      })
      return false
    }

    return true
  }

  checkPassword = () => {
    const { password } = this.state

    /**
     * Check password has at least one character
     */
    if (password && password.trim() === '') {
      this.setState({
        errPassword: I18n.t('invalidPassword'),
      })
      return false
    }

    /**
     * Check password has enough character or not
     */
    if (password.length < 5) {
      this.setState({
        errPassword: I18n.t('password5CharLong'),
      })
      return false
    }

    return true
  }

  checkValidate = (key: 'username' | 'password' | 'firstName' | 'lastName') => {
    switch (key) {
      case 'firstName':
        return this.checkName(key)
      case 'lastName':
        return this.checkName(key)
      case 'username':
        return this.checkEmail()
      case 'password':
        return this.checkPassword()
      default:
        return false
    }
  }

  register = async () => {
    Keyboard.dismiss()

    try {
      const { errFirstName, errLastName, errEmail, errPassword } = this.state

      // check validate
      if (
        errFirstName.length > 0 ||
        errLastName.length > 0 ||
        errEmail.length > 0 ||
        errPassword.length > 0 ||
        !this.checkValidate('firstName') ||
        !this.checkValidate('lastName') ||
        !this.checkValidate('username') ||
        !this.checkValidate('password')
      ) {
        alert('You still have invalid field')
        return
      }

      // check network
      if (this._networkInfo && !Network.isConnected(this._networkInfo)) {
        alert(I18n.t('youNeedConnected'))
        return
      }

      Keyboard.dismiss()

      const { username, password, firstName, lastName } = this.state

      this.setState({
        loading: true,
        errMsg: '',
      })

      await auth2.logout()

      const result = await auth2.signUp({
        firstName,
        lastName,
        username,
        password,
        phoneNumber: null,
        email: username,
      })

      if (result.status === StatusCode.SUCCESS) {
        await auth2.signIn(username, password)

        await AsyncStorage.setItem(LocalStorage.EMAIL, username)

        this.setState(
          {
            loading: false,
          },
          () => {
            this.props.navigation.navigate('LoadingScreen', { isSignUp: true })
          }
        )
      } else {
        this.setState(
          {
            loading: false,
            errMsg: I18n.t('somethingWentWrong'),
          },
          () => {
            alert(this.state.errMsg)
          }
        )
      }
    } catch (e) {
      const errMsg = this.parseErrors(e.response)

      this.setState(
        {
          errMsg,
          loading: false,
        },
        () => {
          alert(this.state.errMsg)
        }
      )
    }
  }

  render() {
    const {
      username,
      password,
      firstName,
      lastName,
      loading,
      errFirstName,
      errLastName,
      errEmail,
      errPassword,
    } = this.state
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
            title={I18n.t('newAccount')}
            onPressBack={() => {
              !loading && navigation.goBack(null)
            }}
          />

          <KeyboardAwareScrollView
            style={styles.wrapInput}
            keyboardShouldPersistTaps={'always'}
            extraScrollHeight={50}
            enableOnAndroid={true}
          >
            {/* First Name */}
            <AInputOne
              textInputRef={nodeRef => {
                signUpNavigation.setRef(SignUpNavigationRef.FirstName, nodeRef)
              }}
              title={I18n.t('firstName')}
              value={firstName}
              onChangeText={this.onChangeText('firstName')}
              isError={errFirstName.length > 0}
              errorText={errFirstName}
              textInputProps={{
                placeholder: I18n.t('yourFirstName'),
                placeholderTextColor: colors.text_light_grey,
                editable: !loading,
                onSubmitEditing: () => {
                  this.onSubmitEditing('firstName')
                },
              }}
              onFocusTextInput={() => {
                signUpNavigation.current = SignUpNavigationRef.FirstName
              }}
              onBlurTextInput={() => {
                this.checkValidate('firstName')
              }}
            />

            {/* Last Name */}
            <AInputOne
              textInputRef={nodeRef => {
                signUpNavigation.setRef(SignUpNavigationRef.LastName, nodeRef)
              }}
              title={I18n.t('lastName')}
              value={lastName}
              onChangeText={this.onChangeText('lastName')}
              isError={errLastName.length > 0}
              errorText={errLastName}
              containerStyle={styles.customContainer}
              textInputProps={{
                placeholder: I18n.t('yourLastName'),
                placeholderTextColor: colors.text_light_grey,
                editable: !loading,
                onSubmitEditing: () => {
                  this.onSubmitEditing('lastName')
                },
              }}
              onFocusTextInput={() => {
                signUpNavigation.current = SignUpNavigationRef.LastName
              }}
              onBlurTextInput={() => {
                this.checkValidate('lastName')
              }}
            />

            {/* Username */}
            <AInputOne
              textInputRef={nodeRef => {
                signUpNavigation.setRef(SignUpNavigationRef.Email, nodeRef)
              }}
              title={I18n.t('emailAddress')}
              value={username}
              onChangeText={this.onChangeText('username')}
              isError={errEmail.length > 0}
              errorText={errEmail}
              textInputProps={{
                keyboardType: 'email-address',
                placeholder: I18n.t('yourEmail'),
                placeholderTextColor: colors.text_light_grey,
                editable: !loading,
                onSubmitEditing: () => {
                  this.onSubmitEditing('username')
                },
              }}
              containerStyle={styles.customContainer}
              onFocusTextInput={() => {
                signUpNavigation.current = SignUpNavigationRef.Email
              }}
              onBlurTextInput={() => {
                this.checkValidate('username')
              }}
            />

            {/* Password */}
            <AInputOne
              textInputRef={nodeRef => {
                signUpNavigation.setRef(SignUpNavigationRef.Password, nodeRef)
              }}
              title={I18n.t('password')}
              value={password}
              onChangeText={this.onChangeText('password')}
              isError={errPassword.length > 0}
              errorText={errPassword}
              textInputProps={{
                secureTextEntry: true,
                placeholder: I18n.t('yourPassword'),
                placeholderTextColor: colors.text_light_grey,
                editable: !loading,
                onSubmitEditing: () => {
                  this.onSubmitEditing('password')
                },
              }}
              containerStyle={styles.customContainer}
              onFocusTextInput={() => {
                signUpNavigation.current = SignUpNavigationRef.Password
              }}
              onBlurTextInput={() => {
                this.checkValidate('password')
              }}
            />

            <View style={styles.wrapButton}>
              <AButtonGradient
                title={I18n.t('createAccount')}
                loading={loading}
                onPress={this.register}
              />
            </View>
          </KeyboardAwareScrollView>
        </TouchableOpacity>
      </AViewIpad>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapInput: {
    flex: 1,
    paddingTop: metrics.triple_base,
    paddingHorizontal: metrics.keylines_screen_sign_in_margin,
  },
  customContainer: {
    marginTop: metrics.keylines_screen_product_info_margin,
  },
  wrapButton: {
    paddingTop: 24,
  },
})
