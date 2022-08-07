import { ACameraTooltip } from '@/components/ACamera/ACameraTooltip'
import { ACameraGrid } from '@/components/ACamera/ACameraGrid'
import { ACameraHeader } from '@/components/ACamera/ACameraHeader'
import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import I18n from '@/i18n'
import { Project, Supplier, Sample } from '@/models/team'
import {
  imageDataProductSubject,
  imageDataSampleSubject,
  imageDataSupplierSubject,
  imageKeyUpdate,
  setLoadingSnapImageBusinessCard,
  updateCameraImage,
} from '@/services/global'
import { isIphoneX } from '@/shared/devices'
import { colors, devices, metrics, fonts } from '@/vars'
import * as React from 'react'
import {
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  BackHandler,
} from 'react-native'
import { RNCamera } from 'react-native-camera'
import { NavigationInjectedProps } from 'react-navigation'
import { Dimension, Orientation } from '@/services/dimension'
import { Subscription } from 'rxjs'
import { NavigationService } from '@/services/navigation'
import ImagePicker, {
  Image as ImageResponse,
  Options,
} from 'react-native-image-crop-picker'
import { CameraMode } from '@/common/constants/CameraMode'
import { permission } from '@/shared/permission'
import { settingStore } from '@/stores/settingStore'
import { mergeMap } from 'rxjs/operators'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { pushNotification } from '@/shared/pushNotification'
import { lCache } from '@/libs/LCache'
import { fromPromise } from 'rxjs/internal-compatibility'
import { CameraFooter } from '@/screens/Camera/Components/CameraFooter'
import { createProductStore } from '@/stores/createProductStore'
import { cameraStore } from '@/stores/cameraStore'
import { AIndicator } from '@/components/AIndicator/AIndicator'

type Props = Partial<{}> &
  AppContextState &
  NavigationInjectedProps<{
    productIds: string[]
    supplier: Supplier
    project: Project[]
    sample: Sample
    isAddSamplePhoto: boolean
    isAddSupplierPhoto: boolean
    isAddProductPhoto: boolean
    isAddContactPicture: boolean
    isSnapSupplierBusinessCard: boolean
    isSnapSupplierBusinessCardFromCreateProduct: boolean
    maxFiles: number
    cameraMode: CameraMode
    isAddMore?: boolean
    forceHideBusinessCard?: boolean
    onAddMore?: (cameraData: any) => void
  }>

type State = Readonly<{
  flashModeOn: boolean
  mode: CameraMode
  imageData: string[]
  animatedScale: Animated.Value
  dimension: Orientation
  keyChangeFlash: number
  showProcessing: boolean
  processingImageIndex: number
  totalImages: number
  loadingCachingImage: boolean
}>

const MAX_FILES = 10000
const MAX_FILES_CHOOSE_IN_GALLERY = 20
const MAX_CONTACT_FILE = 1

@withContext(AppContext.Consumer)
export class CameraScreen extends React.PureComponent<Props, State> {
  _camera: React.RefObject<RNCamera> = React.createRef()
  _subscription: Subscription | undefined
  _navListener = new NavigationService(this.props.navigation)
  _imageType = []
  _updateCameraImage: Subscription
  _onSuccessSubscription: Subscription

  _maxFiles: number = MAX_FILES
  _maxFilesChooseInGallery: number = MAX_FILES_CHOOSE_IN_GALLERY
  _isBeingCapture: boolean = false
  _data = []
  _backHandler: any

