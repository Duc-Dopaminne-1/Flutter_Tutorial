import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { devices, deviceWidth, fonts, images, metrics } from '@/vars'

export class ProductItem extends React.PureComponent<any, any> {
  readonly state = {}

  componentDidMount(): void {}

  componentWillUnmount(): void {}

  render() {
    const { product } = this.props

    return (
      <View
        style={{
          width: deviceWidth,
          flexDirection: 'row',
          paddingVertical: metrics.prod_card_content_padding_vertical,
          paddingHorizontal: metrics.keylines_screen_edge_margin
        }}>
        <>
          <View style={[styles.thumbnail, { overflow: 'hidden' }]}>
            <Image
              source={
                product.avatar ? { uri: product.avatar } : images.default_avatar
              }
              style={styles.thumbnail}
            />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>name: {product.name}</Text>
            <Text style={styles.title}>email: {product.email}</Text>
            <Text style={styles.title}>OS: {product.OS}</Text>
          </View>
        </>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  thumbnail: {
    width: metrics.prod_card_img_size,
    height: metrics.prod_card_img_size,
    borderRadius: metrics.prod_card_border_radius,
    marginRight: metrics.prod_card_padding_btw_content_and_img,
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    width: 200,
    flexWrap: 'wrap',
    marginRight: 27,
    marginTop: -2
  },
  title: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
    marginBottom: 5,
    color: 'white'
  }
})
