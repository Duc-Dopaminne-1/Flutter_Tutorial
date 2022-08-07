import * as React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
} from 'react-native'
import { Supplier } from '@/models/team'
import { NavigationInjectedProps } from 'react-navigation'
import { colors, fonts, metrics } from '@/vars'
import { SafeSupplier } from '@/shared/supplier'
import { ATextCategory } from '@/components/AText/ATextCategory'
import I18n from '@/i18n'
import { ABooth } from '@/components/ABooth/ABooth'
import { HomeListSupplierListCardListImage } from './HomeListSupplierListCardListImage'
import { Subscription } from 'rxjs'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { ALabel } from '@/components/ALabel/ALabel'
import { AThumbnail2 } from '@/components/AThumbnail/AThumbnail2'
import { CacheResult } from '@/locals/models/cache-result'
import { Image } from '@/models/common'

type Props = {
  supplierId?: string
  supplier: Supplier
  currentIndex: number
} & Partial<NavigationInjectedProps<{}>> &
  AppContextState

export type State = Readonly<{
  uris: Image[]
  supplier: Supplier | null
  loading: boolean
}>

@withContext(AppContext.Consumer)
export class HomeListSupplierListCard extends React.PureComponent<
  Props,
  State
> {
  _subscription: Subscription | undefined
  _supplierChangeSubscription: Subscription | undefined
  _results: Realm.Results<Supplier> | undefined
  _imageResults: Realm.Results<CacheResult> | undefined
  _imageSubscription: Subscription | undefined
  _latestChange = false

  static readonly defaultProps = {
    modifications: [],
  }

  readonly state: State = {
    uris: [] as any,
    supplier: null,
    loading: true,
  }

  componentDidMount(): void {
    const { images } = new SafeSupplier(this.props.supplier)
    images.preload()
  }

  componentWillUnmount(): void {
    this._supplierChangeSubscription &&
      this._supplierChangeSubscription.unsubscribe()
  }

  render() {
    const { loading } = this.state
    const { onPress, supplier } = this.props

    if (loading && supplier === null) {
      return null
    }

    const {
      name,
      supplierTypeName,
      supplierLocation,
      categories,
      images,
      statusType,
      logoPlaceholder,
    } = new SafeSupplier(supplier)

    return (
      <TouchableHighlight
        style={styles.wrapItem}
        onPress={onPress}
        // activeOpacity={0.9}
        underlayColor={colors.light_grey}
      >
        <>
          <AThumbnail2
            // favorite={favorite}
            // image={logoImage}
            name={logoPlaceholder}
            containerStyle={styles.thumbnailCustom}
          />

          <View style={styles.wrapContain}>
            <Text numberOfLines={2} style={styles.nameSupplier}>
              {name}
            </Text>

            <View style={styles.wrapSupplier}>
              <ATextCategory
                primaryText={I18n.t(supplierTypeName.toLowerCase(), {
                  defaultValue: supplierTypeName,
                })}
                secondaryText={supplierLocation}
                spaceSize={0}
                primaryStyle={styles.primary}
                dotStyle={styles.dot}
                secondaryStyle={styles.secondary}
              />
            </View>

            {categories.data.length > 0 && (
              <ABooth
                containerStyle={styles.wrapTypeSupplier}
                booths={categories.data}
                currentWidth={200}
              />
            )}

            {statusType.hasLabel && (
              <ALabel
                backgroundColor={statusType.background}
                label={statusType.name}
                color={statusType.color}
                wrapperStyle={styles.labelCustom}
              />
            )}

            {!images.isEmpty && (
              <HomeListSupplierListCardListImage
                supplier={supplier}
                images={images.all}
              />
            )}
          </View>
        </>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create<any>({
  wrapContain: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  wrapItem: {
    flexDirection: 'row',
    overflow: 'hidden',
    borderBottomColor: colors.pale_grey,
    borderBottomWidth:
      metrics.home_screen_suppliers_list_card_item_border_bottom_width,
    paddingLeft: metrics.home_screen_margin_edge,
    paddingTop: metrics.home_screen_margin_edge,
    paddingBottom: metrics.home_screen_margin_edge,
  },
  wrapSupplier: {
    flexDirection: 'row',
    marginTop: metrics.home_screen_suppliers_country_margin_vertical,
  },
  nameSupplier: {
    color: colors.black,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
  },
  wrapTypeSupplier: {
    height: metrics.home_screen_suppliers_wrap_type_suppliers_height,
    // marginBottom:
    //   metrics.home_screen_suppliers_wrap_type_suppliers_margin_bottom,
  },
  primary: {
    color: colors.orange_yellow,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
  dot: {
    color: colors.medium_gray,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
  secondary: {
    color: colors.medium_gray,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
  labelCustom: {
    marginTop: 8,
  },
  thumbnailCustom: {
    height: 48,
    width: 48,
  },
})
