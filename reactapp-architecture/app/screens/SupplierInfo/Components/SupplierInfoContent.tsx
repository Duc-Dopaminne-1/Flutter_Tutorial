import * as React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { SupplierInfoHeader } from './SupplierInfoHeader'
import { SupplierInfoScrollable } from './SupplierInfoScrollable'
import { SupplierInfoImage } from '@/screens/SupplierInfo/Components/SupplierInfoImage'
import { metrics } from '@/vars'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SupplierInfoFixedHeader } from '@/screens/SupplierInfo/Components/SupplierInfoFixedHeader'
import { ACommentInput } from '@/components/AComment/ACommentInput'
import { Subscription } from 'rxjs'
import {
  onAddSupplierComment,
  SupplierInfoContext,
} from '../SupplierInfoContext'
import { withContext } from '@/shared/withContext'
import { isIphoneX } from '@/shared/devices'

const KeyboardAwareScrollViewAnimated = Animated.createAnimatedComponent(
  KeyboardAwareScrollView
)

type Props = Readonly<{
  onChangeHeaderVisibility: (state: boolean) => void
  headerHeight: number
  onSend?: (text: string) => void
  onCommentInputFocus?: (isFocused: boolean) => void
}>

@withContext(SupplierInfoContext.Consumer)
export class SupplierInfoContent extends React.PureComponent<Props> {
  _onAddCommentSubscription: Subscription
  _commentInputRef: React.RefObject<ACommentInput> = React.createRef()

  state = {
    showCommentInput: true,
  }

  componentDidMount() {
    this._onAddCommentSubscription = onAddSupplierComment.subscribe(() => {
      this.setState({ showCommentInput: true })
      this._commentInputRef && this._commentInputRef.current.focus()
    })
  }

  componentWillUnmount() {
    this._onAddCommentSubscription &&
      this._onAddCommentSubscription.unsubscribe()
  }

  onChangeTab = (tab: number) => {
    this.setState({ showCommentInput: tab === 0 })
  }

  renderKeyboardAwareScrollView = () => {
    return (
      <KeyboardAwareScrollViewAnimated
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps={'always'}
      />
    )
  }

  renderBackground = () => {
    return <SupplierInfoImage />
  }

  renderFixHeader = () => {
    return <SupplierInfoFixedHeader />
  }

  render() {
    const {
      onSend,
      onCommentInputFocus,
      onChangeHeaderVisibility,
      headerHeight,
    } = this.props

    return (
      <>
        <ParallaxScrollView
          backgroundScrollSpeed={100}
          parallaxHeaderHeight={headerHeight}
          renderBackground={this.renderBackground}
          renderScrollComponent={this.renderKeyboardAwareScrollView}
          onChangeHeaderVisibility={onChangeHeaderVisibility}
          renderFixedHeader={this.renderFixHeader}
          stickyHeaderHeight={metrics.header_absolute_height}
        >
          <SupplierInfoHeader />
          <SupplierInfoScrollable onChangeTab={this.onChangeTab} />
        </ParallaxScrollView>
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
  container: {},
  input: {
    backgroundColor: 'white',
    marginBottom: isIphoneX() ? 34 : 0,
  },
})
