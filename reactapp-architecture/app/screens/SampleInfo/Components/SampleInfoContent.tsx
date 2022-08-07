import * as React from 'react'
import { StyleSheet } from 'react-native'
import { colors, metrics } from '@/vars'
import { SampleInfoFixedHeader } from '@/screens/SampleInfo/Components/SampleInfoFixedHeader'
import { ACommentInput } from '@/components/AComment/ACommentInput'
import { withContext } from '@/shared/withContext'
import { SampleInfoContext, onAddSampleComment } from '../SampleInfoContext'
import { Subscription } from 'rxjs'
import { SampleInfoParallaxScrollView } from './SampleInfoParallaxScrollView'

type Props = Readonly<{
  renderBackground: () => JSX.Element
  onChangeHeaderVisibility: (state: boolean) => void
  headerHeight: number
  onSend?: (text: string) => void
  onCommentInputFocus?: (isFocused: boolean) => void
}>

const sectionData = [
  { title: 'header', data: [{ type: 'header' }] },
  { title: 'content', data: [{ type: 'content' }] },
]

@withContext(SampleInfoContext.Consumer)
export class SampleInfoContent extends React.PureComponent<Props> {
  _onAddCommentSubscription: Subscription
  _commentInputRef: React.RefObject<ACommentInput> = React.createRef()

  state = {
    showCommentInput: false,
  }

  componentDidMount() {
    this._onAddCommentSubscription = onAddSampleComment.subscribe(() => {
      this.setState({ showCommentInput: true })
      this._commentInputRef && this._commentInputRef.current.focus()
    })
  }

  componentWillUnmount() {
    this._onAddCommentSubscription &&
      this._onAddCommentSubscription.unsubscribe()
  }

  onChangeTab = (i: number) => {
    this.setState({ showCommentInput: i === 1 })
  }

  renderFixedHeader = () => {
    return <SampleInfoFixedHeader />
  }

  render() {
    const {
      onSend,
      onCommentInputFocus,
      renderBackground,
      onChangeHeaderVisibility,
      headerHeight,
    } = this.props
    return (
      <>
        <SampleInfoParallaxScrollView
          backgroundScrollSpeed={100}
          parallaxHeaderHeight={headerHeight}
          stickyHeaderHeight={metrics.header_absolute_height}
          renderBackground={renderBackground}
          onChangeHeaderVisibility={onChangeHeaderVisibility}
          renderFixedHeader={this.renderFixedHeader}
          sectionsData={sectionData}
          onChangeTab={this.onChangeTab}
        />
        <ACommentInput
          ref={this._commentInputRef}
          style={styles.input}
          onSend={onSend}
          onFocus={onCommentInputFocus}
          visible={this.state.showCommentInput}
        />
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative',
  },
  input: {
    backgroundColor: 'white',
  },
})
