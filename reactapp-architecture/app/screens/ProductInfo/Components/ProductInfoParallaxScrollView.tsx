import * as React from 'react'
import {
  Animated,
  ScrollView,
  SectionList,
  StyleSheet,
  View,
} from 'react-native'
import { colors, devices, metrics } from '@/vars'
import I18n from '@/i18n'
import { ProductInfoHeader } from '@/screens/ProductInfo/Components/ProductInfoHeader'
import { ProductInfoActivity } from '@/screens/ProductInfo/Components/ProductInfoActivity'
import { ProductInfoDetail } from '@/screens/ProductInfo/Components/ProductInfoDetail'
import ATabView3 from '@/components/ATabView/ATabView3'
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view'
import { productStore } from '@/stores/productStore'
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
} & DefaultProps

export type State = Readonly<typeof initialState>

export class ProductInfoParallaxScrollView extends React.PureComponent<
  Props,
  State
> {
  sectionListRef: React.RefObject<SectionList<any>> = React.createRef()
  scrollViewRef: React.RefObject<ScrollView> = React.createRef()
  scrollY = new Animated.Value(0)
  _subscription: Subscription

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
    this._subscription = onScrollToComment.subscribe(data => {
      const { type } = data
      if (type === 'product') {
        this.onChangeTab(0)
        this.scrollToEnd()
      }
    })
  }

  componentWillUnmount() {
    this._subscription && this._subscription.unsubscribe()
  }

  /**
   * Scroll to the end of the list
   */
  scrollToEnd = () => {
    if (devices.isIOS) {
      if (this.sectionListRef.current) {
        // @ts-ignore
        this.sectionListRef.current._component.scrollToEnd({ animated: true })
      }
    } else {
      if (this.sectionListRef.current) {
        // @ts-ignore
        this.sectionListRef.current._component
          .getScrollResponder()
          .scrollResponderScrollToEnd()
      }
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

    const p = pivotPoint(parallaxHeaderHeight, stickyHeaderHeight)

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

  onChangeTab = index => {
    const { onChangeTab } = this.props
    const { selectedTab } = this.state

    if (index !== selectedTab) {
      this.scrollViewRef.current &&
        this.scrollViewRef.current.scrollTo({
          x: metrics.screen_width * index,
          y: 0,
          animated: true,
        })

      this.setState({
        selectedTab: index,
      })
    }

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

    const tabs = [I18n.t('activity'), I18n.t('productDetail')]
    return (
      <ATabView3
        tabs={tabs}
        onChangeTab={this.onChangeTab}
        reachedTab={reachedTab}
      />
    )
  }

  renderSectionItem = ({ item }) => {
    const background = this.renderBackground()
    const { selectedTab, reachedTab, viewWidth } = this.state

    if (item.type === 'header') {
      return (
        <>
          {background}
          <ProductInfoHeader reachedTab={reachedTab} />
        </>
      )
    }

    productStore.stayProductActivity = selectedTab === 0

    return (
      <ScrollView
        ref={this.scrollViewRef}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled={true}
        bounces={false}
        scrollsToTop={false}
        scrollEnabled={false}
      >
        <View style={{ width: viewWidth }}>
          <ProductInfoActivity />
        </View>

        <View style={{ width: viewWidth }}>
          <ProductInfoDetail />
        </View>
      </ScrollView>
    )
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
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
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
