import * as React from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { colors, fonts, metrics } from '@/vars'
import Carousel from 'react-native-snap-carousel'
import { GalleryPictureAction } from './Components/GalleryPictureAction'
import I18n from '@/i18n'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { NavigationService } from '@/services/navigation'
import { CameraMode } from '@/common/constants/CameraMode'
import { Sample, Supplier } from '@/models/team'
import { PaintingScreen } from '@/screens/Painting/PaintingScreen'
import {
  editImageDataSubject,
  editImageSupplierSubject,
  imageKeyUpdate,
  onImageProductInfo,
  onImageSampleInfo,
  onImageSupplierInfo,
  renderImageProgress,
  updateCameraImage,
} from '@/services/global'
import { Subscription } from 'rxjs'
import { CacheResult } from '@/locals/models/cache-result'
import { insert } from 'ramda'
import { debounce } from 'lodash'
import { SafeImage } from '@/shared/image'
import { imageStore3, Source } from '@/stores/imageStore3'
import { lCache } from '@/libs/LCache'
import { cameraStore } from '@/stores/cameraStore'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { GalleryPictureHeader } from '@/screens/GalleryPicture/Components/GalleryPictureHeader'
import { GalleryPictureImage } from '@/screens/GalleryPicture/Components/GalleryPictureImage'
import { GalleryPictureImageCount } from '@/screens/GalleryPicture/Components/GalleryPictureImageCount'

type Props = AppContextState &
  NavigationInjectedProps<{
    imagesInfo: string[]
    imageData: string[]
    imageKey: { id: string; base64: string }[]
    sample: Sample
    isSample?: boolean
    isSampleAddPicture?: boolean
    isSupplier: boolean
    isCreateProduct: boolean
    imageType: string[]
    isSupplierAddPicture: boolean
    callbackEditImage?: (imageType: string[]) => void
    productId: string
    supplier?: Supplier
    currentIndexImage?: number
    fromScreen?: 'Camera' | undefined
  }>

export type State = Readonly<{
  isScrollList: boolean
  isEdit: boolean
  imageData: any
  isCreateProduct: boolean
  currentIndex: number
  mainPicture: number
  renderImageProgress: boolean
  imageIds: string[]
  loading: boolean
}>

@withContext(AppContext.Consumer)
export class GalleryPictureScreen extends React.PureComponent<Props, State> {
  _navigation: NavigationService = new NavigationService(this.props.navigation)
  _productInfoImage: string[] = []
  _productInfoImageIsCreate: string[] = []
  _galleryURLSubscribe: Subscription
  _imageProductSubscribe: Subscription
  _imageSampleSubscribe: Subscription
  _renderIPSubscription: Subscription
  _imageSupplierSubscribe: Subscription
  _imageKeyUpdate: Subscription
  _results: Realm.Results<CacheResult> | undefined
  indexImageEdit = 0
  _imageKey: { id: string; base64: string }[] = []
  isReplaceAcceptOnSuccess = false
  isMainPictureAcceptOnSuccess = false
  isDeleteAcceptOnSuccess = false
  _path = ''
  _fromScreen: string
  _onSuccessSubscription: Subscription

  readonly state: State = {
    isScrollList: true,
    isEdit: false,
    imageData: [],
    isCreateProduct: false,
    currentIndex: 0,
    mainPicture: 0,
    renderImageProgress: false,
    imageIds: [],
    loading: false,
  }

  static navigationOptions = {
    header: null,
  }

  componentDidMount() {
    this.initData()
    this.initDataCreateProduct()
  }

  componentWillUnmount() {
    this._imageSupplierSubscribe && this._imageSupplierSubscribe.unsubscribe()
    this._imageProductSubscribe && this._imageProductSubscribe.unsubscribe()
    this._imageSampleSubscribe && this._imageSampleSubscribe.unsubscribe()
    this._galleryURLSubscribe && this._galleryURLSubscribe.unsubscribe()
    this._renderIPSubscription && this._renderIPSubscription.unsubscribe()
    this._imageKeyUpdate && this._imageKeyUpdate.unsubscribe()
    this._onSuccessSubscription && this._onSuccessSubscription.unsubscribe()

    this._results && this._results.removeAllListeners()
  }

