import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import I18n from '@/i18n'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> & DefaultProps

export type State = Readonly<typeof initialState>

export class ProfileInfoTitle extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{I18n.t('yourProfile')}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -150,
    zIndex: 99,
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.white,
  },
})
