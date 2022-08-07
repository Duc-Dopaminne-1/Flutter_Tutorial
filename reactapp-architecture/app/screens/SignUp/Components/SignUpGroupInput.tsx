import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { metrics } from '@/vars'
import { AInput } from '@/components/AInput/AInput'

// init state
const initialState = {}

// default props
const defaultProps = {
  name: '',
  password: '',
  phoneNumber: '',
}

// define type
type DefaultProps = typeof defaultProps

type SignUpInputProps = {
  onChangeText: (key: string) => (text: string) => void
  name: string
  password: string
  phoneNumber: string
  firstName: string
  lastName: string
} & DefaultProps

export type SignUpInputState = Readonly<typeof initialState>

export class SignUpGroupInput extends React.PureComponent<
  SignUpInputProps,
  SignUpInputState
> {
  readonly state: SignUpInputState = initialState

  render() {
    const {
      onChangeText,
      name,
      password,
      phoneNumber,
      firstName,
      lastName,
    } = this.props

    return (
      <View style={styles.container}>
        {/* Name */}
        <AInput
          title={'EMAIL'}
          value={name}
          containerStyle={styles.inputContainer}
          onChangeText={onChangeText('username')}
          keyboardType={'email-address'}
        />

        {/* password */}
        <AInput
          title={'PASSWORD'}
          value={password}
          containerStyle={styles.inputContainer}
          secureTextEntry={true}
          onChangeText={onChangeText('password')}
        />

        {/* phoneNumber */}
        <AInput
          title={'PHONE NUMBER'}
          value={phoneNumber}
          containerStyle={styles.inputContainer}
          onChangeText={onChangeText('phoneNumber')}
          keyboardType={'numeric'}
          maxLength={14}
        />

        {/* email */}
        {/*<AInput*/}
        {/*title={'EMAIL'}*/}
        {/*value={email}*/}
        {/*containerStyle={styles.inputContainer}*/}
        {/*onChangeText={onChangeText('email')}*/}
        {/*keyboardType={'email-address'}*/}
        {/*/>*/}

        {/* firstName */}
        <AInput
          title={'FIRST NAME'}
          value={firstName}
          containerStyle={styles.inputContainer}
          onChangeText={onChangeText('firstName')}
        />

        {/* lastName */}
        <AInput
          title={'LAST NAME'}
          value={lastName}
          containerStyle={styles.inputContainer}
          onChangeText={onChangeText('lastName')}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    marginTop: metrics.keylines_screen_edge_margin,
  },
  inputContainer: {
    flex: 0,
    marginTop: metrics.base,
  },
})
