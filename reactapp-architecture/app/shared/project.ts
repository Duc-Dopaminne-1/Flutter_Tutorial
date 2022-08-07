import { pathOr } from 'ramda'
import { Project } from '@/models/team'

export class SafeProject {
  private _project: Project = null

  constructor(project: Project) {
    this._project = project
  }

  get id() {
    return pathOr('', ['id'], this._project)
  }

  get name() {
    return pathOr('', ['name'], this._project)
  }

  get logo() {
    const normalizeName = this.name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      .toUpperCase()

    const words = normalizeName.split(' ')

    switch (words.length) {
      case 0:
        return ''
      case 1:
        return words[0].substring(0, 2)
      default:
        return words[0].substring(0, 1) + words[1].substring(0, 1)
    }
  }
}
