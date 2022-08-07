import { AButtonIcon } from '@/components/AButton/AButtonIcon'
import { ifIphoneX, isIpad } from '@/shared/devices'

import { colors, devices, fonts } from '@/vars'
import React, { PureComponent } from 'react'
import {
  ImageRequireSource,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

export type Props = {
  title?: string
  icon1?: ImageRequireSource
  icon2?: ImageRequireSource

  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>

  onPressIcon1: () => void
  onPressIcon2: () => void

  turnOffIcon1?: boolean
}

export class AHeaderTwo extends PureComponent<Props> {
  static defaultProps = {
    turnOffIcon1: false,
  }

  componentDidMount() {
    StatusBar.setBarStyle('dark-content', true)
  }

  get renderTitle() {
    const { title, turnOffIcon1 } = this.props

    if (!title) return null

    return (
      <View style={[styles.wrapTitle, !turnOffIcon1 && styles.wrapCenterTitle]}>
        <Text style={[styles.title, !turnOffIcon1 && styles.centerTitle]}>
          {title}
        </Text>
      </View>
    )
  }

  get renderIcon1() {
    const { icon1, onPressIcon1, turnOffIcon1 } = this.props

    if (turnOffIcon1) return null

    return (
      <AButtonIcon
        icon={icon1}
        onPress={onPressIcon1}
        containerStyle={styles.iconCustomContainer}
      />
    )
  }

  get renderIcon2() {
    const { icon2, onPressIcon2 } = this.props

    return <AButtonIcon icon={icon2} onPress={onPressIcon2} />
  }

  render() {
    const { containerStyle, turnOffIcon1 } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {!turnOffIcon1 && <View style={styles.wrapIcon} />}

        {this.renderTitle}

        <View style={styles.wrapIcon}>
          {this.renderIcon1}

          {this.renderIcon2}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: 18,
    paddingHorizontal: 16,
    height: devices.isIOS ? 70 : 100,
    ...ifIphoneX(
      {
        height: 80,
        paddingTop: 40,
      },
      {}
    ),
    borderBottomWidth: 1,
    borderBottomColor: colors.border_header,
  },
  wrapTitle: {
    flex: 6,
  },
  wrapCenterTitle: {
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: isIpad() ? fonts.size.xl : fonts.size.mxl,
  },
  centerTitle: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
  },
  wrapIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconCustomContainer: {
    marginRight: 20,
  },
})
