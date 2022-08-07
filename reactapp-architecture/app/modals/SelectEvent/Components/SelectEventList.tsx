import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import { ifIphoneX } from '@/shared/devices'
import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import {
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Event } from '@/models/team'
import { SafeEvent } from '@/shared/event'
import { modalStore } from '@/stores/modalStore'
import { SelectEventSuggestList } from '@/modals/SelectEvent/Components/SelectEventSuggestList'
import { difference } from '@/shared/supportFunction'
import { Subscription } from 'rxjs'

type Props = {
  keyword: string
  onPress: (item: Event) => void
  onCreate: (keyword: string) => void
  data: Realm.Results<Event>
  isPerfect: boolean
  onClose?: () => void
  textInputHeight?: number
  selectedEvent: Event[]
  loading?: boolean
}

type State = {
  suggestEvent: Event[]
}

export class SelectEventList extends React.Component<Props, State> {
  _subscription: Subscription
  _flatList: React.RefObject<FlatList<Event>> = React.createRef()

  static readonly defaultProps = {
    data: [],
    selectedEvent: [],
    textInputHeight: metrics.multi_select_text_input,
  }

  state: State = {
    suggestEvent: [],
  }

  componentDidMount() {
    this.setState({
      suggestEvent: this.filterEvent(
        modalStore.event,
        this.props.selectedEvent
      ),
    })

    this._subscription = modalStore.eventSubject.subscribe(data => {
      const { suggestEvent, selectedEvent } = data

      this.setState({
        suggestEvent: this.filterEvent(suggestEvent, selectedEvent),
      })
    })
  }

  filterEvent = (suggestEvent: Event[], selectedEvent: Event[]) => {
    return difference(selectedEvent, suggestEvent)
  }

  renderHeader = () => {
    const { onPress } = this.props
    const { suggestEvent } = this.state

    return (
      <SelectEventSuggestList onPress={onPress} suggestEvent={suggestEvent} />
    )
  }

  renderItem = ({ item }: { item: Event }) => {
    const { onPress } = this.props

    if (!item || !item.isValid() || item.deleted) return null

    const { eventName } = new SafeEvent(item)

    return (
      <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
        <View style={styles.wrapImage}>
          <Image source={images.category} style={styles.image} />
        </View>

        <Text style={styles.buttonTitle} numberOfLines={1}>
          {eventName}
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
    if (this.props.textInputHeight === 50) return 0

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
