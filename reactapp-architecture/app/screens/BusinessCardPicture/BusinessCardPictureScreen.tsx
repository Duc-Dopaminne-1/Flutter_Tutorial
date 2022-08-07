import * as React from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { colors, fonts, metrics } from '@/vars'
import { withContext } from '@/shared/withContext'
import { AppContext } from '@/screens/App/AppContext'
import { AppContextState } from '@/screens/App/AppContainer'
import { CameraMode } from '@/common/constants/CameraMode'
import { Subscription } from 'rxjs'
import { LImage } from '@/libs/LImage'
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView'
import { cameraStore } from '@/stores/cameraStore'
import { BusinessCardPictureHeader } from '@/screens/BusinessCardPicture/Components/BusinessCardPictureHeader'
import { setLoadingSnapImageBusinessCard } from '@/services/global'

type Props = AppContextState &
  NavigationInjectedProps<{
    image: { id: string; uri: string }
    createBusinessCard: boolean
  }>

export type State = Readonly<{
  image: { id: string; uri: string }
}>

@withContext(AppContext.Consumer)
export class BusinessCardPictureScreen extends React.PureComponent<
  Props,
  State
> {
  _updatePicture: Subscription

  readonly state: State = {
    image: { id: '', uri: '' },
  }

  componentDidMount() {
    const { image } = this.navigationData()

    this.setState({
      image,
    })

    this._updatePicture = cameraStore.observer.subscribe(returnImage => {
      if (returnImage.length > 0 && returnImage[returnImage.length - 1].id) {
        this.setState({
          image: { id: returnImage[returnImage.length - 1].id, uri: '' },
        })
      }
    })
  }

  componentWillUnmount() {
    this._updatePicture && this._updatePicture.unsubscribe()
  }

  navigationData = () => {
    const { navigation } = this.props

    const image = navigation.getParam('image', { id: '', uri: '' })
    const createBusinessCard = navigation.getParam('createBusinessCard', false)

    return {
      image,
      createBusinessCard,
    }
  }

  changePicture = () => {
    const { navigation } = this.props

    navigation.navigate('CameraScreen', {
      cameraMode: CameraMode.BusinessCard,
      isAddContactPicture: true,
      maxFiles: 1,
    })
  }

  onPressGoBack = () => {
    this.props.navigation.goBack(null)
    setLoadingSnapImageBusinessCard.next(false)
  }

  renderImage = () => {
    const { image } = this.state

    return (
      <View style={styles.wrapImage}>
        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={1}
          zoomStep={0.5}
          initialZoom={1}
          doubleTapDelay={200}
          style={styles.wrapImage}
          // onDoubleTapAfter={this.onDoubleTapAfter} // double click
          // onZoomAfter={this.onZoomAfter} // zoom
          // onPanResponderEnd={this.onPanResponder}
          pinchToZoomInSensitivity={4}
          pinchToZoomOutSensitivity={4}
        >
          <LImage
            source={{
              id: image.id,
              uri: image.uri,
            }}
            style={styles.image}
            scaleMode={'scaleAspectFit'}
          />
        </ReactNativeZoomableView>
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BusinessCardPictureHeader
          onPressGoBack={this.onPressGoBack}
          changePicture={this.changePicture}
        />

        {this.renderImage()}
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
  wrapNumberOfImage: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.blue_grey,
    padding: metrics.gallery_picture_screen_wrapNumberOfImage_padding,
    borderRadius: metrics.gallery_picture_screen_wrapNumberOfImage_borderRadius,
    marginRight: metrics.medium_base,
    marginBottom: metrics.medium_base,
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
