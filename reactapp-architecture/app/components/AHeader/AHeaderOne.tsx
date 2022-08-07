import React, { PureComponent } from 'react'
import {
  Image,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  StatusBar,
  Platform,
} from 'react-native'

import { colors, fonts, images, metrics, normalize } from '@/vars'

export type AHeaderOneProps = {
  title?: string
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  onPressBack: () => void
  visibleLeftButton?: boolean
}

export class AHeaderOne extends PureComponent<AHeaderOneProps> {
  static defaultProps = {
    visibleLeftButton: true,
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
  }

  get renderLeftButton() {
    const { onPressBack, visibleLeftButton } = this.props

    if (!visibleLeftButton) return <View style={styles.emptyMargin} />

    return (
      <TouchableOpacity style={styles.wrapIcon} onPress={onPressBack}>
        <Image
          source={images.backArrow}
          resizeMode={'contain'}
          style={styles.icon}
        />
      </TouchableOpacity>
    )
  }

  get renderTitle() {
    const { title } = this.props

    if (!title) return null

    return (
      <View style={styles.wrapTitle}>
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  }

  render() {
    const { containerStyle } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {this.renderLeftButton}

        {this.renderTitle}
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalize(Platform.OS === 'ios' ? 60 : 100),
  },
  wrapIcon: {
    flex: 1,
    paddingLeft: metrics.keylines_screen_sign_in_margin,
  },
  icon: {
    height: metrics.header_one_icon_height,
    width: metrics.header_one_icon_width,
    tintColor: colors.black,
  },
  wrapTitle: {
    flex: 7,
  },
  title: {
    fontSize: fonts.size.xlxl,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  emptyMargin: {
    marginLeft: metrics.keylines_screen_sign_in_margin,
  },
})
