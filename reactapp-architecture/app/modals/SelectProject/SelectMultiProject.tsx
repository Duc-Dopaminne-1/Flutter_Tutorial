import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product, Project } from '@/models/team'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { SelectProjectList } from './Components/SelectProjectList'
import { colors, metrics } from '@/vars'
import { ProjectsHandle } from '@/shared/projectsHandle'
import {
  createProductNavigation,
  CreateProductRef,
} from '@/navigation/createProductNavigation'
import { modalStore } from '@/stores/modalStore'
import { filterValidRealmObject } from '@/shared/validator'
import { forceUpdateProductInProject, Toast } from '@/services/global'

// init state
const initialState = {
  keyword: '',
  data: [] as any,
  isPerfect: true,
  errMsg: null,
  selectedProjects: [] as any,
  textInputHeight: metrics.multi_select_text_input,
  renderKey: 0,
}

type Props = Readonly<{}> &
  AppContextState &
  Partial<
    NavigationInjectedProps<{
      selectedItem?: Product
      projects: [] | any
      productsId: string[]
      type: string
      isCreateProduct?: boolean
      setValue?: (data, key, type?: string) => void
      hideUpDownClear?: boolean
    }>
  >

export type State = Readonly<typeof initialState> &
  Partial<{
    data: Realm.Collection<Project>
  }>

