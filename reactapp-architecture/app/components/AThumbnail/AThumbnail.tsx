import { ARibbon } from '@/components/ARibbon/ARibbon'
import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import {
  Image as RNImage,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native'

type AThumbnailProps = Readonly<{
  favorite?: boolean
  source?: ImageSourcePropType
}>

export const AThumbnail: React.SFC<AThumbnailProps> = ({
  source,
  favorite,
}) => {
  return (
    <React.Fragment>
      <View style={styles.thumbnail}>
        <RNImage
          source={source}
          // imageId={thumbnailId}
          // size={IMAGE_SIZE.M}
          // onError={this.onError}
          style={styles.thumbnailImage}
        />
      </View>
      {favorite && <ARibbon />}
    </React.Fragment>
  )
}

AThumbnail.defaultProps = {
  source: images.supplier,
  favorite: false,
}

const styles = StyleSheet.create<any>({
  thumbnail: {
    width: metrics.supplier_card_img_size,
    height: metrics.supplier_card_img_size,
    marginRight: metrics.supplier_card_padding_btw_content_and_img,
    backgroundColor: colors.light_white_gray,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailImage: {
    height: metrics.thumbnail_image_height,
    width: metrics.thumbnail_image_width,
    tintColor: colors.light_blue_grey,
  },
})
