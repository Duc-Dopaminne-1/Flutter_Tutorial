import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import { Category } from '@/models/team'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { get } from 'lodash'
import Realm from 'realm'
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { modalStore } from '@/stores/modalStore'
import { Subscription } from 'rxjs'
import { SelectCategorySuggestList } from '@/modals/SelectCategory/Components/SelectCategorySuggestList'
import { SafeCategories } from '@/shared/categories'
import { FuseService } from '@/services/fuse'

type Props = {
  keyword: string
  onPress: (item: Category) => void
  onCreate: (keyword: string) => void
  data: Realm.Results<Category>
  isPerfect: boolean
  onClose?: () => void
  textInputHeight?: number
  selectedCategories: Category[]
  loading?: boolean
}

type State = {
  suggestCategory: Category[]
}

export class SelectCategoryList extends React.Component<Props, State> {
  _categorySuggestSubscription: Subscription
  _categories: SafeCategories = new SafeCategories([] as any)
  _flatList: React.RefObject<FlatList<Category>> = React.createRef()
  _fuse: FuseService<Category> = new FuseService<Category>([] as any)
  _data: any

  static readonly defaultProps = {
    data: [],
    textInputHeight: metrics.multi_select_text_input,
    selectedCategories: [],
  }

  state: State = {
    suggestCategory: [],
  }

  componentDidMount() {
    this.setState({
      suggestCategory: this.filterCategory(
        modalStore.category,
        this.props.selectedCategories
      ),
    })
    this._fuse = new FuseService<Category>(modalStore.category as any)

    this._categorySuggestSubscription = modalStore.categorySubject.subscribe(
      data => {
        const { selectedCategory, suggestCategory, isMulti } = data
        this._data = data

        if (isMulti) {
          this._fuse = new FuseService<Category>(suggestCategory as any)
          this.updateSuggestions()
        }
      }
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keyword !== this.props.keyword) {
      this.updateSuggestions()
    }
  }

  componentWillUnmount() {
    this._categorySuggestSubscription &&
      this._categorySuggestSubscription.unsubscribe()
  }

  updateSuggestions = () => {
    const { keyword } = this.props
    const isMulti = get(this._data, 'isMulti')

    if (keyword.trim().length === 0) {
      if (isMulti) {
        const suggestCategory = get(this._data, 'suggestCategory', []) || []
        const selectedCategory = get(this._data, 'selectedCategory', []) || []
        this.setState({
          suggestCategory: this.filterCategory(
            suggestCategory,
            selectedCategory
          ),
        })
      } else {
        this.setState({
          suggestCategory: this.filterCategory(
            modalStore.category,
            this.props.selectedCategories
          ),
        })
      }
      return
    }
    const resultsSuggestion = this._fuse.search(keyword.trim())
    const selectedCategory = get(this._data, 'selectedCategory', []) || []
    const suggestCategory = isMulti
      ? this.filterCategory(resultsSuggestion.data, selectedCategory)
      : this.filterCategory(
          resultsSuggestion.data,
          this.props.selectedCategories
        )
    this.setState({ suggestCategory })
  }

  filterCategory = (
    suggestCategories: Category[],
    selectedCategories: Category[]
  ) => {
    this._categories.categories = suggestCategories as any
    this._categories.data = suggestCategories as any

    return this._categories.difference(selectedCategories as any)
  }

  renderHeader = () => {
    const { suggestCategory } = this.state
    const { onPress } = this.props

    return (
      <SelectCategorySuggestList
        suggestCategory={suggestCategory}
        onPress={onPress}
      />
    )
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    if (!item || !item.isValid() || item.deleted) return null

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View style={styles.wrapImage}>
          <Image source={images.category} style={styles.image} />
        </View>

        <Text style={styles.buttonTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    const { keyword, isPerfect } = this.props
    if (isPerfect) return null

    return (
      <AButtonCreate
        text={keyword}
        onPress={() => this.props.onCreate(keyword)}
        containerStyle={styles.createButton}
      />
    )
  }

  get paddingBottom() {
    if (this.props.textInputHeight === 50) return 24

    return this.props.textInputHeight - metrics.multi_select_text_input + 10
  }

  render() {
    const { data, loading } = this.props

    if (!loading) {
      setTimeout(() => {
        this._flatList.current && this._flatList.current.recordInteraction()
      }, 50)
    }

    return (
      <FlatList
        ref={this._flatList}
        data={data}
        extraData={this.props}
        renderItem={this.renderItem}
        keyExtractor={(_item, index) => index.toString()}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'always'}
        style={styles.flatList}
        contentContainerStyle={{ paddingBottom: this.paddingBottom }}
        ListFooterComponent={this.renderFooter}
        ListHeaderComponent={this.renderHeader}
        onScrollBeginDrag={() => {
          Keyboard.dismiss()
        }}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  flatList: {
    paddingBottom: 100,
    ...ifIphoneX({
      marginBottom: 30,
    }),
    backgroundColor: colors.white,
  },
  createButton: {
    marginTop: metrics.keylines_screen_edge_margin,
  },
  container: {
    height: 52,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
    paddingRight: 30,
  },
  wrapImage: {
    backgroundColor: colors.light_yellow,
    height: metrics.icon_category_size,
    width: metrics.icon_category_size,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: metrics.small_base,
  },
  image: {
    height: metrics.medium_base,
    width: metrics.medium_base,
  },
  buttonTitle: {
    marginLeft: 14,
    color: colors.tag_text_color,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
