import * as React from 'react'
import { Animated, SectionList, StyleSheet, View } from 'react-native'
import { colors, devices, metrics } from '@/vars'
import ATabView3 from '@/components/ATabView/ATabView3'
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view'
import { SampleInfoDetail } from './SampleInfoDetail'
import { SampleInfoComments } from './SampleInfoComments'
import I18n from '@/i18n'
import { SafeSample } from '@/shared/sample'
import { SampleInfoContext, onAddSampleComment } from '../SampleInfoContext'
import { withContext } from '@/shared/withContext'
import { SampleInfoHeader } from './SampleInfoHeader'
import { Subscription } from 'rxjs'
import { onScrollToComment } from '@/services/global'

const SectionListAnimated = Animated.createAnimatedComponent(SectionList)
const KeyboardAwareSectionListAnimated = Animated.createAnimatedComponent(
  KeyboardAwareSectionList
)

const renderEmpty = () => <View />

const pivotPoint = (a, b) => a - b

/**
 * Override `toJSON` of interpolated value because of an error when serializing
 * style on view inside inspector.
 * See: https://github.com/jaysoo/react-native-parallax-scroll-view/issues/23
 */
const interpolate = (value, opts) => {
  const x = value.interpolate(opts)
  x.toJSON = () => x.__getValue()
  return x
}

// init state
const initialState = {
  scrollY: new Animated.Value(0),
  viewHeight: metrics.screen_height,
  viewWidth: metrics.screen_width,
  selectedTab: 0,
  reachedTab: false,
}

// default props
const defaultProps = {
  backgroundScrollSpeed: metrics.small_base,
  backgroundColor: colors.black,
  contentBackgroundColor: colors.white,
  onChangeHeaderVisibility: () => {},
  renderBackground: renderEmpty,
  renderParallaxHeader: renderEmpty,
  renderForeground: null,
  stickyHeaderHeight: 0,
  outputScaleValue: metrics.small_base,
  sectionsData: [],
  onChangeTab: (_value: any) => {},
}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  backgroundColor?: string
  backgroundScrollSpeed?: number
  fadeOutBackground?: boolean
  contentBackgroundColor?: string
  onChangeHeaderVisibility?: any
  parallaxHeaderHeight: number
  renderBackground?: () => void
  renderFixedHeader?: () => void
  renderForeground?: () => void
  renderStickyHeader?: () => void
  stickyHeaderHeight?: number
  outputScaleValue?: number
  onScroll?: any
  scrollEvent?: any
  sectionsData: any
  onChangeTab?: (value: any) => void
  safeSample?: SafeSample
} & DefaultProps

export type State = Readonly<typeof initialState>

@withContext(SampleInfoContext.Consumer)
export class SampleInfoParallaxScrollView extends React.PureComponent<
  Props,
  State
