import { colors, metrics, images, fonts } from '@/vars'
import * as React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native'
import I18n from '@/i18n'

type AButtonCreateProps = {
  text: string
  onPress: () => void
  containerStyle?: StyleProp<ViewStyle>
}

export const AButtonCreate: React.SFC<AButtonCreateProps> = props => {
  const { text, onPress, containerStyle } = props

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity style={styles.wrapButton} onPress={onPress}>
        <Image source={images.add} style={styles.image} />
        <Text style={styles.text} numberOfLines={1}>
          {I18n.t('create')} "{text}"
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create<any>({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: metrics.keylines_screen_edge_margin,
    marginBottom: metrics.double_base,
  },
  wrapButton: {
    height: 29,
    alignItems: 'center',
    backgroundColor: colors.status_validated,
    flexDirection: 'row',
    borderRadius: 5,
    paddingHorizontal: 7,
    marginRight: 25,
  },
  image: {
    tintColor: colors.white,
    marginRight: metrics.medium_base,
    height: metrics.medium_base,
    width: metrics.medium_base,
  },
  wrapText: {
    flex: 1,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPRegular,
  },
})
