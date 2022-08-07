import { AControl } from '@/components/AControl/AControl'
import { AControlButton } from '@/components/AControl/AControlButton'
import I18n from '@/i18n'
import { Product } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import { ProductInfoContext } from '@/screens/ProductInfo/ProductInfoContext'
import { SafeProduct } from '@/shared/product'
import { withContext } from '@/shared/withContext'
import { images } from '@/vars'
import * as React from 'react'
import ActionSheet from 'react-native-actionsheet'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { CameraMode } from '@/common/constants/CameraMode'
import { CustomAlert } from '@/shared/alert'
import { debounce } from 'lodash'
import { SafeImage } from '@/shared/image'
import Share from 'react-native-share'
import { Subscription } from 'rxjs'
import { lCache } from '@/libs/LCache'
import { StyleSheet } from 'react-native'

type Props = Readonly<{
  product?: Product
  safeProduct?: SafeProduct
  onDelete?: () => void
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

@withContext(AppContext.Consumer)
@withContext(ProductInfoContext.Consumer)
@(withNavigation as any)
export class ProductInfoHeaderAction extends React.PureComponent<Props> {
  _actionSheet: React.RefObject<ActionSheet> = React.createRef()
  _subscribe: Subscription
  _duplicateProduct: Subscription

  componentWillUnmount() {
    this._subscribe && this._subscribe.unsubscribe()
    this._duplicateProduct && this._duplicateProduct.unsubscribe()
  }

  onCopy = (alternateName: string) => {
    const { productFactory, product } = this.props
    const data = {
      ...product,
      name: alternateName,
    }

    this._duplicateProduct = productFactory.duplicate(data).subscribe()
  }

  /**
   * Get data from local storage and then convert it to type base64 that
   * share library can read
   */
  onShare = async () => {
    try {
      const { safeProduct } = this.props
      const {
        name,
        images: { first },
      } = safeProduct

      const imageId = new SafeImage(first).id

      if (!imageId) return

      lCache.retrieveArrayImage([imageId]).then(data => {
        if (data.length <= 0) return

        const convert2Base64Image = 'data:image/png;base64,' + data[0].base64

        Share.open({
          title: name,
          url: convert2Base64Image,
        })
          .then(_shareData => {})
          .catch(error => {
            console.log('share error', error)
          })
      })
    } catch (e) {}
  }

  confirmDelete = () => {
    CustomAlert.alertYesNo({
      message: I18n.t('deleteProductConfirm'),
      onPressYes: this.props.onDelete,
      onPressNo: () => {},
    })
  }

  onPress = debounce((index: number) => {
    const { safeProduct } = this.props

    switch (index) {
      case 0:
        this.confirmDelete()
        return
      case 1:
        this.onCopy(`${safeProduct.name} - Alternate`)
        return
      case 2:
        this.onCopy(`${safeProduct.name} - Copy`)
        return
      default:
        return
    }
  }, 100)

  onPressAddPicture = () => {
    const { navigation, safeProduct } = this.props

    navigation.navigate('CameraScreen', {
      isAddProductPhoto: true,
      cameraMode: CameraMode.Product,
      supplier: safeProduct.supplier,
    })
  }

  onAddTask = () => {
    const { navigation, product } = this.props
    navigation.navigate('CreateTaskPicker', { product })
  }

  onAddSample = () => {
    const { navigation, product } = this.props
    navigation.navigate('CreateSamplePicker', { product })
  }

  render() {
    return (
      <AControl>
        <AControlButton
          source={images.tasksChecked}
          title={I18n.t('taskAdd')}
          onPress={this.onAddTask}
          wrapperIconStyle={styles.task}
          isGradient={true}
        />
        <AControlButton
          source={images.sample}
          title={I18n.t('addSample')}
          onPress={this.onAddSample}
          wrapperIconStyle={styles.sample}
          isGradient={true}
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
          onPress={() => {
            this._actionSheet.current.show()
          }}
          isGradient={true}
        />

        <ActionSheet
          ref={this._actionSheet}
          title={I18n.t('more').capitalize()}
          options={[
            I18n.t('delete'),
            I18n.t('createAlternate'),
            I18n.t('duplicateProduct'),
            I18n.t('cancel'),
          ]}
          destructiveButtonIndex={0}
          cancelButtonIndex={3}
          onPress={this.onPress}
        />
      </AControl>
    )
  }
}

const styles = StyleSheet.create({
  sample: {
    tintColor: 'white',
    marginLeft: 4,
    marginTop: 2,
  },
  task: {
    tintColor: 'white',
  },
})
