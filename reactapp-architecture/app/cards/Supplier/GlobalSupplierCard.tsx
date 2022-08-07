import { SupplierCardType } from '@/cards/Supplier/SupplierCardType'
import { ABooth } from '@/components/ABooth/ABooth'
import { ALabel } from '@/components/ALabel/ALabel'
import I18n from '@/i18n'
import { SafeSupplier } from '@/shared/supplier'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { AThumbnail2 } from '@/components/AThumbnail/AThumbnail2'
import { Booth } from '@/models/global'
import { SafeBooth } from '@/shared/booth'

const PADDING_BTW_ICON_AND_CONTENT = 200

const initialState = {}

type Props = {
  booths: Booth
  mySupplier: any
  onPress(): void
  selected?: boolean
  isGlobalSupplier?: boolean
}

type State = {}

export class GlobalSupplierCard extends React.Component<Props, State> {
  readonly state: State = initialState

  componentDidMount() {
    const { booths } = this.props
    const { supplier } = new SafeBooth(booths)
    const { images } = new SafeSupplier(supplier)
    images.preload()
  }

  shouldComponentUpdate(
    nextProps: Readonly<Props>,
    _nextState: Readonly<State>,
    _nextContext: any
  ) {
    /**
     * Check booths
     */
    const convertCurrentBooths = JSON.stringify(this.props.booths)
    const convertNextBooths = JSON.stringify(nextProps.booths)

    if (convertCurrentBooths !== convertNextBooths) return true

    /**
     * Check mySupplier
     */
    const convertCurrentMySupplier = JSON.stringify(this.props.mySupplier)
    const convertNextMySupplier = JSON.stringify(nextProps.mySupplier)

    if (convertCurrentMySupplier !== convertNextMySupplier) return true

    /**
     * Check isGlobalSupplier
     */
    const convertCurrentIsGlobalSupplier = JSON.stringify(
      this.props.isGlobalSupplier
    )
    const convertNextIsGlobalSupplier = JSON.stringify(
      nextProps.isGlobalSupplier
    )

    if (convertCurrentIsGlobalSupplier !== convertNextIsGlobalSupplier) {
      return true
    }

    /**
     * Check selected
     */
    const convertCurrentSelected = JSON.stringify(this.props.selected)
    const convertNextSelected = JSON.stringify(nextProps.selected)

    if (convertCurrentSelected !== convertNextSelected) return true

    return false
  }

  get renderThumbnail() {
    const { booths, isGlobalSupplier, mySupplier } = this.props
    const safeBooth = new SafeBooth(booths)
    const supplier = mySupplier ? mySupplier : safeBooth.supplier
    const { favorite, logoPlaceholder } = new SafeSupplier(supplier)

    return (
      <AThumbnail2
        favorite={favorite}
        name={logoPlaceholder}
        containerStyle={
          isGlobalSupplier && { backgroundColor: colors.pale_grey }
        }
        textStyle={isGlobalSupplier && { color: colors.blue_light_grey }}
      />
    )
  }

  get renderName() {
    const { booths } = this.props
    const { supplier } = new SafeBooth(booths)
    const { name } = new SafeSupplier(supplier)

    return (
      <Text style={styles.title} numberOfLines={2}>
        {name}
      </Text>
    )
  }

  get renderSupplierCardType() {
    const { booths } = this.props
    const { supplier } = new SafeBooth(booths)
    const { supplierTypeName, supplierLocation } = new SafeSupplier(supplier)

    return (
      <SupplierCardType
        name={I18n.t(supplierTypeName.toLowerCase(), {
          defaultValue: supplierTypeName,
        })}
        location={supplierLocation}
      />
    )
  }

  get renderCategory() {
    const { booths } = this.props
    const { supplier } = new SafeBooth(booths)
    const { categories } = new SafeSupplier(supplier)

    if (categories.data.length <= 0) return null

    return (
      <ABooth
        booths={categories.data}
        currentWidth={PADDING_BTW_ICON_AND_CONTENT}
      />
    )
  }

  get renderLabel() {
    const { booths } = this.props
    const { supplier } = new SafeBooth(booths)
    const { statusType } = new SafeSupplier(supplier)

    if (!statusType.hasLabel) return null

    return (
      <ALabel
        backgroundColor={statusType.background}
        label={statusType.name}
        color={statusType.color}
      />
    )
  }

  get renderBooth() {
    const { booths } = this.props
    const { boothName } = new SafeBooth(booths)

    return (
      <ABooth
        booths={[{ name: boothName }]}
        currentWidth={PADDING_BTW_ICON_AND_CONTENT}
        isDisplayBooth={true}
      />
    )
  }

  render() {
    const { onPress, selected } = this.props

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: selected ? colors.primary_blue : colors.white,
          },
        ]}
        onPress={onPress}
      >
        {this.renderThumbnail}

        <View style={styles.content}>
          {this.renderName}
          {this.renderSupplierCardType}
          {this.renderCategory}
          {this.renderLabel}
          {this.renderBooth}
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
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
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
    height: 24,
    width: 24,
    tintColor: colors.light_blue_grey,
  },
  category: {
    fontSize: fonts.size.m,
    color: colors.text_category_type,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapBooth: {
    marginTop: 4,
  },
})
