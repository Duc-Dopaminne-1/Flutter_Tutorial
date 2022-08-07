import I18n from '@/i18n'
import { colors, fonts } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { withContext } from '@/shared/withContext'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeProduct } from '@/shared/product'
import { TasksQuery } from '@/screens/Tasks/TasksQuery'
import { SearchKeywordType } from '@/services/global'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Product } from '@/models/team'
import { isIphoneX } from '@/shared/devices'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  product?: Product
  safeProduct?: SafeProduct
} & DefaultProps &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

@withContext(ProductInfoContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ProductInfoActivityTasks extends React.PureComponent<Props> {
  onTaskAction = () => {}

  onAddTask = () => {
    const { navigation, product } = this.props
    navigation.navigate('CreateTaskPicker', { product })
  }

  render() {
    const { safeProduct, product } = this.props
    return (
      <View style={styles.container}>
        <TasksQuery
          tabLabel={I18n.t('taskAllTasks')}
          query={`product.id = "${safeProduct.id}"`}
          type={SearchKeywordType.AllTasks}
          onAction={this.onTaskAction}
          disableSwipeActions={true}
          limited={true}
          initialLimit={3}
          isComponent={true}
          product={product}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginTop: 12,
    paddingBottom: !isIphoneX() ? 24 : 0, // TaskQuery component already has bootm padding for iPhoneX devices
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
    marginVertical: 14,
  },
  addButton: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
    color: colors.primary_blue,
  },
})
