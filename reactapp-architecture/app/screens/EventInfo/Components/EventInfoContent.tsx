import * as React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { metrics } from '@/vars'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { EventInfoImage } from '@/screens/EventInfo/Components/EventInfoImage'
import { EventInfoFixedHeader } from '@/screens/EventInfo/Components/EventInfoFixedHeader'
import { EventInfoLogoAndTitle } from './EventInfoLogoAndTitle'
import { EventInfoButtonAction } from './EventInfoButtonAction'
import { EventInfoMainInformation } from '@/screens/EventInfo/Components/EventInfoMainInformation'
import { EventInfoDescription } from '@/screens/EventInfo/Components/EventInfoDescription'

const KeyboardAwareScrollViewAnimated = Animated.createAnimatedComponent(
  KeyboardAwareScrollView
)

type Props = Readonly<{
  onChangeHeaderVisibility: (state: boolean) => void
  headerHeight: number
}>

export class EventInfoContent extends React.PureComponent<Props> {
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
    return <EventInfoImage />
  }

  renderFixHeader = () => {
    return <EventInfoFixedHeader />
  }

  render() {
    const { onChangeHeaderVisibility, headerHeight } = this.props

    return (
      <ParallaxScrollView
        backgroundScrollSpeed={100}
        parallaxHeaderHeight={headerHeight}
        renderBackground={this.renderBackground}
        renderScrollComponent={this.renderKeyboardAwareScrollView}
        onChangeHeaderVisibility={onChangeHeaderVisibility}
        renderFixedHeader={this.renderFixHeader}
        stickyHeaderHeight={metrics.event_info_header_absolute_height}
      >
        <EventInfoLogoAndTitle />
        <EventInfoButtonAction />
        <EventInfoMainInformation />
        <EventInfoDescription />
      </ParallaxScrollView>
    )
  }
}
