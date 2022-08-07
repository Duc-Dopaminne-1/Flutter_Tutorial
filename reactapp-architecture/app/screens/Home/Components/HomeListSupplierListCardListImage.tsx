import * as React from 'react'
import { Subscription } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'
import { FlatList, StyleSheet, View } from 'react-native'
import { metrics } from '@/vars'
import { Supplier } from '@/models/team'
import { Image } from '@/models/common'
import { LImage } from '@/libs/LImage'
import { SafeImage } from '@/shared/image'

type Props = {
  images: Image[]
  supplier: Supplier
}

export type State = Readonly<{}>

export class HomeListSupplierListCardListImage extends React.PureComponent<
  Props,
  State
> {
  _subscription: Subscription | undefined
  _results: Realm.Results<CacheResult> | undefined

  renderImageItem = ({ item, index }: { item: Image; index: number }) => {
    if (index >= 6) return null

    const { uri, id } = new SafeImage(item)
    return (
      <View style={styles.wrapImageDetail}>
        <LImage
          source={{
            id,
            uri,
            downsampling: 200,
          }}
          style={styles.imageDetails}
          scaleMode={'scaleAspectFill'}
        />
      </View>
    )
  }

  render() {
    const { images } = this.props

    if (images.length === 0) {
      return null
    }

    return (
      <FlatList
        data={images}
        extraData={images}
        keyExtractor={item => item.id}
        renderItem={this.renderImageItem}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.flatListImageDetail}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  flatListImageDetail: {
    marginTop: 10,
  },
  wrapImageDetail: {
    marginRight: metrics.home_screen_suppliers_wrap_image_margin_right,
    width: metrics.home_screen_image_detail_size,
    height: metrics.home_screen_image_detail_size,
    overflow: 'hidden',
  },
  imageDetails: {
    width: metrics.home_screen_image_detail_size,
    height: metrics.home_screen_image_detail_size,
    borderRadius: metrics.home_screen_suppliers_wrap_image_detail_border_radius,
  },
})
