import * as React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { AChipStatus } from '@/components/AChip/AChipStatus'
import I18n from '@/i18n'
import { SampleInfoContext } from '@/screens/SampleInfo/SampleInfoContext'
import { withContext } from '@/shared/withContext'
import { colors, fonts, images, metrics } from '@/vars'
import { SafeSample } from '@/shared/sample'

type Props = {
  safeSample?: SafeSample
}

@withContext(SampleInfoContext.Consumer)
export class SampleInfoHeaderStatus extends React.PureComponent<Props> {
  render() {
    const { safeSample } = this.props
    const { safeStatus, comments } = safeSample

    return (
      <View style={styles.container}>
        <View style={styles.wrapSample}>
          <View style={styles.iconContainer}>
            <Image source={images.sample} style={styles.icon} />
          </View>
          <Text style={styles.text}>{I18n.t('sampleTitle')}</Text>
        </View>
        <View style={styles.wrapComment}>
          <Image source={images.comment} style={styles.commentsIcon} />
          <Text style={styles.commentsCount}>{comments.length}</Text>
        </View>
        <AChipStatus
          // @ts-ignore
          fromSample={true}
          safeSample={safeSample}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    marginTop: metrics.medium_base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wrapSample: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  wrapComment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    marginRight: 12,
  },
  icon: {
    width: 11,
    height: 11,
    tintColor: colors.wifi_unstable,
    resizeMode: 'contain',
  },
  iconContainer: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: colors.yellow_background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: metrics.small_base,
  },
  text: {
    color: colors.black_blue_text,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
  },
  commentsIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: colors.light_blue_grey,
  },
  commentsCount: {
    color: colors.blue_light_grey,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    paddingLeft: 4,
  },
})
