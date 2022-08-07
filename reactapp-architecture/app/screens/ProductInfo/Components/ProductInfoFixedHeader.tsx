import { selectPlatform } from '@/shared/devices'
import { colors, images } from '@/vars'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { withContext } from '@/shared/withContext'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { AHeaderFixed } from '@/components/AHeader/AHeaderFixed'
import { SafeProduct } from '@/shared/product'

type Props = Readonly<{
  safeProduct?: SafeProduct
  like?: boolean
  asComponent?: any
  headerVisible?: any
  onLike?: () => void
  onPressIconLeft?: () => void
}>

@withContext(ProductInfoContext.Consumer)
export class ProductInfoFixedHeader extends React.PureComponent<Props> {
  render() {
    const {
      safeProduct,
      like,
      asComponent,
      headerVisible,
      onLike,
      onPressIconLeft,
    } = this.props

    return (
      <AHeaderFixed
        title={!headerVisible && safeProduct.name}
        iconLeft={asComponent ? null : images.leftChevron}
        iconRight={like ? images.heart : images.heartEmpty}
        onPressIconRight={onLike}
        onPressIconLeft={onPressIconLeft}
        color={
          headerVisible
            ? [colors.black, colors.transparent]
            : [
                selectPlatform(
                  {
                    iPad: colors.background,
                    default: colors.white,
                  },
                  !asComponent
                ),
                selectPlatform(
                  {
                    iPad: colors.background,
                    default: colors.white,
                  },
                  !asComponent
                ),
              ]
        }
        titleStyle={
          !headerVisible && {
            color: colors.black,
            fontWeight: selectPlatform<any>({
              iPad: '400',
              default: '600',
            }),
          }
        }
        iconLeftStyle={!headerVisible && { tintColor: colors.black }}
        iconLeftTextStyle={!headerVisible && { color: colors.black }}
        iconRightStyle={!headerVisible && { tintColor: colors.black }}
        containerStyle={!headerVisible && styles.customHeader}
      />
    )
  }
}

const styles = StyleSheet.create({
  customHeader: {
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
})
