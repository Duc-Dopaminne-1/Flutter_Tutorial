import * as React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import I18n from '@/i18n'
import { colors, fonts, images, devices, metrics } from '@/vars'
import { SearchKeywordType } from '@/services/global'

type Props = Readonly<{
  type?: SearchKeywordType
  onViewAll?: () => void
  onCreateSample?: () => void
}>

export class SampleQueryPlaceholder extends React.PureComponent<Props> {
  static readonly defaultProps = {
    onViewAll: () => null,
    onCreateSample: () => null,
    title: I18n.t('sampleEmptyAssign'),
    text: I18n.t('sampleEmptyHint'),
    hasViewAllButton: true,
  }

  get getData() {
    const { type } = this.props
    if (type === SearchKeywordType.AllSamples) {
      return {
        title: I18n.t('sampleEmptyAssignAll'),
        text: I18n.t('sampleEmptyHintAll'),
        showButton: false,
      }
    }
    if (type === SearchKeywordType.MySamples) {
      return {
        title: I18n.t('sampleEmptyAssignMy'),
        text: I18n.t('sampleEmptyHintMy'),
        showButton: true,
      }
    }
    return {
      title: I18n.t('sampleEmptyAssign'),
      text: I18n.t('sampleEmptyHint'),
      showButton: true,
    }
  }

  render() {
    const { title, text, showButton } = this.getData
    const { onViewAll, onCreateSample } = this.props

    return (
      <View style={styles.placeholderContainer}>
        <View style={styles.emptyContentImageContainer}>
          <Image source={images.sample} style={styles.emptyContentImage} />
        </View>
        <Text style={styles.placeholder1}>{title}</Text>
        <Text style={styles.placeholder2}>{text}</Text>
        <View style={styles.emptyContentActionButtons}>
          <TouchableOpacity
            style={styles.createSampleActionButton}
            onPress={onCreateSample}
          >
            <Text style={styles.buttonCreate}>{I18n.t('sampleCreate')}</Text>
          </TouchableOpacity>
          {!showButton ? null : (
            <TouchableOpacity
              style={styles.viewSamplesActionButton}
              onPress={onViewAll}
            >
              <Text style={styles.buttonViewAll}>
                {I18n.t('sampleViewAll')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.placeholder3}>{I18n.t('sampleEmptyMessage')}</Text>
        <View style={styles.emptySpace} />
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  emptySpace: {
    ...Platform.select({
      ios: {
        height: 68 + 32,
      },
      android: {
        height: 64 + 32,
      },
    }),
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder1: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.l,
    marginTop: 21,
  },
  placeholder2: {
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    marginTop: 8,
  },
  placeholder3: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    paddingHorizontal: 43,
    textAlign: 'center',
    marginTop: 32,
  },
  buttonCreate: {
    color: colors.white,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  buttonViewAll: {
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPSemiBold,
    fontSize: fonts.size.m,
  },
  createSampleActionButton: {
    backgroundColor: colors.wifi_unstable,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 6,
  },
  emptyContentImageContainer: {
    width: Math.min((metrics.screen_width * 128) / 414, 128),
    height: Math.min((metrics.screen_width * 128) / 414, 128),
    borderRadius: Math.min((metrics.screen_width * 128) / 414) / 2,
    backgroundColor: colors.yellow_background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContentImage: {
    alignSelf: 'center',
    resizeMode: 'contain',
    tintColor: colors.wifi_unstable,
    marginLeft: 11,
    width: Math.min((metrics.screen_width * 128) / 414) / 2 - 10,
    height: Math.min((metrics.screen_width * 128) / 414) / 2,
  },
  emptyContentActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  viewSamplesActionButton: {
    backgroundColor: colors.close_icon_gray,
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 6,
  },
})
