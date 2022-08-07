import { DelayRender } from '@/components/ADelayRender/ADelayRender'
import { AIndicator } from '@/components/AIndicator/AIndicator'
import { Supplier } from '@/models/team'
import { AppContextState } from '@/screens/App/AppContainer'
import { AppContext } from '@/screens/App/AppContext'
import {
  editImageSupplierSubject,
  imageDataSupplierSubject,
  onImageSupplierInfo,
  onSupplierChangeById,
  renderImageProgress,
} from '@/services/global'
import { SafeSupplier } from '@/shared/supplier'
import { withContext } from '@/shared/withContext'
import { colors, devices, fonts } from '@/vars'
import * as React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { forkJoin, of, Subscription } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { SupplierInfoContext } from '../SupplierInfoContext'
import { Dimension } from '@/services/dimension'
import { SupplierInfoHeaderButtonAddPicture } from '@/screens/SupplierInfo/Components/SupplierInfoHeaderButtonAddPicture'
import { CacheResult } from '@/locals/models/cache-result'
import { Image } from '@/models/common'
import { cacheSystem } from '@/cache'
import { lCache } from '@/libs/LCache'
import { cameraStore } from '@/stores/cameraStore'
import { SupplierInfoImageItem } from '@/screens/SupplierInfo/Components/SupplierInfoImageItem'

type Props = Readonly<{
  supplier?: Supplier
  imageData?: string[]
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  uris: any
  loading: boolean
  dimension: any
  renderImageProgress: boolean
}>

@DelayRender({ delay: 100 })
@withContext(SupplierInfoContext.Consumer)
@withContext(AppContext.Consumer)
@(withNavigation as any)
export class SupplierInfoImage extends React.PureComponent<Props, State> {
  _subscription: Subscription | undefined
  _editImageSubscription: Subscription | undefined
  _supplierChangeSubscription: Subscription | undefined
  _imageSubscription: Subscription | undefined
  _renderIPSubscription: Subscription | undefined
  _subscriptionRotate: Subscription | undefined

  _results: Realm.Collection<CacheResult> | undefined

  currentIndex = 0
  imagesInfo = []

  readonly state: State = {
    uris: [],
    loading: false,
    dimension: Dimension.currentMode,
    renderImageProgress: false,
  }

  constructor(props: Props) {
    super(props)

    const {
      images: { all },
    } = new SafeSupplier(props.supplier)
    this.state = {
      ...this.state,
      uris: all,
    }
  }

  componentDidMount() {
    const { supplier } = this.props

    this._renderIPSubscription = renderImageProgress.subscribe(() => {
      this.setState({
        renderImageProgress: true,
      })
    })

    this._subscription = onSupplierChangeById.subscribe(col => {
      const {
        images: { all, allTypes },
      } = new SafeSupplier(col)

      onImageSupplierInfo.next({ imageData: all })
      this.imagesInfo = allTypes

      this.setState({
        uris: all,
      })
    })

    this._imageSubscription = imageDataSupplierSubject
      .pipe(
        map(data => {
          this.setState((prevState: State) => {
            return {
              uris: prevState.uris.concat(data.imageData),
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
        cacheSystem.write(imageData)
        this.props.supplierFactory
          .addImage(supplier.id, {
            imageData,
            imageType: data[1],
          })
          .subscribe(() => {
            lCache.clear()
            cameraStore.clear()
          })
      })

    this._editImageSubscription = editImageSupplierSubject.subscribe(
      newImageData => {
        this.setState({
          uris: newImageData,
        })
      }
    )

    this.handelRotate()
  }

  componentWillUnmount(): void {
    this._subscription && this._subscription.unsubscribe()
    this._editImageSubscription && this._editImageSubscription.unsubscribe()
    this._imageSubscription && this._imageSubscription.unsubscribe()
    this._subscriptionRotate && this._subscriptionRotate.unsubscribe()
    this._renderIPSubscription && this._renderIPSubscription.unsubscribe()
    this._supplierChangeSubscription &&
      this._supplierChangeSubscription.unsubscribe()
  }

  handelRotate = () => {
    this._subscriptionRotate = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        // @ts-ignore
        this.setState({
          dimension: value,
        })
      }
    })
  }

  openGallery = () => {
    const { uris } = this.state
    const { navigation, supplier } = this.props

    navigation!.navigate('GalleryPictureScreen', {
      supplier,
      imageData: uris,
      isSupplier: true,
      isSupplierAddPicture: true,
      currentIndexImage: this.currentIndex,
      imagesInfo: this.imagesInfo,
      fromScreen: 'SupplierInfoImage',
    })
  }

  renderItem = ({ item }: { item: string | Image; index: number }) => {
    return (
      <SupplierInfoImageItem
        item={item}
        openGallery={this.openGallery}
        layoutWidth={this.props.layoutWidth}
      />
    )
  }

  renderImage = () => {
    const { supplier } = this.props
    const { uris } = this.state
    const width = Dimensions.get('screen').width

    if (uris.length <= 0) {
      return devices.isAndroid ? (
        <SupplierInfoHeaderButtonAddPicture supplier={supplier} />
      ) : (
        <View style={styles.wrapPlaceHolder} />
      )
    }

    return (
      <Carousel<string | Image>
        data={uris}
        renderItem={this.renderItem}
        sliderWidth={width}
        itemWidth={width}
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
    const { loading } = this.state

    return (
      <View style={styles.container}>
        {loading ? <AIndicator full /> : this.renderImage()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    zIndex: 20,
  },
  wrapPlaceHolder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background_gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapImage: {
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
})
