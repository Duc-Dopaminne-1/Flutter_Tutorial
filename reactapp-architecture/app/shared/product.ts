import { Image, User } from '@/models/common'
import {
  Packaging,
  Price,
  Product,
  ProductStatus,
  ProductVote,
  Project,
} from '@/models/team'
import { addCurrencySymbol } from '@/shared/format'
import { colors } from '@/vars/colors'
import { isNil, pathOr } from 'ramda'
import { SafeUser } from '@/shared/user'
import v4 from 'uuid/v4'
import { ISafeImages, SafeImages } from '@/shared/images'
import { SafeStatusType } from '@/shared/statusType'
import { SafeEvent } from '@/shared/event'
import moment from 'moment'
import I18n from '@/i18n'
import { safeLocation } from '@/shared/location'

export type SafeProductPrice = Price & {
  value: number
  formatted: string | number
}

export type ResultPackagingName = {
  data: Packaging
  packaging: string
}

export type PackagingName = 'innerCarton' | 'masterCarton'

export class SafeProduct {
  private _product: Product
  private _defaultText = ''
  private _defaultNumber = ''
  private _defaultInner = {
    height: '',
    itemsQuantity: '',
    length: '',
    unit: this._defaultText,
    weight: '',
    weightUnit: this._defaultText,
    width: '',
  }
  private _defaultPriceMatrix = {
    rows: [],
  }
  private _defaultPrice: Price = {
    baseCurrencyValue: 0,
    currency: 'USD',
    value: 0,
    id: v4(),
  }
  private _defaultStatus: ProductStatus = {
    id: '',
    name: '',
    inWorkflow: false,
    category: '',
    step: 0,
  }

  constructor(product: Product) {
    if (
      !product ||
      (product.isValid && !product.isValid()) ||
      product.deleted
    ) {
      this._product = null
    } else {
      this._product = product
    }
  }

  set product(product: Product) {
    if (
      !product ||
      (product.isValid && !product.isValid()) ||
      product.deleted
    ) {
      this._product = null
    } else {
      this._product = product
    }
  }

  get reference() {
    return pathOr('', ['reference'], this._product)
  }

  get convertProductToObject() {
    const convertPriceMatrixRows =
      this._product &&
      this._product.priceMatrix &&
      this._product.priceMatrix.rows
        ? [
            ...this._product.priceMatrix.rows.map(row => {
              return {
                ...row,
                price: { ...row.price },
              }
            }),
          ]
        : null

    const convertPriceMatrix =
      this._product && this._product.priceMatrix
        ? {
            ...this._product.priceMatrix,
            rows: convertPriceMatrixRows,
          }
        : null

    return {
      ...this._product,
      price: this._product && this._product.price && { ...this._product.price },
      priceMatrix: convertPriceMatrix,
      samplePrice: this._product &&
        this._product.samplePrice && { ...this._product.samplePrice },
      innerCarton: this._product &&
        this._product.innerCarton && { ...this._product.innerCarton },
      masterCarton: this._product &&
        this._product.masterCarton && { ...this._product.masterCarton },
    }
  }

  get duplicateProductConvert() {
    const convertPriceMatrixRows =
      this._product &&
      this._product.priceMatrix &&
      this._product.priceMatrix.rows
        ? [
            ...this._product.priceMatrix.rows.map(row => {
              return {
                ...row,
                id: v4(),
                price: {
                  ...row.price,
                  id: v4(),
                },
              }
            }),
          ]
        : null

    const convertPriceMatrix =
      this._product && this._product.priceMatrix
        ? {
            ...this._product.priceMatrix,
            id: v4(),
            rows: convertPriceMatrixRows,
          }
        : null

    return {
      ...this._product,
      price: this._product &&
        this._product.price && { ...this._product.price, id: v4() },
      priceMatrix: convertPriceMatrix,
      samplePrice: this._product &&
        this._product.samplePrice && { ...this._product.samplePrice, id: v4() },
      innerCarton: this._product &&
        this._product.innerCarton && { ...this._product.innerCarton, id: v4() },
      masterCarton: this._product &&
        this._product.masterCarton && {
          ...this._product.masterCarton,
          id: v4(),
        },
    }
  }

  static getStatusColor = (status: ProductStatus) => {
    if (!status) {
      return colors.status_draft
    }

    switch (status.category) {
      case 'inProgress': {
        return colors.status_in_progress
      }
      case 'validated': {
        return colors.status_validated
      }
      case 'refused': {
        return colors.status_refused
      }
      default:
        return colors.status_draft
    }
  }

