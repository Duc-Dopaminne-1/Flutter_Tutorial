import I18n from '@/i18n'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { AInput } from '@/components/AInput/AInput'
import {
  contactNavigation,
  ContactNavigationRef,
} from '@/navigation/contactNavigation'

type Props = Readonly<{
  onChangeText: (key: string) => (value: string) => void
  onEndEditing: (key: string) => () => void
  onSubmitEditing: () => void
  name: string
  jobTitle: string
  email: string
  phoneNumber: string
  supplierName: string
}>

export class CreateContactForm extends React.PureComponent<Props> {
  render() {
    const {
      onChangeText,
      onEndEditing,
      onSubmitEditing,
      name,
      jobTitle,
      email,
      phoneNumber,
      supplierName,
    } = this.props

    return (
      <>
        {/* Name */}
        <AInput
          ref={nodeRef => {
            contactNavigation.setRef(ContactNavigationRef.Name, nodeRef)
          }}
          title={I18n.t('name').toUpperCase()}
          value={name}
          returnKeyType={'done'}
          onChangeText={onChangeText('name')}
          onEndEditing={onEndEditing('name')}
          onSubmitEditing={onSubmitEditing}
          onFocusTextInput={() => {
            contactNavigation.current = ContactNavigationRef.Name
          }}
        />

        {/* Function */}
        <AInput
          ref={nodeRef => {
            contactNavigation.setRef(ContactNavigationRef.Function, nodeRef)
          }}
          title={I18n.t('function').toUpperCase()}
          value={jobTitle}
          returnKeyType={'done'}
          onChangeText={onChangeText('jobTitle')}
          onEndEditing={onEndEditing('jobTitle')}
          onSubmitEditing={onSubmitEditing}
          onFocusTextInput={() => {
            contactNavigation.current = ContactNavigationRef.Function
          }}
        />

        {/* Email */}
        <AInput
          ref={nodeRef => {
            contactNavigation.setRef(ContactNavigationRef.Email, nodeRef)
          }}
          title={I18n.t('email').toUpperCase()}
          value={email}
          returnKeyType={'done'}
          keyboardType={'email-address'}
          onChangeText={onChangeText('email')}
          onEndEditing={onEndEditing('email')}
          onSubmitEditing={onSubmitEditing}
          onFocusTextInput={() => {
            contactNavigation.current = ContactNavigationRef.Email
          }}
        />

        {/* Phone Number */}
        <AInput
          ref={nodeRef => {
            contactNavigation.setRef(ContactNavigationRef.PhoneNumber, nodeRef)
          }}
          title={I18n.t('phoneNumber').toUpperCase()}
          value={phoneNumber}
          returnKeyType={'done'}
          keyboardType={'numeric'}
          onChangeText={onChangeText('phoneNumber')}
          onEndEditing={onEndEditing('phoneNumber')}
          onSubmitEditing={onSubmitEditing}
          onFocusTextInput={() => {
            contactNavigation.current = ContactNavigationRef.PhoneNumber
          }}
        />

        {/* Supplier Picker */}
        <AInput
          title={I18n.t('supplier').toUpperCase()}
          value={supplierName}
          returnKeyType={'done'}
          editable={false}
          onPress={() => {
            contactNavigation.open(ContactNavigationRef.SelectSupplier)
          }}
        />
      </>
    )
  }
}

const styles = StyleSheet.create<any>({})
