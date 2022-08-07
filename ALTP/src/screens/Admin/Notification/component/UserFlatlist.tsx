import { colors } from '@/vars'
import * as React from 'react'
import {
  Alert,
  BackHandler,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {
  isVisibleTabBar,
  totalSelectMulti,
  isSelectMulti
} from '@/shared/global'
import { ProductSwipeable } from './ProductSwipeable'
import { FooterMultiSelect } from '@/screens/Admin/Notification/component/FooterMultiSelect'
import { getUserInfo } from '@/shared/ListAPI'

type Props = Readonly<{
  openModal?: (data: any) => void
}>

export type State = Readonly<{
  isFetching: boolean
  listUser: any
}>

export class UserFlatList extends React.PureComponent<Props, State> {
  _backHandler: any
  _actionSheetDeleteRef: any = React.createRef()
  _productIdCloseSwipe = ''
  _deleteProductId = ''
  _productId = []
  _isSelected = false
  _rows = {}

  static defaultProps = {
    fromMultiSearch: false,
    multiTypes: false
  }

  readonly state: State = {
    isFetching: false,
    listUser: []
  }

  getUser = async () => {
    this.setState({ isFetching: true })
    const result = await getUserInfo()

    if (result) {
      console.log('**** get User 222', result.data)
      this.setState({
        listUser: result.data,
        isFetching: false
      })
    } else {
      this.setState({ isFetching: false })
      Alert.alert('Oop!', 'Some thing went wrong!')
    }
  }

  componentDidMount() {
    this.getUser()
    this.backButton()
  }

  backButton = () => {
    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        this.onPressClose()
        return false
      }
    )
  }

  onSelect = (productId: string) => {
    if (this._productId.includes(productId)) {
      this._productId.splice(this._productId.indexOf(productId), 1)
    } else {
      this._productId.push(productId)
    }

    totalSelectMulti.next(this._productId.length)

    if (this._productId.length === 0) {
      this._isSelected = false
      isSelectMulti.next(false)
      isVisibleTabBar.next(true)
    } else if (this._productId.length === 1) {
      this._isSelected = true
      isVisibleTabBar.next(false)
    } else {
      this.forceUpdate()
    }
  }

  swipeRightOpen = (id: string) => {
    if (this._productIdCloseSwipe !== '' && this._productIdCloseSwipe !== id) {
      if (this._rows[this._productIdCloseSwipe]) {
        this._rows[this._productIdCloseSwipe].close()
      }
    }
    this._productIdCloseSwipe = id
  }

  swipeLeftOpen = (id: string) => {
    if (
      this._productIdCloseSwipe !== '' &&
      this._productIdCloseSwipe !== id &&
      !this._isSelected
    ) {
      if (this._rows[this._productIdCloseSwipe]) {
        this._rows[this._productIdCloseSwipe].close()
      }
    }
    this._productIdCloseSwipe = id
  }

  onPressDelete = (id: string) => {
    this._deleteProductId = id
    if (this._actionSheetDeleteRef) {
      if (this._rows[this._productIdCloseSwipe]) {
        this._rows[this._productIdCloseSwipe].close()
      }

      this.props.openModal([id])
      this.onPressClose()
    }
  }

  renderItem = ({ item, index }) => {
    const { _id } = item
    return (
      <ProductSwipeable
        _productSwipeRef={row => (this._rows[_id] = row)}
        product={item}
        index={index}
        onPressDelete={() => this.onPressDelete(_id)}
        swipeRightOpen={() => this.swipeRightOpen(_id)}
        swipeLeftOpen={() => this.swipeLeftOpen(_id)}
        onSelect={() => this.onSelect(_id)}
      />
    )
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          backgroundColor: colors.separator
        }}
      />
    )
  }
  resetDataLocal() {
    this._productIdCloseSwipe = ''
    this._isSelected = false
    this._productId = []
  }

  onPressClose = () => {
    this.resetDataLocal()
    isVisibleTabBar.next(true)
    isSelectMulti.next(false)
  }

  footer = () => {
    return (
      <View>
        <FooterMultiSelect
          openModal={() => {
            this.props.openModal(this._productId)
            this.onPressClose()
          }}
          close={this.onPressClose}
          title={'duc skt'}
        />
      </View>
    )
  }

  render() {
    const { listUser } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          data={listUser}
          extraData={listUser}
          keyExtractor={(item, _index) => item._id}
          renderItem={this.renderItem}
          onRefresh={() => this.getUser()}
          refreshing={this.state.isFetching}
          ItemSeparatorComponent={this.renderSeparator}
          style={styles.list}
        />
        {this.footer()}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15
  },
  row: {
    flex: 1,
    flexDirection: 'row'
  },
  list: {
    flex: 1
  }
})