  static calculateVote = (votes: ProductVote[]) => {
    const sum = votes.reduce((acc, cur) => {
      return acc + (cur.value || 0)
    }, 0)

    return sum / votes.length
  }

  static calculateVoteStar = (votes: ProductVote[]) => {
    const sum = votes.reduce((acc, cur) => {
      const convertToStar = SafeProduct.convertVotePercentToStar(cur.value)

      return acc + convertToStar
    }, 0)

    const calculate = sum / votes.length
    const fixNumber = calculate.toFixed(1)

    return fixNumber === '0.0' ? '0' : fixNumber
  }

  static convertVotePercentToStar = votePercent => {
    if (votePercent === 0) return 1

    if (0 < votePercent && votePercent <= 25) return 2

    if (25 < votePercent && votePercent <= 50) return 3

    if (50 < votePercent && votePercent <= 75) return 4

    if (75 < votePercent && votePercent <= 100) return 5

    return 0
  }

  getDefaultPacking = (packing: Packaging) => {
    return {
      get height() {
        return packing.height ? packing.height.toString() : ''
      },
      get id() {
        return packing.id ? packing.id : ''
      },
      get itemsQuantity() {
        return packing.itemsQuantity ? packing.itemsQuantity.toString() : ''
      },
      get itemsQuantityString() {
        return !isNil(packing.itemsQuantity)
          ? packing.itemsQuantity.toString()
          : ''
      },
      get length() {
        return packing.length ? packing.length.toString() : ''
      },
      get unit() {
        return packing.unit ? packing.unit : 'cm'
      },
      get weight() {
        return packing.weight ? packing.weight.toString() : ''
      },
      get weightUnit() {
        return packing.weightUnit ? packing.weightUnit : 'kg'
      },
      get width() {
        return packing.width ? packing.width.toString() : ''
      },
    }
  }

  get id() {
    return pathOr(v4(), ['id'], this._product)
  }

  get createdBy() {
    return pathOr(null, ['createdBy'], this._product)
  }

  get createdByName() {
    const createBy = this.createdBy
    const firstName = pathOr('', ['firstName'], createBy)
    const lastName = pathOr('', ['lastName'], createBy)
    const fullName = firstName + ' ' + lastName

    const createTime = pathOr('', ['creationDate'], this._product)
    const convertTime = moment(createTime).format('DD MMMM YYYY')

    return fullName + ' on ' + convertTime
  }

  get lastUpdatedBy() {
    return pathOr(null, ['lastUpdatedBy'], this._product)
  }

  get lastUpdatedByName() {
    const lastUpdatedBy = this.lastUpdatedBy
    const firstName = pathOr('', ['firstName'], lastUpdatedBy)
    const lastName = pathOr('', ['lastName'], lastUpdatedBy)
    const fullName = firstName + ' ' + lastName

    const lastUpdatedTime = pathOr('', ['lastUpdatedDate'], this._product)
    const convertTime = moment(lastUpdatedTime).format('DD MMMM YYYY')

    return fullName + ' on ' + convertTime
  }

  get assignedName() {
    const assignee = pathOr(null, ['assignee'], this._product)

    if (!assignee) return ''

    const firstName = pathOr('', ['firstName'], assignee)
    const lastName = pathOr('', ['lastName'], assignee)
    return firstName + ' ' + lastName
  }

  get productId() {
    return pathOr('', ['id'], this._product)
  }

  get priceValue() {
    try {
      const price = pathOr(null, ['price'], this._product)
      const value = pathOr<string>(this._defaultNumber, ['value'], price)
      const formatted =
        value > 0 && value !== '' ? (value / 10000).toString() : ''

      return {
        value,
        formatted,
      }
    } catch (e) {
      return {
        value: this._defaultNumber,
        formatted: '',
      }
    }
  }

  get currency() {
    const price = pathOr(null, ['price'], this._product)
    const currency = pathOr<string>('USD', ['currency'], price)
    const symbol = addCurrencySymbol(currency)
    return {
      currency,
      symbol,
    }
  }

  get supplier() {
    return pathOr<string>(null, ['supplier'], this._product)
  }

  get supplierName() {
    const supplier = this.supplier

    return pathOr<string>(this._defaultText, ['name'], supplier)
  }

  get category() {
    return pathOr<string>(null, ['category'], this._product)
  }

  get categoryName() {
    const category = this.category

    return pathOr<string>(this._defaultText, ['name'], category)
  }

  get MOQ() {
    const minimumOrderQuantity = pathOr<string>(
      this._defaultNumber,
      ['minimumOrderQuantity'],
      this._product
    )
    const moqDescription = pathOr<string>(
      this._defaultText,
      ['moqDescription'],
      this._product
    )
    return {
      minimumOrderQuantity,
      moqDescription,
    }
  }

