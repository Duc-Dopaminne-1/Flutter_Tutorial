import * as React from 'react'
import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Sample } from '@/models/team'
import { colors, images, fonts } from '@/vars'
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Image as RNImage,
  Text,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { forkJoin, of, Subscription } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Dimension, Orientation } from '@/services/dimension'
import {
  editImageDataSubject,
  imageDataSampleSubject,
  onImageSampleInfo,
  onSampleChangeById,
  renderImageProgress,
} from '@/services/global'
import I18n from '@/i18n'
import { AppContextState } from '@/screens/App/AppContainer'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { CacheResult } from '@/locals/models/cache-result'
import { Image } from '@/models/common'
import { LImage } from '@/libs/LImage'
import { SafeImage } from '@/shared/image'
import { lCache } from '@/libs/LCache'
import { cameraStore } from '@/stores/cameraStore'
import { SafeSample } from '@/shared/sample'
import { CameraMode } from '@/common/constants/CameraMode'

type Props = Readonly<{
  sample: Sample
  imageData: string[]
  wasCreated: boolean
  layoutWidth: number
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  uris: string[] | Image[]
  loading: boolean
  dimension: Orientation
  renderImageProgress: boolean
}>

@DelayRender({ delay: 0 })
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SampleInfoImage extends React.PureComponent<Props, State> {
  _subscription: Subscription | undefined
  _renderIPSubscription: Subscription | undefined
  _rotateSubscription: Subscription | undefined
  _imageSubscription: Subscription | undefined
  _editImageSubscription: Subscription | undefined
  _prodChangeSubscription: Subscription | undefined
  _results: Realm.Results<CacheResult> | undefined
  currentIndex = 0
  imagesInfo: any = []

  readonly state: State = {
    uris: [],
    loading: false,
    dimension: Dimension.currentMode,
    renderImageProgress: false,
  }

  static readonly defaultProps = {
    // layoutWidth: metrics.screen_width,
  }

  constructor(props: Props) {
    super(props)

    if (!props.wasCreated) {
      this.state = {
        ...this.state,
        uris: props.imageData,
      }
    } else {
      const {
        images: { all },
      } = new SafeSample(props.sample)

      this.state = {
        ...this.state,
        uris: all,
      }
    }
  }

  async componentDidMount() {
    const { sample } = this.props

    this._renderIPSubscription = renderImageProgress.subscribe(() => {
      this.setState({
        renderImageProgress: true,
      })
    })

    this._subscription = onSampleChangeById.subscribe(col => {
      const {
        images: { all, allTypes },
      } = new SafeSample(col)

      onImageSampleInfo.next({ imageData: all })
      this.imagesInfo = allTypes
      this.setState({
        uris: all,
      })
    })

    this._imageSubscription = imageDataSampleSubject
      .pipe(
        map(data => {
          this.setState((prevState: State) => {
            const uris = prevState.uris as any

            return {
              uris: uris.concat(data.imageData),
            }
          })

          return data
        }),
        mergeMap(data => {
          return forkJoin([of(cameraStore.data), of(data.imageType)])
        })
      )
      .subscribe(data => {
        const [imageData] = data
        this.props.sampleFactory
          .addImage(sample.id, {
            imageData,
            imageType: data[1],
          })
          .subscribe(sample => {
            onSampleChangeById.next(sample)
            setTimeout(() => {
              lCache.clear()
              cameraStore.clear()
            }, 2000)
          })
      })

    this._editImageSubscription = editImageDataSubject.subscribe(
      newImageData => {
        this.setState({
          uris: newImageData,
        })
      }
    )

    this.handleRotate()
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._prodChangeSubscription && this._prodChangeSubscription.unsubscribe()
    this._imageSubscription && this._imageSubscription.unsubscribe()
    this._rotateSubscription && this._rotateSubscription.unsubscribe()
    this._editImageSubscription && this._editImageSubscription.unsubscribe()
    this._renderIPSubscription && this._renderIPSubscription.unsubscribe()
    this._results && this._results.removeAllListeners()
  }

  handleRotate = () => {
    this._rotateSubscription = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        this.setState({
          dimension: value,
        })
      }
    })
  }

  onPressAddPicture = () => {
    const { navigation, sample } = this.props

    navigation.navigate('CameraScreen', {
      sample,
      isAddSamplePhoto: true,
      cameraMode: CameraMode.Sample,
    })
  }

  openGallery = () => {
    const { uris } = this.state

    if (uris.length < 1) {
      Alert.alert(
        I18n.t('imageIsEmpty'),
        '',
        [
          {
            text: I18n.t('cancel'),
            onPress: () => {},
          },
        ],
        { cancelable: false }
      )
      return
    }
    const { imageData, wasCreated, navigation, sample } = this.props

    const data = wasCreated ? uris : imageData

    navigation!.navigate('GalleryPictureScreen', {
      sample,
      isSample: true,
      isSampleAddPicture: true,
      imageData: data,
      currentIndexImage: this.currentIndex,
      imagesInfo: this.imagesInfo,
      fromScreen: 'SampleInfoImage',
    })
  }

  renderItem = ({ item }: { item: string | Image; index: number }) => {
    const layoutSize = this.props.layoutWidth
      ? this.props.layoutWidth
      : Dimensions.get('screen').width

    const containerStyle = {
      width: layoutSize,
      height: layoutSize,
    }

    const { uri, id } = new SafeImage(item)

    return (
      <TouchableOpacity
        style={[styles.wrapImage, containerStyle]}
        onPress={this.openGallery}
        activeOpacity={1}
      >
        <LImage
          source={{
            id,
            uri,
            downloadPriority: 1,
          }}
          style={containerStyle as any}
          scaleMode="scaleAspectFit"
        />
      </TouchableOpacity>
    )
  }

  renderItemPlaceholder = () => {
    const layoutSize = this.props.layoutWidth
      ? this.props.layoutWidth
      : Dimensions.get('screen').width

    const containerStyle = {
      width: layoutSize,
      height: layoutSize,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background_gray,
    }

    return (
      <View style={[styles.wrapImage, containerStyle]}>
        <RNImage source={images.camera} style={styles.camera} />
        <Text style={styles.placeholder}>{I18n.t('sampleAddPicture')}</Text>
        <TouchableOpacity
          style={styles.addPicture}
          onPress={this.onPressAddPicture}
        >
          <Text style={styles.placeholder1}>{I18n.t('addPicture')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  listImage = (lengths: number) => {
    const { uris } = this.state
    const { layoutWidth: _layoutWidth } = this.props
    const layoutWidth = _layoutWidth
      ? _layoutWidth
      : Dimensions.get('screen').width

    if (lengths === 0) {
      return (
        <Carousel<string | Image>
          data={[images.missingImage]}
          renderItem={this.renderItemPlaceholder}
          sliderWidth={layoutWidth}
          itemWidth={layoutWidth}
        />
      )
    }

    return (
      <Carousel<string | Image>
        data={uris}
        initialNumToRender={uris.length}
        renderItem={this.renderItem}
        sliderWidth={layoutWidth}
        itemWidth={layoutWidth}
        onBeforeSnapToItem={index => {
          this.currentIndex = index
        }}
      />
    )
  }

  render() {
    const { uris } = this.state
    const { loading } = this.state

    return (
      <View style={styles.container}>
        {loading ? <AIndicator full /> : this.listImage(uris.length)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    zIndex: 20,
  },
  wrapImage: {
    overflow: 'hidden',
    backgroundColor: colors.black,
  },
  camera: {
    resizeMode: 'contain',
    width: 64,
    height: 48,
    tintColor: colors.blue_light_grey,
    marginBottom: 20,
  },
  placeholder: {
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
    fontSize: fonts.size.l,
    paddingHorizontal: 51,
    textAlign: 'center',
  },
  placeholder1: {
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
    fontSize: fonts.size.l,
    paddingHorizontal: 30,
    textAlign: 'center',
  },
  addPicture: {
    borderRadius: 4,
    backgroundColor: colors.close_icon_gray,
    paddingVertical: 9,
    marginTop: 12,
  },
})
