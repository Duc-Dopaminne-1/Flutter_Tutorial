import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  NavigationInjectedProps,
  NavigationScreenProp,
  withNavigation,
} from 'react-navigation'
import { ProjectQuery } from '@/screens/ProjectInfo/Component/ProjectQuery'
import { colors } from '@/vars'
import { isIpad } from '@/shared/devices'
import { AEmpty } from '@/components/AEmpty/AEmpty'
import { ProductInfoScreen } from '@/screens/ProductInfo/ProductInfoScreen'
import { Product, Project } from '@/models/team'
import { Subscription } from 'rxjs'
import { productStore } from '@/stores/productStore'
import { projectProductStore } from '@/stores/projectProductStore'

type Props = Readonly<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      project: Project
    }>
  >

export type State = Readonly<{
  layoutWidth: number
  selectedItem: Product
  selectedIndex: number
}>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class ProjectInfoScreen extends React.PureComponent<Props, State> {
  _selectItemSubSubscription: Subscription

  readonly state: State = {
    layoutWidth: 0,
    selectedItem: null,
    selectedIndex: 0,
  }

  componentDidMount() {
    this._selectItemSubSubscription = projectProductStore
      .select()
      .subscribe(value => {
        if (value.item && value.index >= 0) {
          this.setState({
            selectedItem: value.item,
            selectedIndex: value.index,
          })

          productStore.update().next({
            selectedId: value.item.id,
          })
        } else {
          this.setState({
            selectedItem: null,
            selectedIndex: -1,
          })
        }
      })
  }

  componentWillUnmount() {
    this._selectItemSubSubscription &&
      this._selectItemSubSubscription.unsubscribe()
  }

  onLayout = event => {
    const { width } = event.nativeEvent.layout
    this.setState({
      layoutWidth: width,
    })
  }

  renderDetail = () => {
    const { selectedItem, layoutWidth, selectedIndex } = this.state

    const productId = selectedItem && selectedItem.id

    if (!productId) {
      return <AEmpty />
    }

    return (
      <View style={styles.detail} onLayout={this.onLayout}>
        {productId && (
          <ProductInfoScreen
            key={productId}
            // @ts-ignore
            navigation={this.props.navigation}
            layoutWidth={layoutWidth}
            wasCreated={true}
            productId={productId}
            selectedIndex={selectedIndex}
            asComponent={isIpad()}
          />
        )}
      </View>
    )
  }

  render() {
    const { navigation } = this.props

    return (
      <View style={styles.container}>
        <ProjectQuery navigation={navigation} />
        {isIpad() && this.renderDetail()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  },
  detail: {
    flex: 1.2,
    borderLeftWidth: 1,
    borderLeftColor: colors.border_header,
  },
})