> {
  _onAddCommentSubscription: Subscription
  _subscription: Subscription
  sectionListRef: React.RefObject<SectionList<any>> = React.createRef()
  tabHeaderRef: React.RefObject<ATabView3> = React.createRef()
  scrollY = new Animated.Value(0)

  readonly state: State = initialState

  static defaultProps = defaultProps

  constructor(props) {
    super(props)

    if (props.renderStickyHeader && !props.stickyHeaderHeight) {
      console.warn(
        'Property `stickyHeaderHeight` must be set if `renderStickyHeader` is used.'
      )
    }

    if (props.renderParallaxHeader !== renderEmpty && !props.renderForeground) {
      console.warn(
        'Property `renderParallaxHeader` is deprecated. Use `renderForeground` instead.'
      )
    }
  }

  componentDidMount() {
    this._onAddCommentSubscription = onAddSampleComment.subscribe(() => {
      this.tabHeaderRef && this.tabHeaderRef.current.onPressTab(1)()
    })
    this._subscription = onScrollToComment.subscribe(data => {
      const { type } = data
      if (type === 'sample') {
        this.onChangeTab(1)
        setTimeout(() => {
          this.scrollToEnd()
        }, 100)
      }
    })
  }

  componentWillUnmount() {
    this._onAddCommentSubscription &&
      this._onAddCommentSubscription.unsubscribe()
    this._subscription && this._subscription.unsubscribe()
  }

  /**
   * Scroll to the end of the list
   */
  scrollToEnd = () => {
    if (devices.isIOS) {
      this.sectionListRef.current._component.scrollToEnd({ animated: true })
    } else {
      this.sectionListRef.current._component
        .getScrollResponder()
        .scrollResponderScrollToEnd()
    }
  }

  maybeUpdateViewDimensions = e => {
    const {
      nativeEvent: {
        layout: { width, height },
      },
    } = e

    if (width !== this.state.viewWidth || height !== this.state.viewHeight) {
      this.setState({
        viewWidth: width,
        viewHeight: height,
      })
    }
  }

  onScroll = e => {
    const {
      parallaxHeaderHeight,
      stickyHeaderHeight,
      onChangeHeaderVisibility,
      scrollEvent,
      onScroll: prevOnScroll = () => {},
    } = this.props

    scrollEvent && scrollEvent(e)

    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight + 50)

    /**
     * This optimization won't run, since we update the animation value
     * directly in onScroll event
     */
    // this._maybeUpdateScrollPosition(e)

    if (e.nativeEvent.contentOffset.y >= p) {
      onChangeHeaderVisibility(false)
    } else {
      onChangeHeaderVisibility(true)
    }

    if (e.nativeEvent.contentOffset.y >= p + 500) {
      this.setState({
        reachedTab: true,
      })
    } else if (this.state.reachedTab) {
      this.setState({
        reachedTab: false,
      })
    }

    prevOnScroll(e)
  }

  onChangeTab = (index: number) => {
    const { onChangeTab } = this.props

    this.setState({
      selectedTab: index,
    })

    onChangeTab(index)
  }

  maybeRenderStickyHeader = () => {
    const {
      renderStickyHeader,
      renderFixedHeader,
      parallaxHeaderHeight,
      stickyHeaderHeight,
      backgroundColor,
    } = this.props
    const { viewWidth } = this.state

    if (renderStickyHeader || renderFixedHeader) {
      const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight)
      return (
        <View
          style={[
            styles.stickyHeader,
            {
              width: viewWidth,
              ...(stickyHeaderHeight ? { height: stickyHeaderHeight } : null),
            },
          ]}
        >
          {renderStickyHeader ? (
            <Animated.View
              style={{
                backgroundColor,
                height: stickyHeaderHeight,
                opacity: interpolate(this.scrollY, {
                  inputRange: [0, p],
                  outputRange: [0, 1],
                  extrapolate: 'clamp',
                }),
              }}
            >
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: interpolate(this.scrollY, {
                        inputRange: [0, p],
                        outputRange: [stickyHeaderHeight, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                }}
              >
                {renderStickyHeader()}
              </Animated.View>
            </Animated.View>
          ) : null}
          {renderFixedHeader && renderFixedHeader()}
        </View>
      )
    }

    return null
  }

  renderBackground = () => {
    const {
      fadeOutBackground,
      backgroundScrollSpeed,
      backgroundColor,
      parallaxHeaderHeight,
      stickyHeaderHeight,
      renderBackground,
      outputScaleValue,
    } = this.props
    const { viewWidth, viewHeight } = this.state
    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight)

    return (
      <Animated.View
        style={[
          styles.backgroundImage,
          {
            backgroundColor,
            height: parallaxHeaderHeight,
            width: viewWidth,
            opacity: fadeOutBackground
              ? interpolate(this.scrollY, {
                  inputRange: [0, p * (1 / 2), p * (3 / 4), p],
                  outputRange: [1, 0.3, 0.1, 0],
                  extrapolate: 'clamp',
                })
              : 1,
            transform: [
              {
                translateY: interpolate(this.scrollY, {
                  inputRange: [0, p],
                  outputRange: [0, -(p / backgroundScrollSpeed)],
                  extrapolateRight: 'extend',
                  extrapolateLeft: 'clamp',
                }),
              },
              {
                scale: interpolate(this.scrollY, {
                  inputRange: [-viewHeight, 0],
                  outputRange: [outputScaleValue * 1.5, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
          },
        ]}
      >
        <>{renderBackground()}</>
      </Animated.View>
    )
  }

  renderSectionHeader = ({ section }) => {
    if (section.title === 'header') return null

    const { reachedTab } = this.state
    const { safeSample } = this.props
    const commentTitle = `${I18n.t('comments')} (${safeSample.comments.length})`

    const tabs = [I18n.t('samplesDetails'), commentTitle]
    return (
      <ATabView3
        ref={this.tabHeaderRef}
        tabs={tabs}
        onChangeTab={this.onChangeTab}
        reachedTab={reachedTab}
      />
    )
  }

  renderSectionItem = ({ item }) => {
    const background = this.renderBackground()
    const { selectedTab, reachedTab } = this.state

    if (item.type === 'header') {
      return (
        <>
          {background}
          <SampleInfoHeader reachedTab={reachedTab} />
        </>
      )
    }

    return selectedTab === 0 ? <SampleInfoDetail /> : <SampleInfoComments />
  }

  render() {
    const { sectionsData } = this.props
    const SectionListWithAnimated = devices.isIOS
      ? KeyboardAwareSectionListAnimated
      : SectionListAnimated

    return (
      <View style={styles.container} onLayout={this.maybeUpdateViewDimensions}>
        <SectionListWithAnimated
          ref={this.sectionListRef}
          style={styles.scrollView}
          scrollEventThrottle={1}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
            { useNativeDriver: true, listener: this.onScroll }
          )}
          showsVerticalScrollIndicator={false}
          sections={sectionsData}
          renderSectionHeader={this.renderSectionHeader}
          renderItem={this.renderSectionItem}
          keyExtractor={(_item, index) => index.toString()}
          keyboardShouldPersistTaps={'always'}
          listKey={'AParallaxScrollView'}
          enableResetScrollToCoords={false}
          stickySectionHeadersEnabled={true}
        />

        {this.maybeRenderStickyHeader()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    backgroundColor: 'transparent',
  },
  backgroundImage: {},
  stickyHeader: {
    backgroundColor: 'transparent',
    position: 'absolute',
    overflow: 'hidden',
    top: 0,
    left: 0,
  },
})
