import { AppContextState } from '@/screens/App/AppContainer'
import { withContext } from '@/shared/withContext'
import { colors, images, metrics } from '@/vars'
import * as React from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { Subscription } from 'rxjs'
import { EventInfoContext } from '../EventInfoContext'
import { Dimension, Orientation } from '@/services/dimension'
import { SafeEvent } from '@/shared/event'

type Props = Readonly<{
  safeEvent?: SafeEvent
}> &
  AppContextState &
  Partial<NavigationInjectedProps<{}>>

export type State = Readonly<{
  dimension: any
}>

@withContext(EventInfoContext.Consumer)
export class EventInfoImage extends React.PureComponent<Props, State> {
  _subscriptionRotate: Subscription

  readonly state: State = {
    dimension: Dimension.currentMode,
  }

  componentDidMount() {
    this.handelRotate()
  }

  componentWillUnmount() {
    this._subscriptionRotate && this._subscriptionRotate.unsubscribe()
  }

  handelRotate = () => {
    this._subscriptionRotate = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        this.setState({
          dimension: value,
        })
      }
    })
  }

  renderImage = () => {
    const { safeEvent } = this.props

    return (
      <View style={[styles.wrapImage]}>
        <Image source={images.eventEmptyPlaceholder} style={styles.image} />
      </View>
    )
  }

  render() {
    return <View style={styles.container}>{this.renderImage()}</View>
  }
}

const styles = StyleSheet.create<any>({
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
  image: {
    width: '100%',
    height: '100%',
  },
})
