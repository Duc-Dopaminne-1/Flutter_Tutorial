import * as React from 'react'
import { Image, requireNativeComponent, StyleProp } from 'react-native'
import { metrics, devices } from '@/vars'

const COMPONENT_NAME = 'RNLImageView'

export type LImageSource = {
  uri: string
  id?: string
  downsampling?: number
  fitMode?: 'clip' | 'crop'
  downloadPriority?: number
}

export type LImageProps = {
  source: LImageSource
  placeholder?: string
  style: StyleProp<Image> & { height: number; width: number }
  scaleMode?: 'scaleAspectFill' | 'scaleAspectFit' | 'scaleAspectCenter'
}

type LImageState = {
  key: string
  placeholder?: string
}

export class LImage extends React.PureComponent<LImageProps, LImageState> {
  static defaultProps = {
    source: {
      uri: '',
      id: '',
      downsampling: metrics.screen_width,
      fitMode: 'crop',
      scaleMode: 'scaleAspectFill',
      downloadPriority: null,
    },
  }

  readonly state: LImageState

  constructor(props: LImageProps) {
    super(props)

    const { id } = props.source

    this.state = {
      key: id,
    }
  }

  onResourceReady = () => {}

  onLoadFailed = () => {}

  render(): React.ReactNode {
    const { source, style, scaleMode } = this.props
    const { key } = this.state

    const src = {
      uri: '',
      id: '',
      downsampling: metrics.screen_width,
      ...source,
    }
    // Remove the downsampling prop for Android to make it render images with high resolution
    // TODO Find way to render high resolution images only for full screen images
    // This is a temporary fix
    if (devices.isAndroid) {
      delete src.downsampling
    }
    return (
      <RNLImage
        source={src}
        key={key}
        scaleMode={scaleMode}
        style={style}
        size={{
          height: style.height,
          width: style.width,
        }}
        onResourceReady={this.onResourceReady}
        onLoadFailed={this.onLoadFailed}
      />
    )
  }
}

// @ts-ignore
const RNLImage = requireNativeComponent(COMPONENT_NAME, LImage, {
  nativeOnly: {
    onLoadFailed: true,
    onResourceReady: true,
  },
})