@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SelectMultiProject extends React.PureComponent<Props, State> {
  _subscription: Subscription
  _fuse: FuseService<Project> = new FuseService<Project>([] as any)
  _fuseSelected: FuseService<Project> = new FuseService<Project>([] as any)
  _results: Realm.Results<Project>
  _project: ProjectsHandle = new ProjectsHandle([] as any)
  _projectSubscription: Subscription
  _modal
  _firstTimeUpdateSuggestList: boolean = true
  _firstTimeUpdateFuseData: boolean = true
  _isChoose = false
  _isEditData = false

  readonly state: State = initialState

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    const { navigation } = this.props
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    this.open()

    if (isCreateProduct) {
      this.initDataCreateProduct()
    } else {
      const selectedItem = navigation.getParam('projects', [])
      const productsId = navigation.getParam('productsId', [])
      if (selectedItem || productsId.length > 0) {
        this.initData()
      }
    }
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
    this._projectSubscription && this._projectSubscription.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const type = navigation.getParam('type', '')
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const setValue = navigation.getParam('setValue', null)
    const selectedItem = navigation.getParam('selectedItem', null)
    const productsId = this.props.navigation.getParam('productsId', [])
    const hideUpDownClear = this.props.navigation.getParam(
      'hideUpDownClear',
      false
    )

    return {
      type,
      isCreateProduct,
      setValue,
      selectedItem,
      productsId,
      hideUpDownClear,
    }
  }

  initDataCreateProduct = () => {
    const { navigation } = this.props
    const selectedItem = navigation.getParam('projects', [])
    const filterSelectedProjects = filterValidRealmObject(selectedItem)
    const setValue = navigation.getParam('setValue', null)

    if (setValue) {
      setValue(filterSelectedProjects, 'projects')
    }

    this.setState(
      {
        selectedProjects: filterSelectedProjects,
      },
      () => {
        this.fetchProject()
      }
    )
  }

  /**
   * Init data from product info screen
   */
  initData = () => {
    const { navigation } = this.props
    const selectedItem = navigation.getParam('selectedItem', null)

    if (selectedItem) {
      this.setState(
        {
          selectedProjects: [...selectedItem.projects],
        },
        () => {
          this.fetchProject()
        }
      )
    } else {
      this.fetchProject()
    }
  }

  /**
   * Request data from realm
   */
  fetchProject = () => {
    const { projectFactory } = this.props
    const [subscription, results] = projectFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(projects => {
      this._project = new ProjectsHandle(projects)
      const selectedProjects = this.getSelectedProject()

      // call this to update suggest list each time have change
      this.updateSuggestList(selectedProjects)

      // remove all data have in selectedProjects
      const filterProject = this._project.difference(selectedProjects)

      this.setState(
        {
          data: filterProject,
        },
        () => {
          this.updateFuseData(filterProject, selectedProjects)
          this.forceUpdate()
        }
      )
    })
  }

  updateFuseData = (dataSearch: any, selectedProjects: any) => {
    if (this._firstTimeUpdateFuseData) {
      this._firstTimeUpdateFuseData = false

      this._fuse = new FuseService<Project>(dataSearch)
      this._fuseSelected = new FuseService<Project>(selectedProjects)
    } else {
      this._fuse.update(dataSearch)
      this._fuseSelected.update(selectedProjects)
    }
  }

  getSelectedProject = () => {
    const { navigation } = this.props
    const { selectedProjects } = this.state
    const isCreateProduct = navigation.getParam('isCreateProduct', false)

    if (!isCreateProduct) {
      return selectedProjects
    }

    // Only run this check valid data when create product

    const filterSelectedProject = filterValidRealmObject(selectedProjects)

    if (selectedProjects.length !== filterSelectedProject.length) {
      this.setState({
        selectedProjects: filterSelectedProject,
      })
      this.updateState(filterSelectedProject)
    }

    return filterSelectedProject
  }

  updateSuggestList = (selectedProjects: Project[]) => {
    if (this._firstTimeUpdateSuggestList) {
      this._firstTimeUpdateSuggestList = false
      return
    }

    modalStore.projectSubject.next({
      isMulti: true,
      suggestProject: modalStore.project,
      selectedProject: selectedProjects,
    })
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    if (this._modal) {
      this._modal.close()
    }
  }

  onChangeText = (keyword: string) => {
    if (keyword.trim().length === 0) {
      this.setState({
        keyword,
        isPerfect: true,
        data: this._project.data || [],
      })
      this._fuse.update(this._project.data || ([] as any))
      return
    }

    this.setState(
      {
        keyword,
      },
      () => this.onSearch(keyword)
    )
  }

  onSelect = (project: Project) => {
    this._isChoose = true
    const { selectedProjects } = this.state
    const newSelectedProject = [...selectedProjects].concat(project)

    // Add to suggest
    modalStore.setProject(project, newSelectedProject, true).catch(() => {})

    this.updateState(newSelectedProject)
  }

  /**
   * Update for mass edit product
   */
  updateMulti = () => {
    const { productFactory } = this.props
    const { selectedProjects } = this.state
    const { productsId } = this.navigationData()

    if (productsId.length <= 0) return

    productFactory
      .updateProjectMultiProduct(productsId, selectedProjects)
      .subscribe(() => {})

    if (selectedProjects.length > 0) {
      Toast.next({
        message: I18n.t('totalProductUpdate', {
          total: productsId.length,
          isMany: productsId.length === 1 ? '' : 's',
        }),
      })
    }
  }

  /**
   * Normal update
   */
  update = () => {
    const { productFactory } = this.props
    const { selectedProjects } = this.state
    const {
      type,
      isCreateProduct,
      setValue,
      selectedItem,
    } = this.navigationData()

    if (!this._isEditData) return

    if (isCreateProduct && setValue) {
      setValue(selectedProjects, 'projects')
      forceUpdateProductInProject.next(true)
      return
    }

    if (type === 'Product' && selectedItem) {
      productFactory
        .update(selectedItem.id, {
          projects: selectedProjects,
        })
        .subscribe(() => {
          forceUpdateProductInProject.next(true)
        })
    }
  }

  updateState = (selectedProjects: Project[], isRemove: boolean = false) => {
    const newData = this._project.difference(selectedProjects)

    this._fuse.update(newData)
    this._fuseSelected.update(selectedProjects as any)

    this._isEditData = true

    this.setState(
      {
        selectedProjects,
        keyword: '',
        data: newData,
        renderKey: this.state.renderKey + 1,
      },
      () => {
        isRemove &&
          modalStore.projectSubject.next({
            isMulti: true,
            suggestProject: modalStore.project,
            selectedProject: selectedProjects,
          })
      }
    )
  }

  onCreate = (keyword: string) => {
    const { projectFactory } = this.props

    projectFactory
      .create({
        name: keyword.trim(),
      })
      .subscribe(newProject => {
        this.onSelect(newProject)
        this._project.project = this._results
        this.setState({
          keyword: '',
          isPerfect: true,
          renderKey: this.state.renderKey + 1,
        })
      })
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    const resultSelected = this._fuseSelected.search(keyword.trim())

    this.setState({
      data: result.data,
      isPerfect: resultSelected.isPerfect
        ? resultSelected.isPerfect
        : result.isPerfect,
    })
  }

  onClear = () => {
    this.setState({
      isPerfect: true,
      data: this._project.data || [],
      keyword: '',
      renderKey: this.state.renderKey + 1,
    })
    this._fuse.update(this._project.data || ([] as any))
  }

  onHeightChange = (height: number) => {
    this.setState({
      textInputHeight: height,
    })
  }

  render() {
    const {
      keyword,
      data,
      selectedProjects,
      isPerfect,
      textInputHeight,
      renderKey,
    } = this.state
    const { productsId, hideUpDownClear } = this.navigationData()
    const isMassEdit = productsId.length > 0

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
          productNavigation.setRef(ProductRef.SelectProjects, nodeRef)
          createProductNavigation.setRef(
            CreateProductRef.SelectProjects,
            nodeRef
          )
        }}
        textInputType={'multiple'}
        updateMulti={isMassEdit ? this.updateMulti : this.update}
        headerProps={{
          title: I18n.t('selectProjects'),
          onPressIconRight: this.close,
        }}
        tagsInputProps={
          {
            onChangeText: this.onChangeText,
            onChange: projects => this.updateState(projects, true),
            placeholder: I18n.t('enterProjectName'),
            value: selectedProjects,
            text: keyword,
          } as any
        }
        onClear={this.onClear}
        hideUpDownClear={hideUpDownClear}
        onHeightChange={this.onHeightChange}
        renderKey={renderKey}
        tagColor={colors.primary_blue}
        tagTextColor={colors.white}
      >
        <SelectProjectList
          selectedProjects={selectedProjects}
          keyword={keyword.trim()}
          onPress={this.onSelect}
          onCreate={this.onCreate}
          data={data}
          isPerfect={isPerfect}
          textInputHeight={textInputHeight}
        />
      </AModal3>
    )
  }
}
