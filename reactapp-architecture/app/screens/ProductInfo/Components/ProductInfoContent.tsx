import { isIphoneX } from '@/shared/devices'
import { colors, metrics } from '@/vars'
import * as React from 'react'
import { StyleSheet } from 'react-native'
import { ProductInfoFixedHeader } from '@/screens/ProductInfo/Components/ProductInfoFixedHeader'
import { ACommentInput } from '@/components/AComment/ACommentInput'
import { withContext } from '@/shared/withContext'
import { ProductInfoContext, onAddProductComment } from '../ProductInfoContext'
import { Subscription } from 'rxjs'
import { ProductInfoParallaxScrollView } from './ProductInfoParallaxScrollView'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'

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

@withContext(ProductInfoContext.Consumer)
export class ProductInfoContent extends React.PureComponent<Props> {
  _commentInputRef: React.RefObject<ACommentInput> = React.createRef()
  _onAddCommentSubscription: Subscription

  state = {
    showCommentInput: true,
  }

  componentDidMount() {
    this._onAddCommentSubscription = onAddProductComment.subscribe(() => {
      this.setState({ showCommentInput: true })
      this._commentInputRef && this._commentInputRef.current.focus()
    })
  }

  componentWillUnmount() {
    this._onAddCommentSubscription &&
      this._onAddCommentSubscription.unsubscribe()
  }

  onChangeTab = (i: number) => {
    this.setState({ showCommentInput: i === 0 })
  }

  renderFixedHeader = () => {
    return <ProductInfoFixedHeader />
  }

  render() {
    const {
      renderBackground,
      onChangeHeaderVisibility,
      headerHeight,
      onSend,
      onCommentInputFocus,
    } = this.props

    return (
      <>
        <ProductInfoParallaxScrollView
          backgroundScrollSpeed={100}
          stickyHeaderHeight={metrics.header_absolute_height}
          parallaxHeaderHeight={headerHeight}

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
    paddingBottom: isIphoneX() ? 20 : 0,
    backgroundColor: colors.white,
    position: 'relative',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: isIphoneX() ? 34 : 0,
  },
})
