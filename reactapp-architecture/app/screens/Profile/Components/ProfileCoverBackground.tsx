import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View, Image, Platform, Dimensions } from 'react-native'
import { isIphoneX } from '@/shared/devices'
import { Dimension, Orientation } from '@/services/dimension'
import { Subscription } from 'rxjs'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> & DefaultProps

export type State = Readonly<typeof initialState>

export class ProfileCoverBackground extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <Image source={images.backgroundImage} style={styles.image} />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    width: '100%',
    height: metrics.profile_header_height,
    backgroundColor: colors.home_header_top,
  },
  image: {
    width: '100%',
    height: metrics.profile_header_height,
  },
})
