import * as React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { colors, images, metrics } from '@/vars'
import { AHeaderFixed } from '@/components/AHeader/AHeaderFixed'
import { selectPlatform } from '@/shared/devices'
import { withContext } from '@/shared/withContext'
import { EventInfoContext } from '@/screens/EventInfo/EventInfoContext'
import { SafeEvent } from '@/shared/event'

type Props = Readonly<{
  asComponent?: any
  headerVisible?: any
  onPressIconLeft?: () => void
  safeEvent?: SafeEvent
}>

@withContext(EventInfoContext.Consumer)
export class EventInfoFixedHeader extends React.PureComponent<Props> {
  renderIconLeft = () => {
    return (
      <View style={styles.wrapImage}>
        <Image source={images.closeIcon} style={styles.image} />
      </View>
    )
  }

  render() {
    const {
      asComponent,
      headerVisible,
      onPressIconLeft,
      safeEvent,
    } = this.props

    return (
      <AHeaderFixed
        title={!headerVisible && safeEvent.eventName}
        renderIconLeft={this.renderIconLeft}
        onPressIconLeft={onPressIconLeft}
        color={
          headerVisible
            ? [colors.transparent, colors.transparent]
            : [
                selectPlatform(
                  {
                    iPad: colors.background,
                    default: colors.white,
                  },
                  !asComponent
                ),
                selectPlatform(
                  {
                    iPad: colors.background,
                    default: colors.white,
                  },
                  !asComponent
                ),
              ]
        }
        titleStyle={
          !headerVisible && {
            color: colors.black,
            fontWeight: selectPlatform<any>({
              iPad: '400',
              default: '600',
            }),
          }
        }
        iconLeftStyle={!headerVisible && { tintColor: colors.black }}
        iconLeftTextStyle={!headerVisible && { color: colors.black }}
        containerStyle={[
          styles.customAnimatedStyle,
          !headerVisible && styles.customHeader,
        ]}
        animatedStyle={styles.customAnimatedStyle}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  customAnimatedStyle: {
    height: metrics.event_info_header_absolute_height,
  },
  customHeader: {
    borderBottomWidth: 1,
    borderColor: colors.border_gray,
  },
  wrapImage: {
    backgroundColor: colors.light_80,
    width: metrics.event_info_wrap_close_icon_size,
    height: metrics.event_info_wrap_close_icon_size,
    borderRadius: metrics.event_info_wrap_close_icon_size / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: metrics.event_info_close_icon_size,
    width: metrics.event_info_close_icon_size,
    tintColor: colors.text_light_grey,
  },
})