  navigationData = () => {
    const { navigation } = this.props

    const imagesInfo = navigation.getParam('imagesInfo', [])
    const imageData = navigation.getParam('imageData', [])
    const currentIndex = navigation.getParam('currentIndexImage', 0)
    const isCreateProduct = navigation.getParam('isCreateProduct', false)
    const imageKey = navigation.getParam('imageKey', [])
    const fromScreen = navigation.getParam('fromScreen', 'Camera')
    const imageType = navigation.getParam('imageType', [])
    const currentIndexImage = navigation.getParam('currentIndexImage', 0)
    const productId = navigation.getParam('productId', '')
    const supplier = navigation.getParam('supplier', null)
    const isSupplierAddPicture = navigation.getParam(
      'isSupplierAddPicture',
      false
    )
    const isSupplier = navigation.getParam('isSupplier', false)
    const callbackEditImage = this.props.navigation.getParam(
      'callbackEditImage',
      () => {}
    )
    const sample = navigation.getParam('sample', null)
    const isSampleAddPicture = navigation.getParam('isSampleAddPicture', false)
    const isSample = navigation.getParam('isSample', false)

    return {
      imagesInfo,
      imageData,
      currentIndex,
      isCreateProduct,
      imageKey,
      fromScreen,
      imageType,
      currentIndexImage,
      productId,
      supplier,
      isSupplierAddPicture,
      isSupplier,
      callbackEditImage,
      sample,
      isSample,
      isSampleAddPicture,
    }
  }

  /* INIT DATA */
  initData = () => {
    const {
      imagesInfo,
      fromScreen,
      imageData,
      currentIndex,
      isCreateProduct,
    } = this.navigationData()

    this._productInfoImage = imagesInfo
    this._fromScreen = fromScreen

    this.initImageSubscribe()

    this._onSuccessSubscription = cameraStore.observer.subscribe(data => {
      this.onSuccess(data)
    })

    this._renderIPSubscription = renderImageProgress.subscribe(() => {
      this.setState({
        renderImageProgress: true,
      })
    })

    this.setState({
      imageData,
      currentIndex,
      isCreateProduct,
    })
  }

  initImageSubscribe = () => {
    this._imageProductSubscribe = onImageProductInfo.subscribe(data => {
      const { imageData } = data

      if (imageData.length <= 0) {
        this.createCallBack()
        this.props.navigation.goBack()
        return
      }

      this.setState({
        imageData,
      })
    })

    this._imageSampleSubscribe = onImageSampleInfo.subscribe(data => {
      const { imageData } = data

      if (imageData.length <= 0) {
        this.createCallBack()
        this.props.navigation.goBack()
        return
      }

      this.setState({
        imageData,
      })
    })

    this._imageSupplierSubscribe = onImageSupplierInfo.subscribe(data => {
      const { imageData } = data

      if (imageData.length <= 0) {
        this.createCallBack()
        this.props.navigation.goBack()
        return
      }

      this.setState({
        imageData,
      })
    })
  }

  initDataCreateProduct = () => {
    const {
      imageType,
      imageData,
      isCreateProduct,
      imageKey,
    } = this.navigationData()

    if (!isCreateProduct) return

    this._imageKeyUpdate = imageKeyUpdate.subscribe(data => {
      this._imageKey = data as any
    })

    if (imageType.length > 0) {
      this._productInfoImageIsCreate = imageType
    } else {
      imageData.map(() => {
        this._productInfoImageIsCreate.push('Photo')
      })
    }

    this._imageKey = imageKey
  }

  /* UPDATE IMAGE PROMISE RETURN SUCCESS HANDLE */
  onSuccess = data => {
    this.onSuccessUpdateMainImage(data)
    this.onSuccessDeletedImage()
    this.onSuccessReplaceImage(data)
  }

  onSuccessUpdateMainImage = data => {
    if (!this.isMainPictureAcceptOnSuccess) return

    this._imageKey = data
    this.setState(
      {
        isEdit: false,
        loading: false,
      },
      () => {
        this.forceUpdate()
      }
    )
  }

  onSuccessDeletedImage = () => {
    if (!this.isDeleteAcceptOnSuccess) return

    this.setState(
      {
        isEdit: false,
        loading: false,
      },
      () => {
        this.forceUpdate()
      }
    )
  }

