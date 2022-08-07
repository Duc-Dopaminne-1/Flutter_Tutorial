import * as React from 'react'
import { FlatList, Keyboard, StyleSheet, View } from 'react-native'
import { ACommentRow } from './ACommentRow'
import { Comment } from '@/models/team'

type Props = Readonly<{
  comments: [Comment]
  style: any
}>

export class ACommentList extends React.PureComponent<Props> {
  static readonly defaultProps = {
    comments: [],
    style: {},
  }

  renderItem = ({ item }) => {
    return <ACommentRow comment={item} />
  }

  extractKeys = (item: Comment, index: number) => {
    return `${item.id}-${index}`
  }

  render() {
    const { comments, style } = this.props

    return (
      <View style={styles.container}>
        <FlatList<Comment>
          data={comments}
          keyExtractor={this.extractKeys}
          renderItem={this.renderItem}
          onScrollBeginDrag={() => Keyboard.dismiss()}
          style={[styles.list, style]}
          keyboardShouldPersistTaps={'always'}
          bounces={false}
          onEndReachedThreshold={2}
          windowSize={10}
          initialNumToRender={20}
          removeClippedSubviews={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
})
