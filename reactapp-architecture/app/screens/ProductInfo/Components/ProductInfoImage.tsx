import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Product } from '@/models/team'
import { SafeProduct } from '@/shared/product'
import { colors, images } from '@/vars'
import * as React from 'react'
import {
  Alert,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { forkJoin, of, Subscription } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { Dimension, Orientation } from '@/services/dimension'
import {
  editImageDataSubject,
  imageDataProductSubject,
  onImageProductInfo,
  onProductChangeById,
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
import { ProductInfoImageItem } from '@/screens/ProductInfo/Components/ProductInfoImageItem'

type Props = Readonly<{
  product: Product
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
export class ProductInfoImage extends React.PureComponent<Props, State> {
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
      } = new SafeProduct(props.product)

      this.state = {
        ...this.state,
        uris: all,
      }
    }
  }

  async componentDidMount() {
    const { product } = this.props

    this._renderIPSubscription = renderImageProgress.subscribe(() => {
      this.setState({
        renderImageProgress: true,
      })
    })

    this._subscription = onProductChangeById.subscribe(col => {
      const {
        images: { all, allTypes },
      } = new SafeProduct(col)

      onImageProductInfo.next({ imageData: all })
      this.imagesInfo = allTypes
      this.setState({
        uris: all,
      })
    })

    this._imageSubscription = imageDataProductSubject
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
        this.props.productFactory
          .addImage(product.id, {
            imageData,
            imageType: data[1],
          })
          .subscribe(() => {
            lCache.clear()
            cameraStore.clear()
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
    const { imageData, wasCreated, navigation, product } = this.props

    const data = wasCreated ? uris : imageData

    navigation!.navigate('GalleryPictureScreen', {
      imageData: data,
      productId: product.id,
      supplier: product.supplier,
      currentIndexImage: this.currentIndex,
      imagesInfo: this.imagesInfo,
      fromScreen: 'ProductInfoImage',
    })
  }

  renderItem = ({ item }: { item: string | Image; index: number }) => {
    return (
      <ProductInfoImageItem
        item={item}
        openGallery={this.openGallery}
        layoutWidth={this.props.layoutWidth}
      />
    )
  }

  renderItemPlaceholder = () => {
    const layoutSize = this.props.layoutWidth
      ? this.props.layoutWidth
      : Dimensions.get('screen').width

    const containerStyle = {
      width: layoutSize,
      height: layoutSize,
    }

    return (
      <TouchableOpacity
        style={[styles.wrapImage, containerStyle]}
        onPress={this.openGallery}
        activeOpacity={1}
      >
        <LImage
          source={{
            id: '',
            uri: '',
          }}
          style={containerStyle as any}
        />
      </TouchableOpacity>
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
        renderItem={this.renderItem}
        sliderWidth={layoutWidth}
        itemWidth={layoutWidth}
        onBeforeSnapToItem={index => {
          this.currentIndex = index
        }}
        initialNumToRender={1}
        loop={false}
        loopClonesPerSide={1}
        hasParallaxImages={true}
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
    backgroundColor: colors.white,
    zIndex: 20,
  },
  wrapImage: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
})
