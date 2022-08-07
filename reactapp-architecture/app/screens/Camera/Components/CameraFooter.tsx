import * as React from 'react'
import { CameraMode } from '@/common/constants/CameraMode'
import { CameraCapturedStack } from '@/screens/Camera/Components/CameraCapturedStack'
import { ACameraNextButton } from '@/components/ACamera/ACameraNextButton'
import { ACameraTab } from '@/components/ACamera/ACameraTab'
import { ACameraTabButton } from '@/components/ACamera/ACameraTabButton'
import I18n from '@/i18n'
import { ACameraFooter } from '@/components/ACamera/ACameraFooter'
import { AIndicator } from '@/components/AIndicator/AIndicator'

export type Props = Readonly<{
  mode: CameraMode
  cameraMode: CameraMode
  imageData: string[]
  animatedScale: any
  onOpenViewMode: () => void
  onPressNext: () => void
  onChangeCameraMode: (item: CameraMode) => void
  onCapture: () => void
  hideBusinessCard?: boolean
  hideTabs?: boolean
  loadingCachingImage?: boolean
}>

export type State = Readonly<{}>

export class CameraFooter extends React.PureComponent<Props, State> {
  readonly state: State = {}

  static readonly defaultProps = {}

  renderLeft = () => {
    const { mode, animatedScale, onOpenViewMode } = this.props

    if (mode === CameraMode.BusinessCard) {
      return null
    }

    return (
      <CameraCapturedStack
        animatedScale={animatedScale}
        onPress={onOpenViewMode}
      />
    )
  }

  renderRight = () => {
    const { mode, onPressNext, imageData, loadingCachingImage } = this.props

    if (mode === CameraMode.BusinessCard) {
      return null
    }

    if (loadingCachingImage) {
      return <AIndicator />
    }

    return (
      <ACameraNextButton
        onPress={onPressNext}
        hasImage={imageData.length > 0}
      />
    )
  }

  renderTabSupplier = () => {
    const { mode, cameraMode, onChangeCameraMode } = this.props

    if (cameraMode !== CameraMode.Supplier) return null

    return (
      <ACameraTabButton
        onChangeType={() => onChangeCameraMode(CameraMode.Supplier)}
        selected={mode === CameraMode.Supplier}
        label={I18n.t('supplier')}
      />
    )
  }

  renderTabProduct = () => {
    const { mode, cameraMode, onChangeCameraMode } = this.props

    if (cameraMode !== CameraMode.Product) return null

    return (
      <ACameraTabButton
        onChangeType={() => onChangeCameraMode(CameraMode.Product)}
        selected={mode === CameraMode.Product}
        label={I18n.t('product')}
      />
    )
  }

  renderTabBusinessCard = () => {
    const { mode, onChangeCameraMode, hideBusinessCard } = this.props
    if (hideBusinessCard) {
      return null
    }

    return (
      <ACameraTabButton
        onChangeType={() => {
          onChangeCameraMode(CameraMode.BusinessCard)
        }}
        selected={mode === CameraMode.BusinessCard}
        label={I18n.t('businessCard')}
      />
    )
  }

  renderTop = () => {
    const { cameraMode, hideTabs } = this.props

    if (cameraMode === CameraMode.BusinessCard || hideTabs) {
      return null
    }

    return (
      <ACameraTab>
        {this.renderTabSupplier()}

        {this.renderTabProduct()}

        {this.renderTabBusinessCard()}
      </ACameraTab>
    )
  }

  render() {
    const { imageData, onCapture } = this.props

    return (
      <ACameraFooter
        onCapture={onCapture}
        imageData={imageData}
        renderLeft={this.renderLeft}
        renderRight={this.renderRight}
        renderTop={this.renderTop}
      />
    )
  }
}