  onSuccessReplaceImage = data => {
    if (!this.isReplaceAcceptOnSuccess) return

    const { imageData, currentIndex } = this.state
    const { isCreateProduct } = this.navigationData()

    renderImageProgress.next(true)

    if (isCreateProduct) {
      if (this._productInfoImageIsCreate[currentIndex] === 'Photo') {
        this.overridePhoto(currentIndex, true, data)
      } else {
        this.overrideDrawing(imageData, currentIndex, true, data)
      }
    } else {
      if (this._productInfoImage[currentIndex] === 'Photo') {
        this.overridePhoto(currentIndex, false, data)
      } else {
        this.overrideDrawing(imageData, currentIndex, false, data)
      }
    }
  }

  /* DELETE HANDLE */
  deleteImage = debounce(() => {
    const { currentIndex, imageData } = this.state
    const { isCreateProduct } = this.navigationData()

    // Update current action
    this.isDeleteAcceptOnSuccess = true
    this.isMainPictureAcceptOnSuccess = false
    this.isReplaceAcceptOnSuccess = false

    renderImageProgress.next(true)

    if (!isCreateProduct && imageData.length <= 1) {
      return alert(I18n.t('youCanNotDeleteImage'))
    }

    // remove and update image to state an realm
    const newImageData = imageData.filter((_, index) => index !== currentIndex)
    this.updateToRealm(true, newImageData, currentIndex)

    this.setState({
      imageData: newImageData,
    })

    // fix number of image if delete the last image
    if (currentIndex === imageData.length - 1) {
      this.setState({ currentIndex: newImageData.length - 1 })
    }

    this._productInfoImage.splice(currentIndex, 1)

    // update list image in camera screen
    if (isCreateProduct) {
      this._productInfoImageIsCreate.splice(currentIndex, 1)
      cameraStore.delete(currentIndex)

      newImageData.length <= 0 && this.onPressGoBack()
    }
  }, 100)

  /* CHANGE MAIN IMAGE HANDLE */
  mainPicture = debounce(() => {
    const { isCreateProduct } = this.navigationData()
    const { currentIndex, imageData } = this.state

    // Update action
    this.isMainPictureAcceptOnSuccess = true
    this.isDeleteAcceptOnSuccess = false
    this.isReplaceAcceptOnSuccess = false

    renderImageProgress.next(true)

    // Update data to state and realm
    const newImageData = imageData.move(currentIndex, 0)
    this._productInfoImage = this._productInfoImage.move(currentIndex, 0)
    this.updateToRealm(false, newImageData as any, currentIndex)
    this.setState({
      imageData: newImageData,
    })

    if (isCreateProduct) {
      cameraStore.rearrange(currentIndex, 0)
      this._productInfoImageIsCreate = this._productInfoImageIsCreate.move(
        currentIndex,
        0
      )
    }
  }, 100)

  /* ADD IMAGE HANDLE */
  addPicture = () => {
    const { navigation } = this.props
    const {
      isSupplierAddPicture,
      supplier,
      isCreateProduct,
      sample,
      isSampleAddPicture,
    } = this.navigationData()

    updateCameraImage.next({ imageData: this.state.imageData })

    this.createCallBack()

    if (!isCreateProduct && isSampleAddPicture) {
      this._navigation.replace('CameraScreen', {
        sample,
        cameraMode: CameraMode.Sample,
        isAddSamplePhoto: true,
      })

      return
    }

    if (!isCreateProduct && isSupplierAddPicture) {
      this._navigation.replace('CameraScreen', {
        supplier,
        cameraMode: CameraMode.Supplier,
        isAddSupplierPhoto: true,
      })

      return
    }
    if (!isCreateProduct && !isSupplierAddPicture) {
      this._navigation.replace('CameraScreen', {
        supplier,
        isAddProductPhoto: true,
        cameraMode: CameraMode.Product,
      })

      return
    }

    navigation.goBack()
  }