  get images(): ISafeImages {
    try {
      const images = pathOr<Image[]>([], ['images'], this._product) as Image[]
      return new SafeImages(images)
    } catch (e) {
      return SafeImages.default()
    }
  }

  get name() {
    return pathOr<string>(this._defaultText, ['name'], this._product)
  }

  get description() {
    return pathOr<string>(this._defaultText, ['description'], this._product)
  }

  get tags() {
    return pathOr<string[]>([], ['tags'], this._product)
  }

  get projects() {
    return pathOr<Project[]>([], ['projects'], this._product)
  }

  get carton() {
    const inner = pathOr<Packaging>(
      this._defaultInner as any,
      ['innerCarton'],
      this._product
    )
    const master = pathOr<Packaging>(
      this._defaultInner as any,
      ['masterCarton'],
      this._product
    )

    const getCarton = (packaging: PackagingName) => {
      const data = packaging === 'innerCarton' ? inner : master

      return {
        packaging,
        data: {
          get id() {
            return data.id ? data.id : v4()
          },
          ...data,
        },
      }
    }

    return {
      getCarton,
      master: this.getDefaultPacking(master),
      inner: this.getDefaultPacking(inner),
    }
  }

  get price() {
    const price = pathOr<Price>(this._defaultPrice, ['price'], this._product)

    const value = pathOr<string>(this._defaultNumber, ['value'], price)

    const formatted =
      value > -1 && value !== '' ? (value / 10000).toFixed(2) : ''

    const currency = price.currency ? price.currency : 'USD'

    return {
      ...price,
      currency,
      value,
      formatted,
    }
  }

  static genericName = (productsSize: number, user?: User): string => {
    const slotProduct = (productsSize + 1).toString()
    const { logoPlaceholder } = new SafeUser(user as any)
    return (
      'P-' + slotProduct.padStart(4, '0') + '-' + logoPlaceholder.toUpperCase()
    )
  }

  get samplePrice() {
    return pathOr(this._defaultPrice, ['samplePrice'], this._product)
  }

  get currencySamplePrice() {
    const samplePrice = pathOr<{}>({}, ['samplePrice'], this._product)
    const currency = pathOr<string>('USD', ['currency'], samplePrice)

    return {
      currency,
    }
  }

  get priceMatrix() {
    return pathOr(this._defaultPriceMatrix, ['priceMatrix'], this._product)
  }

  get currencyPriceMatrix() {
    if (!this._product.priceMatrix) return ['USD']

    return this._product.priceMatrix.rows.map(data => {
      return data.price.currency
    })
  }

  get votePercent() {
    return this._product.votes && this._product.votes.length !== 0
      ? SafeProduct.calculateVote(this._product.votes)
      : 0
  }

  get voteStar() {
    return this._product.votes && this._product.votes.length !== 0
      ? SafeProduct.calculateVoteStar(this._product.votes)
      : 0
  }

  get votes() {
    return pathOr<ProductVote>([] as any, ['votes'], this._product)
  }

  get favorite() {
    return pathOr<boolean>(false, ['favorite'], this._product)
  }

  get safeStatus() {
    const status = pathOr<ProductStatus>(
      this._defaultStatus,
      ['status'],
      this._product
    )

    const id = status ? status.id : ''

    const number = status ? status.step.toString() : ''
    const category = status ? status.category.toString() : ''
    const step = status ? status.step.toString() : ''
    const name = status ? status.name : ''
    const color = SafeProduct.getStatusColor(status)

    const label = status && status.name ? status.name : ''
    const formattedLabel = SafeStatusType.getName(label)

    return {
      status,
      id,
      number,
      name,
      step,
      label,
      formattedLabel,
      color,
      category,
    }
  }

  get event() {
    return pathOr(null, ['event'], this._product)
  }

  get safeEvent() {
    return new SafeEvent(this.event)
  }

  get extendedFields() {
    return pathOr([], ['extendedFields'], this._product)
  }

  get harbour() {
    return pathOr('', ['harbour'], this._product)
  }

  get incoTerm() {
    return pathOr('', ['incoTerm'], this._product)
  }

  get commentsCount() {
    const comments = pathOr([], ['comments'], this._product)
    if (comments.length < 1) {
      return ''
    }
    if (comments.length === 1) {
      return `1 ${I18n.t('comment')}`
    }
    return `${comments.length} ${I18n.t('comments')}`
  }

  get comments() {
    return pathOr([], ['comments'], this._product)
  }
}
