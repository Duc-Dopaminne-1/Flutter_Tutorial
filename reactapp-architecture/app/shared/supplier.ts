import I18n from '@/i18n'
import { Product, ProductStatus, Supplier, SupplierStatus } from '@/models/team'
import { SafeCountry } from '@/shared/country'
import { images } from '@/vars'
import { colors } from '@/vars/colors'
import { isNil, pathOr } from 'ramda'
import { Image } from '@/models/common'
import { ISafeImages, SafeImages } from '@/shared/images'
import { SafeStatusType } from '@/shared/statusType'
import moment from 'moment'

export class SafeSupplier {
  private _supplier: Supplier
  private _defaultStatus: any = {
    id: '',
    name: '',
    inWorkflow: false,
    category: '',
    step: 0,
  }

  constructor(supplier: Supplier) {
    this._supplier = supplier
  }

  set supplier(supplier: Supplier) {
    if (
      !supplier ||
      (supplier.isValid && !supplier.isValid()) ||
      supplier.deleted
    ) {
      this._supplier = null
    } else {
      this._supplier = supplier
    }
  }

  get reference() {
    return pathOr('', ['reference'], this._supplier)
  }

  static getStatusColor = (
    status: SupplierStatus
  ): {
    background: string
    color: string
  } => {
    if (!status) {
      return {
        background: colors.new_supplier,
        color: colors.blue_light_grey,
      }
    }

    switch (status.name) {
      case 'Onboarding': {
        return {
          background: colors.status_in_progress,
          color: colors.white,
        }
      }
      case 'Validated': {
        return {
          background: colors.validated,
          color: colors.white,
        }
      }
      case 'Refused': {
        return {
          background: colors.warning,
          color: colors.white,
        }
      }
      default:
        return {
          background: colors.new_supplier,
          color: colors.blue_light_grey,
        }
    }
  }

  get safeStatus() {
    const status = pathOr<SupplierStatus>(
      this._defaultStatus,
      ['status'],
      this._supplier
    )

    const id = status ? status.id : ''

    const number = status ? status.step.toString() : ''
    const category = status ? status.category.toString() : ''
    const step = status ? status.step.toString() : ''
    const name = status ? status.name : ''
    const color = SafeSupplier.getStatusColor(status)

    const label = status && status.name ? status.name : ''
    const formattedLabel = SafeStatusType.getNameSupplier(label)

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

  get logoPlaceholder() {
    const normalizeName = this.name
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/^\s+|\s+$|\s+(?=\s)/g, '')
      .toUpperCase()

    const words = normalizeName.split(' ')

    switch (words.length) {
      case 0:
        return ''
      case 1:
        return words[0].substring(0, 4)
      case 2:
        return words[0].substring(0, 2) + words[1].substring(0, 2)
      case 3:
        return (
          words[0].substring(0, 1) +
          words[1].substring(0, 1) +
          words[2].substring(0, 1)
        )
      default:
        return (
          words[0].substring(0, 1) +
          words[1].substring(0, 1) +
          words[2].substring(0, 1) +
          words[3].substring(0, 1)
        )
    }
  }

  get id() {
    return pathOr('', ['id'], this._supplier)
  }

  get name() {
    return pathOr('', ['name'], this._supplier)
  }

  get fullName() {
    return pathOr('', ['fullName'], this._supplier)
  }

  get description() {
    return pathOr('', ['description'], this._supplier)
  }

  get favorite() {
    return this._supplier.favorite
  }

  get supplierTypeName() {
    return pathOr<string>('Supplier', ['name'], this._supplier.supplierType)
  }

  get country() {
    return pathOr('', ['country'], this._supplier)
  }

  get city() {
    return this._supplier && this._supplier.city
      ? this._supplier.city + ' '
      : ''
  }

  get supplierLocation() {
    // return this.city + SafeCountry.getCountryName(this.country)
    return SafeCountry.getCountryName(this.country)
  }

