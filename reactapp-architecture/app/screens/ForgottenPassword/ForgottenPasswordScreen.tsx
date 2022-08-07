import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInputOne } from '@/components/AInput/AInputOne'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { StatusCode } from '@/services/api'
import { isValidEmail } from '@/shared/validator'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationScreenProp } from 'react-navigation'
import { AViewIpad } from '@/components/AView/AViewIpad'
import { auth2 } from '@/services/auth2'

// init state
const initialState = {
  email: '',
  errorEmail: false,
  sendEmailSuccess: false,
  loading: false,
  errorMessage: I18n.t('weCouldNotFindYourEmail'),
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<any>
}> &
  DefaultProps &
  AppContextState

export type State = Partial<{}> & Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class ForgottenPasswordScreen extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  get checkValidate() {
    const { email } = this.state
    const trimEmail = email.trim()
    // check empty text
    if (trimEmail.length <= 0) {
      this.setState({
        errorMessage: I18n.t('emptyEmail'),
        errorEmail: true,
      })
      return false
    }

    // check email
    if (!isValidEmail(trimEmail.toLowerCase())) {
      this.setState({
        errorMessage: I18n.t('invalidEmail'),
        errorEmail: true,
      })
      return false
    }

    return true
  }

  recoverAccount = async () => {
    try {
      Keyboard.dismiss()
      if (!this.checkValidate) return

      this.setState({ loading: true })

      const result = await auth2.resetPassword(this.state.email)

      if (
        result.status === StatusCode.SUCCESS ||
        result.status === StatusCode.SUCCESS_NO_CONTENT
      ) {
        this.setState({
          sendEmailSuccess: true,
          loading: false,
        })
      } else {
        alert(I18n.t('somethingWentWrong'))
      }
    } catch (e) {
      alert(I18n.t('somethingWentWrong'))
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  onChangeText = email => {
    this.setState({
      email,
      errorMessage: '',
      errorEmail: false,
    })
  }

  get renderTextInput() {
    const { email, errorEmail, loading, errorMessage } = this.state
    const { navigation } = this.props

    return (
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss()
        }}
        activeOpacity={1}
        style={{ flex: 1 }}
      >
        <AHeaderOne
          title={I18n.t('forgotPassword')}
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
          <AInputOne
            title={I18n.t('emailAddress')}
            value={email}
            onChangeText={this.onChangeText}
            isError={errorEmail}
            errorText={errorMessage}
            textInputProps={{
              keyboardType: 'email-address',
              placeholder: I18n.t('yourEmail'),
              placeholderTextColor: colors.text_light_grey,
              editable: !loading,
            }}
          />

          <View style={styles.wrapBack}>
            <TouchableOpacity
              onPress={() => {
                !loading && navigation.goBack(null)
              }}
            >
              <Text style={styles.backToLogin}>{I18n.t('backToLogin')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wrapButton}>
            <AButtonGradient
              title={I18n.t('recoverMyAccount')}
              loading={loading}
              onPress={this.recoverAccount}
            />
          </View>
        </KeyboardAwareScrollView>
      </TouchableOpacity>
    )
  }

  get sendEmailSuccess() {
    const { navigation } = this.props

    return (
      <View style={styles.wrapMessage}>
        <Image
          source={images.sendMessage}
          resizeMode={'contain'}
          style={styles.iconMessage}
        />

        <Text style={styles.message}>{I18n.t('recoverPasswordMessage')}</Text>

        <View style={styles.wrapButton}>
          <AButtonGradient
            title={I18n.t('backToLogin')}
            // loading={loading}
            onPress={() => {
              navigation.goBack(null)
            }}
          />
        </View>
      </View>
    )
  }

  render() {
    const { sendEmailSuccess } = this.state

    return (
      <AViewIpad noPaddingTop>
        {sendEmailSuccess ? this.sendEmailSuccess : this.renderTextInput}
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
  wrapBack: {
    marginTop: metrics.keylines_screen_product_info_margin,
    alignItems: 'flex-end',
  },
  backToLogin: {
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapButton: {
    paddingTop: 24,
  },
  wrapMessage: {
    flex: 1,
    paddingHorizontal: metrics.keylines_screen_forgot_password_margin,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconMessage: {
    width: metrics.icon_message_width,
    height: metrics.icon_message_height,
  },
  message: {
    marginTop: 40,
    textAlign: 'center',
    color: colors.dark_blue_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
})
