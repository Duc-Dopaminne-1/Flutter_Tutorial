import { colors } from '@/vars'
import I18n from '@/i18n'

export class SafeStatusType {
  static getColor = (name: string) => {
    switch (name) {
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

  static getName = (name: string) => {
    switch (name) {
      case '_Draft' || '_draft' || '':
        return I18n.t('newProduct')
      case '':
        return I18n.t('newProduct')
      case 'Get quotation':
        return I18n.t('getQuotation')
      case 'Validate sample':
        return I18n.t('validateSample')
      case 'Team review':
        return I18n.t('teamReview')
      case 'Validated':
        return I18n.t('validated')
      case 'Refused':
        return I18n.t('refused')
      default:
        return name
    }
  }

  static getNameSupplier = (name: string) => {
    switch (name) {
      case '_Draft' || '_draft' || '':
        return I18n.t('newSupplier')
      case '':
        return I18n.t('newSupplier')
      case 'Onboarding':
        return I18n.t('onboarding')
      case 'Validated':
        return I18n.t('validated')
      case 'Refused':
        return I18n.t('refused')
      default:
        return name
    }
  }

  static getNameSample = (name: string) => {
    switch (name) {
      case '_Draft' || '_draft' || '':
        return I18n.t('newSample')
      case '':
        return I18n.t('newSample')
      case 'To order':
        return I18n.t('toOrder')
      case 'Ordered':
        return I18n.t('ordered')
      case 'Received':
        return I18n.t('received')
      case 'Under Assessment':
        return I18n.t('underAssessment')
      case 'Validated':
        return I18n.t('validated')
      case 'Refused':
        return I18n.t('refused')
      default:
        return name
    }
  }
}
