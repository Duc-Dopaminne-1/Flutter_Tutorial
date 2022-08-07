import { SampleStatus, Sample } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import { sortBy } from 'lodash'
import Realm from 'realm'
import { Observable } from 'rxjs'

export class SampleStatusFactory extends Factory<SampleStatus> {
  private _sortData: Realm.Results<SampleStatus>

  constructor(realm: Realm) {
    super(realm, 'SampleStatus')
  }

  get sortData() {
    return this._sortData
  }

  fetch = ({
    descriptor = 'name',
    reverse = true,
    skip = 0,
    limit = -1,
  }: FetchOptions<SampleStatus> = {}): [
    Observable<Realm.Collection<SampleStatus>>,
    Realm.Results<SampleStatus>
  ] => {
    const results = this._realm
      .objects<SampleStatus>('SampleStatus')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<SampleStatus>>(
      observer => {
        results.addListener(
          (col): Realm.CollectionChangeCallback<SampleStatus> => {
            if (skip >= 0 && limit > 0) {
              const data = this.transformData(col, { skip, limit })
              observer.next(data)
            } else {
              const data = this.sortManually(col)
              observer.next(data)
            }

            return null
          }
        )
      }
    )

    return [subscription, results]
  }

  getDatFromId = (data: Realm.Results<SampleStatus>, id: string) => {
    if (!id) return null

    return data.find(item => item.id === id)
  }

  sortManually = (
    col: Realm.Collection<SampleStatus>
  ): Realm.Collection<SampleStatus> => {
    const sort = sortBy(col, ['step'])

    // @ts-ignore
    this._sortData = sort
    return sort as any
  }

  transformData = (
    col: Realm.Collection<SampleStatus>,
    options: { skip: number; limit: number }
  ): Realm.Collection<SampleStatus> => {
    const sortedData =
      this.sortManually(col).slice(options.skip, options.limit) || []

    return sortedData as any
  }

  update = (
    id: string,
    data: {
      status: SampleStatus
    }
  ): Observable<SampleStatus> => {
    return new Observable(observer => {
      try {
        let updatedSample = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Update status
            updatedSample = this._realm.create<Sample>(
              'Sample',
              {
                id,
                status: data.status,
                ...this.widthAudit({}, 'update'),
              },
              true
            )
          })
        } catch (e) {}

        if (updatedSample) {
          observer.next(updatedSample)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateStatusMultiSample = (samplesId: string[], status: SampleStatus) => {
    return new Observable(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            try {
              samplesId.forEach(sampleId => {
                const sample: Sample = this._realm.objectForPrimaryKey(
                  'Sample',
                  sampleId
                )

                sample.status = status
              })
            } catch (e) {
              errorWhileUpdate = e
            }
          })
        } catch (e) {}

        if (!errorWhileUpdate) {
          /**
           * pass data in here if you want return value
           */
          observer.next()
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }
}
