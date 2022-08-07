import { Image } from '@/models/common'
import {
  Category,
  Comment,
  Product,
  Supplier,
  SupplierType,
  Tag,
} from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { insert } from 'ramda'
import { filterDeleteImage, sortImage } from '@/shared/image'
import { Source } from '@/stores/imageStore3'
import { differenceWith } from 'lodash'

type CreateSupplierDto = {
  name: string
}

type CreateSupplierGlobalDto = {
  name: string | any
  fullName: string | any
  tradingName: string | any
  description: string | any
  country: string | any
  city: string | any
  address: string | any
  website: string | any
  officeEmail: string | any
  officePhone: string | any
  type: string | any
  logo: Image | any
  globalDatabaseId: string | any
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

export class SupplierFactory extends Factory<Supplier> {
  deleteLocals = false

  constructor(realm: Realm) {
    super(realm, 'Supplier')
  }

  set deleteLocal(value) {
    this.deleteLocals = value
  }

  fetch = ({
    descriptor = 'creationDate',
    reverse = true,
    skip = 0,
    limit = -1,
    query = '',
    isReceiveChange = false,
  }: FetchOptions<Product> = {}): any => {
    const results = this._realm
      .objects<Supplier>('Supplier')
      .filtered(query ? `deleted = false AND ${query}` : 'deleted = false')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<Supplier>>(
      observer => {
        results.addListener((col, change) => {
          observer.next(
            this.generateResult({
              isReceiveChange,
              change,
              limit,
              skip,
              data: col,
              isDeleteLocal: this.deleteLocals,
            })
          )

          return null
        })
      }
    )

    return [subscription, results]
  }

  // fetchById(
  //   supplierId: string,
  //   isReceiveChange?: boolean
  // ): [
  //   Observable<{
  //     col: Supplier
  //     change: Realm.CollectionChangeSet
  //   }>,
  //   Realm.Results<Supplier>
  // ]
  fetchById(
    supplierId: string,
    isReceiveChange?: boolean
  ): [Observable<Supplier>, Realm.Results<Supplier>]
  fetchById(supplierId: string, isReceiveChange = false): any {
    const results = this._realm
      .objects<Supplier>('Supplier')
      .filtered('deleted = false AND id = $0', supplierId)

    const subscription = new Observable<Supplier>(observer => {
      observer.next(
        this.generateResult({
          isReceiveChange,
          data: results,
          selectOne: true,
        })
      )

      results.addListener(
        (col, change): Realm.CollectionChangeCallback<Supplier> => {
          observer.next(
            this.generateResult({
              isReceiveChange,
              change,
              data: col,
              selectOne: true,
            })
          )

          return null
        }
      )
    })

    return [subscription, results]
  }

  create = (
    data: CreateSupplierDto,
    isUpdateToRealm = false,
    idUpdate = ''
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let createdSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }
        try {
          this._realm.write(() => {
            // Create supplier
            createdSupplier = this._realm.create<Supplier>('Supplier', {
              id: this.generateId,
              name: data.name,
              favorite: false,
              deleted: false,
              images: [],
              ...this.widthAudit(),
            })

            if (isUpdateToRealm && idUpdate) {
              const updatedProduct = this._realm.create<Product>(
                'Product',
                {
                  id: idUpdate,
                  supplier: createdSupplier,
                  ...this.widthAudit({}, 'update'),
                },
                true
              )
            }
          })
        } catch (e) {}

        if (createdSupplier) {
          observer.next(createdSupplier)
          observer.complete()
        } else {
          observer.error()
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  createAndUpdateMultiProduct = (
    data: CreateSupplierDto,
    productsId: string[]
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let createdSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            // Create supplier
            createdSupplier = this._realm.create<Supplier>('Supplier', {
              id: this.generateId,
              name: data.name,
              favorite: false,
              deleted: false,
              images: [],
              ...this.widthAudit(),
            })

            productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )

              product.supplier = createdSupplier
            })
          })
        } catch (e) {}

        if (createdSupplier) {
          observer.next(createdSupplier)
          observer.complete()
        } else {
          observer.error()
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  saveSupplierGlobal = (
    data: CreateSupplierGlobalDto
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let createdSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // Create Status
          const createType = this._realm.create<SupplierType>('SupplierType', {
            id: this.generateId,
            name: data.type,
            deleted: false,
          })

          try {
            // Create supplier
            createdSupplier = this._realm.create<Supplier>('Supplier', {
              id: this.generateId,
              name: data.name,
              fullName: data.fullName,
              tradingName: data.tradingName,
              description: data.description,
              logoImage: data.logo,
              supplierType: createType,
              website: data.website,
              country: data.country,
              city: data.city,
              address: data.address,
              officeEmail: data.officeEmail,
              officePhone: data.officePhone,
              globalDatabaseId: data.globalDatabaseId,
              favorite: false,
              deleted: false,
              ...this.widthAudit(),
            })
          } catch (e) {
            console.log('error when copy exhibitor to team supplier', e)
          }
        })

        if (createdSupplier) {
          observer.next(createdSupplier)
          observer.complete()
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  update = (
    id: string | Supplier,
    data: Partial<Supplier> & ImageProps
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let updatedSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }
        this._realm.write(() => {
          try {
            updatedSupplier = this._realm.create<Supplier>(
              'Supplier',
              {
                id,
                ...data,
                ...this.widthAudit({}, data.deleted ? 'delete' : 'update'),
              },
              true
            )
          } catch (e) {
            console.log('Update supplier error', e)
          }

          if (updatedSupplier && !updatedSupplier.images) {
            updatedSupplier.images = []
          }
        })

        if (updatedSupplier) {
          observer.next(updatedSupplier)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateImageAfterEditProgress = (updatedSupplier, data) => {
    if (updatedSupplier && !updatedSupplier.images) {
      updatedSupplier.images = []
    }

    if (updatedSupplier) {
      const modifications = data.modifications
      if (data && Array.isArray(modifications)) {
        if (data.override) {
          const date = new Date()
          const imageInfo = []

          updatedSupplier.images = filterDeleteImage(updatedSupplier.images)

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
              updatedSupplier.images[el] = imageInfo[0]
            })
          } catch (e) {}

          return updatedSupplier
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
            updatedSupplier.images = insert(
              el + 1,
              imageInfo[0],
              updatedSupplier.images
            )
          })
        } catch (e) {}

        return updatedSupplier
      }
    }
  }

  updateImageAfterEdit = (
    id: string | Supplier,
    data: Partial<Supplier> & ImageObject
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let updatedSupplier = null
        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            updatedSupplier = this._realm.create<Supplier>(
              'Supplier',
              {
                id,
                ...this.widthAudit({}, 'update'),
              },
              true
            )
            // update-Image-After-Edit
            updatedSupplier = this.updateImageAfterEditProgress(
              updatedSupplier,
              data
            )

            if (updatedSupplier && !updatedSupplier.images) {
              updatedSupplier.images = []
            }
          })
        } catch (e) {}

        if (updatedSupplier) {
          observer.next(updatedSupplier)
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

  addImage = (
    id: string | Supplier,
    data: Partial<Supplier> & ImageProps
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let updatedSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }
        this._realm.write(() => {
          const imageData = data.imageData || []
          const createdImages = []
          let count = -1
          imageData.map(imageData => {
            count++
            const date = new Date()
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

          data.imageData = null

          // Update supplier
          try {
            updatedSupplier = this._realm.create<Supplier>(
              'Supplier',
              {
                id,
                ...data,
                ...this.widthAudit({}, data.deleted ? 'delete' : 'update'),
              },
              true
            )

            if (updatedSupplier && updatedSupplier.images === null) {
              updatedSupplier.images = []
            }

            updatedSupplier.images.push(...createdImages)
          } catch (e) {
            console.log('Update supplier error', e)
          }

          if (updatedSupplier && !updatedSupplier.images) {
            updatedSupplier.images = []
          }
        })

        if (updatedSupplier) {
          observer.next(updatedSupplier)
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
  ): Observable<Supplier> => {
    return new Observable<Supplier>(observer => {
      try {
        let updatedSupplier = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          // get Supplier by id
          updatedSupplier = this._realm.create<Supplier>(
            'Supplier',
            {
              id,
              ...this.widthAudit({}, 'update'),
            },
            true
          )
          const filterImage = filterDeleteImage(updatedSupplier.images)
          if (isDelete) {
            filterImage[index].deleted = true
            return
          }

          if (updatedSupplier) {
            updatedSupplier.images = sortImage(filterImage, index)
          }
        })

        if (updatedSupplier) {
          observer.next(updatedSupplier)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateCategoryMultiSupplier = (
    suppliersId: string[],
    categories: Category[]
  ): Observable<Supplier> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            suppliersId.forEach(supplierId => {
              const supplier: Supplier = this._realm.objectForPrimaryKey(
                'Supplier',
                supplierId
              )

              const filterCategories = differenceWith(
                categories,
                supplier.categories,
                (categoryA, categoryB) => categoryA.id === categoryB.id
              )

              if (filterCategories.length > 0) {
                supplier.categories = [...supplier.categories].concat(
                  filterCategories
                )
              }
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
      } finally {
        observer.complete()
      }
    })
  }

  updateTagMultiSupplier = (
    suppliersId: string[],
    tags: Tag[]
  ): Observable<Supplier> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            suppliersId.forEach(supplierId => {
              const supplier: Supplier = this._realm.objectForPrimaryKey(
                'Supplier',
                supplierId
              )

              const filterTags = differenceWith(
                tags,
                supplier.tags,
                (tagA, tagB) => tagA.id === tagB.id
              )

              if (filterTags.length > 0) {
                supplier.tags = [...supplier.tags].concat(filterTags)
              }
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
      } finally {
        observer.complete()
      }
    })
  }

  deleteMultiSupplier = (suppliersId: string[]): Observable<Supplier> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            suppliersId.forEach(supplierId => {
              this._realm.create<Supplier>(
                'Supplier',
                {
                  id: supplierId,
                  deleted: true,
                  ...this.widthAudit({}, 'delete'),
                },
                true
              )
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
      } finally {
        observer.complete()
      }
    })
  }

  comment = (supplierId: string, comment: Comment): Observable<Supplier> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            const supplier: Supplier = this._realm.objectForPrimaryKey(
              'Supplier',
              supplierId
            )

            supplier.comments.push(comment)
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
