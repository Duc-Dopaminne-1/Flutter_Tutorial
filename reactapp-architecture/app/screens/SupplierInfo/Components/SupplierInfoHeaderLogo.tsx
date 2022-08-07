import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { withContext } from '@/shared/withContext'
import { SupplierInfoContext } from '../SupplierInfoContext'
import { SafeSupplier } from '@/shared/supplier'
import { Supplier } from '@/models/team'
import { SafeImage } from '@/shared/image'
import { images } from '@/vars/index'

type SupplierInfoHeaderLogoProps = Readonly<{
  supplier?: Supplier
}>

@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoHeaderLogo extends React.PureComponent<
  SupplierInfoHeaderLogoProps
> {
  render() {
    const { logoPlaceholder, logoImage } = new SafeSupplier(this.props.supplier)
    const { uri } = new SafeImage(logoImage.uri)
    return (
      <View style={styles.container}>
        <View style={styles.wrapText}>
          {uri ? (
            <Image
              source={{ uri }}
              defaultSource={images.missingImage}
              style={styles.wrapperImage}
            />
          ) : (
            <Text style={styles.text}>{logoPlaceholder}</Text>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    position: 'absolute',
    top: -45,
    left: 12,
    height: 84,
    width: 84,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: metrics.base,
    borderRadius: metrics.small_base,
  },
  wrapText: {
    height: 74,
    width: 74,
    borderRadius: metrics.small_base,
    backgroundColor: colors.background_violet,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPBold,
    color: colors.white,
  },
  wrapperImage: {
    height: 74,
    width: 74,
  },
})
