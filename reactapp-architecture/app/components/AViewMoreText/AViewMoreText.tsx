import { AButton } from '@/components/AButton/AButton'
import { colors, fonts } from '@/vars'
import React from 'react'
import {
  RegisteredStyle,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from 'react-native'
import I18n from '@/i18n'

// init state
const initialState = {
  isFulltextShown: true,
  numberOfLines: 1,
  trimmedTextHeight: null,
  fullTextHeight: null,
  shouldShowMore: false,
}

// default props
const defaultProps = {
  numberOfLines: 1,
  afterCollapse: () => {},
  afterExpand: () => {},
  viewMoreText: '',
  viewLessText: '',
  viewMoreTextStyle: {},
  viewMoreTextContainerStyle: {},
}

// define type
type DefaultProps = Partial<typeof defaultProps>

type AViewMoreTextProps = {
  numberOfLines: number
  renderViewMore?: (callbackFn: () => void) => void
  renderViewLess?: (callbackFn: () => void) => void
  afterCollapse?: () => void
  afterExpand?: () => void
  textStyle?: TextStyle
} & DefaultProps

export type AViewMoreTextState = Readonly<typeof initialState>

export class AViewMoreText extends React.PureComponent<
  AViewMoreTextProps,
  AViewMoreTextState
> {
  readonly state: AViewMoreTextState = initialState

  componentDidMount() {
    this.setState({
      numberOfLines: this.props.numberOfLines,
    })
  }

  componentDidUpdate() {
    this.hideFullText()
  }

  hideFullText = () => {
    const { isFulltextShown, trimmedTextHeight, fullTextHeight } = this.state

    if (isFulltextShown && trimmedTextHeight && fullTextHeight) {
      this.setState({
        isFulltextShown: false,
        shouldShowMore: trimmedTextHeight < fullTextHeight,
      })
    }
  }

  onLayoutTrimmedText = event => {
    const { height } = event.nativeEvent.layout

    this.setState(
      {
        trimmedTextHeight: Math.floor(height),
      },
      () => {
        this.hideFullText()
      }
    )
  }

  onLayoutFullText = event => {
    const { height } = event.nativeEvent.layout

    this.setState(
      {
        fullTextHeight: Math.floor(height),
      },
      () => {
        this.hideFullText()
      }
    )
  }

  onPressMore = () => {
    this.setState({
      numberOfLines: null,
    })
  }

  onPressLess = () => {
    this.setState({
      numberOfLines: this.props.numberOfLines,
    })
  }

  getWrapperStyle = () => {
    const { isFulltextShown } = this.state

    return isFulltextShown ? styles.transparent : {}
  }

  renderViewMore = () => {
    const {
      renderViewMore,
      viewMoreText,
      viewMoreTextStyle,
      viewMoreTextContainerStyle,
    } = this.props
    if (renderViewMore) {
      return renderViewMore(this.onPressMore)
    }

    return (
      <AButton
        onPress={this.onPressMore}
        title={viewMoreText || I18n.t('readMore')}
        containerStyle={[styles.buttonContainer, viewMoreTextContainerStyle]}
        titleStyle={[styles.buttonTitle, viewMoreTextStyle]}
      />
    )
  }

  renderViewLess = () => {
    const {
      renderViewLess,
      viewLessText,
      viewMoreTextStyle,
      viewMoreTextContainerStyle,
    } = this.props
    if (renderViewLess) {
      return renderViewLess(this.onPressLess)
    }

    return (
      <AButton
        onPress={this.onPressLess}
        title={viewLessText || I18n.t('readLess')}
        containerStyle={[styles.buttonContainer, viewMoreTextContainerStyle]}
        titleStyle={[styles.buttonTitle, viewMoreTextStyle]}
      />
    )
  }

  renderFooter = () => {
    const { numberOfLines, shouldShowMore } = this.state

    if (shouldShowMore) {
      if (numberOfLines > 0) {
        return (this.props.renderViewMore || this.renderViewMore)(
          this.onPressMore
        )
      }
      return (this.props.renderViewLess || this.renderViewLess)(
        this.onPressLess
      )
    }
    return null
  }

  renderFullText = () => {
    const { isFulltextShown } = this.state

    if (isFulltextShown) {
      return (
        <View onLayout={this.onLayoutFullText} style={styles.fullTextWrapper}>
          <Text style={this.props.textStyle}>{this.props.children}</Text>
        </View>
      )
    }

    return null
  }

  renderTrimmedText = () => {
    const { children, textStyle } = this.props
    const { numberOfLines } = this.state

    return (
      <View onLayout={this.onLayoutTrimmedText}>
        <Text style={textStyle} numberOfLines={numberOfLines}>
          {children}
        </Text>
        {this.renderFooter()}
      </View>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderTrimmedText()}

        {this.renderFullText()}
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  fullTextWrapper: {
    opacity: 0,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  viewMoreText: {
    color: colors.primary_blue,
    fontSize: fonts.size.m,
  },
  transparent: {
    opacity: 0,
  },

  buttonContainer: {
    height: 33,
    margin: 0,
    marginTop: 8,
    backgroundColor: colors.background,
  },
  buttonTitle: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.blue_light_grey,
  },
})
