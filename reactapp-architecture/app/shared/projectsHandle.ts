import { differenceWith } from 'ramda'
import { Project } from '@/models/team'

export class ProjectsHandle {
  private _project: Realm.Results<Project> = null
  private _data: Realm.Results<Project> = null

  constructor(project: Realm.Results<Project>) {
    this._project = project
    this._data = project
  }

  set project(project: Realm.Results<Project>) {
    this._project = project
  }

  set data(project: Realm.Results<Project>) {
    this._data = project
  }

  get data() {
    return this._data
  }

  difference = (selectedProject: Project[]) => {
    const cmp = (x, y) => x.id === y.id
    const newData = differenceWith<Project, Project>(
      cmp,
      this._project,
      selectedProject
    )
    // @ts-ignore
    this._data = newData

    return newData as any
  }

  filter = (project: Project) => {
    const newData: any = this._data.filter(item => item.name !== project.name)
    this._data = newData

    return newData
  }
}
