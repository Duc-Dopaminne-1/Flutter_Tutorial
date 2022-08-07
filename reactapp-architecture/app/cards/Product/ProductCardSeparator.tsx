import { colors } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

// export const ProductCardSeparator = () => {
//   return <View style={styles.separator} />
// }

export class ProductCardSeparator extends React.PureComponent {
  render() {
    return <View style={styles.separator} />
  }
}

const styles = StyleSheet.create<any>({
  separator: {
    height: 1,
    backgroundColor: colors.separator,
  },
})
