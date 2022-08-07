import { SupplierCardType } from '@/cards/Supplier/SupplierCardType'
import { ABooth } from '@/components/ABooth/ABooth'
import { ALabel } from '@/components/ALabel/ALabel'
import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import { SafeSupplier } from '@/shared/supplier'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native'
import { AThumbnail2 } from '@/components/AThumbnail/AThumbnail2'
import { navigation } from '@/navigation/navigation'
import { SafeImage } from '@/shared/image'
import { isIpad } from '@/shared/devices'
import { supplierStore } from '@/stores/supplierStore'
import { debounce } from 'lodash'

const PADDING_BTW_ICON_AND_CONTENT = 200

const initialState = {}

type SupplierCardProps = {
  supplier: Supplier
  currentIndex?: number
  selected?: boolean
  onPress?: () => void
  fromSupplierList?: boolean
  fromMultiSearchAll?: boolean
}

type SupplierCardState = {}

export class SupplierCard extends React.PureComponent<
  SupplierCardProps,
  SupplierCardState
> {
  static defaultProps = {
    onPress: () => {},
    fromSupplierList: false,
    currentIndex: 0,
  }

  readonly state: SupplierCardState = initialState

  componentDidMount(): void {
    const { images } = new SafeSupplier(this.props.supplier)
    images.preload()
  }

  onPressCard = debounce(() => {
    const { supplier, currentIndex, fromSupplierList, onPress } = this.props

    if (!fromSupplierList) {
      onPress && onPress()
      return
    }

    if (!isIpad()) {
      navigation.navigate('SupplierInfoScreen', {
        supplierId: supplier.id,
      })
    } else {
      supplierStore.select().next({
        item: supplier,
        index: currentIndex,
      })
    }
  }, 250)

  render() {
    const { supplier, selected, fromMultiSearchAll } = this.props

    const safeSupplier = new SafeSupplier(supplier)
    const {
      logoImage,
      name,
      favorite,
      supplierTypeName,
      supplierLocation,
      categories,
      statusType,
      safeStatus,
      logoPlaceholder,
    } = safeSupplier

    const statusDotColor = safeStatus.color
    const statusNumber = safeStatus.number
    const statusLabel = safeStatus.formattedLabel
    const { uri } = new SafeImage(logoImage.uri)
    const cardStyle = fromMultiSearchAll ? styles.multiSearchCard : styles.card
    const thumbnailStyle = fromMultiSearchAll ? styles.thumbnail : {}

    return (
      <TouchableHighlight
        style={[
          cardStyle,
          {
            backgroundColor: selected ? colors.primary_blue : colors.white,
          },
        ]}
        underlayColor={colors.light_grey}
        onPress={() => this.onPressCard()}
      >
        <>
          <AThumbnail2
            containerStyle={thumbnailStyle}
            favorite={favorite}
            name={logoPlaceholder}
            image={uri}
          />

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>
              {name}
            </Text>

            <SupplierCardType
              name={I18n.t(supplierTypeName.toLowerCase(), {
                defaultValue: supplierTypeName,
              })}
              location={supplierLocation}
            />

            {categories.data.length > 0 && (
              <ABooth
                booths={categories.data}
                currentWidth={PADDING_BTW_ICON_AND_CONTENT}
              />
            )}

            <View style={styles.wrapperSample}>
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: statusDotColor.background,
                  },
                ]}
              />
              <Text style={styles.sample}>
                {statusNumber ? `${statusNumber}.` : ''} {statusLabel}
              </Text>
            </View>
          </View>
        </>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create<any>({
  sample: {
    fontSize: fonts.size.s,
    marginLeft: 4,
    color: colors.text_grey,
  },
  dot: {
    width: metrics.prod_card_dot_size,
    height: metrics.prod_card_dot_size,
    borderRadius: metrics.prod_card_dot_size / 2,
    backgroundColor: colors.dot,
  },
  wrapperSample: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    paddingVertical: metrics.prod_card_content_padding_vertical,
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  multiSearchCard: {
    flexDirection: 'row',
    paddingVertical: metrics.prod_card_content_padding_vertical,
    paddingHorizontal: metrics.keylines_screen_edge_margin_multi_search,
    overflow: 'hidden',
    backgroundColor: colors.primary,
  },
  thumbnail: {
    width: metrics.supplier_card_img_size_multi_search,
    height: metrics.supplier_card_img_size_multi_search,
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
