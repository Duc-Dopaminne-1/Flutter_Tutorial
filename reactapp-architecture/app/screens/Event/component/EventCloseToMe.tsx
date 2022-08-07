import * as React from 'react'
import {
  Image,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  AppStateStatus,
  AppState,
  ImageRequireSource,
} from 'react-native'
import { colors, fonts, normalize } from '@/vars'
import { AppContextState } from '@/screens/App/AppContainer'

const initialState = {
  locationEnabled: false,
  appState: AppState.currentState,
}

export type State = Readonly<{
  locationEnabled: boolean
  appState: AppStateStatus
}> &
  Readonly<typeof initialState>

const defaultProps = {}

type DefaultProps = typeof defaultProps

type Props = Partial<{
  requestLocation?: () => void
  icon?: ImageRequireSource
  textButton?: string
  textOne?: string
  textTwo?: string
  textThree?: string
}> &
  DefaultProps &
  AppContextState

export class EventCloseToMe extends React.PureComponent<Props, State> {
  render() {
    const {
      requestLocation,
      icon,
      textOne,
      textTwo,
      textThree,
      textButton,
    } = this.props
    return (
      <View style={styles.container}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
        <Text style={styles.textLocation}>{textOne}</Text>

        <Text style={styles.textAccessLocation}>{textTwo}</Text>

        <TouchableOpacity style={styles.wrapButton} onPress={requestLocation}>
          <Text style={styles.textButton}>{textButton}</Text>
        </TouchableOpacity>

        <Text style={styles.textTradeShow}>{textThree}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: normalize(19),
  },
  icon: {
    height: normalize(128),
    width: normalize(128),
    marginTop: normalize(60),
    marginBottom: normalize(33),
  },
  textLocation: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
    fontWeight: '600',
    color: colors.dark_blue_grey,
    marginBottom: normalize(7),
  },
  textAccessLocation: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
    marginBottom: normalize(24),
    textAlign: 'center',
  },
  wrapButton: {
    height: normalize(40),
    width: normalize(188),
    backgroundColor: colors.primary_blue,
    borderRadius: normalize(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(21),
  },
  textButton: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
    fontWeight: '600',
    color: colors.white,
  },
  textTradeShow: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
    textAlign: 'center',
    paddingHorizontal: normalize(10),
  },
})
