import { ATitle } from '@/components/ATitle/ATitle'
import I18n from '@/i18n'
import { metrics } from '@/vars'
import { colors } from '@/vars/colors'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { SupplierInfoDetailInfoForm } from './SupplierInfoDetailInfoForm'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<any>
}> &
  DefaultProps

export type State = Readonly<typeof initialState>

export class SupplierInfoDetailInfo extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  static navigationOptions = {
    header: null,
  }

  render() {
    return (
      <View style={styles.container}>
        <ATitle title={I18n.t('supplierDetails')} />
        <SupplierInfoDetailInfoForm />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingTop: metrics.triple_base,
    paddingBottom: 20,
  },
})
