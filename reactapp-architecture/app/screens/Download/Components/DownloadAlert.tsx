import { colors, fonts, images, metrics } from '@/vars'
import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import I18n from '@/i18n'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = Partial<{}> & DefaultProps

export type State = Partial<{}> & Readonly<typeof initialState>

export class DownloadAlert extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapLeft}>
          <Image
            source={images.weight}
            resizeMode={'contain'}
            style={styles.icon}
          />
        </View>

        <View style={styles.wrapRight}>
          <Text style={styles.title}>
            {I18n.t('heavyDataNeedToTransferTitle')}
          </Text>

          <Text style={styles.description}>
            {I18n.t('heavyDataNeedToTransferDescription')}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: metrics.download_alert_width,
    height: metrics.download_alert_height,
    borderRadius: metrics.small_base,
    marginTop: metrics.download_alert_margin_top,
  },
  wrapLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapRight: {
    flex: 2.5,
    justifyContent: 'center',
    paddingRight: metrics.medium_base,
    paddingVertical: metrics.medium_base,
  },
  icon: {
    height: metrics.download_alert_icon_size,
    width: metrics.download_alert_icon_size,
  },
  title: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPBold,
    color: colors.dark_blue_grey,
  },
  description: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
  },
})
