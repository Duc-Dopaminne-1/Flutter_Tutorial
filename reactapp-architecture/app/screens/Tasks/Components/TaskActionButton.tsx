import * as React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  ImageSourcePropType,
} from 'react-native'
import { colors, fonts, metrics } from '@/vars'

export type RightButton = {
  text: string
  image: ImageSourcePropType
  backgroundColor: string
  index: number
}

type Props = {
  content: RightButton
  onActionPress: (content: RightButton) => void
}

export class TaskActionButton extends React.PureComponent<Props> {
  static readonly defaultProps = {
    content: {},
    onActionPress: () => null,
  }

  render() {
    const { content, onActionPress } = this.props
    const { text, image, backgroundColor } = content
    return (
      <TouchableHighlight
        style={{ backgroundColor }}
        onPress={() => onActionPress(content)}
      >
        <View style={[styles.swipableContent, { backgroundColor }]}>
          <Image style={styles.rightIcon} source={image} />
          <Text numberOfLines={1} style={styles.rightButtonText}>
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create<any>({
  swipableContent: {
    height: metrics.tasks_row_height,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightIcon: {
    width: 15,
    height: 16,
    resizeMode: 'contain',
    tintColor: colors.white,
    marginBottom: 2,
  },
  rightButtonText: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.xs,
    width: '100%',
    textAlign: 'center',
  },
})
