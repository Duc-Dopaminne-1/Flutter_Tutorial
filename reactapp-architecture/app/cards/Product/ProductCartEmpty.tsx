import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import * as React from 'react'
import { fonts, metrics } from '@/vars'
import I18n from '@/i18n'
import { AIndicator } from '@/components/AIndicator/AIndicator'

type ProductCardEmptyProps = {
  loading: boolean
  title: string
  containerStyle?: StyleProp<ViewStyle>
}

export const ProductCardEmpty: React.SFC<ProductCardEmptyProps> = ({
  loading,
  title,
}) => {
  if (loading) {
    return <AIndicator full />
  }

  return (
    <View style={styles.center}>
      <Text style={styles.text}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    paddingTop: metrics.triple_base,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.size.m,
  },
})
