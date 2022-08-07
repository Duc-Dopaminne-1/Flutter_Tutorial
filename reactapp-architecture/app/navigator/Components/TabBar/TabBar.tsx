import { ANetworkStatus } from '@/components/ANetworkStatus/ANetworkStatus'
import { isIphoneX } from '@/shared/devices'
import { colors, images, metrics, normalize } from '@/vars'
import * as React from 'react'
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { TabBarButton } from './TabBarButton'
import { Dimension, Orientation } from '@/services/dimension'
import { Subscription } from 'rxjs'
import { AToast } from '@/components/AToast/AToast'
import { isVisibleTabBar } from '@/services/global'
import { ProductToast } from '@/screens/Product/Components/ProductToast'

type TabBarProps = {
  activeTintColor: string
  inactiveTintColor: string
  jumpTo(key: string): void
  navigation: NavigationScreenProp<any, any>
}

type TabBarState = Readonly<{
  dimension: number
  cameraButtonLeft: number
}>

export class TabBar extends React.PureComponent<TabBarProps, TabBarState> {
  _subscription: Subscription
  _isVisibleSubscription: Subscription
  _moveAnim = new Animated.Value(isIphoneX() ? normalize(62) : normalize(60))
  marginBottom = 62

  readonly state = {
    dimension: Dimension.isPortrait
      ? Orientation.Portrait
      : Orientation.Landscape,
    cameraButtonLeft: Dimensions.get('window').width / 2 - normalize(32.5),
  }

  componentDidMount() {
    this._isVisibleSubscription = isVisibleTabBar.subscribe(data => {
      if (data) {
        Animated.timing(this._moveAnim, {
          toValue: isIphoneX() ? normalize(62) : normalize(60),
          duration: 400,
        }).start()
      } else {
        Animated.timing(this._moveAnim, {
          toValue: 0,
          duration: 400,
        }).start()
      }
    })

    this._subscription = Dimension.onChange().subscribe(value => {
      if (this.state.dimension !== value) {
        const dim = Dimensions.get('screen')
        // @ts-ignore
        this.setState({
          dimension: value,
          cameraButtonLeft:
            Dimensions.get('window').width / 2 - normalize(32.5),
        })
      }
    })
  }

  componentWillUnmount() {
    this._isVisibleSubscription && this._isVisibleSubscription.unsubscribe()
    this._subscription && this._subscription.unsubscribe()
  }

  render() {
    const {
      activeTintColor,
      inactiveTintColor,
      jumpTo,
      navigation,
    } = this.props
    const { cameraButtonLeft } = this.state
    const currentIndex = navigation.state.index

    const setTintColor = (currentIndex: number, screenIndex: number) =>
      currentIndex === screenIndex ? activeTintColor : inactiveTintColor

    return (
      <>
        <Animated.View
          style={[
            styles.container,
            {
              height: this._moveAnim,
            },
          ]}
        >
          <TabBarButton
            title={'home'}
            source={images.homeIcon}
            tintColor={setTintColor(currentIndex, 0)}
            onPress={() => jumpTo('HomeScreen')}
          />

          <TabBarButton
            title={'asd'}
            source={images.product}
            tintColor={setTintColor(currentIndex, 1)}
            onPress={() => jumpTo('ProductScreen')}
          />

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.buttonCamera, { left: cameraButtonLeft }]}
            onPress={() => {
              navigation.navigate('CameraScreen')
            }}
          >
            <Image
              source={images.camera}
              style={styles.camera}
              resizeMode={'contain'}
            />
          </TouchableOpacity>

          <TabBarButton
            title={I18n.t('suppliers')}
            source={images.company}
            tintColor={setTintColor(currentIndex, 2)}
            onPress={() => jumpTo('SupplierScreen')}
          />

          <TabBarButton
            // title={I18n.t('inbox')}
            // source={images.inboxIcon}
            title={I18n.t('projects')}
            source={images.project}
            tintColor={setTintColor(currentIndex, 3)}
            onPress={() => jumpTo('Project')}
          />
        </Animated.View>
        <AToast height={this.marginBottom} />
        <ProductToast />
        <ANetworkStatus />
      </>
    )
  }
}

const styles = StyleSheet.create<any>({
  container: {
    height: isIphoneX() ? normalize(62) : normalize(60),
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 0.7,
    borderTopColor: colors.pale_grey,
  },
  buttonCamera: {
    position: 'absolute',
    top: '-25%',
    height: metrics.home_footer_camera_size,
    width: metrics.home_footer_camera_size,
    backgroundColor: colors.product_info_camera_btn_bottom,
    borderRadius: metrics.home_footer_camera_size,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 0 },
        shadowColor: colors.camera_button,
        shadowOpacity: 1.0,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  camera: {
    height: metrics.home_footer_camera_height,
    width: metrics.home_footer_camera_width,
    tintColor: colors.white,
  },
})
