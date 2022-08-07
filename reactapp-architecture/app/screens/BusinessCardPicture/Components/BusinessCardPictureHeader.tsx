import * as React from 'react'
import { StyleSheet } from 'react-native'
import { colors, images } from '@/vars'
import { AHeader } from '@/components/AHeader/AHeader'

// init state
const initialState = {}

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  onPressGoBack: () => void
  changePicture: () => void
} & DefaultProps

export type State = Readonly<typeof initialState>

export class BusinessCardPictureHeader extends React.PureComponent<
  Props,
  State
> {
  readonly state: State = initialState

  render() {
    const { onPressGoBack, changePicture } = this.props

    return (
      <AHeader
        // icon left
        iconLeft={images.closeIcon}
        onPressIconLeft={onPressGoBack}
        iconLeftStyle={styles.iconLeftCustom}
        // icon right
        iconRight={images.camera}
        onPressIconRight={changePicture}
        wrapIconRightStyle={styles.wrapIconRightCustom}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  iconLeftCustom: {
    tintColor: colors.white,
  },
  wrapIconRightCustom: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})
