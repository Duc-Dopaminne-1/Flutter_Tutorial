import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { colors, images, metrics } from '@/vars'
import * as React from 'react'

type ADataRowHeaderProps = Readonly<{
  onPress: () => void
  headerIcon: any
}>

export const ADataRowHeader: React.SFC<ADataRowHeaderProps> = ({
  onPress,
  headerIcon,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={headerIcon} resizeMode={'contain'} style={styles.icon} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    marginRight: metrics.small_base,
    borderColor: colors.border_gray,
    borderWidth: 1,
    borderRadius: metrics.double_base,
    padding: 8,
  },
  icon: {
    tintColor: colors.black,
    height: 12,
    width: 12,
  },
})
