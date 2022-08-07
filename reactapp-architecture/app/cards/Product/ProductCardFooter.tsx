import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import * as React from 'react'
import { metrics } from '@/vars'

type ProductCardFooterProps = {
  loading: boolean
  containerStyle?: StyleProp<ViewStyle>
}

export const ProductCardFooter: React.SFC<ProductCardFooterProps> = ({
  loading,
  containerStyle,
}) => {
  if (loading) {
    return (
      <View style={[styles.container, containerStyle]}>
        <AIndicator />
      </View>
    )
  }
  return null
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: metrics.home_latest_product_image_size,
    height: metrics.home_latest_product_image_size,
  },
})
