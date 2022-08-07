import * as React from 'react'
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  StyleSheet,
  Image,
  TouchableHighlight,
} from 'react-native'
import { colors, fonts, images, metrics, normalize } from '@/vars'
import I18n from 'react-native-i18n'
import { NavigationInjectedProps } from 'react-navigation'
import { AppContextState } from '@/screens/App/AppContainer'

type Props = {
  isSeparate?: boolean
  container?: StyleProp<ViewStyle>
  wrapItem?: StyleProp<ViewStyle>
  title?: string
  total?: number
  isShowDot?: boolean
  onPressItem: () => void
}

type State = Readonly<{}>

export class HomeAssignedItem extends React.PureComponent<Props, State> {
  readonly state: State = {}

  static defaultProps = {
    isShowDot: false,
    total: 0,
  }

  render() {
    const {
      isSeparate,
      container,
      wrapItem,
      title,
      total,
      isShowDot,
      onPressItem,
    } = this.props

    return (
      <View style={styles.wrapAll}>
        <View style={[styles.container, container]}>
          <TouchableHighlight
            onPress={onPressItem}
            underlayColor={colors.light_grey}
          >
            <View style={wrapItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={styles.textNumber}>{total}</Text>
                {isShowDot ? <View style={styles.dotAboveIcon} /> : null}
              </View>

              <Text style={styles.textType}>{title}</Text>
              <Text style={styles.textAssigned}>{I18n.t('assignedToYou')}</Text>
            </View>
          </TouchableHighlight>
        </View>
        {isSeparate ? <View style={styles.separate} /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapAll: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotAboveIcon: {
    width: 8,
    height: 8,
    // position: 'absolute',
    // top: 5,
    marginLeft: -5,
    marginTop: 3,
    backgroundColor: colors.warning,
    borderRadius: 10,
  },
  textNumber: {
    fontSize: fonts.size.xxlxl - 1,
    fontWeight: '300',
    fontFamily: fonts.family.SSPLight,
    textAlign: 'center',
    color: colors.black,
  },
  textType: {
    fontSize: fonts.size.m - 1,
    fontWeight: '600',
    fontFamily: fonts.family.SSPSemiBold,
    textAlign: 'center',
    color: colors.black_blue_text,
  },
  textAssigned: {
    fontSize: fonts.size.s - 1,
    fontFamily: fonts.family.SSPRegular,
    textAlign: 'center',
    color: colors.blue_light_grey,
  },
  separate: {
    height: 48,
    width: 1,
    backgroundColor: colors.pale_grey,
  },
})
