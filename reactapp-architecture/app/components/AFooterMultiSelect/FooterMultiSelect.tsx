import React from 'react'
import {
  Image,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native'
import { fonts, images, colors, metrics, devices, normalize } from '@/vars'
import I18n from '@/i18n'
import { FooterButton } from '@/components/AFooterMultiSelect/FooterButton'
import { Subscription } from 'rxjs'
import { isVisibleTabBar, totalSelectMulti } from '@/services/global'

type Props = Readonly<{
  title?: string
  close: () => void
  onPressTask?: () => void
  onPressSample?: () => void
  onPressEdit: () => void
  onPressProject?: () => void
  isShowProject?: boolean
  isShowAddSample?: boolean
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
    isShowAddSample: true,
  }

  readonly state: State = {
    totalSelect: 0,
  }

  componentDidMount() {
    this._selectMulti = totalSelectMulti.subscribe(totalSelect => {
      this.setState({ totalSelect })
    })
    this.visibleTabBar = isVisibleTabBar.subscribe(data => {
      if (!data) {
        Animated.timing(this._moveAnim, {
          toValue: 0,
          duration: 400,
        }).start()
      } else {
        Animated.timing(this._moveAnim, {
          toValue: -160,
          duration: 400,
        }).start()
      }
    })
  }

  componentWillUnmount(): void {
    this._selectMulti && this._selectMulti.unsubscribe()
    this.visibleTabBar && this.visibleTabBar.unsubscribe()
  }

  render() {
    const {
      close,
      onPressEdit,
      onPressProject,
      onPressTask,
      onPressSample,
      isShowProject,
      isShowAddSample,
      title,
    } = this.props
    const { totalSelect } = this.state

    return (
      <Animated.View
        style={[
          styles.container,
          { width: '100%' },
          devices.isAndroid ? styles.shadowAndroid : styles.shadowIos,
          {
            marginBottom: this._moveAnim,
          },
        ]}
      >
        <View style={styles.action}>
          <View style={styles.wrapperIconAction}>
            <FooterButton
              onPress={onPressTask}
              style={styles.icon}
              icon={images.addTask}
              title={I18n.t('addTask')}
            />
            {isShowAddSample ? (
              <FooterButton
                icon={images.sample}
                title={I18n.t('addSample')}
                onPress={onPressSample}
              />
            ) : null}
            <FooterButton
              icon={images.edit}
              title={I18n.t('edit')}
              onPress={onPressEdit}
            />
            {isShowProject ? (
              <FooterButton
                icon={images.projects}
                title={I18n.t('project')}
                onPress={onPressProject}
              />
            ) : null}
          </View>
          <TouchableOpacity style={styles.cancel} onPress={close}>
            <Image source={images.closeThickIcon} style={styles.cancelIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.productSelectedContainer}>
          <Text style={styles.productSelectedText}>
            {totalSelect} {title}
          </Text>
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    backgroundColor: colors.light_98,
  },
  wrapperIconAction: {
    flex: 1,
    flexDirection: 'row',
  },
  shadowIos: {
    shadowOpacity: 0.1,
    shadowOffset: { height: -5, width: 0 },
  },
  shadowAndroid: {
    elevation: metrics.base,
  },
  action: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 16,
  },
  icon: {
    marginLeft: metrics.footer_task_icon_marginLeft,
  },
  cancel: {
    width: metrics.footer_task_cancel_width,
    height: metrics.footer_task_cancel_height,
    marginRight: metrics.footer_task_cancel_margin_right,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: metrics.footer_task_cancel_border_radius,
    padding: metrics.footer_task_cancel_padding,
  },
  cancelIcon: {
    width: metrics.footer_task_cancel_icon_width,
    height: metrics.footer_task_cancel_icon_height,
    tintColor: colors.light_blue_grey,
  },
  productSelectedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: metrics.footer_task_product_selected_container_margin_top,
    paddingBottom: 20,
  },
  productSelectedText: {
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.s,
    color: colors.text_light_grey,
  },
})