  readonly state: State = {
    flashModeOn: false,
    mode: CameraMode.Product,
    imageData: [],
    animatedScale: new Animated.Value(0),
    dimension: Dimension.currentMode,
    keyChangeFlash: 0,
    showProcessing: false,
    processingImageIndex: 1,
    totalImages: 1,
    loadingCachingImage: false,
  }

  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  }

  componentDidMount() {
    this.init()
    this.initState()
    this.initSubscribe()

    this._backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackPress
    )
  }

  componentWillUnmount() {
    this._updateCameraImage && this._updateCameraImage.unsubscribe()
    this._subscription && this._subscription.unsubscribe()
    this._navListener && this._navListener.removeListener()
    this._onSuccessSubscription && this._onSuccessSubscription.unsubscribe()

    this._backHandler && this._backHandler.remove()
  }

  get navigationData() {
    const { navigation } = this.props

    const cameraMode = navigation.getParam('cameraMode', CameraMode.Product)
    const maxFiles = navigation.getParam(
      'maxFiles',
      MAX_FILES_CHOOSE_IN_GALLERY
    )
    const isAddContactPicture = this.props.navigation.getParam(
      'isAddContactPicture',
      false
    )
    const supplier = navigation.getParam('supplier', null)
    const sample = navigation.getParam('sample', null)
    const project = navigation.getParam('project', [])
    const isAddSupplierPhoto = navigation.getParam('isAddSupplierPhoto', false)
    const isAddProductPhoto = navigation.getParam('isAddProductPhoto', false)
    const isAddSamplePhoto = navigation.getParam('isAddSamplePhoto', false)
    const isSnapSupplierBusinessCard = navigation.getParam(
      'isSnapSupplierBusinessCard',
      false
    )
    const isAddMore = navigation.getParam('isAddMore', false)
    const onAddMore = navigation.getParam('onAddMore')
    const forceHideBusinessCard = navigation.getParam(
      'forceHideBusinessCard',
      false
    )

    return {
      maxFiles,
      cameraMode,
      isAddContactPicture,
      supplier,
      sample,
      project,
      isAddSamplePhoto,
      isAddSupplierPhoto,
      isAddProductPhoto,
      isSnapSupplierBusinessCard,
      isAddMore,
      onAddMore,
      forceHideBusinessCard,
    }
  }

  init = () => {
    this._navListener.setBarStyle('light-content')
  }

  initState = () => {
    const { maxFiles, cameraMode } = this.navigationData

    this._maxFiles = maxFiles === MAX_CONTACT_FILE ? maxFiles : MAX_FILES
    this._maxFilesChooseInGallery = maxFiles

    this.setState({
      mode: cameraMode,
    })
  }

  initSubscribe = () => {
    /**
     * Check dimension on Ipad
     * */
    this._subscription = Dimension.onChange().subscribe(value => {
      const { dimension } = this.state

      if (dimension !== value) {
        // @ts-ignore
        this.setState({
          dimension: value,
        })
      }
    })

    /**
     * Update image Data from gallery
     * */
    this._updateCameraImage = updateCameraImage.subscribe(data => {
      this.setState({ imageData: data.imageData })
    })

    this._onSuccessSubscription = cameraStore.observer.subscribe(data => {
      imageKeyUpdate.next(data)
    })
  }

  handleBackPress = () => {
    const { navigation } = this.props
    const { isAddContactPicture } = this.navigationData

    if (isAddContactPicture) {
      setLoadingSnapImageBusinessCard.next(false)
      navigation.goBack()
      return true
    }

    createProductStore.clear()
    lCache.cleanCache()
    cameraStore.clear()

    navigation.goBack()
    return true
  }

  onChangeFlash = () => {
    this.setState((prevState: State) => ({
      flashModeOn: !prevState.flashModeOn,
      keyChangeFlash: prevState.keyChangeFlash + 1,
    }))
  }

  onChangeCameraMode = (newMode: CameraMode) => {
    const { mode } = this.state

    if (mode !== CameraMode.Product && mode !== CameraMode.Supplier) {
      this.setState({
        imageData: [],
      })

      lCache.cleanCache()
      cameraStore.clear()
    }

    this._maxFiles =
      newMode === CameraMode.BusinessCard ? MAX_CONTACT_FILE : MAX_FILES

    this._maxFilesChooseInGallery =
      newMode === CameraMode.BusinessCard
        ? MAX_CONTACT_FILE
        : MAX_FILES_CHOOSE_IN_GALLERY

    this.setState({
      mode: newMode,
    })
  }

  onOpenViewMode = () => {
    const { navigate } = this.props.navigation
    const { imageData } = this.state

    if (imageData.length <= 0) return

    const data = cameraStore.data
    navigate('GalleryPictureScreen', {
      imageData,
      imageKey: data,
      imageType: this._imageType,
      isCreateProduct: true,
      callbackEditImage: this.callbackEditImage,
      fromScreen: 'Camera',
    })
  }

  onPressClose = () => {
    const { navigation } = this.props
    const { isAddContactPicture } = this.navigationData

    if (isAddContactPicture) {
      setLoadingSnapImageBusinessCard.next(false)
      navigation.goBack()
      return
    }

    createProductStore.clear()
    lCache.cleanCache()
    cameraStore.clear()

    navigation.goBack()
  }

  callbackEditImage = (imageType: string[]) => {
    this._imageType = imageType
  }

  animatedScaleTiming = (toValue: number) => {
    const { animatedScale } = this.state

    Animated.timing(animatedScale, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start()
  }

  onOpenGalleryStart = () => {
    /**
     * Start animation
     * */
    this.animatedScaleTiming(0)
  }

  onOpenGalleryEnd = (response: ImageResponse[]) => {
    if (response.length === 0) {
      this.animatedScaleTiming(2)
      return
    }

    const { mode } = this.state
    const isBusinessCardMode = mode === CameraMode.BusinessCard
    const paths = []
    for (const image of response) {
      paths.push(image.path)
    }
    this.setState({ showProcessing: true, totalImages: response.length })
    this.addImageToQueue(paths, response.length > 0).catch(() => {})
    /**
     * Start animation
     * */
    this.animatedScaleTiming(2)
  }

  onCapture = () => {
    const { mode } = this.state
    const isBusinessCardMode = mode === CameraMode.BusinessCard

    if (this._isBeingCapture || !this._camera.current) return

    this._isBeingCapture = true

    /**
     * Start animation
     * */
    this.animatedScaleTiming(0)

    const options = {
      skipProcessing: true,
      forceUpOrientation: true,
    }

    this._camera.current.takePictureAsync(options).then(data => {
      /**
       * Start animation
       * */
      this.animatedScaleTiming(2)

      /**
       * If capture mode is business card then crop the image
       * */
      if (isBusinessCardMode) {
        const optionCropImage: Options = {
          // set high resolution width x height and keep  1200x780 aspect ratio.
          width: (metrics.business_card_grid_height * 5 * 1200) / 780,
          height: metrics.business_card_grid_height * 5,
          path: data.uri,
        }

        ImagePicker.openCropper(optionCropImage)
          .then(image => {
            this.setState({ showProcessing: true })
            this.addImageToQueue([image.path])

            /**
             * Check and save image to camera roll
             * */
            if (settingStore.savePicture) {
              permission.checkPermissionSaveImage(image.path)
            }
          })
          .catch(_error => {
            /**
             * If crop fail the set isBeingCapture to false to user can capture
             * again
             */
            this._isBeingCapture = false
          })
          .finally(() => {
            this.setState({ loadingCachingImage: false })
          })
      } else {
        this.setState({ loadingCachingImage: true })
        this.addImageToQueue([data.uri])

        /**
         * Check and save image to camera roll
         * */
        if (settingStore.savePicture) {
          permission.checkPermissionSaveImage(data.uri)
        }
      }
    })
  }

  addImageToQueue = async (uri: string[], goNext: boolean = false) => {
    const { isSnapSupplierBusinessCard } = this.navigationData
    const arrUri = Array.isArray(uri) ? uri : [uri]

    /**
     * Create image type for drawing
     * */
    arrUri.map(() => {
      this._imageType.push('Photo')
    })

    this.setState(prevState => ({
      imageData: prevState.imageData.concat(arrUri),
    }))

    if (!isSnapSupplierBusinessCard) {
      /**
       * Store ony by one to show the progress and not freeze the UI
       */
      for await (const uri of arrUri) {
        try {
          const result = await lCache.store([uri])
          result && cameraStore.put(result)
          this.setState({
            processingImageIndex: this.state.processingImageIndex + 1,
          })
        } catch (e) {
          console.tron(e)
        }
      }

      this.setState({
        showProcessing: false,
        loadingCachingImage: false,
        totalImages: 1,
      })

      if (goNext) {
        this.onPressNext()
      }
    }

    /**
     * If we use imageData outside of this callBack it i'll get the old
     * data.
     * We have to call full this.state.imageData to
     * get the latest data.
     */
    if (this.state.imageData.length >= this._maxFiles) {
      this.onPressNext()
      return
    }

    this._isBeingCapture = false
  }

  onPressNext = () => {
    const { navigation, contactFactory } = this.props
    const { imageData, mode } = this.state
    const {
      supplier,
      project,
      isAddSupplierPhoto,
      isAddProductPhoto,
      isAddSamplePhoto,
      isAddContactPicture,
      isSnapSupplierBusinessCard,
    } = this.navigationData
    const isBusinessCardMode = mode === CameraMode.BusinessCard

    /**
     * Add photo for sample
     * */
    if (!isBusinessCardMode && isAddSamplePhoto) {
      imageDataSampleSubject.next({ imageData, imageType: this._imageType })
      navigation.goBack()
      return
    }

    /**
     * Add photo for product
     * */
    if (!isBusinessCardMode && isAddProductPhoto) {
      imageDataProductSubject.next({ imageData, imageType: this._imageType })
      navigation.goBack()
      return
    }

    /**
     * Add photo for supplier
     * */
    if (!isBusinessCardMode && isAddSupplierPhoto) {
      imageDataSupplierSubject.next({ imageData, imageType: this._imageType })
      navigation.goBack()
      return
    }

    /**
     * Add photo for business card when press snap business card in supplier
     * */
    if (isBusinessCardMode && isSnapSupplierBusinessCard && supplier) {
      pushNotification._snapBusinessCardSubscription = fromPromise(
        lCache.storeWithoutSave(imageData)
      )
        .pipe(
          mergeMap(data => {
            return contactFactory.upsert('', {
              supplier,
              name: '',
              jobTitle: '',
              email: '',
              phoneNumber: '',
              imageData: data,
            })
          })
        )
        .subscribe(() => {
          pushNotification.pushNotification(I18n.t('yourBusinessCardWasSaved'))
        })

      navigation.goBack()
      return
    }

    /**
     * Add photo for business card on other case
     * */
    if (isBusinessCardMode) {
      if (isAddContactPicture) {
        navigation.goBack()
        return
      }

      this._navListener.replace('CreateContactScreen', {
        supplier,
        imageData: cameraStore.data,
        newBusinessCard: true,
        createBusinessCard: true,
      })
      return
    }

    /**
     * Add photo for create product
     * */
    if (mode === CameraMode.Product) {
      const { isAddMore, onAddMore } = this.navigationData
      this.setState({ imageData: [] })
      if (isAddMore) {
        onAddMore && onAddMore(cameraStore.data)
        this.props.navigation.goBack()
        createProductStore.clear()
        cameraStore.clear()
      } else {
        this._navListener.replace('CreateProductScreen', {
          supplier,
          project,
          imageData,
          imageType: this._imageType,
        })
      }
    }
  }

  get message() {
    const { mode } = this.state

    switch (mode) {
      case CameraMode.BusinessCard: {
        return I18n.t('makeSureBusinessCard')
      }
      case CameraMode.Product: {
        return I18n.t('takeOnOrMoreProduct')
      }
      case CameraMode.Supplier: {
        return I18n.t('takeOnOrMoreSupplier')
      }
      case CameraMode.Sample: {
        return I18n.t('takeOnOrMoreSample')
      }
    }
  }

  get flashMode() {
    const { flashModeOn } = this.state

    if (flashModeOn) {
      return RNCamera.Constants.FlashMode.on
    }

    return RNCamera.Constants.FlashMode.off
  }

  renderProcessing = () => {
    const { processingImageIndex, totalImages, showProcessing } = this.state
    if (!showProcessing) return null
    const index =
      processingImageIndex > totalImages ? totalImages : processingImageIndex
    return (
      <View style={styles.processingContainer}>
        <AIndicator size={60} />
        <Text style={[styles.processing, { marginTop: 24 }]}>
          Procesing your pictures...
        </Text>
        <Text style={styles.processing}>{`${index} / ${totalImages}`}</Text>
      </View>
    )
  }

  render() {
    const {
      mode,
      imageData,
      animatedScale,
      keyChangeFlash,
      loadingCachingImage,
    } = this.state
    const {
      isAddContactPicture,
      cameraMode,
      isAddSamplePhoto,
      forceHideBusinessCard,
    } = this.navigationData
    const width = Dimensions.get('screen').width
    const businessCardHeight = ((width - 40) * 780) / 1200
    const hideBusinessCard =
      (mode !== CameraMode.BusinessCard && imageData.length > 0) ||
      forceHideBusinessCard

    return (
      <SafeAreaView style={styles.container}>
        <ACameraHeader
          key={keyChangeFlash}
          onPressClose={this.onPressClose}
          onOpenGalleryStart={this.onOpenGalleryStart}
          onOpenGalleryEnd={this.onOpenGalleryEnd}
          onChangeFlash={this.onChangeFlash}
          flashMode={this.flashMode}
          maxFiles={this._maxFilesChooseInGallery}
          isAddContactPicture={isAddContactPicture}
        />

        <View style={styles.wrapCamera}>
          <ACameraGrid
            height={
              mode === CameraMode.BusinessCard ? businessCardHeight : null
            }
          />

          <RNCamera
            ref={this._camera}
            style={{ width, flex: 1 }}
            flashMode={this.flashMode}
            captureAudio={false}
            type={RNCamera.Constants.Type.back}
            androidCameraPermissionOptions={{
              title: I18n.t('permissionCameraTitle'),
              message: I18n.t('permissionCameraMessage'),
              buttonPositive: I18n.t('ok'),
              buttonNegative: I18n.t('cancel'),
            }}
            ratio={Platform.select({
              ios: '3:4',
              android: '1:1',
            })}
          />

          <ACameraTooltip
            isVisible={imageData.length <= 0}
            message={this.message}
            position={mode === CameraMode.BusinessCard ? 'top' : 'bottom'}
            padding={mode === CameraMode.BusinessCard ? 20 : 0}
          />
        </View>

        <CameraFooter
          mode={mode}
          cameraMode={cameraMode}
          imageData={imageData}
          animatedScale={animatedScale}
          onOpenViewMode={this.onOpenViewMode}
          onPressNext={this.onPressNext}
          onChangeCameraMode={this.onChangeCameraMode}
          onCapture={this.onCapture}
          hideBusinessCard={isAddSamplePhoto}
          hideTabs={hideBusinessCard}
          loadingCachingImage={loadingCachingImage}
        />

        <ANetworkStatus
          fillAbsolute={isIphoneX()}
          connectedBgColor={colors.transparent}
        />
        {this.renderProcessing()}
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    backgroundColor: colors.dark_grey,
  },
  wrapCamera: {
    flex: 1,
    backgroundColor: colors.white,
  },
  camera: {
    flex: 1,
  },
  processingContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processing: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.l,
    color: colors.white,
    marginTop: 12,
  },
})
