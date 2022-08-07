import * as React from 'react'
import { StyleSheet, Alert, ToastAndroid } from 'react-native'
import { AControl } from '@/components/AControl/AControl'
import { AControlButton } from '@/components/AControl/AControlButton'
import I18n from '@/i18n'
import { Sample } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import {
  SampleInfoContext,
  onAddSampleComment,
} from '@/screens/SampleInfo/SampleInfoContext'
import { withContext } from '@/shared/withContext'
import { images, devices } from '@/vars'
import ActionSheet from 'react-native-actionsheet'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { CustomAlert } from '@/shared/alert'
import { debounce } from 'lodash'
import { SafeImage } from '@/shared/image'
import Share from 'react-native-share'
import { Subscription } from 'rxjs'
import { lCache } from '@/libs/LCache'
import { SafeSample } from '@/shared/sample'
import { selectPlatform } from '@/shared/devices'

type Props = Readonly<{
  sample?: Sample
  safeSample?: SafeSample
  onDelete?: () => void
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

@withContext(AppContext.Consumer)
@withContext(SampleInfoContext.Consumer)
@(withNavigation as any)
export class SampleInfoHeaderAction extends React.PureComponent<Props> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  _subscribe: Subscription

  componentWillUnmount() {
    this._subscribe && this._subscribe.unsubscribe()
  }

  onArchive = () => {
    const { sampleFactory, sample } = this.props
    if (!sample) return

    sampleFactory
      .update(sample.id, {
        archived: true,
      })
      .subscribe(() => {
        console.warn('Archived')
      })
  }

  /**
   * Get data from local storage and then convert it to type that
   * share library can read
   */
  onShare = async () => {
    try {
      const { safeSample } = this.props
      const {
        name,
        images: { first },
      } = safeSample

      const imageId = new SafeImage(first).id

      if (!imageId) {
        const message = I18n.t('noImageToShare')
        if (devices.isAndroid) {
          ToastAndroid.show(message, ToastAndroid.SHORT)
        } else {
          Alert.alert(message)
        }
        return
      }

      lCache.retrieveArrayImage([imageId]).then(data => {
        if (data.length <= 0) {
          const message = I18n.t('noImageToShare')
          if (devices.isAndroid) {
            ToastAndroid.show(message, ToastAndroid.SHORT)
          } else {
            Alert.alert(message)
          }
          return
        }
        /**
         * Convert base64 get from local storage, so it can share
         */
        const convert2Base64Image = 'data:image/png;base64,' + data[0].base64

        // Cannot share multiple images via WeChat
        const shareOption = devices.isAndroid
          ? {
              title: name,
              url: convert2Base64Image,
            }
          : {
              title: name,
              urls: [convert2Base64Image],
              type: 'image/png',
              message: name,
              subject: 'Sample',
            }
        Share.open(shareOption)
          .then(_shareData => {})
          .catch(error => {
            console.log('share error', error)
          })
      })
    } catch (e) {}
  }

  confirmDelete = () => {
    CustomAlert.alertYesNo({
      message: I18n.t('deleteSampleConfirm'),
      onPressYes: this.props.onDelete,
      onPressNo: () => {},
    })
  }

  onPress = debounce((index: number) => {
    switch (index) {
      case 0:
        this.confirmDelete()
        return
      case 1:
        this.onArchive()
        return
      default:
        return
    }
  }, 100)

  onComment = () => {
    onAddSampleComment.next()
  }

  render() {
    return (
      <AControl>
        <AControlButton
          source={images.comment}
          title={I18n.t('commentAdd')}
          onPress={this.onComment}
          isGradient={true}
          wrapperIconStyle={styles.icon}
          containerStyle={styles.container}
        />
        <AControlButton
          source={images.share}
          title={I18n.t('share')}
          onPress={this.onShare}
          isGradient={true}
        />
        <AControlButton
          source={images.more}
          title={I18n.t('more')}
          isGradient={true}
          onPress={() => this._actionSheet.current.show()}
          containerStyle={styles.container}
        />

        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('more').capitalize()}
          options={[
            I18n.t('delete'),
            I18n.t('archiveSample'),
            I18n.t('cancel'),
          ]}
          destructiveButtonIndex={0}
          cancelButtonIndex={2}
          onPress={this.onPress}
        />
      </AControl>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    width: selectPlatform({
      iPad: 95,
      default: 88,
    }),
  },
  icon: {
    tintColor: 'white',
  },
})
