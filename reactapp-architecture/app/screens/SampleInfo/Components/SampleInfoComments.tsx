import * as React from 'react'
import { colors } from '@/vars'
import { StyleSheet, View } from 'react-native'
import { ACommentList } from '@/components/AComment/ACommentList'
import { withContext } from '@/shared/withContext'
import { SampleInfoContext } from '../SampleInfoContext'
import { SafeSample } from '@/shared/sample'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  safeSample?: SafeSample
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(SampleInfoContext.Consumer)
export class SampleInfoComments extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    const { safeSample } = this.props
    return (
      <>
        <View style={styles.space} />
        <ACommentList style={styles.padding} comments={safeSample.comments} />
      </>
    )
  }
}

const styles = StyleSheet.create({
  space: {
    height: 12,
    width: '100%',
    backgroundColor: colors.light_white_gray,
  },
  padding: {
    paddingHorizontal: 12,
  },
})
