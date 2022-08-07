import * as React from 'react'
import { StyleSheet } from 'react-native'
import { colors, images, metrics } from '@/vars'
import { AHeader } from '@/components/AHeader/AHeader'
import { confirmDialog } from '@/shared/dialog'
import I18n from '@/i18n'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  onPressGoBack: () => void
  addPicture: () => void
  deleteImage: () => void
} & DefaultProps

export type State = Readonly<typeof initialState>

export class GalleryPictureHeader extends React.PureComponent<Props, State> {
  readonly state: State = initialState

  confirmDelete = () => {
    confirmDialog({
      message: I18n.t('areYouSure'),
      onPressRight: this.props.deleteImage,
    })
  }

  render() {
    const { onPressGoBack, addPicture } = this.props

    return (
      <AHeader
        // icon left
        iconLeft={images.closeIcon}
        onPressIconLeft={onPressGoBack}
        iconLeftStyle={styles.iconLeftCustom}
        // icon right 1
        iconRight={images.camera2}
        onPressIconRight={addPicture}
        iconRightStyle={styles.iconRightCustom}
        wrapIconRightStyle={styles.wrapIconRight}
        // icon right 2
        iconRight2={images.trashBin}
        onPressIconRight2={this.confirmDelete}
        iconRightStyle2={styles.iconRight2Custom}
        wrapIconRightStyle2={styles.wrapIconRight2}
        // other configure
        isGallery={true}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  iconLeftCustom: {
    width: metrics.gallery_picture_screen_headerIconLeftCustom_width,
    height: metrics.gallery_picture_screen_headerIconLeftCustom_height,
    tintColor: colors.white,
  },
  wrapIconRight: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconRightCustom: {
    width: metrics.gallery_picture_screen_iconRight_width,
    height: metrics.gallery_picture_screen_iconRight_height,
  },
  iconRight2Custom: {
    tintColor: colors.white,
    width: metrics.gallery_picture_screen_iconRight2_width,
    height: metrics.gallery_picture_screen_iconRight2_height,
    marginLeft: metrics.gallery_picture_screen_iconRight2_marginLeft,
    marginRight: metrics.gallery_picture_screen_iconRight2_marginRight,
  },
  wrapIconRight2: {
    width: metrics.gallery_picture_screen_iconRight_width,
    height: metrics.gallery_picture_screen_iconRight_height,
    justifyContent: 'flex-start',
  },
})
