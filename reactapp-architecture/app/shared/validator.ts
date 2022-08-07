import validate from 'validate.js'
import { Keyboard } from 'react-native'
import { CustomAlert } from '@/shared/alert'
import { Project } from '@/models/team'
import I18n from '@/i18n'

export function isEmpty(text: string, alertText?: string) {
  if (!text.trim().length) {
    alertText && alert(alertText)
    return true
  }

  return false
}

export function isValidEmail(email: string) {
  const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return email && regexEmail.test(email.trim().toLowerCase())
}

export function isValidPhoneNumber(phoneNumber: string) {
  const regexPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
  // /^[\d.\-]+$/

  return regexPhoneNumber.test(phoneNumber) && phoneNumber.trim().length >= 10
}

export function isJson(text: string) {
  try {
    JSON.parse(text)
  } catch (e) {
    return false
  }
  return true
}

export function isPriceJson(value: string) {
  if (
    value.includes('__typename') &&
    value.includes('Price') &&
    isJson(value)
  ) {
    return true
  }

  return false
}

export function isInt(value: string, noAlert: boolean = false) {
  if (value.length <= 0) return false

  const convert2Number = Number(value.toString().replace(',', '.'))

  if (!validate.isNumber(convert2Number)) {
    !noAlert && CustomAlert.alertTimeout('Not a number, please type again')
    return false
  }

  if (value.includes(',') || value.includes('.')) {
    !noAlert && CustomAlert.alertTimeout('Not type Integer, please type again')
    return false
  }

  return true
}

export function isDecimal(value: string, noAlert: boolean = false) {
  if (value.length <= 0) return false

  const convert2String = value.toString()
  const convert2Number = Number(convert2String.replace(',', '.'))

  if (!validate.isNumber(convert2Number)) {
    !noAlert && CustomAlert.alertTimeout('Not a number, please type again')
    return false
  }

  if (!convert2String.includes(',') && !convert2String.includes('.')) {
    !noAlert && CustomAlert.alertTimeout('Not type Decimal, please type again')
    return false
  }

  return true
}

export function isPrice(value: string, noAlert: boolean = false) {
  if (value.length <= 0) return false

  const convert2Number = Number(value.toString().replace(',', '.'))

  if (!validate.isNumber(convert2Number)) {
    !noAlert && CustomAlert.alertTimeout('Not a number, please type again')
    return false
  }

  return true
}

export function filterValidProject(projects: Project[]) {
  let isChange = false
  const oldProjectLength = projects.length

  if (!projects || projects.length === 0) {
    return {
      isChange,
      filterProjects: [],
    }
  }

  const filterProjects = projects
    .map(project => {
      if (!project || !project.isValid() || project.deleted) {
        return null
      }

      return project
    })
    .filter(data => data)

  if (oldProjectLength > filterProjects.length) {
    alert(I18n.t('someProjectsHaveDelete'))
    isChange = true
  }

  return {
    filterProjects,
    isChange,
  }
}

export function filterValidRealmObject(dataList: any[]) {
  return dataList
    .map(data => {
      if (!data || !data.isValid() || data.deleted) {
        return null
      }

      return data
    })
    .filter(data => data)
}

export function checkValidRealmObject(realmObject: any, defaultValue: any) {
  if (!realmObject || !realmObject.isValid() || realmObject.deleted) {
    return defaultValue
  }

  return realmObject
}

export function isValidRealmObject(realmObject: any) {
  if (realmObject !== null && (!realmObject.isValid() || realmObject.deleted)) {
    return false
  }

  return true
}

export function isValidListRealmObject(realmObject: any[]) {
  for (const data of realmObject) {
    if (data !== null && (!data.isValid() || data.deleted)) {
      return false
    }
  }

  return true
}
