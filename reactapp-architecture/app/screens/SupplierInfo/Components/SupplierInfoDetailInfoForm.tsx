import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AInput } from '@/components/AInput/AInput'
import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import {
  supplierNavigation,
  SupplierRef,
} from '@/navigation/supplierNavigation'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { SafeCountry } from '@/shared/country'
import { SafeSupplier } from '@/shared/supplier'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import validate from 'validate.js'
import { isValidEmail, isValidPhoneNumber } from '@/shared/validator'
import { CustomAlert } from '@/shared/alert'
import { productNavigation, ProductRef } from '@/navigation/productNavigation'

// init state
const initialState = {
  openModalSelectCategory: false,
  isEdit: false,

  // info
  name: '',
  fullName: '',
  generalMOQ: '',
  generalLeadTime: '',
  country: '',
  website: '',
  officeEmail: '',
  officePhone: '',
  owner: '',
}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  supplier?: Supplier
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@DelayRender({ delay: 200 })
@withContext(AppContext.Consumer)
@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoDetailInfoForm extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  componentDidMount() {
    const {
      name,
      fullName,
      generalMOQ,
      generalLeadTime,
      country,
      website,
      officeEmail,
      officePhone,
      owner,
    } = new SafeSupplier(this.props.supplier)

    this.setState({
      name,
      fullName,
      generalMOQ,
      generalLeadTime,
      country,
      website,
      officeEmail,
      officePhone,
      owner,
    })
  }

  onChangeText = (key: string) => (_text: string) => {
    const text: string =
      key === 'generalMOQ' || key === 'generalLeadTime'
        ? _text.replace(/\D/g, '')
        : _text
    // @ts-ignore
    this.setState({
      [key]: text,
      isEdit: true,
    })
  }

  checkValueText = ({ value, key = 'none' }) => {
    const { isBack } = this.props

    if (!value || value.trim().length <= 0) {
      if (key === 'name') {
        return null
      }

      return ''
    }

    if (key === 'officePhone') {
      if (isValidPhoneNumber(value)) {
        return value.toString()
      }
      !isBack && CustomAlert.alertTimeout(I18n.t('invalidNumber'))
      return null
    }

    if (key === 'officeEmail' && !isValidEmail(value)) {
      !isBack && CustomAlert.alertTimeout(I18n.t('invalidEmail'))
      return null
    }

    return value.trim()
  }

  checkValueNumber = ({ value, key = 'none' }) => {
    const { isBack } = this.props

    if (!value) {
      return 0
    }

    const number = Number(value.replace(',', '.'))
    if (!validate.isNumber(number)) {
      !isBack && CustomAlert.alertTimeout(I18n.t('notANumber'))
      return null
    }

    if (key === 'generalMOQ' || key === 'generalLeadTime') {
      const floor = Math.floor(number)
      // @ts-ignore
      this.setState({
        [key]: floor,
      })
      return floor
    }

    return number
  }

  onSubmit = (
    key: string,
    type: 'number' | 'string' | 'phone' = 'string'
  ) => () => {
    const { supplierFactory, supplier } = this.props

    const value =
      type === 'number'
        ? this.checkValueNumber({ key, value: this.state[key].toString() })
        : this.checkValueText({ key, value: this.state[key].toString() })

    if (value === null || value === undefined) {
      // @ts-ignore
      this.setState({
        [key]: '',
      })
      return
    }

    supplierFactory
      .update(supplier.id, {
        [key]: value,
      })
      .subscribe(() => {
        // this.setState({
        //   isEdit: false,
        // })
      })
  }

  get data() {
    const { isEdit } = this.state
    const {
      name,
      fullName,
      generalMOQ,
      generalLeadTime,
      country,
      website,
      officeEmail,
      officePhone,
      owner,
      harbour,
      incoTerm,
      createdByName,
      lastUpdatedByName,
      assignedName,
    } = new SafeSupplier(this.props.supplier)

    return {
      harbour,
      incoTerm,
      country,
      createdByName,
      lastUpdatedByName,
      assignedName,
      fullName: isEdit ? this.state.fullName : fullName,
      name: isEdit ? this.state.name : name,
      generalMOQ: isEdit ? this.state.generalMOQ : generalMOQ,
      generalLeadTime: isEdit ? this.state.generalLeadTime : generalLeadTime,
      website: isEdit ? this.state.website : website,
      officeEmail: isEdit ? this.state.officeEmail : officeEmail,
      officePhone: isEdit ? this.state.officePhone : officePhone,
      owner: isEdit ? this.state.owner : owner,
    }
  }

  render() {
    const {
      country,
      fullName,
      name,
      generalMOQ,
      generalLeadTime,
      website,
      officeEmail,
      officePhone,
      owner,
      harbour,
      incoTerm,
      createdByName,
      lastUpdatedByName,
      assignedName,
    } = this.data

    return (
      <View style={styles.container}>
        {/* Alisa Name */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.AliasName, nodeRef)
          }}
          value={fullName}
          title={I18n.t('alisaName').toUpperCase()}
          onChangeText={this.onChangeText('fullName')}
          onEndEditing={this.onSubmit('fullName')}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.AliasName
          }}
        />

        {/* Legal Name */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.LegalName, nodeRef)
          }}
          value={name}
          title={I18n.t('legalName').toUpperCase()}
          onChangeText={this.onChangeText('name')}
          onEndEditing={this.onSubmit('name')}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.LegalName
          }}
        />

        {/* General MOQ */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.MOQ, nodeRef)
          }}
          value={generalMOQ}
          title={I18n.t('generalMOQ').toUpperCase()}
          onChangeText={this.onChangeText('generalMOQ')}
          onEndEditing={this.onSubmit('generalMOQ', 'number')}
          keyboardType={'number-pad'}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.MOQ
          }}
        />

        {/* General Lead Time */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.LeadTime, nodeRef)
          }}
          title={I18n.t('generalLeadTime').toUpperCase()}
          value={generalLeadTime}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText('generalLeadTime')}
          onEndEditing={this.onSubmit('generalLeadTime', 'number')}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.LeadTime
          }}
        />

        {/* Country */}
        <AInput
          title={I18n.t('country').toUpperCase()}
          value={SafeCountry.getCountryName(country)}
          onPress={() => {
            supplierNavigation.open(SupplierRef.SelectCountry)
          }}
          editable={false}
          // onFocusTextInput={() => {
          //   supplierNavigation.current = SupplierRef.SelectCountry
          // }}
        />

        {/* Web */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.Web, nodeRef)
          }}
          value={website}
          title={I18n.t('web').toUpperCase()}
          onChangeText={this.onChangeText('website')}
          onEndEditing={this.onSubmit('website')}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.Web
          }}
        />

        {/* Main E-Mail */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.Email, nodeRef)
          }}
          value={officeEmail}
          title={I18n.t('mainEMail').toUpperCase()}
          onChangeText={this.onChangeText('officeEmail')}
          onEndEditing={this.onSubmit('officeEmail')}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.Email
          }}
          keyboardType={'email-address'}
        />

        {/* Main Phone Number */}
        <AInput
          ref={nodeRef => {
            supplierNavigation.setRef(SupplierRef.PhoneNumber, nodeRef)
          }}
          title={I18n.t('mainPhoneNumber').toUpperCase()}
          value={officePhone}
          keyboardType={'numeric'}
          onChangeText={this.onChangeText('officePhone')}
          onEndEditing={this.onSubmit('officePhone', 'phone')}
          onFocusTextInput={() => {
            supplierNavigation.current = SupplierRef.PhoneNumber
          }}
        />

        {/* Owner */}
        <AInput
          // ref={nodeRef => {
          //   supplierNavigation.setRef(SupplierRef.Owner, nodeRef)
          // }}
          value={owner}
          title={I18n.t('owner').toUpperCase()}
          editable={false}
          onChangeText={this.onChangeText('owner')}
          // onEndEditing={this.onSubmit('owner')}
          // onFocusTextInput={() => {
          //   supplierNavigation.current = SupplierRef.Owner
          // }}
        />

        {/* Harbour */}
        <AInput
          title={I18n.t('harbour').toUpperCase()}
          value={harbour}
          editable={false}
          onPress={() => {
            supplierNavigation.open(SupplierRef.SelectHarbour)
          }}
        />

        {/* Incoterm */}
        <AInput
          title={I18n.t('incoTerm').toUpperCase()}
          value={incoTerm}
          editable={false}
          onPress={() => {
            supplierNavigation.open(SupplierRef.SelectIncoTerm)
          }}
        />

        {/* Assigned To */}
        <AInput
          title={I18n.t('assignedTo').toUpperCase()}
          value={assignedName}
          editable={false}
          onPress={() => {
            supplierNavigation.open(SupplierRef.SelectAssignee)
          }}
        />

        {/* Created By */}
        <AInput
          title={I18n.t('createdBy').toUpperCase()}
          value={createdByName}
          editable={false}
        />

        {/* Last Updated By */}
        <AInput
          title={I18n.t('lastUpdatedBy').toUpperCase()}
          value={lastUpdatedByName}
          editable={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: metrics.base,
    paddingBottom: metrics.triple_base,
  },
})
