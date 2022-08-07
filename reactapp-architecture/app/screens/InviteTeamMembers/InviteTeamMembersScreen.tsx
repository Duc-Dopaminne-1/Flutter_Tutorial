import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { AHeaderOne } from '@/components/AHeader/AHeaderOne'
import { AInputOne } from '@/components/AInput/AInputOne'
import I18n from '@/i18n'
import { Team, User } from '@/models/common'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import { Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { AViewIpad } from '@/components/AView/AViewIpad'
import Realm from 'realm'
import { Factory } from '@/services/factory'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { isValidEmail } from '@/shared/validator'
import { findIndex } from 'lodash'
import { SafeUser } from '@/shared/user'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'

// init state
const initialState = {
  inviteEmail: '',
  userInfo: null,
  teamMember: [],
  loading: false,
  loadingUser: true,
  loadingTeamMembers: true,
  errorEmail: false,
  errorText: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> &
  DefaultProps &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Partial<{}> & Readonly<typeof initialState>

@withContext(AppContext.Consumer)
export class InviteTeamMembersScreen extends React.PureComponent<Props, State> {
  _userSubscription: Subscription
  _userResults: Realm.Results<User>
  _addTeamMemberSub: Subscription

  _teamMembersResults: Realm.Results<Team>
  _teamMembersSubscription: Subscription

  readonly state: State = initialState

  componentDidMount() {
    this.fetchUser()
    this.fetchTeamMembers()
  }

  componentWillUnmount() {
    this._userSubscription && this._userSubscription.unsubscribe()
    this._userResults && this._userResults.removeAllListeners()
    this._addTeamMemberSub && this._addTeamMemberSub.unsubscribe()
    this._teamMembersResults && this._teamMembersResults.removeAllListeners()
    this._teamMembersSubscription && this._teamMembersSubscription.unsubscribe()
  }

  fetchUser = () => {
    const { userFactory } = this.props

    const [subscription, results] = userFactory.fetchById(
      Factory.user().identity
    )

    this._userResults = results

    this._userSubscription = subscription.subscribe(userInfo => {
      this.setState({
        userInfo,
        loadingUser: false,
      })
    })
  }

  fetchTeamMembers = () => {
    const { teamUserFactory } = this.props
    const [subscription, results] = teamUserFactory.fetch()

    this._teamMembersResults = results

    this._teamMembersSubscription = subscription.subscribe(teamMember => {
      this.setState({
        teamMember,
        loadingTeamMembers: false,
      })
    })
  }

  onChangeText = (inviteEmail: string) => {
    this.setState({
      inviteEmail,
      errorEmail: false,
      errorText: '',
    })
  }

  checkEmail = () => {
    const { inviteEmail, teamMember } = this.state

    if (!isValidEmail(inviteEmail)) {
      this.setState({
        errorEmail: true,
        errorText: I18n.t('invalidEmail'),
      })
      return
    }

    const index = findIndex(teamMember, member => {
      const { email } = new SafeUser(member)
      return email === inviteEmail
    })

    if (index !== -1) {
      this.setState({
        errorEmail: true,
        errorText: I18n.t('teamMemberExist'),
      })
      return
    }

    this.submit()
  }

  submit = () => {
    const { teamUserFactory } = this.props
    const { inviteEmail, userInfo } = this.state

    this.setState({
      loading: true,
    })

    this._addTeamMemberSub = teamUserFactory
      .addTeamMember(inviteEmail, userInfo)
      .subscribe(() => {
        this.props.navigation.goBack()
      })
  }

  renderInputField = () => {
    const {
      inviteEmail,
      loading,
      loadingUser,
      loadingTeamMembers,
      errorEmail,
      errorText,
    } = this.state

    if (loadingUser || loadingTeamMembers) return <AIndicator />

    return (
      <KeyboardAwareScrollView
        style={styles.wrapInput}
        keyboardShouldPersistTaps={'always'}
        extraScrollHeight={metrics.triple_base}
        enableOnAndroid={true}
      >
        <AInputOne
          title={I18n.t('inviteEmail')}
          value={inviteEmail}
          isError={errorEmail}
          errorText={errorText}
          onChangeText={this.onChangeText}
          textInputProps={{
            placeholder: I18n.t('enterEmail'),
            placeholderTextColor: colors.text_light_grey,
          }}
        />

        <View style={styles.wrapButton}>
          <AButtonGradient
            title={I18n.t('inviteTeamMember')}
            loading={loading}
            onPress={this.checkEmail}
          />
        </View>
      </KeyboardAwareScrollView>
    )
  }

  render() {
    const { goBack } = this.props.navigation

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
            title={I18n.t('inviteTeamMember')}
            onPressBack={() => goBack()}
          />

          {this.renderInputField()}
        </TouchableOpacity>

        <ANetworkStatus fillAbsolute />
      </AViewIpad>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapInput: {
    flex: 1,
    paddingTop: metrics.triple_base,
    paddingHorizontal: metrics.keylines_screen_sign_in_margin,
  },
  wrapButton: {
    paddingTop: metrics.margin_btw_button_text_input,
  },
})
