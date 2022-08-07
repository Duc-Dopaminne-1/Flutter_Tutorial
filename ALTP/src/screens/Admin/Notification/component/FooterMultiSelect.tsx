import React from 'react'
import {
  Image,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated
} from 'react-native'
import { fonts, images, colors, metrics, devices, normalize } from '@/vars'
import I18n from '@/i18n'
import { Subscription } from 'rxjs'
import { isVisibleTabBar, totalSelectMulti } from '@/shared/global'
import { ButtonImageBackground } from '@/components/ButtonImageBackground'
import { userInfo } from '@/shared/UserInfo'

type Props = Readonly<{
  title?: string
  close?: () => void
  openModal?: () => void
}>

type State = {
  totalSelect: number
}

export class FooterMultiSelect extends React.PureComponent<Props, State> {
  _moveAnim = new Animated.Value(-160)
  _selectMulti: Subscription
  visibleTabBar: Subscription

  static defaultProps = {
    isShowProject: true,
    isShowAddSample: true
  }

  readonly state: State = {
    totalSelect: 0
  }

  componentDidMount() {
    this._selectMulti = totalSelectMulti.subscribe(totalSelect => {
      this.setState({ totalSelect })
    })
    this.visibleTabBar = isVisibleTabBar.subscribe(data => {
      if (!data) {
        Animated.timing(this._moveAnim, {
          toValue: 0,
          duration: 400
        }).start()
      } else {
        Animated.timing(this._moveAnim, {
          toValue: -160,
          duration: 400
        }).start()
      }
    })
  }

  componentWillUnmount(): void {
    this._selectMulti && this._selectMulti.unsubscribe()
    this.visibleTabBar && this.visibleTabBar.unsubscribe()
  }

  render() {
    const { close } = this.props
    const { totalSelect } = this.state

    return (
      <Animated.View
        style={[
          styles.container,
          { width: '100%' },
          devices.isAndroid ? styles.shadowAndroid : styles.shadowIos,
          {
            marginBottom: this._moveAnim,
            borderRadius: 12
          }
        ]}>
        <View style={{ paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={styles.productSelectedText}>
              Selected {totalSelect} User
            </Text>

            <TouchableOpacity
              style={[
                styles.cancel,
                { position: 'absolute', top: 0, right: 0 }
              ]}
              onPress={close}>
              <Image
                source={images.close}
                style={styles.cancelIcon}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>

          <View style={{}}>
            <ButtonImageBackground
              onPress={() => {
                userInfo.setSendAll(true)
                this.props.openModal()
              }}
              imageStyle={styles.buttonImage}
              containerStyle={{ justifyContent: 'center', marginTop: 20 }}
              text={'Send All'}
              textStyle={{ fontSize: 18 }}
              source={images.button_feedback}
            />
            <ButtonImageBackground
              onPress={() => {
                userInfo.setSendAll(false)
                this.props.openModal()
              }}
              imageStyle={styles.buttonImage}
              containerStyle={{ justifyContent: 'center', marginTop: 10 }}
              text={'Send Notification'}
              textStyle={{ fontSize: 18 }}
              source={images.button_login_signup}
            />
          </View>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: colors.light_98
  },
  wrapperIconAction: {
    flex: 1,
    flexDirection: 'row'
  },
  shadowIos: {
    shadowOpacity: 0.1,
    shadowOffset: { height: -5, width: 0 }
  },
  shadowAndroid: {
    elevation: metrics.base
  },
  action: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  icon: {
    marginLeft: metrics.footer_task_icon_marginLeft
  },
  cancel: {
    width: metrics.footer_task_cancel_width,
    height: metrics.footer_task_cancel_height,
    marginRight: metrics.footer_task_cancel_margin_right,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.footer_task_cancel_border_radius,
    padding: metrics.footer_task_cancel_padding
  },
  cancelIcon: {
    width: 25,
    height: 25
  },
  buttonImage: {
    alignItems: 'center',
    paddingVertical: 8
  },
  productSelectedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.footer_task_product_selected_container_margin_top,
    paddingBottom: 20
  },
  productSelectedText: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: 14,
    color: colors.black,
    marginTop: 10
  }
})