  /* REALM HANDLE */
  updateToRealm = (
    isDelete: boolean = false,
    newImageData: string[],
    currentIndex: number
  ) => {
    const { productFactory, supplierFactory, sampleFactory } = this.props
    const { productId, supplier, isSample, sample } = this.navigationData()

    if (isSample) {
      sampleFactory.updateImage(sample.id, currentIndex, isDelete).subscribe(
        () => {
          editImageDataSubject.next(newImageData)
        },
        () => {}
      )
      return
    }
    if (productId !== '') {
      productFactory.updateImage(productId, currentIndex, isDelete).subscribe(
        () => {
          editImageDataSubject.next(newImageData)
        },
        () => {}
      )

      return
    }
    if (supplier && supplier.id !== '') {
      supplierFactory
        .updateImage(supplier.id, currentIndex, isDelete)
        .subscribe(
          () => {
            editImageSupplierSubject.next(newImageData)
          },
          () => {}
        )

      return
    }
  }

  /* GET DATA RENDER */
  get numberOfImage() {
    const { currentIndex, imageData, isCreateProduct } = this.state

    if (isCreateProduct) {
      if (currentIndex >= this._imageKey.length) {
        const currentImage = this._imageKey.length
        return `${currentImage.toString()} / ${this._imageKey.length.toString()}`
      }

      const currentImage = currentIndex + 1
      return `${currentImage.toString()} / ${this._imageKey.length.toString()}`
    }

    if (currentIndex >= imageData.length) {
      const currentImage = imageData.length
      return `${currentImage.toString()} / ${imageData.length.toString()}`
    }

    const currentImage = currentIndex + 1
    return `${currentImage.toString()} / ${imageData.length.toString()}`
  }

  get isMainPicture() {
    const { mainPicture, currentIndex } = this.state

    return mainPicture === currentIndex
  }

  /* ON PRESS EDIT IMAGE HANDLE */
  alertEditEmpty = () => {
    Alert.alert(
      null,
      I18n.t('imageIsEmpty'),
      [
        {
          text: I18n.t('cancel'),
          onPress: () => {},
        },
      ],
      { cancelable: false }
    )
  }

  onPressEdit = () => {
    const { isCreateProduct } = this.navigationData()
    const { imageData, currentIndex } = this.state
    const { uri, id } = new SafeImage(imageData[currentIndex])

    if (isCreateProduct) {
      if (uri === '') {
        this.alertEditEmpty()
      } else {
        this.setState({ isEdit: true })
      }

      return
    }

    lCache.retrieveImage(id).then(photoPath => {
      if (photoPath.path === '') {
        this.alertEditEmpty()
      } else {
        this.setState({ isEdit: true })
      }
    })
  }

  /* EDIT IMAGE HANDLE */
  onEdit = (
    path: string,
    currentIndex: number,
    isEditImage: boolean,
    pathsCount: number
  ) => {
    // Update action
    this.isReplaceAcceptOnSuccess = true
    this.isDeleteAcceptOnSuccess = false
    this.isMainPictureAcceptOnSuccess = false

    renderImageProgress.next(true)

    // prevent the image save when all stroke was removed
    if (!isEditImage || pathsCount === 0) {
      this.indexImageEdit = currentIndex
      this.setState({ isEdit: false, loading: false })
      return
    }

    this._path = path

    if (this._productInfoImageIsCreate[currentIndex] === 'Photo') {
      this.indexImageEdit = currentIndex + 1
      lCache.store([path]).then(data => {
        cameraStore.putAt(data[0], currentIndex + 1)
      })

      return
    }

    if (this._productInfoImage[currentIndex] === 'Photo') {
      lCache.store([path]).then(data => {
        cameraStore.put(data)
      })
      this.indexImageEdit = currentIndex + 1

      return
    }

    this.indexImageEdit = currentIndex
    if (this._productInfoImageIsCreate[currentIndex] === 'drawing') {
      lCache.store([path]).then(data => {
        cameraStore.putReplaceAt(data[0], currentIndex)
      })
      return
    }

    lCache.store([path]).then(data => {
      cameraStore.put(data)
    })
  }

  overridePhoto = (
    currentIndex: number,
    isCreateProduct: boolean,
    data: Source
  ) => {
    const { imageData } = this.state
    const uri = this._path
    this._imageKey = data
    const arrayImage = insert(currentIndex + 1, uri, imageData)

    this.setState(
      {
        isEdit: false,
        loading: false,
        imageData: arrayImage,
        currentIndex: currentIndex + 1,
      },
      () => {
        this.forceUpdate()
      }
    )

    if (!isCreateProduct) {
      this._productInfoImage = insert(
        currentIndex + 1,
        'drawing',
        this._productInfoImage
      )

      this.overrideImage(currentIndex, 'drawing', false, data)

      return
    }

    this._productInfoImageIsCreate = insert(
      currentIndex + 1,
      'drawing',
      this._productInfoImageIsCreate
    )
  }

