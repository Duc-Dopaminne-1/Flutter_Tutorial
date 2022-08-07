import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type ACameraTooltipProps = Readonly<{
  isVisible: boolean
  message: string
  position?: 'top' | 'bottom'
  padding?: number
}>

// export const ACameraTooltip: React.SFC<ACameraTooltipProps> = ({
//   isVisible,
//   message,
//   position,
//   padding,
// }) => {
//   if (!isVisible) {
//     return null
//   }
//
//   return (
//     <View
//       style={[
//         styles.container,
//         position === 'top' ? { top: padding } : { bottom: padding },
//       ]}
//     >
//       <Text style={styles.text}>{message}</Text>
//     </View>
//   )
// }

export class ACameraTooltip extends React.PureComponent<ACameraTooltipProps> {
  static readonly defaultProps = {
    position: 'bottom',
    padding: 0,
  }

  render() {
    const { isVisible, message, position, padding } = this.props

    if (!isVisible) return null

    return (
      <View
        style={[
          styles.container,
          position === 'top' ? { top: padding } : { bottom: padding },
        ]}
      >
        <Text style={styles.text}>{message}</Text>
      </View>
    )
  }
}

// ACameraTooltip.defaultProps = {
//   position: 'bottom',
//   padding: 0,
// }

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    zIndex: 99,
    backgroundColor: colors.primary_blue,
    height: 35,
    width: metrics.screen_width - 40,
    alignSelf: 'center',
    justifyContent: 'center',
    marginBottom: metrics.base,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.s,
    textAlign: 'center',
  },
})
