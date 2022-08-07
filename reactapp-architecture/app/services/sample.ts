import { Sample, Product, Supplier, Comment, SampleStatus } from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import { filterDeleteImage, sortImage } from '@/shared/image'
import { Image } from '@/models/common'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { User } from '@/models/user'
import { Source } from '@/stores/imageStore3'
import { insert } from 'ramda'

type CreateSampleDto = {
  name: string
  assignee: User
  description: string
  product: Product
  supplier: Supplier
  status: SampleStatus
}

type CreateMultiSampleDto = {
  name: string
  assignee: User
  description: string
  product?: Product[]
  supplier?: Supplier
  productsId?: string[]
  suppliersId?: string[]
  status: SampleStatus
}

type ImageProps = {
  imageData?: Source
  imageType?: string[]
}

type ImageObject = {
  id: string
  imageData: Source
  modifications: number[]
  imageType?: string
  override?: boolean
}

export class SampleFactory extends Factory<Sample> {
  constructor(realm: Realm) {
    super(realm, 'Sample')
  }

  fetch(option: FetchOptions<Sample>): [any, Realm.Results<Sample>]
  fetch({
    descriptor = 'creationDate',
    reverse = true,
    skip = 0,
    limit = -1,
    query = '',
    isReceiveChange,
  }: FetchOptions<Sample> = {}): any {
    const results = this._realm
      .objects<Sample>('Sample')
      .filtered(query ? `deleted = false AND ${query}` : 'deleted = false')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<Sample>>(observer => {
      observer.next(
        this.generateResult({
          isReceiveChange,
          data: results,
        })
      )

      results.addListener((col, change) => {
        observer.next(
          this.generateResult({
            isReceiveChange,
            change,
            limit,
            skip,
            data: col,
          })
        )

        return null
      })
    })

    return [subscription, results]
  }

  fetchById(sampleId: string): [Observable<Sample>, Realm.Results<Sample>]
  fetchById(
    sampleId: string,
    isReceiveChange?: boolean
  ): [
    Observable<{
      col: Sample
      change: Realm.CollectionChangeSet
    }>,
    Realm.Results<Sample>
  ]
  fetchById(sampleId: string, isReceiveChange?: boolean): any {
    const results = this._realm
      .objects<Sample>('Sample')
      .filtered('deleted = false AND id = $0', sampleId)

    const subscription = new Observable<Sample>(observer => {
      observer.next(
        this.generateResult({
          isReceiveChange,
          data: results,
          selectOne: true,
        })
      )

      results.addListener((col, change) => {
        observer.next(
          this.generateResult({
            isReceiveChange,
            change,
            data: col,
            selectOne: true,
          })
        )

        return
      })
    })

    return [subscription, results]
  }

