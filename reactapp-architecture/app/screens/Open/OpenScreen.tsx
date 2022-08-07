import { AButtonGradient } from '@/components/AButton/AButtonGradient'
import { OpenScreenLogo } from '@/screens/Open/Components/OpenScreenLogo'
import { colors, fonts, metrics, normalize } from '@/vars'
import * as React from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import I18n from '@/i18n'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  DefaultProps

export type State = Partial<{}> & Readonly<typeof initialState>

export class OpenScreen extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  static getDerivedStateFromProps() {
    StatusBar.setBarStyle('dark-content', true)
    return null
  }

  createAccount = () => {
    this.props.navigation.navigate('SignUpScreen')
  }

  signIn = () => {
    this.props.navigation.navigate('SignInScreen')
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <OpenScreenLogo />

        <View style={styles.wrapBody}>
          <Text style={styles.title}>ShowSourcing</Text>

          <Text style={styles.description}>{I18n.t('appDescription')}</Text>

          <View style={styles.wrapDot}>
            <View style={styles.dot} />
            <View style={[styles.dot, { backgroundColor: colors.pale_grey }]} />
            <View style={[styles.dot, { backgroundColor: colors.pale_grey }]} />
          </View>

          <AButtonGradient
            title={I18n.t('createAccount')}
            onPress={this.createAccount}
          />

          <View style={styles.wrapSignInText}>
            <Text style={styles.question}>
              {I18n.t('alreadyGotAccount') + ' '}
            </Text>

            <TouchableOpacity onPress={this.signIn}>
              <Text style={styles.signIn}>{I18n.t('signIn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapBody: {
    flex: 1.5,
  },
  title: {
    textAlign: 'center',
    fontSize: fonts.size.xlxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  description: {
    marginHorizontal: metrics.triple_base,
    marginTop: 24,
    textAlign: 'center',
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
  wrapDot: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 39,
  },
  dot: {
    height: normalize(6),
    width: normalize(6),
    borderRadius: normalize(6),
    marginHorizontal: 6,
    backgroundColor: colors.text_light_grey,
  },
  wrapSignInText: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
  },
  question: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
  signIn: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
})
