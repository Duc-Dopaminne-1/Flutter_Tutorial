import * as React from 'react'
import { Image, ImageRequireSource, StyleSheet, Text, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { GlobalSupplierInfoContext } from '../GlobalSupplierInfoContext'
import { SafeSupplier } from '@/shared/supplier'
import { colors, fonts, images, metrics } from '@/vars'
import { ABooth } from '@/components/ABooth/ABooth'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'
import { SafeGlobalSupplier } from '@/shared/globalSupplier'

type props = Readonly<{
  booth?: Booth
}>

@withContext(GlobalSupplierInfoContext.Consumer)
export class GlobalSupplierInfoHeaderTitle extends React.PureComponent<props> {
  renderInformation = (
    icon: ImageRequireSource,
    background: string,
    text: string
  ) => {
    if (text.length <= 0) return null

    return (
      <View style={styles.wrapItem}>
        <View style={[styles.wrapIcon, { backgroundColor: background }]}>
          <Image
            source={icon}
            // @ts-ignore
            resizeMode={'contain'}
            style={styles.icon}
          />
        </View>

        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </View>
    )
  }

  get renderCategory() {
    const { booth } = this.props
    const { supplier } = new SafeBooth(booth)
    const { categories } = new SafeSupplier(supplier)

    if (!categories.hasText) return null

    return (
      <View style={styles.wrapCategory}>
        <View
          style={[
            styles.wrapIcon,
            { backgroundColor: colors.category_orange_yellow },
          ]}
        >
          <Image
            source={images.category}
            resizeMethod={'resize'}
            style={styles.icon}
          />
        </View>
        <ABooth
          booths={categories.data}
          containerStyle={styles.customCategoryContainer}
          textStyle={styles.text}
          currentWidth={200}
        />
      </View>
    )
  }

  render() {
    const { booth } = this.props
    const { supplier } = new SafeBooth(booth)
    const { name, type, city } = new SafeGlobalSupplier(supplier)

    return (
      <View style={styles.container}>
        <Text style={styles.supplierName} numberOfLines={2}>
          {name}
        </Text>

        <View style={styles.wrapInformation}>
          {this.renderInformation(
            images.company,
            colors.background_violet,
            type
          )}
          {this.renderInformation(
            images.location,
            colors.light_blue_grey,
            city
          )}
          {this.renderCategory}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingTop: metrics.global_info_header_title_container_padding_top,
  },
  supplierName: {
    color: colors.black,
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapInformation: {
    paddingTop: metrics.global_info_header_title_wrap_information_margin_top,
    paddingBottom:
      metrics.global_info_header_title_wrap_information_padding_bottom,
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.global_info_header_title_wrap_item_margin_bottom,
    paddingRight: metrics.keylines_screen_edge_margin,
  },
  wrapIcon: {
    height: metrics.global_info_header_title_wrap_icon_height,
    width: metrics.global_info_header_title_wrap_icon_width,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.global_info_header_title_border_radius,
    marginRight: metrics.base,
  },
  icon: {
    height: metrics.global_info_header_title_icon_height,
    width: metrics.global_info_header_title_icon_width,
    tintColor: colors.white,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.black_blue_text,
  },
  wrapCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCategoryContainer: {
    height: 0,
  },
})
