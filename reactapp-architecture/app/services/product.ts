import { Image, User } from '@/models/common'
import {
  Category,
  Comment,
  Event,
  Price,
  Product,
  ProductStatus,
  ProductVote,
  Project,
  Supplier,
  Tag,
} from '@/models/team'
import { Factory, FetchOptions } from '@/services/factory'
import Realm from 'realm'
import { Observable } from 'rxjs'
import { filterDeleteImage, sortImage } from '@/shared/image'
import { SafeProduct } from '@/shared/product'
import { UltiFactory } from '@/services/ulti'
import { insert } from 'ramda'
import { Source } from '@/stores/imageStore3'
import {
  checkValidRealmObject,
  filterValidRealmObject,
} from '@/shared/validator'
import { differenceWith } from 'lodash'

type CustomField = {
  value: any
  extendFieldDefinition: any
  idExtendFieldData: string
}

type CreateProductDto = {
  images?: Source
  supplier: Supplier
  category: Category
  description: string
  tags: Tag[]
  projects: Project[]
  price: number
  currency: string
  moq: number
  moqDescription: string
  name: string
  status: ProductStatus
  harbour: string
  incoTerm: string
  event: Event
  extendedFields: CustomField[]
  innerCarton: any
  masterCarton: any
  priceMatrix: any
  samplePrice: number
  imageType: string[]
  currencySamplePrice: string
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

type ratingData = {
  productId: string
  ratingId?: string
  value: number
  user: User
}

export class ProductFactory extends Factory<Product> {
  deleteLocals = false

  constructor(realm: Realm) {
    super(realm, 'Product')
  }

  set deleteLocal(value) {
    this.deleteLocals = value
  }

  count(): [Observable<number>, Realm.Results<Product>] {
    const results = this._realm
      .objects<Product>('Product')
      .filtered('lastUpdatedBy != null')
      .sorted('name', false)

    const subscription = new Observable<number>(observer => {
      results.addListener(col => {
        observer.next(col.length)

        return
      })
    })
    return [subscription, results]
  }

  static defaultName(name: string, index: string) {
    return `${name}-${index.padStart(2, '0')}`
  }

  static normalName(length: number) {
    return SafeProduct.genericName(length, UltiFactory.userData())
  }

  fetch(
    option: FetchOptions<Product> & { isReceiveChange: true }
  ): [
    Observable<{
      col: Realm.Collection<Product>
      change: Realm.CollectionChangeSet
    }>,
    Realm.Results<Product>
  ]
  fetch(
    option: FetchOptions<Product>
  ): [Observable<Realm.Collection<Product>>, Realm.Results<Product>]
  fetch({
    descriptor = 'creationDate',
    reverse = true,
    skip = 0,
    limit = -1,
    query = '',
    isReceiveChange = false,
  }: FetchOptions<Product> = {}): any {
    const results = this._realm
      .objects<Product>('Product')
      .filtered(query ? `deleted = false AND ${query}` : 'deleted = false')
      .sorted(descriptor, reverse)

    const subscription = new Observable<Realm.Collection<Product>>(observer => {
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

        return
      })
    })

    return [subscription, results]
  }

  fetchById(productId: string): [Observable<Product>, Realm.Results<Product>]
  fetchById(
    productId: string,
    isReceiveChange?: boolean
  ): [
    Observable<{
      col: Product
      change: Realm.CollectionChangeSet
    }>,
    Realm.Results<Product>
  ]
  fetchById(productId: string, isReceiveChange?: boolean): any {
    const results = this._realm
      .objects<Product>('Product')
      .filtered('deleted = false AND id = $0', productId)

    const subscription = new Observable<Product>(observer => {
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

  createWrite = (
    data: CreateProductDto,
    createNormal = false,
    indexCreateMul
  ) => {
    // Create status
    const status = data.status ? data.status : null

    // Create event
    let event = checkValidRealmObject(data.event, null)
    if (event && event.id) {
      event = this._realm.objectForPrimaryKey('Event', event.id)
    }

    // Create price
    const price = {
      id: this.generateId,
      currency: data.currency,
      value: data.price * 10000,
      baseCurrencyValue: 0,
    }

    // Create sample price
    const samplePrice = {
      id: this.generateId,
      currency: data.currencySamplePrice,
      value: data.samplePrice * 10000,
      baseCurrencyValue: 0,
    }

    // Create priceMatrix rows
    const priceMatrixRows = data.priceMatrix.rows.map(row => {
      const pricePriceMatrix = this._realm.create<Price>('Price', {
        id: this.generateId,
        currency: row.price.currency,
        value: Number(row.price.value) * 10000,
        baseCurrencyValue: 0,
      })

      return {
        id: this.generateId,
        label: row.label,
        price: pricePriceMatrix,
      }
    })

    const priceMatrix = {
      id: this.generateId,
      rows: priceMatrixRows,
    }

    // Create inner carton
    const innerCarton = {
      id: this.generateId,
      height: Number(data.innerCarton.height),
      width: Number(data.innerCarton.width),
      length: Number(data.innerCarton.length),
      unit: data.innerCarton.unit,
      itemsQuantity: Number(data.innerCarton.itemsQuantity),
      weight: Number(data.innerCarton.weight),
      weightUnit: data.innerCarton.weightUnit,
    }

    // Create master carton
    const masterCarton = {
      id: this.generateId,
      height: Number(data.masterCarton.height),
      width: Number(data.masterCarton.width),
      length: Number(data.masterCarton.length),
      unit: data.masterCarton.unit,
      itemsQuantity: Number(data.masterCarton.itemsQuantity),
      weight: Number(data.masterCarton.weight),
      weightUnit: data.masterCarton.weightUnit,
    }

    // Create Extend Field
    const extendedFields = data.extendedFields
      .map((item: CustomField) => {
        const { extendFieldDefinition, value } = item

        if (value) {
          return {
            value,
            id: this.generateId,
            definition: extendFieldDefinition,
          }
        }

        return null
      })
      .filter(val => val)

    // Fetch supplier
    const fetchSupplier = checkValidRealmObject(data.supplier, null)
      ? this._realm
          .objects<Supplier>('Supplier')
          .filtered('deleted = false AND id = $0', data.supplier.id)
      : null
    const supplier = fetchSupplier ? fetchSupplier[0] : fetchSupplier

    let createdImages = []

    if (createNormal) {
      let index = -1
      const tempCreatedImages = []

      for (const image of data.images) {
        index = index + 1
        const date = new Date()

        try {
          tempCreatedImages[index] = this._realm.create<Image>('Image', {
            id: image.id,
            orientation: 0,
            imageType: data.imageType[index] ? data.imageType[index] : 'Photo',
            creationDate: date,
            lastUpdatedDate: date,
            fileName: `${image.id}.png`,
            data: image.base64,
          })
        } catch (e) {
          const resultImage = this._realm
            .objects('Image')
            .filtered('id = $0', image.id)

          tempCreatedImages[index] =
            resultImage && resultImage.length > 0 ? resultImage[0] : null
        }
      }

      createdImages = tempCreatedImages.filter(item => item)
    } else {
      for (const image of data.images) {
        const date = new Date()
        try {
          createdImages[0] = this._realm.create<Image>('Image', {
            id: image.id,
            orientation: 0,
            imageType: data.imageType[indexCreateMul]
              ? data.imageType[indexCreateMul]
              : 'Photo',
            creationDate: date,
            lastUpdatedDate: date,
            fileName: `${image.id}.png`,
            data: image.base64,
          })
        } catch (e) {}
      }
    }

    // check projects valid
    const projects = filterValidRealmObject(data.projects)

    // check tags valid
    const tags = filterValidRealmObject(data.tags)

    // check category valid
    const category = checkValidRealmObject(data.category, null)

    // Create product
    return this._realm.create<Product>('Product', {
      price,
      samplePrice,
      priceMatrix,
      status,
      event,
      extendedFields,
      innerCarton,
      masterCarton,
      supplier,
      projects,
      tags,
      category,
      harbour: data.harbour,
      incoTerm: data.incoTerm,
      id: this.generateId,
      name: data.name,
      favorite: false,
      images: createdImages,
      minimumOrderQuantity: data.moq,
      moqDescription: data.moqDescription,
      description: data.description,
      archived: false,
      deleted: false,
      assignee: this.userData,
      ...this.createWidthAudit(),
    })
  }

  create(data: CreateProductDto): Observable<Product> {
    return new Observable<Product>(observer => {
      try {
        let createdProduct = null
        let errorMessage = ''

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            // Create images
            createdProduct = this.createWrite(data, true, 0)
          } catch (e) {
            errorMessage = e.message
          }
        })

        if (createdProduct) {
          observer.next(createdProduct)
          observer.complete()
        } else {
          observer.error(errorMessage)
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  createMultiple(
    images: Source,
    data: CreateProductDto,
    editedName: boolean
  ): Observable<Product[]> {
    const products = this._realm.objects<Product>('Product')

    return new Observable<Product[]>(observer => {
      try {
        const response: Product[] = []
        let errorMessage = ''

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        let index = 0
        this._realm.write(() => {
          // Create images
          for (const image of images) {
            const name = editedName
              ? ProductFactory.defaultName(data.name, (index + 1).toString())
              : ProductFactory.normalName(products.length)
            let createdProduct = null

            try {
              createdProduct = this.createWrite(
                {
                  ...data,
                  name,
                  images: [image],
                },
                false,
                index
              )
            } catch (e) {
              errorMessage = e.message
            }

            response.push(createdProduct)
            index++
          }
        })

        if (Array.isArray(response)) {
          observer.next(response)
          observer.complete()
        } else {
          observer.error(errorMessage)
        }
      } catch (e) {
        observer.error(e)
      }
    })
  }

  update = (
    id: string | Product,
    data: Partial<Product> & ImageProps
  ): Observable<Product> => {
    return new Observable<Product>(observer => {
      try {
        let updatedProduct: Product | null | undefined

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            updatedProduct = this._realm.create<Product>(
              'Product',
              {
                id,
                ...data,
                ...this.widthAudit({}, data.deleted ? 'delete' : 'update'),
              },
              true
            )
          } catch (e) {}
        })

        if (updatedProduct) {
          observer.next(updatedProduct)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateImageAfterEditProgress = (updatedProduct, data) => {
    if (updatedProduct && !updatedProduct.images) {
      updatedProduct.images = []
    }

    if (updatedProduct) {
      const modifications = data.modifications
      if (data && Array.isArray(modifications)) {
        if (data.override) {
          const date = new Date()
          const imageInfo = []

          updatedProduct.images = filterDeleteImage(updatedProduct.images)

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
              updatedProduct.images[el] = imageInfo[0]
            })
          } catch (e) {}

          return updatedProduct
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
            updatedProduct.images = insert(
              el + 1,
              imageInfo[0],
              updatedProduct.images
            )
          })
        } catch (e) {}

        return updatedProduct
      }
    }
  }

  updateImageAfterEdit = (
    id: string | Product,
    data: Partial<Product> & ImageObject
  ): Observable<Product> => {
    return new Observable<Product>(observer => {
      try {
        let updatedProduct = null
        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            updatedProduct = this._realm.create<Product>(
              'Product',
              {
                id,
                ...this.widthAudit({}, 'update'),
              },
              true
            )

            // update-Image-After-Edit
            updatedProduct = this.updateImageAfterEditProgress(
              updatedProduct,
              data
            )

            if (updatedProduct && !updatedProduct.images) {
              updatedProduct.images = []
            }
          })
        } catch (e) {}

        if (updatedProduct) {
          observer.next(updatedProduct)
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

  addImage = (id: string | Product, data: ImageProps): Observable<Product> => {
    return new Observable<Product>(observer => {
      try {
        let updatedProduct: Product | null | undefined

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

          // Update product
          try {
            updatedProduct = this._realm.create<Product>(
              'Product',
              {
                id,
                ...data,
                ...this.createWidthAudit({}, true),
              },
              true
            )

            if (updatedProduct && updatedProduct.images === null) {
              updatedProduct.images = []
            }
            updatedProduct.images.push(...createdImages)
          } catch (e) {}
        })

        if (updatedProduct) {
          observer.next(updatedProduct)
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
  ): Observable<Product> => {
    return new Observable<Product>(observer => {
      try {
        let updatedProduct = null
        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        try {
          this._realm.write(() => {
            updatedProduct = this._realm.create<Product>(
              'Product',
              {
                id,
                ...this.widthAudit({}, 'update'),
              },
              true
            )

            if (updatedProduct && !updatedProduct.images) {
              updatedProduct.images = []
            }

            const filterImage = filterDeleteImage(updatedProduct.images)
            if (isDelete && Array.isArray(filterImage) && !isNaN(index)) {
              if (filterImage[index]) {
                filterImage[index].deleted = true
              }
            }

            if (updatedProduct) {
              updatedProduct.images = sortImage(filterImage, index)
            }
          })
        } catch (e) {}

        if (updatedProduct) {
          observer.next(updatedProduct)
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

  duplicate = (data: Partial<Product>): Observable<Product> => {
    return new Observable<Product>(observer => {
      try {
        let duplicateProduct = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          const fetchProductResult = this._realm
            .objects<Product>('Product')
            .filtered('deleted = false AND id = $0', data.id)

          const { duplicateProductConvert } = new SafeProduct(
            fetchProductResult[0]
          )

          const productInfo = {
            ...duplicateProductConvert,
            name: data.name,
          }

          if (productInfo && productInfo.id && productInfo.images) {
            // Duplicate product
            try {
              duplicateProduct = this._realm.create<Product>(
                'Product',
                {
                  ...productInfo,
                  id: this.generateId,
                  ...this.createWidthAudit({}, false),
                },
                false
              )
            } catch (e) {}
          }
        })

        if (duplicateProduct) {
          observer.next(duplicateProduct)
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  rating = (data: ratingData): Observable<any> => {
    return new Observable<any>(observer => {
      try {
        let votes = null
        let product = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          /**
           * If user doesn't ranting before then create new
           */
          if (!data.ratingId || data.ratingId === '') {
            try {
              votes = this._realm.create<ProductVote>(
                'ProductVote',
                {
                  id: this.generateId,
                  user: data.user,
                  value: data.value,
                  creationDate: new Date(),
                },
                false
              )

              product = this._realm.objectForPrimaryKey(
                'Product',
                data.productId
              )

              product.votes = [...product.votes, votes]
            } catch (e) {
              console.log('create rating error', e)
            }
          } else {
            try {
              votes = this._realm.create<ProductVote>(
                'ProductVote',
                {
                  id: data.ratingId,
                  value: data.value,
                },
                true
              )

              product = this._realm.objectForPrimaryKey(
                'Product',
                data.productId
              )
            } catch (e) {
              console.log('update rating error', e)
            }
          }
        })

        console.log('votes', votes)
        console.log('product', product)

        if (votes) {
          observer.next({ votes, product })
        }
      } catch (e) {
        observer.error(e)
      } finally {
        observer.complete()
      }
    })
  }

  updateCategoryMultiProduct = (
    productsId: string[],
    category: Category
  ): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )

              product.category = category
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

  updateSupplierMultiProduct = (
    productsId: string[],
    supplier: Supplier
  ): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )

              product.supplier = supplier
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

  updatePriceMultiProduct = (
    productsId: string[],
    price: { value: number; currency: string }
  ): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )

              if (product.price && product.price.id) {
                product.price.value = price.value
                product.price.currency = price.currency
              } else {
                product.price = {
                  id: this.generateId,
                  value: price.value,
                  currency: price.currency,
                }
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

  updateProjectMultiProduct = (
    productsId: string[],
    projects: Project[]
  ): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            productsId.forEach(productId => {
              const product: Product = this._realm.objectForPrimaryKey(
                'Product',
                productId
              )

              const filterProjects = differenceWith(
                projects,
                product.projects,
                (projectA, projectB) => projectA.id === projectB.id
              )

              if (filterProjects.length > 0) {
                product.projects = [...product.projects].concat(filterProjects)
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

  deleteMultiProduct = (productsId: string[]): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            productsId.forEach(productId => {
              this._realm.create<Product>(
                'Product',
                {
                  id: productId,
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

  updateArchiveMultiProduct = (productsId: string[]): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            productsId.forEach(productId => {
              this._realm.create<Product>(
                'Product',
                {
                  id: productId,
                  archived: true,
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

  comment = (productId: string, comment: Comment): Observable<Product> => {
    return new Observable<any>(observer => {
      try {
        let errorWhileUpdate = null

        if (!this._realm) {
          observer.error(`Realm property is null`)
          return
        }

        this._realm.write(() => {
          try {
            const product: Product = this._realm.objectForPrimaryKey(
              'Product',
              productId
            )

            product.comments.push(comment)
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
