import * as React from 'react'
import {
  Image,
  ImageStyle,
  RegisteredStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { fonts, images, metrics } from '@/vars'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type AChipTagProps = {
  index: number
  label: string | JSX.Element
  tagColor: string
  tagTextColor: string

  // true | false
  isLastTag: boolean
  editable: boolean

  // function
  onLayoutLastTag: (endPosOfTag: number) => void
  removeIndex: (index: number) => void

  // style
  tagContainerStyle?: RegisteredStyle<ViewStyle>
  tagTextStyle?: RegisteredStyle<TextStyle>
  iconCloseStyle?: RegisteredStyle<ImageStyle>
} & DefaultProps

export type AChipTagState = Readonly<typeof initialState>

export class AChipTag extends React.PureComponent<
  AChipTagProps,
  AChipTagState
> {
  curPos: any

  readonly state: AChipTagState = initialState

  static defaultProps: DefaultProps = defaultProps

  componentDidUpdate(prevProps) {
    const { onLayoutLastTag, isLastTag } = this.props

    if (
      isLastTag &&
      !prevProps.isLastTag &&
      this.curPos !== null &&
      this.curPos !== undefined
    ) {
      onLayoutLastTag(this.curPos)
    }
  }

  onLayoutLastTag = event => {
    const { isLastTag, onLayoutLastTag } = this.props
    const { width, x } = event.nativeEvent.layout
    this.curPos = width + x

    if (isLastTag) {
      onLayoutLastTag(this.curPos)
    }
  }

  onPress = () => {
    const { removeIndex, index } = this.props

    removeIndex(index)
  }

  padding = text => {
    const length = text.length * 8
    if (length >= metrics.screen_width - 100) {
      return 25
    }

    return 0
  }

  get isElement() {
    const { label } = this.props

    return React.isValidElement(label)
  }

  get renderTag() {
    const { label, tagTextColor, tagTextStyle } = this.props

    return (
      <Text
        style={[styles.tagText, { color: tagTextColor }, tagTextStyle]}
        numberOfLines={1}
      >
        {label}
      </Text>
    )
  }

  render() {
    const {
      label,
      tagColor,
      editable,
      tagContainerStyle,
      iconCloseStyle,
    } = this.props

    return (
      <View
        onLayout={this.onLayoutLastTag}
        style={[
          styles.container,
          { backgroundColor: tagColor },
          tagContainerStyle,
          { paddingRight: this.padding(label) },
        ]}
      >
        {this.isElement ? label : this.renderTag}

        <TouchableOpacity
          disabled={!editable}
          onPress={this.onPress}
          style={styles.wrapButton}
        >
          <Image
            source={images.closeThickIcon}
            style={[styles.icon, iconCloseStyle]}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingVertical: 2,
    height: 24,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: fonts.size.l,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  icon: {
    height: 8,
    width: 8,
  },
})