  create = (data: CreateSampleDto): Observable<Sample> => {
    return new Observable<Sample>(observer => {
      try {
        let createdSample = null
        let errorWhileCreate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        const product =
          data.product && data.product.id
            ? this._realm.objectForPrimaryKey('Product', data.product.id)
            : null

        const supplier =
          data.supplier && data.supplier.id
            ? this._realm.objectForPrimaryKey('Supplier', data.supplier.id)
            : null

        this._realm.write(() => {
          try {
            createdSample = this._realm.create<Sample>('Sample', {
              product,
              supplier,
              status: data.status,
              id: this.generateId,
              name: data.name,
              assignee: data.assignee,
              paid: false,
              description: data.description || '',
              reference: '',
              type: '',
              ...this.widthAudit(),
            })
          } catch (e) {
            console.warn('ERRROR', e)
            errorWhileCreate = e
          }
        })

        if (createdSample) {
          observer.next(createdSample)
          observer.complete()
        } else {
          observer.error(errorWhileCreate)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  // TODO move to createMulti
  createMultiSupplier = (data: CreateMultiSampleDto): Observable<Sample[]> => {
    return new Observable<Sample[]>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            data.suppliersId.forEach(supplierId => {
              const supplier: Supplier = this._realm.objectForPrimaryKey(
                'Supplier',
                supplierId
              )

              this._realm.create<Sample>('Sample', {
                supplier,
                product: null,
                status: data.status,
                id: this.generateId,
                name: data.name,
                assignee: data.assignee,
                paid: false,
                description: data.description || '',
                reference: '',
                type: '',
                ...this.widthAudit(),
              })
            })
          } catch (e) {
            errorWhileUpdate = e
          }
        })

        if (!errorWhileUpdate) {
          /**
           * pass data in here if you want return value
           */
          observer.next()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }
  createMulti = (data: CreateMultiSampleDto): Observable<Sample[]> => {
    return new Observable<Sample[]>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            data.productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )
              const supplier =
                product.supplier && product.supplier.id
                  ? this._realm.objectForPrimaryKey(
                      'Supplier',
                      product.supplier.id
                    )
                  : null

              this._realm.create<Sample>('Sample', {
                product,
                supplier,
                status: data.status,
                id: this.generateId,
                name: data.name,
                assignee: data.assignee,
                paid: false,
                description: data.description || '',
                reference: '',
                type: '',
                ...this.widthAudit(),
              })
            })
          } catch (e) {
            errorWhileUpdate = e
          }
        })

        if (!errorWhileUpdate) {
          /**
           * pass data in here if you want return value
           */
          observer.next()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  update = (id: string | Sample, data: Partial<Sample>): Observable<Sample> => {
    return new Observable<Sample>(observer => {
      try {
        let updateSample: Sample | null | undefined

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Update sample
          try {
            updateSample = this._realm.create<Sample>(
              'Sample',
              {
                id,
                ...data,
                ...this.createWidthAudit({}, true),
              },
              true
            )
          } catch (e) {
            observer.error(e)
          }
        })

        if (updateSample) {
          observer.next(updateSample)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateImageAfterEditProgress = (updatedSample, data) => {
    if (updatedSample && !updatedSample.images) {
      updatedSample.images = []
    }

    if (updatedSample) {
      const modifications = data.modifications
      if (data && Array.isArray(modifications)) {
        if (data.override) {
          const date = new Date()
          const imageInfo = []

          updatedSample.images = filterDeleteImage(updatedSample.images)

          try {
            imageInfo[0] = this._realm.create<Image>('Image', {
              id: data.id,
              orientation: 0,
              imageType: data.imageType,
              creationDate: date,
              lastUpdatedDate: date,
              fileName: `${data.id}.png`,
              data: data.imageData.base64,
            })

            modifications.forEach(el => {
              updatedSample.images[el] = imageInfo[0]
            })
          } catch (e) {}

          return updatedSample
        }

        const date = new Date()
        const imageInfo = []

        try {
          imageInfo[0] = this._realm.create<Image>('Image', {
            id: data.id,
            orientation: 0,
            imageType: data.imageType,
            creationDate: date,
            lastUpdatedDate: date,
            fileName: `${data.id}.png`,
            data: data.imageData.base64,
          })

          modifications.forEach(el => {
            updatedSample.images = insert(
              el + 1,
              imageInfo[0],
              updatedSample.images
            )
          })
        } catch (e) {}

        return updatedSample
      }
    }
  }

  updateImageAfterEdit = (
    id: string | Sample,
    data: Partial<Sample> & ImageObject
  ): Observable<Sample> => {
    return new Observable<Sample>(observer => {
      try {
        let updatedSample = null
        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            updatedSample = this._realm.create<Sample>(
              'Sample',
              {
                id,
                ...this.widthAudit({}, 'update'),
              },
              true
            )

            // update-Image-After-Edit
            updatedSample = this.updateImageAfterEditProgress(
              updatedSample,
              data
            )

            if (updatedSample && !updatedSample.images) {
              updatedSample.images = []
            }
          })
        } catch (e) {}

        if (updatedSample) {
          observer.next(updatedSample)
        } else {
          observer.error()
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  addImage = (id: string | Sample, data: ImageProps): Observable<Sample> => {
    return new Observable<Sample>(observer => {
      try {
        let updatedSample: Sample | null | undefined

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          const imageData = data.imageData || []
          const createdImages: Image[] = []
          let count = -1
          imageData.map(imageData => {
            const date = new Date()
            count++
            const properties = {
              id: imageData.id,
              orientation: 0,
              imageType: data.imageType[count],
              creationDate: date,
              lastUpdatedDate: date,
              fileName: `${imageData.id}.png`,
              data: imageData.base64,
            }
            try {
              const createdImage = this._realm.create<Image>(
                'Image',
                properties
              )
              createdImages.push(createdImage)
            } catch (e) {
              const newId = this.generateId
              const propertiesWithDifferentId = {
                id: newId,
                orientation: 0,
                imageType: data.imageType[count],
                creationDate: date,
                lastUpdatedDate: date,
                fileName: `${newId}.png`,
                data: imageData.base64,
              }

              const createdImage = this._realm.create<Image>(
                'Image',
                propertiesWithDifferentId
              )
              createdImages.push(createdImage)
            }
          })

          data.imageData = undefined

          // Update sample
          try {
            updatedSample = this._realm.create<Sample>(
              'Sample',
              {
                id,
                ...data,
                ...this.createWidthAudit({}, true),
              },
              true
            )

            if (updatedSample && updatedSample.images === null) {
              updatedSample.images = []
            }
            updatedSample.images.push(...createdImages)
          } catch (e) {}
        })

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

  updateImage = (
    id: string,
    index: number,
    isDelete: boolean
  ): Observable<Sample> => {
    return new Observable<Sample>(observer => {
      try {
        let updatedSample = null
        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            updatedSample = this._realm.create<Sample>(
              'Sample',
              {
                id,
                ...this.widthAudit({}, 'update'),
              },
              true
            )

            if (updatedSample && !updatedSample.images) {
              updatedSample.images = []
            }

            const filterImage = filterDeleteImage(updatedSample.images)
            if (isDelete && Array.isArray(filterImage) && !isNaN(index)) {
              if (filterImage[index]) {
                filterImage[index].deleted = true
              }
            }

            if (updatedSample) {
              updatedSample.images = sortImage(filterImage, index)
            }
          })
        } catch (e) {}

        if (updatedSample) {
          observer.next(updatedSample)
        } else {
          observer.error()
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  comment = (sampleId: string, comment: Comment): Observable<Sample> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            const sample: Sample = this._realm.objectForPrimaryKey(
              'Sample',
              sampleId
            )

            sample.comments.push(comment)
          } catch (e) {
            errorWhileUpdate = e
          }
        })

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
