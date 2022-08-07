import * as React from 'react'
import I18n from '@/i18n'
import { imageStore3 } from '@/stores/imageStore3'
import { lCache } from '@/libs/LCache'
import { createProductStore } from '@/stores/createProductStore'
import { AHeader } from '@/components/AHeader/AHeader'
import { StyleSheet } from 'react-native'
import { colors } from '@/vars'
import { cameraStore } from '@/stores/cameraStore'

// default props
const defaultProps = {}

// define type
type DefaultProps = typeof defaultProps

type Props = {
  onPressIconLeft: () => void
  backButtonIOSTitle?: string
  renderRight?: any
} & DefaultProps

export class CreateProductHeader extends React.PureComponent<Props> {
  onPressIconLeft = () => {
    imageStore3.clear()
    lCache.clear()
    cameraStore.clear()
    createProductStore.clear()

    this.props.onPressIconLeft()
  }

  render() {
    const { renderRight, backButtonIOSTitle } = this.props
    return (
      <AHeader
        title={I18n.t('createProduct')}
        onPressIconLeft={this.onPressIconLeft}
        renderBackButtonIOS={true}
        backButtonIOSStyle={styles.flexNone}
        backButtonIOSTextStyle={styles.backIOS}
        containerStyle={styles.headerContainer}
        backButtonIOSTitle={backButtonIOSTitle}
        renderRight={renderRight}
        wrapTitleStyle={styles.title}
      />
    )
  }
}

const styles = StyleSheet.create<any>({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border_header,
  },
  backIOS: {
    color: colors.back_button_ios_color,
  },
  flexNone: {
    flex: 0.5,
  },
  title: {
    flex: 2,
  },
})
