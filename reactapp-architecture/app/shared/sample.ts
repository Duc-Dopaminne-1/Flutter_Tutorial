import I18n from '@/i18n'
import { Sample, SampleStatus, Price } from '@/models/team'
import { colors } from '@/vars/colors'
import { pathOr } from 'ramda'
import { Image } from '@/models/common'
import { addCurrencySymbol } from '@/shared/format'
import { ISafeImages, SafeImages } from '@/shared/images'
import moment from 'moment/min/moment-with-locales.js'
import v4 from 'uuid/v4'
import { Factory } from '@/services/factory'
import { SafeStatusType } from './statusType'

export class SafeSample {
  private _sample: Sample = null
  private _defaultNumber = ''

  private _defaultStatus: SampleStatus = {
    id: '',
    name: '',
    inWorkflow: false,
    category: '',
    step: 0,
  }
  private _defaultPrice: Price = {
    baseCurrencyValue: 0,
    currency: 'USD',
    value: 0,
    id: v4(),
  }

  constructor(sample: Sample) {
    this._sample = sample
  }

  set sample(sample: Sample) {
    if (!sample || (sample.isValid && !sample.isValid()) || sample.deleted) {
      this._sample = null
    } else {
      this._sample = sample
    }
  }

  static getStatusColor = (
    status: SampleStatus
  ): {
    background: string
    color: string
  } => {
    if (!status) {
      return {
        background: colors.status_background,
        color: colors.primary_blue,
      }
    }

    const statusName = status.name.toLowerCase()
    switch (statusName) {
      case 'validated': {
        return {
          background: '#f0fcf4',
          color: '#4fd273',
        }
      }
      case 'refused': {
        return {
          background: colors.warning_light,
          color: colors.warning,
        }
      }
      case 'new sample':
      case '_draft':
      case 'to order':
      case 'ordered':
      case '': {
        return {
          background: colors.new_supplier,
          color: colors.blue_light_grey,
        }
      }
      default:
        return {
          background: colors.status_background,
          color: colors.primary_blue,
        }
    }
  }

  get id() {
    return pathOr('', ['id'], this._sample)
  }

  get name() {
    return pathOr('', ['name'], this._sample)
  }

  get reference() {
    return pathOr('', ['reference'], this._sample)
  }

  get description() {
    return pathOr('', ['description'], this._sample)
  }

  get supplier() {
    return pathOr<string>(null, ['supplier'], this._sample)
  }

  get paid() {
    return pathOr<string>(null, ['paid'], this._sample)
  }

  get createdBy() {
    return pathOr(null, ['createdBy'], this._sample)
  }

  get assignedTo() {
    const assignee = pathOr(null, ['assignee'], this._sample)

    if (!assignee) return ''
    const firstName = pathOr('', ['firstName'], assignee)
    const lastName = pathOr('', ['lastName'], assignee)
    return `${firstName} ${lastName}`
  }

  get assignedToName() {
    const assignee = pathOr(null, ['assignee'], this._sample)

    if (!assignee) return ''
    const firstName = pathOr('', ['firstName'], assignee)
    const lastName = pathOr('', ['lastName'], assignee)
    return `${I18n.t('sampleAssignedTo')} ${firstName} ${lastName}`
  }

  get assignedName() {
    const assignee = pathOr(null, ['assignee'], this._sample)

    if (!assignee) return ''

    if (this._sample.assignee.id === Factory.user().identity) {
      return I18n.t('sampleAssignedToMe')
    }
    const firstName = pathOr('', ['firstName'], assignee)
    const lastName = pathOr('', ['lastName'], assignee)
    return `${I18n.t('sampleAssignedTo')} ${firstName} ${lastName}`
  }

  get createdByName() {
    const createBy = this.createdBy
    const firstName = pathOr('', ['firstName'], createBy)
    const lastName = pathOr('', ['lastName'], createBy)
    const fullName = firstName + ' ' + lastName

    const createTime = pathOr('', ['creationDate'], this._sample)
    const convertTime = moment(createTime).format('DD MMMM YYYY')

    return `${I18n.t('taskCreatedBy')} ${fullName} ${I18n.t(
      'taskActionByDate'
    )} ${convertTime}`
  }

  get commentsCount() {
    const comments = pathOr([], ['comments'], this._sample)
    if (comments.length < 1) {
      return ''
    }
    if (comments.length === 1) {
      return `1 ${I18n.t('comment')}`
    }
    return `${comments.length} ${I18n.t('comments')}`
  }

  get comments() {
    return pathOr([], ['comments'], this._sample)
  }

  get lastUpdatedBy() {
    return pathOr(null, ['lastUpdatedBy'], this._sample)
  }

  get lastUpdatedByName() {
    const lastUpdatedBy = this.lastUpdatedBy
    const firstName = pathOr('', ['firstName'], lastUpdatedBy)
    const lastName = pathOr('', ['lastName'], lastUpdatedBy)
    const fullName = firstName + ' ' + lastName

    const lastUpdatedTime = pathOr('', ['lastUpdatedDate'], this._sample)

    const convertTime = moment(lastUpdatedTime).format('DD MMMM YYYY')

    return `${I18n.t('taskLastUpdatedBy')} ${fullName} ${I18n.t(
      'taskActionByDate'
    )} ${convertTime}`
  }

  get images(): ISafeImages {
    try {
      const images = pathOr<Image[]>([], ['images'], this._sample) as Image[]
      return new SafeImages(images)
    } catch (e) {
      return SafeImages.default()
    }
  }

  get convertSampleToObject() {
    return {
      ...this._sample,
      price: this._sample && this._sample.price && { ...this._sample.price },
    }
  }

  get price() {
    const price = pathOr<Price>(this._defaultPrice, ['price'], this._sample)

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

  get priceValue() {
    try {
      const price = pathOr(null, ['price'], this._sample)
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
    const price = pathOr(null, ['price'], this._sample)
    const currency = pathOr<string>('USD', ['currency'], price)
    const symbol = addCurrencySymbol(currency)
    return {
      currency,
      symbol,
    }
  }

  get statusType() {
    const status = pathOr<SampleStatus>(null, ['status'], this._sample)
    const statusColor = SafeSample.getStatusColor(status)
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

  get safeStatus() {
    const status = pathOr<SampleStatus>(
      this._defaultStatus,
      ['status'],
      this._sample
    )

    const id = status ? status.id : ''

    const number = status ? status.step.toString() : ''
    const category = status ? status.category.toString() : ''
    const step = status ? status.step.toString() : ''
    const name = status ? status.name : ''
    const color = SafeSample.getStatusColor(status)

    const label = status && status.name ? status.name : ''
    const formattedLabel = SafeStatusType.getNameSample(label)

    return {
      status,
      id,
      number,
      name,
      step,
      label,
      formattedLabel,
      category,
      hasLabel: !!name,
      color: color.color,
      background: color.background,
    }
  }

  get extendedFields() {
    return pathOr([], ['extendedFields'], this._sample)
  }
}
