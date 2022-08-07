import * as React from 'react'
import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import { NavigationInjectedProps } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { FlatList, Keyboard, StyleSheet } from 'react-native'
import { colors, metrics } from '@/vars'
import { ifIphoneX } from '@/shared/devices'
import { SelectProductList } from './Components/SelectProductList'
import { Omit } from 'utility-types'
import { ModalizeProps } from '@/libs/Modalize'
import { Direction } from '@/common/constants/Direction'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  renderKey: 0,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {} & DefaultProps &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      setValue?: (data: any, key: string) => void
      hideActionBar?: boolean
      modalProps?: Omit<ModalizeProps, 'children'>
      onMove: (direction: Direction) => void
    }>
  >

export type State = Readonly<typeof initialState> &
  Readonly<{
    data: Realm.Results<Product>
  }>

@withContext(AppContext.Consumer)
export class SelectProductPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Product> = new FuseService<Product>([] as any)
  _subscription: Subscription
  _results: Realm.Results<Product> = [] as any
  _modal?: any

  static readonly defaultProps = {
    onPressClose: () => {},
  }

  readonly state: State = initialState

  async componentDidMount() {
    const { productFactory } = this.props

    this.open()

    const [subscription, results] = productFactory.fetch({})

    this._results = results

    this._subscription = subscription.subscribe(products => {
      this.setState({ data: products }, () => this.forceUpdate())
      this._fuse = new FuseService<Product>(products)
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        data: this._results || [],
      })
      return
    }

    this.setState({ keyword }, () => this.onSearch(keyword))
  }

  onSelect = (product: Product) => {
    const { navigation } = this.props
    const setValue = navigation.getParam('setValue', () => null)

    if (setValue && product) {
      setValue(product, 'product')
      this.close()
    }
  }

  openSnapSupplierModal = () => {
    Keyboard.dismiss()
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      data: result.data,
    })
  }

  open = () => {
    if (this._modal) {
      this._modal.open()
    }
  }

  close = () => {
    if (this._modal) {
      this._modal.close()
    }
  }

  onClear = () => {
    this.setState({
      data: this._results || [],
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })
    this._fuse.update(this._results || ([] as any))
  }

  renderItem = ({ item }) => {
    if (!item || item.deleted) return null

    return <SelectProductList product={item} onPress={this.onSelect} />
  }

  render() {
    const { keyword, data, renderKey } = this.state
    const onMove = this.props.navigation.getParam('onMove', () => null)
    const hideActionBar = this.props.navigation.getParam('hideActionBar', false)
    const modalProps = this.props.navigation.getParam('modalProps', undefined)

    return (
      <AModal3
        ref={nodeRef => (this._modal = nodeRef)}
        headerProps={{
          title: I18n.t('selectProduct'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterProductName'),
        }}
        onClear={this.onClear}
        hideActionBar={hideActionBar}
        renderKey={renderKey}
        modalProps={modalProps}
        onMove={onMove}
      >
        <FlatList
          data={data}
          renderItem={this.renderItem}
          keyExtractor={(_item, index) => index.toString()}
          keyboardDismissMode={'on-drag'}
          keyboardShouldPersistTaps={'always'}
          style={styles.flatList}
          onScrollBeginDrag={() => {
            Keyboard.dismiss()
          }}
        />
      </AModal3>
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    paddingTop: metrics.medium_base,
    paddingBottom: 100,
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
  },
})