  overrideDrawing = (
    imageData: string[],
    currentIndex: number,
    isCreateProduct: boolean,
    data?: Source
  ) => {
    if (!isCreateProduct) {
      const imageType = 'drawing'
      const override = true
      this.setState({
        isEdit: false,
        loading: false,
      })
      this.overrideImage(currentIndex, imageType, override, data)

      return
    }

    this._imageKey = data
    this.onEditImage(imageData, currentIndex)
  }

  overrideImage = (
    currentIndex: number,
    imageType: string,
    override: boolean,
    data: Source
  ) => {
    const { productFactory, supplierFactory, sampleFactory } = this.props
    const {
      productId,
      isSupplier,
      supplier,
      sample,
      isSample,
    } = this.navigationData()

    if (isSample) {
      imageStore3.clear()
      imageStore3.append(data)
      data.map(data => {
        sampleFactory
          .updateImageAfterEdit(sample.id, {
            imageType,
            override,
            id: data.id,
            imageData: data as any,
            modifications: [currentIndex],
          })
          .subscribe(() => {})
      })

      lCache.clear()
      cameraStore.clear()
      return
    }
    if (productId !== '') {
      imageStore3.clear()
      imageStore3.append(data)

      data.map(data => {
        productFactory
          .updateImageAfterEdit(productId, {
            imageType,
            override,
            id: data.id,
            imageData: data as any,
            modifications: [currentIndex],
          })
          .subscribe(() => {})
      })

      lCache.clear()
      cameraStore.clear()
      return
    }

    if (isSupplier && supplier) {
      imageStore3.clear()
      imageStore3.append(data)
      data.map(data => {
        supplierFactory
          .updateImageAfterEdit(supplier.id, {
            imageType,
            override,
            id: data.id,
            imageData: data as any,
            modifications: [currentIndex],
          })
          .subscribe(() => {})
      })

      lCache.clear()
      cameraStore.clear()
      return
    }

    return
  }

  onEditImage = (imageData: string[], currentIndex: number) => {
    const newImage = imageData.map((img, index) => {
      if (index === currentIndex) {
        return this._path
      }
      return img
    })

    this.setState({
      isEdit: false,
      loading: false,
      imageData: newImage,
    })
  }

  /* OTHER FUNCTION */
  createCallBack = () => {
    const { callbackEditImage } = this.navigationData()

    callbackEditImage && callbackEditImage(this._productInfoImageIsCreate)
  }

  beforeReturnPath = () => {
    this.setState({ loading: true })
  }

  onClose = (currentIndex: number) => {
    this.indexImageEdit = currentIndex
    this.setState({ isEdit: false })
  }

  onBeforeSnapToItem = index => {
    this.setState({ currentIndex: index })
  }

  onPanResponder = (_event, _gestureState, zoomAbleViewEventObject) => {
    if (zoomAbleViewEventObject.zoomLevel < 1.1) {
      this.setState({
        isScrollList: true,
      })
    } else {
      this.setState({
        isScrollList: false,
      })
    }
  }

  onDoubleTapAfter = (_event, _gestureState, zoomAbleViewEventObject) => {
    if (zoomAbleViewEventObject.zoomLevel === 1) {
      this.setState({
        isScrollList: true,
      })
    } else {
      this.setState({
        isScrollList: false,
      })
    }
  }

  onZoomAfter = () => {
    this.setState({
      isScrollList: false,
    })
  }

  onPressGoBack = () => {
    const { navigation } = this.props
    const { imageData } = this.state

    updateCameraImage.next({ imageData })
    renderImageProgress.next(true)
    this.createCallBack()

    navigation.goBack()
  }

  /* RENDER COMPONENT */
  renderItem = ({ item, index }: { item: any; index: number }) => {
    const { isCreateProduct } = this.navigationData()

    if (isCreateProduct) return this.renderItemCreateProduct(index)

    return this.renderItemNormal(item)
  }

