import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { GlobalSupplierInfoContext } from '../GlobalSupplierInfoContext'
import { SafeCountry } from '@/shared/country'
import { withContext } from '@/shared/withContext'
import { metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { GlobalSupplierInfoFormText } from './GlobalSupplierInfoFormText'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'
import { SafeGlobalSupplier } from '@/shared/globalSupplier'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{
  booth?: Booth
}> &
  DefaultProps &
  AppContextState

export type State = Readonly<typeof initialState>

@withContext(GlobalSupplierInfoContext.Consumer)
export class GlobalSupplierInfoForm extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    const { booth } = this.props
    const { supplier } = new SafeBooth(booth)
    const {
      name,
      fullName,
      country,
      website,
      officeEmail,
      officePhone,
    } = new SafeGlobalSupplier(supplier)

    return (
      <View style={styles.container}>
        {/* Alisa Name */}
        <GlobalSupplierInfoFormText
          value={fullName}
          title={I18n.t('alisaName').toUpperCase()}
        />

        {/* Legal Name */}
        <GlobalSupplierInfoFormText
          value={name}
          title={I18n.t('legalName').toUpperCase()}
        />

        {/* General MOQ */}
        <GlobalSupplierInfoFormText
          value={''}
          title={I18n.t('generalMOQ').toUpperCase()}
        />

        {/* General Lead Time */}
        <GlobalSupplierInfoFormText
          title={I18n.t('generalLeadTime').toUpperCase()}
          value={''}
        />

        {/* Country */}
        <GlobalSupplierInfoFormText
          title={I18n.t('country').toUpperCase()}
          value={SafeCountry.getCountryName(country)}
        />

        {/* Web */}
        <GlobalSupplierInfoFormText
          value={website}
          title={I18n.t('web').toUpperCase()}
        />

        {/* Main E-Mail */}
        <GlobalSupplierInfoFormText
          value={officeEmail}
          title={I18n.t('mainEMail').toUpperCase()}
        />

        {/* Main Phone Number */}
        <GlobalSupplierInfoFormText
          title={I18n.t('mainPhoneNumber').toUpperCase()}
          value={officePhone}
        />

        {/* Owner */}
        <GlobalSupplierInfoFormText
          value={''}
          title={I18n.t('owner').toUpperCase()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: metrics.global_info_detail_info_form_container_margin_top,
  },
})
