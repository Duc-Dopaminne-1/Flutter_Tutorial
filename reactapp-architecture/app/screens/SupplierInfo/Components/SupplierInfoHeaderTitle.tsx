import * as React from 'react'
import { Image, ImageRequireSource, StyleSheet, Text, View } from 'react-native'
import { withContext } from '@/shared/withContext'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { SafeSupplier } from '@/shared/supplier'
import { Supplier } from '@/models/team'
import { colors, fonts, images, metrics } from '@/vars'
import { ABooth } from '@/components/ABooth/ABooth'
import I18n from '@/i18n'

type SupplierInfoHeaderTitleProps = Readonly<{
  supplier?: Supplier
}>

@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoHeaderTitle extends React.PureComponent<
  SupplierInfoHeaderTitleProps
> {
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
    const { categories } = new SafeSupplier(this.props.supplier)

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
    const { name, supplierTypeName, supplierLocation } = new SafeSupplier(
      this.props.supplier
    )

    return (
      <View style={styles.container}>
        <Text style={styles.supplierName} numberOfLines={2}>
          {name}
        </Text>

        <View style={styles.wrapInformation}>
          {this.renderInformation(
            images.company,
            colors.background_violet,
            I18n.t(supplierTypeName.toLowerCase(), {
              defaultValue: supplierTypeName,
            })
          )}
          {this.renderInformation(
            images.location,
            colors.light_blue_grey,
            supplierLocation
          )}
          {this.renderCategory}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    paddingTop: metrics.medium_base,
  },
  supplierName: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapInformation: {
    marginTop: metrics.medium_base,
    borderBottomWidth: 1,
    borderBottomColor: colors.background_gray,
    paddingBottom: 20,
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: metrics.base,
  },
  wrapIcon: {
    height: 16,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginRight: metrics.base,
  },
  icon: {
    height: 10,
    width: 10,
    tintColor: colors.white,
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
    color: colors.blue_light_grey,
  },
  wrapCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCategoryContainer: {
    height: 20,
  },
})
