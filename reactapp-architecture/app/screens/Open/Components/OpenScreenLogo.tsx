import * as React from 'react'
import { Image, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { images, normalize } from '@/vars'
import Config from 'react-native-config'

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

export class OpenScreenLogo extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  showInfo = () => {
    alert(Config.SERVER_URL)
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={images.logo}
          resizeMode={'contain'}
          style={styles.image}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  image: {
    width: normalize(143),
    height: normalize(162),
  },
})
