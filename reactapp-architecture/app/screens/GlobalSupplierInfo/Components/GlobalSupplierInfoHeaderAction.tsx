import I18n from '@/i18n'
import { colors, images } from '@/vars'
import * as React from 'react'
import { AControl } from '@/components/AControl/AControl'
import { AControlButton } from '@/components/AControl/AControlButton'
import { Alert, StyleSheet } from 'react-native'
import { withContext } from '@/shared/withContext'
import { GlobalSupplierInfoContext } from '../GlobalSupplierInfoContext'

type Props = Readonly<{
  saveSupplier?: () => void
}>

@withContext(GlobalSupplierInfoContext.Consumer)
export class GlobalSupplierInfoHeaderAction extends React.PureComponent<Props> {
  onPress = () => {
    Alert.alert(
      '',
      I18n.t('alertWillAddSupplierToAccount'),
      [
        {
          text: I18n.t('cancel'),
          onPress: () => {},
        },
        {
          text: I18n.t('addSupplier'),
          onPress: this.onPressSave,
          style: 'destructive',
        },
      ],
      { cancelable: false }
    )
  }

  onPressSave = () => {
    this.props.saveSupplier && this.props.saveSupplier()
  }

  render() {
    return (
      <AControl>
        <AControlButton
          wrapperStyle={styles.wrapper}
          wrapperIconStyle={styles.wrapperIcon}
          source={images.product}
          title={I18n.t('newProduct')}
          onPress={this.onPress}
        />
        <AControlButton
          wrapperStyle={styles.wrapper}
          wrapperIconStyle={styles.wrapperIcon}
          source={images.camera}
          title={I18n.t('addPicture')}
          onPress={this.onPress}
        />
        <AControlButton
          wrapperStyle={styles.wrapper}
          wrapperIconStyle={styles.wrapperIcon}
          source={images.more}
          title={I18n.t('more')}
          onPress={this.onPress}
        />
      </AControl>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.close_icon_gray,
  },
  wrapperIcon: {
    tintColor: colors.light_blue_grey,
  },
})
