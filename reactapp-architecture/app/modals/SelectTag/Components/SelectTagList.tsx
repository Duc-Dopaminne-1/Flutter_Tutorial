import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import { Tag } from '@/models/team'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { get } from 'lodash'
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Subscription } from 'rxjs'
import { SafeTags } from '@/shared/tags'
import { modalStore } from '@/stores/modalStore'
import { SelectTagSuggestList } from '@/modals/SelectTag/Components/SelectTagSuggestList'
import { FuseService } from '@/services/fuse'

type Props = {
  keyword: string
  onPress: (item: Tag) => void
  onCreate: (keyword: string) => void
  data: Realm.Results<Tag>
  isPerfect: boolean
  onClose?: () => void
  textInputHeight?: number
  selectedTags: []
}

type State = {
  suggestTag: Tag[]
}

export class SelectTagList extends React.PureComponent<Props, State> {
  _tagSuggestSubscription: Subscription
  _tags: SafeTags = new SafeTags([] as any)
  _fuse: FuseService<Tag> = new FuseService<Tag>([] as any)
  _data: any

  static readonly defaultProps = {
    data: [],
    textInputHeight: metrics.multi_select_text_input,
  }

  state: State = {
    suggestTag: [],
  }

  componentDidMount() {
    this.setState({
      suggestTag: this.filterTag(modalStore.tag, this.props.selectedTags),
    })
    this._fuse = new FuseService<Tag>(modalStore.tag as any)
    this._tagSuggestSubscription = modalStore.tagSubject.subscribe(data => {
      const { suggestTag, isMulti } = data
      this._data = data

      if (isMulti) {
        this._fuse = new FuseService<Tag>(suggestTag as any)
        this.updateSuggestions()
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.keyword !== this.props.keyword) {
      this.updateSuggestions()
    }
  }

  componentWillUnmount() {
    this._tagSuggestSubscription && this._tagSuggestSubscription.unsubscribe()
  }

  updateSuggestions = () => {
    const { keyword } = this.props
    const isMulti = get(this._data, 'isMulti')

    if (keyword.trim().length === 0) {
      if (isMulti) {
        const suggestTag = get(this._data, 'suggestTag', []) || []
        const selectedTag = get(this._data, 'selectedTag', []) || []
        this.setState({
          suggestTag: this.filterTag(suggestTag, selectedTag),
        })
      } else {
        this.setState({
          suggestTag: this.filterTag(modalStore.tag, this.props.selectedTags),
        })
      }
      return
    }
    const resultsSuggestion = this._fuse.search(keyword.trim())
    const selectedTag = get(this._data, 'selectedTag', []) || []
    const suggestTag = isMulti
      ? this.filterTag(resultsSuggestion.data, selectedTag)
      : this.filterTag(resultsSuggestion.data, this.props.selectedTags)
    this.setState({ suggestTag })
  }

  filterTag = (suggestTag: Tag[], selectedTags: Tag[]) => {
    this._tags.tag = suggestTag as any
    this._tags.data = suggestTag as any

    return this._tags.difference(selectedTags as any)
  }

  get paddingBottom() {
    const { textInputHeight } = this.props

    if (textInputHeight === 50) return 0

    return textInputHeight - metrics.multi_select_text_input + 10
  }

  renderHeader = () => {
    const { suggestTag } = this.state
    const { onPress } = this.props

    return <SelectTagSuggestList onPress={onPress} suggestTag={suggestTag} />
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    if (!item || !item.isValid() || item.deleted) return null

    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.wrapImage}>
          <Image source={images.tag} style={styles.image} />
        </View>

        <View style={styles.wrapButtonTitle}>
          <Text style={styles.buttonTitle} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderFooter = () => {
    const { keyword, isPerfect, onCreate } = this.props
    if (isPerfect) return null

    return (
      <AButtonCreate
        text={keyword}
        onPress={() => onCreate(keyword)}
        containerStyle={styles.createButton}
      />
    )
  }

  render() {
    const { data } = this.props

    return (
      <FlatList<Tag>
        data={data}
        extraData={data}
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
  container: {
    marginTop: metrics.base,
  },
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
  buttonContainer: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: metrics.keylines_screen_edge_margin,
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
  wrapImage: {
    backgroundColor: colors.tag_color,
    height: metrics.icon_category_size,
    width: metrics.icon_category_size,
    marginRight: metrics.medium_base,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  image: {
    height: metrics.medium_base,
    width: metrics.medium_base,
    tintColor: colors.text_grey,
  },
  wrapButtonTitle: {
    flex: 1,
    paddingRight: metrics.base,
  },
  buttonTitle: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
