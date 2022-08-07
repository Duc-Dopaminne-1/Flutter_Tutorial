import { colors, metrics } from '@/vars'
import * as React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { isIpad } from '@/shared/devices'

type AViewIpadProps = Readonly<{
  children?: any
  noPaddingTop?: boolean
}>

export class AViewIpad extends React.PureComponent<AViewIpadProps> {
  static readonly defaultProps = {
    noPaddingTop: false,
  }

  render() {
    const { children, noPaddingTop } = this.props

    return (
      <SafeAreaView style={styles.container}>
        <View
          style={[
            { flex: 1 },
            isIpad() && styles.ipadMargin,
            noPaddingTop && { paddingTop: 0 },
          ]}
        >
          {children}
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
  ipadMargin: {
    width: metrics.screen_width_for_ipad,
    paddingTop: metrics.padding_top_for_ipad,
    alignSelf: 'center',
  },
})
