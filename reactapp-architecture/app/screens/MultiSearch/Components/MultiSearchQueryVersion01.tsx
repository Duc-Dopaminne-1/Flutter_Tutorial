import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { NavigationService } from '@/services/navigation'
import { withContext } from '@/shared/withContext'
import { colors, fonts } from '@/vars'
import * as React from 'react'
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { SearchKeywordType } from '@/services/global'
import I18n from '@/i18n'
import { ProductQuery } from '@/screens/Product/Components/ProductQuery'
import { SupplierQuery } from '@/screens/Supplier/Components/SupplierQuery'
import { TasksScreen } from '@/screens/Tasks/TasksScreen'
import { SampleListScreen } from '@/screens/Sample/SampleListScreen'

type Props = Readonly<{
  types?: boolean
  query?: string
  type?: SearchKeywordType
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  hidden: boolean
}>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class MultiSearchQuery extends React.PureComponent<Props, State> {
  _navListener = new NavigationService(this.props.navigation)

  readonly state: State = {
    hidden: true,
  }

  async componentDidMount() {
    this._navListener.didFocus(() => {
      StatusBar.setBarStyle('light-content', true)
    })
  }

  componentWillMount() {
    setTimeout(() => {
      this.show()
    }, 500)
  }

  show = () => {
    this.setState({ hidden: false })
  }

  componentWillUnmount() {
    this._navListener.removeListener()
  }

  render() {
    const { hidden } = this.state
    return (
      <ScrollView style={styles.container}>
        <View style={styles.separator}>
          <Text style={styles.title}>{I18n.t('products')}</Text>
          <ProductQuery
            multiTypes={true}
            fromMultiSearch={true}
            tabLabel={I18n.t('products')}
            type={SearchKeywordType.AllProduct}
          />
        </View>

        {hidden ? null : (
          <>
            <View style={styles.separator}>
              <Text style={styles.title}>{I18n.t('suppliers')}</Text>
              <SupplierQuery
                multiTypes={true}
                fromMultiSearch={true}
                tabLabel={I18n.t('suppliers')}
                type={SearchKeywordType.AllSupplier}
              />
            </View>

            <View style={styles.separator}>
              <Text style={styles.title}>{I18n.t('taskMenu')}</Text>
              <TasksScreen
                multiTypes={true}
                fromMultiSearch={true}
                tabLabel={I18n.t('taskMenu')}
                type={SearchKeywordType.AllTasks}
              />
            </View>

            <View style={styles.separator}>
              <Text style={styles.title}>{I18n.t('sampleTitle')}</Text>
              <SampleListScreen
                multiTypes={true}
                fromMultiSearch={true}
                tabLabel={I18n.t('sampleTitle')}
                type={SearchKeywordType.AllSamples}
              />
            </View>
          </>
        )}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  list: {
    flex: 1,
  },
  title: {
    marginLeft: 12,
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    fontWeight: '600',
    fontFamily: fonts.family.SSPSemiBold,
  },
  separator: {
    marginBottom: 37,
  },
})
