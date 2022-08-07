import * as React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native'
import RNSketchCanvas from '@terrylinla/react-native-sketch-canvas'
import { withNavigation } from 'react-navigation'
import { colors, fonts, images, metrics } from '@/vars'
import I18n from '@/i18n'
import { SafeImage } from '@/shared/image'
import { lCache } from '@/libs/LCache'

const initialState = {
  color: '#FF0000',
  photoPath: '',
}

type State = Readonly<{
  color: string
  photoPath: any
}>

type Prop = Readonly<{
  imageData?: any
  currentIndex?: number
  onEdit(
    path: string,
    currentIndex: number,
    isEditImage: boolean,
    pathsCount: number
  ): void
  onClose(currentIndex: number): void
  beforeReturnPath(mess: string): void
  fromScreen?: string
}>

@(withNavigation as any)
export class PaintingScreen extends React.PureComponent<Prop, State> {
  canvas1?: RNSketchCanvas
  fileName = 'ShowSourcing'
  pathsCount = 0
  editing = true

  readonly state: State = initialState

  componentDidMount() {
    const { imageData, fromScreen } = this.props
    const { uri, id } = new SafeImage(imageData)

    if (fromScreen === 'Camera') {
      this.setState({
        photoPath: Platform.select({
          ios: uri.replace('file://', ''),
          android: uri.replace('file:///data/user/0', '/data/data'),
        }),
      })
    } else {
      lCache.retrieveImage(id).then(photoPath => {
        this.setState({
          photoPath: photoPath.path,
        })
      })
    }
  }

  onSave: any = (_, path?: string, isEditImage?: boolean) => {
    this.editing = false
    this.props.beforeReturnPath(_)
    if (path) {
      this.editing = true
      const { currentIndex } = this.props
      this.props.onEdit(path, currentIndex, isEditImage, this.pathsCount)
    }
  }

  onClose = () => {
    const { currentIndex } = this.props
    this.props.onClose(currentIndex)
  }

  strokeFunc = (color: string, index: number) => {
    if (index === 5) {
      return (
        <View
          style={[
            { backgroundColor: color },
            styles.strokeColorButton,
            styles.stroke,
          ]}
        />
      )
    }

    return (
      <View style={[{ backgroundColor: color }, styles.strokeColorButton]} />
    )
  }

  strokeSelectedFunc = (color: string, index: number) => {
    if (index === 5) {
      return (
        <View
          style={[
            { backgroundColor: color },
            styles.strokeSelectOutSideBlack,
            styles.strokeColorButton,
          ]}
        >
          <View style={styles.strokeSelectInSideBlack} />
        </View>
      )
    }
    return (
      <View
        style={[
          { backgroundColor: color },
          styles.strokeSelectOutSide,
          styles.strokeColorButton,
        ]}
      >
        <View style={styles.strokeSelectInSide} />
      </View>
    )
  }

  onClearPressed = () => {
    this.editing && this.canvas1.clear()
  }

  onPathsChange = pathsCount => {
    this.pathsCount = pathsCount
  }

  onStrokeEnd = () => {
    this.pathsCount = this.pathsCount + 1
  }

  onUndoPressed = id => {
    this.editing && this.canvas1.deletePath(id)
  }

  render() {
    const { photoPath } = this.state
    const { height, width } = Dimensions.get('window')

    if (!photoPath) return null

    return (
      <View style={styles.container}>
        <View style={styles.wrapRNSketchCanvas}>
          <RNSketchCanvas
            ref={ref => (this.canvas1 = ref)}
            localSourceImage={{
              // @ts-ignore
              filename: photoPath,
              directory: null,
              mode: 'AspectFit',
              heightDevice: height,
              widthDevice: width,
            }}
            containerStyle={styles.RNSketchCanvasContainerStyle}
            canvasStyle={styles.RNSketchCanvasContainerStyle}
            listColorStyle={styles.listColor}
            closeComponent={
              <View style={styles.wrapClose}>
                <Image style={styles.iconClose} source={images.closeIcon} />
              </View>
            }
            clearComponent={
              <View style={styles.wrapText}>
                <Text style={styles.text}>{I18n.t('clear')}</Text>
              </View>
            }
            undoComponent={
              <View style={styles.wrapText}>
                <Text style={styles.text}>{I18n.t('undo')}</Text>
              </View>
            }
            saveComponent={
              <View style={styles.wrapTextSave}>
                <Text style={styles.text}>{I18n.t('save')}</Text>
              </View>
            }
            defaultStrokeIndex={0}
            defaultStrokeWidth={5}
            // @ts-ignore
            strokeComponent={this.strokeFunc}
            strokeSelectedComponent={this.strokeSelectedFunc}
            onClearPressed={this.onClearPressed}
            onUndoPressed={this.onUndoPressed}
            onClosePressed={this.onClose}
            onSketchSaved={this.onSave}
            onPathsChange={this.onPathsChange}
            onStrokeEnd={this.onStrokeEnd}
            savePreference={() => {
              return {
                folder: this.fileName,
                filename: String(Math.ceil(Math.random() * 100000000)),
                transparent: true,
                imageType: 'png',
                includeImage: true,
                includeText: false,
                cropToImageSize: true,
              }
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  wrapRNSketchCanvas: {
    flex: 1,
    flexDirection: 'row',
  },
  RNSketchCanvasContainerStyle: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  strokeColorButton: {
    width: metrics.painting_screen_strokeColorButton_width,
    height: metrics.painting_screen_strokeColorButton_height,
    borderRadius: metrics.painting_screen_strokeColorButton_borderRadius,
    marginLeft: metrics.painting_screen_strokeColorButton_marginLeft,
  },
  wrapClose: {
    marginLeft: metrics.painting_screen_wrapClose_marginLeft,
    marginTop: metrics.painting_screen_wrapClose_marginTop,
  },
  iconClose: {
    width: metrics.painting_screen_iconClose_width,
    height: metrics.painting_screen_iconClose_height,
    tintColor: colors.white,
  },
  wrapText: {
    height: metrics.painting_screen_wrapText_height,
    width: metrics.painting_screen_wrapText_width,
    marginTop: metrics.painting_screen_wrapText_marginTop,
    marginRight: metrics.painting_screen_wrapText_marginRight,
    borderRadius: metrics.painting_screen_wrapText_borderRadius,
    justifyContent: 'center',
  },
  wrapTextSave: {
    height: metrics.painting_screen_wrapTextsave_height,
    width: metrics.painting_screen_wrapTextsave_width,
    backgroundColor: colors.product_info_camera_btn_bottom,
    marginTop: metrics.painting_screen_wrapTextsave_marginTop,
    marginRight: metrics.painting_screen_wrapTextsave_marginRight,
    borderRadius: metrics.painting_screen_wrapTextsave_borderRadius,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  listColor: {
    height: metrics.painting_screen_listColor_height,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: metrics.painting_screen_listColor_marginRight,
  },
  stroke: {
    borderWidth: 1,
    borderColor: colors.blue_grey,
  },
  strokeSelectOutSideBlack: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  strokeSelectInSideBlack: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    bottom: 1,
    borderColor: colors.category_orange_yellow,
    borderWidth: 1,
    borderRadius: 15,
  },
  strokeSelectOutSide: {
    borderWidth: 1,
    borderColor: colors.white,
  },
  strokeSelectInSide: {
    position: 'absolute',
    left: 1,
    right: 1,
    top: 1,
    bottom: 1,
    borderColor: colors.black,
    borderWidth: 2,
    borderRadius: 15,
  },
})
