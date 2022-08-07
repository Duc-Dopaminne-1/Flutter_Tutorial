import { Factory } from '@/services/factory'
import globalSchema from 'showsourcing-schema/global'

export class GlobalDataFactory extends Factory<any> {
  constructor() {
    super()
  }

  open = () => {
    try {
      this._realm = this.openSchema({
        schema: globalSchema,
        path: `global/global-data`,
        partial: true,
      })

      return this._realm
    } catch (e) {
      return e
    }
  }
}
