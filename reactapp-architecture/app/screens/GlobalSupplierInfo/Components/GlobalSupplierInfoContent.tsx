import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { GlobalSupplierInfoHeader } from './GlobalSupplierInfoHeader'
import { GlobalSupplierInfoDetail } from './GlobalSupplierInfoDetail'

type Props = Readonly<{}>

export class GlobalSupplierInfoContent extends React.PureComponent<Props> {
  render() {
    return (
      <View style={styles.container}>
        <GlobalSupplierInfoHeader />
        <GlobalSupplierInfoDetail />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {},
})
