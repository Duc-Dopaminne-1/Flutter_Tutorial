import { AButtonCreate } from '@/components/AButton/AButtonCreate'
import { Project } from '@/models/team'
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
import { Subscription } from 'rxjs'
import { modalStore } from '@/stores/modalStore'
import { ProjectsHandle } from '@/shared/projectsHandle'
import { SelectProjectSuggestList } from '@/modals/SelectProject/Components/SelectProjectSuggestList'
import { FuseService } from '@/services/fuse'

type Props = {
  keyword: string
  onPress: (item: Project) => void
  onCreate: (keyword: string) => void
  data: Realm.Results<Project>
  isPerfect: boolean
  onClose?: () => void
  textInputHeight?: number
  selectedProjects: []
}

type State = {
  suggestProject: Project[]
}

export class SelectProjectList extends React.PureComponent<Props, State> {
  _projectSuggestSubscription: Subscription
  _projects: ProjectsHandle = new ProjectsHandle([] as any)
  _fuse: FuseService<Project> = new FuseService<Project>([] as any)
  _data: any

  static readonly defaultProps = {
    data: [],
    textInputHeight: metrics.multi_select_text_input,
  }

  state: State = {
    suggestProject: [],
  }

  componentDidMount() {
    this.setState({
      suggestProject: this.filterProject(
        modalStore.project,
        this.props.selectedProjects
      ),
    })
    this._fuse = new FuseService<Project>(modalStore.project as any)
    this._projectSuggestSubscription = modalStore.projectSubject.subscribe(
      data => {
        const { selectedProject, suggestProject, isMulti } = data
        this._data = data

        if (isMulti) {
          this._fuse = new FuseService<Project>(suggestProject as any)
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
    this._projectSuggestSubscription &&
      this._projectSuggestSubscription.unsubscribe()
  }

  updateSuggestions = () => {
    const { keyword } = this.props
    const isMulti = get(this._data, 'isMulti')

    if (keyword.trim().length === 0) {
      if (isMulti) {
        const suggestProject = get(this._data, 'suggestProject', []) || []
        const selectedProject = get(this._data, 'selectedProject', []) || []
        this.setState({
          suggestProject: this.filterProject(suggestProject, selectedProject),
        })
      } else {
        this.setState({
          suggestProject: this.filterProject(
            modalStore.project,
            this.props.selectedProjects
          ),
        })
      }
      return
    }
    const resultsSuggestion = this._fuse.search(keyword.trim())
    const selectedProject = get(this._data, 'selectedProject', []) || []
    const suggestProject = isMulti
      ? this.filterProject(resultsSuggestion.data, selectedProject)
      : this.filterProject(resultsSuggestion.data, this.props.selectedProjects)
    this.setState({ suggestProject })
  }

  filterProject = (suggestProjects: Project[], selectedProjects: Project[]) => {
    this._projects.project = suggestProjects as any
    this._projects.data = suggestProjects as any

    return this._projects.difference(selectedProjects as any)
  }

  get paddingBottom() {
    if (this.props.textInputHeight === 50) return 0

    return this.props.textInputHeight - metrics.multi_select_text_input + 10
  }

  renderHeader = () => {
    const { onPress } = this.props
    const { suggestProject } = this.state

    return (
      <SelectProjectSuggestList
        onPress={onPress}
        suggestProject={suggestProject}
      />
    )
  }

  renderItem = ({ item }) => {
    const { onPress } = this.props

    if (!(item && item.isValid())) return null

    return (
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.wrapImage}>
          <Image source={images.project} style={styles.image} />
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
      <FlatList
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
    backgroundColor: colors.primary_blue,
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
    tintColor: colors.white,
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
