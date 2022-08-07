import I18n from '@/i18n'
import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { SupplierInfoContext } from '@/screens/SupplierInfo/SupplierInfoContext'
import { withContext } from '@/shared/withContext'
import { images } from '@/vars'
import * as React from 'react'
import ActionSheet from 'react-native-actionsheet'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { AControl } from '@/components/AControl/AControl'
import { AControlButton } from '@/components/AControl/AControlButton'
import { CustomAlert } from '@/shared/alert'

type Props = Readonly<{
  supplier?: Supplier
  addPhoto?: () => void
  onDelete?: () => void
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

@withContext(AppContext.Consumer)
@withContext(SupplierInfoContext.Consumer)
@(withNavigation as any)
export class SupplierInfoHeaderAction extends React.PureComponent<Props> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()

  confirmDelete = () => {
    CustomAlert.alertYesNo({
      message: I18n.t('deleteSupplierConfirm'),
      onPressYes: this.props.onDelete,
      onPressNo: () => {},
    })
  }

  onPress = (index: number) => {
    switch (index) {
      case 0:
        this.confirmDelete()
        return
      default:
        return
    }
  }

  createProduct = () => {
    const { navigation, supplier } = this.props
    navigation.navigate('CameraScreen', {
      supplier,
    })
  }

  render() {
    return (
      <AControl>
        <AControlButton
          source={images.product}
          title={I18n.t('newProduct')}
          onPress={this.createProduct}
        />
        <AControlButton
          source={images.camera}
          title={I18n.t('addPicture')}
          onPress={this.props.addPhoto}
        />
        <AControlButton
          source={images.more}
          title={I18n.t('more')}
          onPress={() => {
            this._actionSheet.current.show()
          }}
        />

        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('more').capitalize()}
          options={[I18n.t('deleteSupplier'), I18n.t('cancel')]}
          destructiveButtonIndex={0}
          cancelButtonIndex={1}
          onPress={this.onPress}
        />
      </AControl>
    )
  }
}
