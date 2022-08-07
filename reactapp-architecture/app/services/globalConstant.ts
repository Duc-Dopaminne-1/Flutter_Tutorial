import { Factory } from '@/services/factory'
import GlobalConstantSchema from 'showsourcing-schema/constant'

export class GlobalConstantFactory extends Factory<any> {
  constructor() {
    super()
  }

  open = () => {
    try {
      this._realm = this.openSchema({
        schema: GlobalConstantSchema,
        path: 'global/global-constants',
        fullSynchronization: true,
      })

      return this._realm
    } catch (e) {
      return e
    }
  }
}
