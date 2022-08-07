import React from 'react'
import styles from './styles'
import { CustomText } from '../CustomText'
import { ViewStyle } from 'react-native'

type Props = {
  errorValue: string | false | undefined
  style?: ViewStyle
}

const ErrorMessage = ({ errorValue, style }: Props) => (
  <CustomText
    styleContainer={styles.container}
    style={[styles.errorText, style]}
    text={errorValue ? errorValue : ''}
  />
)

export default ErrorMessage
