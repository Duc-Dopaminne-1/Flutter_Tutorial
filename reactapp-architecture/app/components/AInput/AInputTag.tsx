import { AChipTag } from '@/components/AChip/AChipTag'
import { colors, metrics } from '@/vars'
import invariant from 'invariant'
import * as React from 'react'
import {
  ImageStyle,
  Platform,
  Keyboard,
  RegisteredStyle,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'

// init state
const initialState = {
  inputWidth: 0,
  wrapperHeight: 0,
  wrapperWidth: 0,
  spaceLeft: 0,
  contentHeight: 0,
}

// default props
const defaultProps = {
  value: [],
  editable: true,
  tagColor: '#dddddd',
  tagTextColor: '#777777',
  inputDefaultWidth: metrics.screen_width / 2,
  inputColor: '#777777',
  maxHeight: 150,
}

// define type
type DefaultProps = typeof defaultProps

export type AInputTagProps = {
  /**
   * An array of tags, which can be any type, as long as labelExtractor below
   * can extract a string from it
   */
  value: any[]
  /**
   * The text currently being displayed in the TextInput following the list of
   * tags
   */
  text: string
  /**
   * Background color of tags
   */
  tagColor?: string
  /**
   * Text color of tags
   */
  tagTextColor?: string
  /**
   * Width override for text input's default width when it's empty and showing placeholder
   */
  inputDefaultWidth?: number
  /**
   * Color of text input
   */
  inputColor?: string
  /**
   * Max height of the tag input on screen (will scroll if max height reached)
   */
  maxHeight?: number

  // function
  /**
   * A handler to be called when array of tags change. The parent should update
   * the value prop when this is called if they want to enable removal of tags
   */
  onChange: (item: any) => void
  /**
   * Function to extract string value for label from item
   */
  labelExtractor?: (tagData: any) => string | JSX.Element
  /**
   * This callback gets called when the user types in the TextInput. The parent
   * should update the text prop when this is called if they want to enable
   * input. This is also where any parsing to detect new tags should occur
   */
  onChangeText: (text: string) => void
  /**
   * Callback that gets passed the new component height when it changes
   */
  onHeightChange?: (height: number) => void

  // style
  /**
   * Styling override for container surrounding tag text
   */
  tagContainerStyle?: RegisteredStyle<ViewStyle>
  /**
   * Styling override for tag's text component
   */
  tagTextStyle?: RegisteredStyle<TextStyle>
  iconCloseStyle?: RegisteredStyle<ImageStyle>

  // true | false
  /**
   * If false, text input is not editable and existing tags cannot be removed.
   */
  editable?: boolean

  // Props
  /**
   * Any misc. TextInput props (autoFocus, placeholder, returnKeyType, etc.)
   */
  inputProps?: TextInputProps
  /**
   * Any ScrollView props (horizontal, showsHorizontalScrollIndicator, etc.)
   */
  scrollViewProps?: ScrollViewProps

  placeholder?: string
} & DefaultProps

export type AInputTagState = Readonly<typeof initialState>

export class AInputTag extends React.PureComponent<
  AInputTagProps,
  AInputTagState
> {
  _textInput: React.RefObject<TextInput> = React.createRef()
  _scrollView: React.RefObject<ScrollView> = React.createRef()

  readonly state: AInputTagState = initialState

  static defaultProps: DefaultProps = defaultProps

  componentDidMount() {
    const { inputDefaultWidth } = this.props

    this.setState({
      inputWidth: inputDefaultWidth,
      wrapperWidth: metrics.screen_width,
      wrapperHeight: 36,
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      contentHeight,
      spaceLeft,
      wrapperWidth,
      inputWidth,
      wrapperHeight,
    } = prevState
    const newWrapperHeight = Math.min(nextProps.maxHeight, contentHeight)
    const newInputWidth = AInputTag.getInputWidth(
      nextProps.text,
      spaceLeft,
      nextProps.inputDefaultWidth,
      wrapperWidth
    )

    if (newInputWidth !== inputWidth) {
      return {
        inputWidth: newInputWidth,
      }
    }
    if (newWrapperHeight !== wrapperHeight) {
      return {
        wrapperHeight: newWrapperHeight,
      }
    }

    return null
  }

  componentDidUpdate(_prevProps, prevState) {
    const { onHeightChange } = this.props
    const { wrapperHeight } = this.state

    if (onHeightChange && prevState.wrapperHeight !== wrapperHeight) {
      onHeightChange(wrapperHeight)
    }
  }

  static getInputWidth = (text, spaceLeft, inputDefaultWidth, wrapperWidth) => {
    if (text === '') {
      return inputDefaultWidth
    }
    if (spaceLeft >= 100) {
      return spaceLeft - 10
    }
    return wrapperWidth
  }

  measureWrapper = event => {
    const { spaceLeft, inputWidth } = this.state
    const newWrapperWidth = event.nativeEvent.layout.width - 25
    const newInputWidth = AInputTag.getInputWidth(
      this.props.text,
      spaceLeft,
      this.props.inputDefaultWidth,
      newWrapperWidth
    )

    this.setState({ wrapperWidth: newWrapperWidth })

    if (newInputWidth !== inputWidth) {
      this.setState({ inputWidth: newInputWidth })
    }
  }

  onBlur = event => {
    invariant(Platform.OS === 'ios', 'only iOS gets text on TextInput.onBlur')
    this.props.onChangeText(event.nativeEvent.text)
  }

  onKeyPress = event => {
    const { text, value, onChange } = this.props
    const tags = [...value]

    if (text !== '' || event.nativeEvent.key !== 'Backspace') {
      return
    }

    tags.pop()
    onChange(tags)
    this.scrollToEnd()
    this.focus()
  }

  focus = () => {
    invariant(this._textInput, 'should be set')
    this._textInput.current.focus()
  }

  removeIndex = (index: number) => {
    const { value, onChange } = this.props

    const tags = [...value]
    tags.splice(index, 1)
    onChange(tags)
  }

  scrollToEnd = () => {
    invariant(
      this._scrollView,
      'this.scrollView ref should exist before scrollToEnd called'
    )
    setTimeout(() => {
      // if(this._scrollView.current) {
      //   this._scrollView.current.scrollToEnd({ animated: true })
      // }
    }, 0)
  }

  onScrollViewContentSizeChange = (_w: number, h: number) => {
    const { maxHeight } = this.props
    const { wrapperHeight, contentHeight } = this.state
    const nextWrapperHeight = Math.min(maxHeight, h)

    if (contentHeight === h) {
      return
    }
    if (nextWrapperHeight !== wrapperHeight) {
      this.setState({
        wrapperHeight: nextWrapperHeight,
      })
    } else if (contentHeight < h) {
      // this.scrollToEnd()
    }
    this.setState({
      contentHeight: h,
    })
  }

  onLayoutLastTag = (endPosOfTag: number) => {
    const { wrapperWidth, inputWidth } = this.state
    const newSpaceLeft = wrapperWidth - endPosOfTag - 13
    const newInputWidth = AInputTag.getInputWidth(
      this.props.text,
      newSpaceLeft,
      this.props.inputDefaultWidth,
      wrapperWidth
    )

    if (newInputWidth !== inputWidth) {
      this.setState({ inputWidth: newInputWidth })
    }
  }

  clearText = () => {
    if (this._textInput) {
      this._textInput.current.clear()
    }
  }

  get renderTags() {
    const {
      value,
      labelExtractor,
      editable,
      tagColor,
      tagTextColor,
      tagContainerStyle,
      tagTextStyle,
      iconCloseStyle,
    } = this.props

    return value.map((tag, index) => (
      <AChipTag
        index={index}
        label={labelExtractor(tag)}
        isLastTag={value.length === index + 1}
        onLayoutLastTag={this.onLayoutLastTag}
        removeIndex={this.removeIndex}
        tagColor={tagColor}
        tagTextColor={tagTextColor}
        tagContainerStyle={tagContainerStyle}
        tagTextStyle={tagTextStyle}
        key={index}
        editable={editable}
        iconCloseStyle={iconCloseStyle}
      />
    ))
  }

  handleKeyDown() {
    Keyboard.dismiss()
  }

  get renderTextInput() {
    const { inputWidth } = this.state
    const {
      text,
      inputColor,
      editable,
      onChangeText,
      inputProps,
      placeholder,
    } = this.props

    return (
      <View style={[styles.textInputContainer, { width: inputWidth }]}>
        <TextInput
          ref={this._textInput}
          style={[
            styles.textInput,
            {
              width: inputWidth,
              color: inputColor,
            },
          ]}
          value={text}
          blurOnSubmit={false}
          onBlur={Platform.OS === 'ios' ? this.onBlur : undefined}
          onChangeText={onChangeText}
          autoCapitalize={'none'}
          autoCorrect={false}
          returnKeyType={'done'}
          keyboardType={'default'}
          onSubmitEditing={this.handleKeyDown}
          editable={editable}
          placeholder={placeholder}
          {...inputProps}
        />
      </View>
    )
  }

  render() {
    const { wrapperHeight } = this.state
    const { scrollViewProps } = this.props

    // return (
    //   <TouchableWithoutFeedback
    //     onPress={this.focus}
    //     style={styles.container}
    //     onLayout={this.measureWrapper}
    //   >
    //     <View style={[styles.wrapper, { height: wrapperHeight }]}>
    //       <ScrollView
    //         ref={this._scrollView}
    //         style={styles.tagInputContainerScroll}
    //         onContentSizeChange={this.onScrollViewContentSizeChange}
    //         // keyboardShouldPersistTaps={'always'}
    //         {...scrollViewProps}
    //       >
    //         <View style={styles.tagInputContainer}>
    //           {this.renderTags}
    //           {this.renderTextInput}
    //         </View>
    //       </ScrollView>
    //     </View>
    //   </TouchableWithoutFeedback>
    // )

    return (
      <View style={styles.container} onLayout={this.measureWrapper}>
        <View style={[styles.wrapper, { height: wrapperHeight }]}>
          <ScrollView
            ref={this._scrollView}
            style={styles.tagInputContainerScroll}
            onContentSizeChange={this.onScrollViewContentSizeChange}
            {...scrollViewProps}
          >
            <View style={styles.tagInputContainer}>
              {this.renderTags}
              {this.renderTextInput}
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 3,
    marginBottom: 2,
    alignItems: 'flex-start',
  },
  tagInputContainerScroll: {
    flex: 1,
  },
  tagInputContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  textInput: {
    height: 26,
    fontSize: 16,
    padding: 0,
  },
  textInputContainer: {
    height: 36,
    justifyContent: 'flex-start',
  },
})
