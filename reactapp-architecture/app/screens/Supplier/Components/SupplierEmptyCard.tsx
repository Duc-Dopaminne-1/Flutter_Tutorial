import * as React from 'react'
import {
  View,
  StyleSheet,
  Image,
  Text,
  ViewStyle,
  StyleProp,
} from 'react-native'
import { colors, fonts, metrics, normalize } from '@/vars'
import { AButton } from '@/components/AButton/AButton'

type Props = Readonly<{
  isTwoButton?: boolean
  icon: any
  title: string
  content: string
  textButtonOne: string
  textButtonTwo?: string
  onPressButtonOne?: () => void
  onPressButtonTwo?: () => void
  styleContainer?: StyleProp<ViewStyle>
  disableButtonTwo?: boolean
}>

export class SupplierEmptyCard extends React.PureComponent<Props> {
  render() {
    const {
      isTwoButton,
      icon,
      title,
      content,
      textButtonOne,
      textButtonTwo,
      onPressButtonOne,
      onPressButtonTwo,
      disableButtonTwo,
      styleContainer,
    } = this.props
    return (
      <View style={[styles.container, styleContainer]}>
        <View style={styles.wrapIcon}>
          <View style={styles.wrapIconChild}>
            <Image source={icon} style={styles.icon} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.wrapMessage}>
          <View style={styles.wrapTextTrade}>
            <Text style={styles.textTrade}>{title}</Text>
          </View>
          <View style={styles.wrapTextTrade}>
            <Text style={styles.textMessageTradeShows}>{content}</Text>
          </View>

          <View style={styles.wrapContainerButton}>
            <AButton
              containerStyle={styles.wrapButton}
              title={textButtonOne}
              titleStyle={styles.textButtonTradeShow}
              onPress={onPressButtonOne}
            />

            {isTwoButton ? (
              <AButton
                containerStyle={[
                  styles.wrapButton,
                  { backgroundColor: colors.close_icon_gray },
                ]}
                title={textButtonTwo}
                titleStyle={styles.textButtonTradeShowExhibitors}
                onPress={onPressButtonTwo}
                disabled={disableButtonTwo}
              />
            ) : null}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: 26,
    marginBottom: 24,
  },
  wrapIcon: {
    width: 86,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  wrapIconChild: {
    borderRadius: 4,
    height: 60,
    width: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 32,
    width: 32,
  },
  wrapMessage: {
    flex: 1,
    flexDirection: 'column',
  },
  wrapContainerButton: {
    marginRight: 8,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapButton: {
    margin: 0,
    height: 40,
    width: '48%',
    borderRadius: metrics.product_empty_screen_wrap_button_border_radius,
  },
  textTrade: {
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    fontWeight: '600',
    fontFamily: fonts.family.SSPSemiBold,
  },
  textMessageTradeShows: {
    fontSize: fonts.size.m,
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
  },
  wrapTextTrade: {
    marginBottom: 10,
  },
  textButtonTradeShow: {
    color: colors.white,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  textButtonTradeShowExhibitors: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
})
