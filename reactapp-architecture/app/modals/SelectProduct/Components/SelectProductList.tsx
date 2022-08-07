import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import { ATextCategory } from '@/components/AText/ATextCategory'
import { LImage } from '@/libs/LImage'
import { Product } from '@/models/team'
import { SafeProduct } from '@/shared/product'
import { colors, fonts, images, metrics } from '@/vars'

type Props = {
  onPress: (product: Product) => void
  product: Product
}

export class SelectProductList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    product: [],
  }

  componentDidMount(): void {
    const { images } = new SafeProduct(this.props.product)
    images.preload()
  }

  render() {
    const { product, onPress } = this.props

    const {
      supplierName,
      categoryName,
      favorite,
      images: { uri, first },
      name,
    } = new SafeProduct(product)
    return (
      <TouchableOpacity style={styles.card} onPress={() => onPress(product)}>
        <>
          <View style={[styles.thumbnail, { overflow: 'hidden' }]}>
            <LImage
              source={{
                uri,
                id: first.id,
                downsampling: 200,
              }}
              style={styles.thumbnail}
            />
          </View>

          {favorite && (
            <View style={styles.wrapHeartIcon}>
              <Image
                source={images.heart}
                style={{ tintColor: colors.white }}
              />
            </View>
          )}
        </>

        <View style={styles.content}>
          <Text style={styles.title}>{name}</Text>
          <ATextCategory
            primaryText={categoryName}
            secondaryText={supplierName}
            spacer={'bottom'}
          />
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create<any>({
  card: {
    flexDirection: 'row',
    paddingVertical: metrics.prod_card_content_padding_vertical,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    backgroundColor: colors.white,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: metrics.prod_card_border_radius,
    marginRight: metrics.prod_card_padding_btw_content_and_img,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    marginBottom: 5,
  },
  wrapHeartIcon: {
    position: 'absolute',
    marginLeft: 18,
    marginTop: 19,
  },
})
