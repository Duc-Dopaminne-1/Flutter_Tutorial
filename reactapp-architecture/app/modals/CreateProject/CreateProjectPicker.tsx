import { AModal3 } from '@/components/AModal/AModal3'
import I18n from '@/i18n'
import { Product, Project, Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { FuseService } from '@/services/fuse'
import { withContext } from '@/shared/withContext'
import * as React from 'react'
import { withNavigation } from 'react-navigation'
import Realm from 'realm'
import { Subscription } from 'rxjs'
import { CreateProjectList } from './Components/CreateProjectList'
import { onSelectProjectInModal } from '@/services/global'

// init state
const initialState = {
  keyword: '',
  isVisible: false,
  data: [] as any,
  loading: true,
  isPerfect: true,
  errMsg: '',
  selectedProduct: null,
  dirty: false,
  renderKey: 0,
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = DefaultProps & AppContextState

export type State = Readonly<typeof initialState> &
  Readonly<{
    data: Realm.Collection<Supplier>
    selectedProduct: Product
  }>

@(withNavigation as any)
@withContext(AppContext.Consumer)
export class CreateProjectPicker extends React.PureComponent<Props, State> {
  _fuse: FuseService<Project> = new FuseService<Project>([] as any)
  _subscription: Subscription
  _results: Realm.Results<Project>
  _modal

  readonly state: State = initialState

  async componentDidMount() {
    this.open()

    const { projectFactory } = this.props
    const [subscription, results] = projectFactory.fetch()

    this._results = results

    this._subscription = subscription.subscribe(projects => {
      this.setState({
        data: projects,
        loading: false,
      })

      this._fuse = new FuseService<Project>(projects)
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
        isPerfect: true,
        data: this._results ? this._results : [],
      })
      return
    }

    this.setState(
      {
        keyword,
        dirty: true,
      },
      () => this.onSearch(keyword)
    )
  }

  onCreate = (keyword: string) => {
    const { projectFactory } = this.props

    projectFactory.create({ name: keyword.trim() }).subscribe(() => {
      this.close()
    })
  }

  onSelect = (project: Project) => {
    onSelectProjectInModal.next(project)

    this.close()
  }

  onSearch = (keyword: string) => {
    if (keyword.trim().length === 0) return

    const result = this._fuse.search(keyword.trim())
    this.setState({
      data: result.data,
      isPerfect: result.isPerfect,
    })
  }

  open = () => {
    this._modal && this._modal.open()
  }

  close = () => {
    this._modal && this._modal.close()
  }

  render() {
    const { keyword, data, isPerfect, renderKey, dirty } = this.state

    return (
      <AModal3
        ref={nodeRef => {
          this._modal = nodeRef
        }}
        headerProps={{
          title: I18n.t('addProject'),
          onPressIconRight: this.close,
        }}
        textInputProps={{
          onChangeText: this.onChangeText,
          value: keyword,
          text: I18n.t('enterProjectName'),
        }}
        hideActionBar={true}
        renderKey={renderKey}
      >
        <CreateProjectList
          onCreate={this.onCreate}
          onSelect={this.onSelect}
          data={data}
          keyword={keyword.trim()}
          isPerfect={isPerfect}
          dirty={dirty}
        />
      </AModal3>
    )
  }
}
