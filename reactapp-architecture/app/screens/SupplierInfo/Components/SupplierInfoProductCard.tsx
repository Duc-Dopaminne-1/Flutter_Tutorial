import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { SafeProduct } from '@/shared/product'
import { metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Subscription } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'
import { LImage } from '@/libs/LImage'

type Props = Readonly<{
  product: Product
}> &
  Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{}>

@(withNavigation as any)
export class SupplierInfoProductCard extends React.PureComponent<Props, State> {
  _subscription: Subscription = null
  _results: Realm.Results<CacheResult> = null

  readonly state: State = {}

  static navigationOptions = {
    header: null,
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  onPress = () => {
    const { product, navigation } = this.props

    navigation.navigate('ProductInfoScreen', {
      productName: product.name,
      productId: product.id,
      wasCreated: true,
    })
  }

  render() {
    const { images } = new SafeProduct(this.props.product)
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <LImage
          source={{
            uri: images.uri,
            id: images.first.id,
            downsampling: 200,
          }}
          style={styles.image}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    margin: 5,
    overflow: 'hidden',
    height: metrics.screen_width / 3.65,
    width: metrics.screen_width / 3.65,
  },
  image: {
    height: metrics.screen_width / 3.65,
    width: metrics.screen_width / 3.65,
  },
})
