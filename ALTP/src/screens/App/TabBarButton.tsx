import { colors, metrics } from '@/vars'
import { fonts } from '@/vars/fonts'
import * as React from 'react'
import {
  Image,
  ImageRequireSource,
  ImageURISource,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'

type TabBarButtonProps = {
  tintColor?: string
  title?: string
  source?: ImageURISource | ImageRequireSource
  onPress?: () => void
}

export const TabBarButton: React.SFC<TabBarButtonProps> = props => {
  const { tintColor, source, onPress, title } = props
  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapButton}>
      <Image style={[styles.selectedButton, { tintColor }]} source={source} />
      <Text style={[styles.textLabel, { color: tintColor }]}>
        {title.toUpperCase()}
      </Text>
    </TouchableOpacity>
  )
}

TabBarButton.defaultProps = {
  tintColor: colors.light_blue_grey
}

const styles = StyleSheet.create<any>({
  wrapButton: {
    marginTop: metrics.base,
    flex: 1,
    alignItems: 'center'
  },
  selectedButton: {
    width: metrics.home_footer_button_size,
    height: metrics.home_footer_button_size
  },
  textLabel: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.xs
  }
})
