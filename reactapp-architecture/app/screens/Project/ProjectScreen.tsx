import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import { DrawerActions, NavigationScreenProp } from 'react-navigation'
import { colors, devices, images, metrics } from '@/vars'
import { AHeader3 } from '@/components/AHeader/AHeader3'
import I18n from '@/i18n'
import { Project } from '@/models/team'
import { Subscription } from 'rxjs'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { Paging } from '@/paging'
import { FuseService } from '@/services/fuse'
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust'
import { SafeProject } from '@/shared/project'
import { ProjectCard } from '@/screens/Project/Components/ProjectCard'
import { CustomAlert } from '@/shared/alert'
import { debounce } from 'lodash'
// @ts-ignore
import { ActionSheet } from '@/components/ActionSheet/ActionSheetScreen'
import {
  forceUpdateProductInProject,
  onSelectProjectInModal,
} from '@/services/global'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { ProjectEmpty } from '@/screens/Project/Components/ProjectEmpty'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  navigation: NavigationScreenProp<{}, {}>
}> &
  AppContextState &
  DefaultProps

export type State = Partial<{
  keyword: string
  projects: any
  key: number
  loading: boolean
}>

@withContext(AppContext.Consumer)
export class ProjectScreen extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _subscriptionDelete: Subscription
  _selectProjectInModalSubscription: Subscription
  _subscriptionForceUpdate: Subscription

  _results: Realm.Collection<Project> = [] as any
  _resultProjects: Realm.Collection<Project> = [] as any

  _flatList: React.RefObject<FlatList<any>> = React.createRef()
  // _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  _actionSheet: any = React.createRef()

  _project: Project

  _fuse: FuseService<Project> = new FuseService<Project>([] as any)
  _firstTimeLoadData: boolean = true

  _paging: Paging<Project> = new Paging<Project>([] as any)
  _pagingSearch: Paging<Project> = new Paging<Project>([] as any)
  _after: string = null
  _afterSearch: string = null
  _emptyProject = false

  _isFocus: boolean = false

  readonly state: State = {
    keyword: '',
    projects: [],
    key: 0,
  }

  componentDidMount() {
    this.fetchProject()
    this.initSubscription()
    this.subscriptionForceUpdate()
  }

  componentWillUnmount() {
    // result
    this._resultProjects && this._resultProjects.removeAllListeners()

    // subscription
    this._subscription && this._subscription.unsubscribe()
    this._selectProjectInModalSubscription &&
      this._selectProjectInModalSubscription.unsubscribe()
    this._subscriptionDelete && this._subscriptionDelete.unsubscribe()
    this._subscriptionForceUpdate && this._subscriptionForceUpdate.unsubscribe()
  }

  fetchProject = () => {
    const { projectFactory } = this.props

    const [subscription, results] = projectFactory.fetch()
    this._resultProjects = results

    this._subscription = subscription.subscribe(projects => {
      const { keyword } = this.state

      this._paging.update(projects)
      const newProjects = this._paging.next(null, 30)
      this._after = this._paging.getLatestId(newProjects)
      this.resultUpdate(newProjects)
      this.searchUpdate(projects)

      this._emptyProject = projects.length <= 0

      if (projects.length >= 0) {
        if (keyword.trim().length === 0) {
          this.setState((prevState: State) => {
            return {
              projects: newProjects,
              key: prevState.key + 1,
              loading: false,
            }
          })
        } else {
          // reset the search array
          this.onChangeText(keyword)
        }
      }
    })
  }

  initSubscription = () => {
    this._selectProjectInModalSubscription = onSelectProjectInModal.subscribe(
      project => {
        if (project) {
          setTimeout(() => {
            this.props.navigation.navigate('ProjectInfoScreen', {
              project,
            })
          }, 100)
        }
      }
    )
  }

  subscriptionForceUpdate = () => {
    this._subscriptionForceUpdate = forceUpdateProductInProject.subscribe(
      forceUpdate => {
        if (forceUpdate) {
          this.setState((prevState: State) => {
            return {
              key: prevState.key + 1,
            }
          })
        }
      }
    )
  }

  resultUpdate = (projects: Realm.Collection<Project>) => {
    this._results = projects
  }

  searchUpdate = (projects: Realm.Results<Project>) => {
    if (this._firstTimeLoadData) {
      this._fuse = new FuseService<Project>(projects)
      this._firstTimeLoadData = false
      return
    }

    this._fuse.update(projects)
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        projects: this._results,
      })
      return
    }

    this.setState({ keyword })
    this.onSearch(keyword)
  }

  onSearch = debounce((keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())

    this._pagingSearch.update(result.data as any)
    const newProjects = this._pagingSearch.next(null)
    this._afterSearch = this._pagingSearch.getLatestId(newProjects)

    this.setState((prevState: State) => {
      return {
        projects: newProjects as any,
        key: prevState.key + 1,
      }
    })
  }, 100)

  onPressIcon = () => {
    if (this._isFocus) {
      Keyboard.dismiss()
      setTimeout(() => {
        this.onChangeText('')
      }, 0)
      return
    }

    devices.isAndroid && AndroidKeyboardAdjust.setAdjustPan()
    this.props.navigation.navigate('CreateProjectPicker')
  }

  onPressBack = () => {
    // Go back and close the drawer
    const { navigation } = this.props
    navigation.navigate('HomeScreen', {}, navigation.dispatch(
      DrawerActions.closeDrawer()
    ) as any)
  }

  onFocus = (isFocus: boolean) => {
    if (devices.isAndroid && isFocus) {
      AndroidKeyboardAdjust.setAdjustPan()
    }

    this._isFocus = isFocus
  }

  onScrollHandler = () => {
    const { projects, keyword } = this.state

    if (!this._paging.isEnd(this._after) && keyword.trim().length === 0) {
      const nextProject = this._paging.next(this._after)
      this._after = this._paging.getLatestId(nextProject)
      const newProjects = projects.concat(nextProject)
      this.resultUpdate(newProjects as any)

      this.setState({
        projects: newProjects,
      })
    } else if (
      !this._pagingSearch.isEnd(this._afterSearch) &&
      keyword.trim().length > 0
    ) {
      const nextProject = this._pagingSearch.next(this._afterSearch)
      const newProjects = projects.concat(nextProject)

      this._afterSearch = this._pagingSearch.getLatestId(newProjects as any)

      this.setState({
        projects: newProjects,
      })
    }
  }

  onPressItem = (item: Project) => {
    this.props.navigation.navigate('ProjectInfoScreen', {
      project: item,
    })
  }

  onPressOpenMenu = (item: Project) => {
    this._project = item
    this._actionSheet && this._actionSheet.show()
  }

  onPressAction = debounce((index: number) => {
    switch (index) {
      case 0:
        this.confirmDelete()
        return
      default:
        this._project = null
        return
    }
  }, 100)

  confirmDelete = () => {
    CustomAlert.alertYesNo({
      message: I18n.t('deleteProjectConfirm'),
      onPressYes: this.deleteProject,
      onPressNo: () => {
        this._project = null
      },
    })
  }

  deleteProject = () => {
    const { projectFactory } = this.props
    const { id } = new SafeProject(this._project)

    if (!id) return

    this._subscriptionDelete = projectFactory.delete(id).subscribe(() => {
      this._project = null
    })
  }

  renderItem = ({ item }) => {
    if (!item || !item.isValid() || item.deleted) return null

    return (
      <ProjectCard
        project={item}
        onPressItem={this.onPressItem}
        onOpenMenu={() => this.onPressOpenMenu(item)}
      />
    )
  }

  keyExtractor = (item: Project = { id: 'project' } as any, index: number) => {
    return `${item.id}-${index}`
  }

  renderFlatList = () => {
    const { projects, loading, key } = this.state

    if (loading) {
      return <AIndicator full />
    }

    if (this._emptyProject) {
      return <ProjectEmpty onPressCreate={this.onPressIcon} />
    }

    return (
      <FlatList
        ref={this._flatList}
        key={key}
        data={projects}
        extraData={projects}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContainer}
        onScrollBeginDrag={Keyboard.dismiss}
        keyboardShouldPersistTaps={'always'}
        onEndReached={this.onScrollHandler}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onEndReachedThreshold={0.4}
        windowSize={21}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={0}
      />
    )
  }

  render() {
    const { keyword, loading } = this.state

    if (!loading) {
      setTimeout(() => {
        this._flatList.current && this._flatList.current.recordInteraction()
      }, 50)
    }

    return (
      <View style={styles.container}>
        <AHeader3
          placeholder={I18n.t('searchProject')}
          focusPlaceholder={I18n.t('searchText')}
          value={keyword}
          icon={images.add}
          onPressIcon={this.onPressIcon}
          // hasBackIcon={true}
          // onPressBack={this.onPressBack}
          onChangeText={this.onChangeText}
          onFocus={this.onFocus}
        />

        {this.renderFlatList()}

        <ActionSheet
          ref={nodeRef => (this._actionSheet = nodeRef)}
          options={[I18n.t('delete'), I18n.t('cancel')]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          firstItem={1}
          lastItem={1}
          onPress={this.onPressAction}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flatList: {
    flex: 1,
  },
  flatListContainer: {
    paddingBottom: metrics.project_list_padding_bottom,
  },
})
