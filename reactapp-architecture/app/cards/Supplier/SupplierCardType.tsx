import { colors } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text } from 'react-native'

type SupplierCardTypeProps = {
  name: string
  location: string
}

export const SupplierCardType: React.SFC<SupplierCardTypeProps> = ({
  name,
  location,
}) => {
  if (!name && !location) return null

  return (
    <Text style={styles.primary} numberOfLines={2}>
      {name && <Text>{name}</Text>}
      {name && location && <Text style={styles.text}> • </Text>}
      {location && <Text style={styles.text}>{location}</Text>}
    </Text>
  )
}

const styles = StyleSheet.create({
  primary: {
    color: colors.orange_yellow,
    marginTop: 4,
  },
  text: {
    color: colors.text_grey,
  },
})