  get categories() {
    const category = pathOr<any>(null, ['categories'], this._supplier)
    const data = !isNil(category) ? this._supplier.categories : []

    const text = data ? data.map(cat => cat.name).join(' • ') : ''

    return {
      text,
      data,
      hasText: !!text,
    }
  }

  get logoImage() {
    return this._supplier.logoImage
      ? {
          uri: this._supplier.logoImage,
        }
      : images.supplier
  }

  get images(): ISafeImages {
    try {
      const images = pathOr<Image[]>([], ['images'], this._supplier) as Image[]
      return new SafeImages(images)
    } catch (e) {
      return SafeImages.default()
    }
  }

  get statusType() {
    const status = pathOr<SupplierStatus>(null, ['status'], this._supplier)
    const statusColor = SafeSupplier.getStatusColor(status)
    const name = pathOr<string>(null, ['name'], status)
    const formattedName = name
      ? I18n.t(name.toLowerCase(), { defaultValue: name }).toUpperCase()
      : ''

    return {
      name: formattedName,
      hasLabel: !!name,
      background: statusColor.background,
      color: statusColor.color,
    }
  }

  get safeTags() {
    return pathOr<any>([], ['tags'], this._supplier)
  }

  get generalMOQ() {
    return this._supplier.generalMOQ ? this._supplier.generalMOQ.toString() : ''
  }

  get generalLeadTime() {
    return this._supplier.generalLeadTime
      ? this._supplier.generalLeadTime.toString()
      : ''
  }

  get website() {
    return this._supplier.website ? this._supplier.website : ''
  }

  get officeEmail() {
    return this._supplier.officeEmail ? this._supplier.officeEmail : ''
  }

  get officePhone() {
    return this._supplier.officePhone ? this._supplier.officePhone : ''
  }

  get owner() {
    const createdUser = this._supplier.createdBy
    const firstName =
      createdUser && createdUser.firstName ? createdUser.firstName + ' ' : ''
    const lastName =
      createdUser && createdUser.lastName ? createdUser.lastName : ''

    return firstName + lastName
  }

  get harbour() {
    return pathOr('', ['harbour'], this._supplier)
  }

  get incoTerm() {
    return pathOr('', ['incoTerm'], this._supplier)
  }

  get createdBy() {
    return pathOr(null, ['createdBy'], this._supplier)
  }

  get createdByName() {
    const createBy = this.createdBy
    const firstName = pathOr('', ['firstName'], createBy)
    const lastName = pathOr('', ['lastName'], createBy)
    const fullName = firstName + ' ' + lastName

    const createTime = pathOr('', ['creationDate'], this._supplier)
    const convertTime = moment(createTime).format('DD MMMM YYYY')

    return fullName + ' on ' + convertTime
  }

  get lastUpdatedBy() {
    return pathOr(null, ['lastUpdatedBy'], this._supplier)
  }

  get lastUpdatedByName() {
    const lastUpdatedBy = this.lastUpdatedBy
    const firstName = pathOr('', ['firstName'], lastUpdatedBy)
    const lastName = pathOr('', ['lastName'], lastUpdatedBy)
    const fullName = firstName + ' ' + lastName

    const lastUpdatedTime = pathOr('', ['lastUpdatedDate'], this._supplier)
    const convertTime = moment(lastUpdatedTime).format('DD MMMM YYYY')

    return fullName + ' on ' + convertTime
  }

  get assignedName() {
    const assignee = pathOr(null, ['assignee'], this._supplier)

    if (!assignee) return ''

    const firstName = pathOr('', ['firstName'], assignee)
    const lastName = pathOr('', ['lastName'], assignee)
    return firstName + ' ' + lastName
  }

  get commentsCount() {
    const comments = pathOr([], ['comments'], this._supplier)
    if (comments.length < 1) {
      return ''
    }
    if (comments.length === 1) {
      return `1 ${I18n.t('comment')}`
    }
    return `${comments.length} ${I18n.t('comments')}`
  }

  get comments() {
    return pathOr([], ['comments'], this._supplier)
  }
}
