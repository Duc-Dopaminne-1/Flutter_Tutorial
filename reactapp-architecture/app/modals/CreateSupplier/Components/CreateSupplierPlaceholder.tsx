import I18n from '@/i18n'
import { colors, fonts, images } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'

export const CreateSupplierPlaceholder = () => {
  return (
    <View style={styles.emptyContainer}>
      <Image
        source={images.typo}
        style={styles.emptyTypo}
        resizeMode={'contain'}
      />
      <Text style={styles.emptyText}>{I18n.t('typeTheNameSupplier')}</Text>
    </View>
  )
}

const styles = StyleSheet.create<any>({
  emptyContainer: {
    flex: 1,
    paddingTop: 78,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  emptyText: {
    fontSize: fonts.size.xl,
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
    paddingHorizontal: 25,
    textAlign: 'center',
    paddingTop: 23,
  },
  emptyTypo: {
    height: 66,
    width: 80,
  },
})
