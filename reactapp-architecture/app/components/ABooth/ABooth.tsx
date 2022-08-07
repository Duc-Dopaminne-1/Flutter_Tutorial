import {
  RegisteredStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { colors, fonts, metrics } from '@/vars'
import * as React from 'react'
import I18n from '@/i18n'

// TODO: add booths type
type ABoothProps = {
  booths?: any[]
  separator?: string
  isDisplayBooth?: boolean
  boothStyle?: any
  boothTextStyle?: any
  containerStyle?: RegisteredStyle<ViewStyle>
  textStyle?: RegisteredStyle<TextStyle>
  backgroundColor?: string
  color?: string
  currentWidth?: number
}

const BOOTH_WIDTH = 100
const CHARACTER_WIDTH = 5
const OFFSET_LEFT =
  metrics.supplier_card_img_size +
  metrics.supplier_card_padding_btw_content_and_img +
  metrics.keylines_screen_edge_margin * 2 +
  metrics.booth_margin_width_text

export class ABooth extends React.PureComponent<ABoothProps> {
  readonly state = {
    text: '',
  }

  static readonly defaultProps: ABoothProps = {
    separator: ' • ',
    backgroundColor: colors.product_info_camera_btn_bottom,
    color: colors.white,
    booths: [],
    isDisplayBooth: false,
    currentWidth: 0,
  }

  componentDidMount() {
    this.callCalculator()
  }

  componentDidUpdate() {
    // FIXME: improve performance later
    this.callCalculator()
  }

  callCalculator = () => {
    const { isDisplayBooth, currentWidth } = this.props
    if (isDisplayBooth) {
      this.calculateTextWidth({ currentWidth: OFFSET_LEFT + BOOTH_WIDTH })
      return
    }

    if (currentWidth) {
      this.calculateTextWidth({ currentWidth })
      return
    }

    this.calculateTextWidth()
  }

  calculateTextWidth = ({
    currentWidth = OFFSET_LEFT,
    currentText = '',
    prevText = '',
    index = 0,
    isComplete = false,
  } = {}) => {
    const { separator, booths } = this.props

    if (isComplete || booths.length === 0) {
      this.setState({
        text: currentText,
      })
      return currentText
    }

    const el = booths[index].name
    const isLastItem = index === booths.length - 1

    const tmpText = isLastItem ? el : el + separator
    const tmpWidth = currentWidth + tmpText.length * CHARACTER_WIDTH

    const nextState = {
      currentWidth: tmpWidth,
      currentText: currentText + tmpText,
      prevText: currentText,
      index: index + 1,
      isComplete: isLastItem,
    }

    if (tmpWidth > metrics.screen_width) {
      const moreTextPrevIndex = index === 0 ? index : index - 1
      const moreTextPrev = I18n.t('plusMore', {
        total: booths.length - moreTextPrevIndex,
      })
      const moreTextCurrent = I18n.t('plusMore', {
        total: booths.length - index,
      })
      const moreTextWidth = moreTextCurrent.length * CHARACTER_WIDTH
      const isGreaterThanScreen =
        currentWidth + moreTextWidth > metrics.screen_width

      const nextText = isGreaterThanScreen
        ? prevText + moreTextPrev
        : currentText + moreTextCurrent

      return this.calculateTextWidth({
        ...nextState,
        currentText: nextText,
        isComplete: true,
      })
    }

    return this.calculateTextWidth(nextState)
  }

  render() {
    const { text } = this.state
    const {
      boothStyle,
      boothTextStyle,
      color,
      backgroundColor,
      containerStyle,
      textStyle,
      isDisplayBooth,
    } = this.props

    return (
      <View style={[styles.container, containerStyle]}>
        {isDisplayBooth && (
          <View style={[styles.booth, { backgroundColor }, boothStyle]}>
            <Text style={[styles.boothText, { color }, boothTextStyle]}>
              BOOTH
            </Text>
          </View>
        )}

        <Text style={[styles.text, textStyle]}>{text}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: 33,
    flexDirection: 'row',
    alignItems: 'center',
  },
  booth: {
    paddingHorizontal: 4,
    borderRadius: 4,
    marginRight: metrics.booth_margin_width_text,
  },
  boothText: {
    color: colors.white,
    fontSize: fonts.size.s,
    fontFamily: fonts.family.SSPSemiBold,
  },
  text: {
    fontSize: fonts.size.m,
    color: colors.text_category_type,
  },
})