  renderItemCreateProduct = (index: number) => {
    const id =
      this._imageKey[index] && this._imageKey[index].id
        ? this._imageKey[index].id
        : ''

    return (
      <GalleryPictureImage
        uri={''}
        id={id}
        onPanResponder={this.onPanResponder}
        onDoubleTapAfter={this.onDoubleTapAfter}
        onZoomAfter={this.onZoomAfter}
      />
    )
  }

  renderItemNormal = (item: any) => {
    const { uri, id } = new SafeImage(item)

    return (
      <GalleryPictureImage
        uri={uri}
        id={id}
        onPanResponder={this.onPanResponder}
        onDoubleTapAfter={this.onDoubleTapAfter}
        onZoomAfter={this.onZoomAfter}
      />
    )
  }

  carouselUseIdLocal = () => {
    const { isScrollList } = this.state
    const { currentIndexImage, isCreateProduct } = this.navigationData()
    const dataLocal = this._imageKey.map(data => data.id)
    const firstItem =
      this.indexImageEdit > 0 ? this.indexImageEdit : currentIndexImage

    if (!isCreateProduct) return null

    return (
      <Carousel
        data={dataLocal}
        firstItem={firstItem}
        renderItem={this.renderItem}
        scrollEnabled={isScrollList}
        lockScrollWhileSnapping={true}
        sliderWidth={metrics.screen_width}
        itemWidth={metrics.screen_width}
        onBeforeSnapToItem={this.onBeforeSnapToItem}
        initialNumToRender={dataLocal.length}
        inactiveSlideScale={0.7}
        inactiveSlideOpacity={0.4}
        loop={false}
        loopClonesPerSide={1}
        hasParallaxImages={true}
      />
    )
  }

  carouselUseNormal = () => {
    const { isScrollList } = this.state
    const { currentIndexImage, isCreateProduct } = this.navigationData()
    const { imageData } = this.state
    const firstItem =
      this.indexImageEdit > 0 ? this.indexImageEdit : currentIndexImage

    if (isCreateProduct) return null

    return (
      <Carousel
        data={imageData}
        firstItem={firstItem}
        scrollEnabled={isScrollList}
        lockScrollWhileSnapping={true}
        renderItem={this.renderItem}
        sliderWidth={metrics.screen_width}
        itemWidth={metrics.screen_width}
        onBeforeSnapToItem={this.onBeforeSnapToItem}
        initialNumToRender={imageData.length}
        inactiveSlideScale={0.7}
        inactiveSlideOpacity={0.4}
        loop={false}
        loopClonesPerSide={1}
        hasParallaxImages={true}
      />
    )
  }

  renderEditComponent = () => {
    const { fromScreen } = this.navigationData()
    const { imageData, currentIndex, loading, isEdit } = this.state

    if (!isEdit) return null

    return (
      <SafeAreaView style={styles.container}>
        <PaintingScreen
          imageData={imageData[currentIndex]}
          currentIndex={currentIndex}
          onEdit={this.onEdit}
          beforeReturnPath={this.beforeReturnPath}
          onClose={this.onClose}
          fromScreen={fromScreen}
        />

        {loading && (
          <AIndicator
            full
            color={colors.white}
            containerStyle={styles.loadingContainer}
          />
        )}
      </SafeAreaView>
    )
  }

  render() {
    const { isEdit } = this.state

    if (isEdit) return this.renderEditComponent()

    return (
      <SafeAreaView style={styles.container}>
        <GalleryPictureHeader
          onPressGoBack={this.onPressGoBack}
          addPicture={this.addPicture}
          deleteImage={this.deleteImage}
        />

        <View style={styles.wrapImage}>
          {this.carouselUseIdLocal()}
          {this.carouselUseNormal()}

          <GalleryPictureImageCount count={this.numberOfImage} />
        </View>

        <GalleryPictureAction
          onPressEdit={this.onPressEdit}
          onPressMainPicture={this.mainPicture}
          isMainPicture={this.isMainPicture}
        />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  wrapImage: {
    flex: 1,
  },
  image: {
    height: metrics.screen_height - 162,
    width: metrics.screen_width,
  },
  text: {
    color: colors.white,
    fontSize: fonts.size.s,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
  },
})
