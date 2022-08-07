import * as React from 'react'
import { AModal1 } from '@/components/AModal/AModal1'
import { colors, fonts, images, metrics, normalize } from '@/vars'
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import I18n from '@/i18n'
import CheckBox from 'react-native-check-box'
import { settingStore } from '@/stores/settingStore'

type AModal5Props = Readonly<{
  title?: string
  description?: string
  checkBoxText?: string
  leftButtonText?: string
  rightButtonText?: string
  iconRight?: ImageSourcePropType
  onPressLeft: () => void
  onPressRight: () => void
  onChangeCheck: (value: boolean) => void
}>

type AModal5State = Readonly<{}>

export class AModal5 extends React.PureComponent<AModal5Props, AModal5State> {
  readonly state = {
    isVisible: false,
    check: false,
  }

  static readonly defaultProps = {
    title: I18n.t('snapSupplier'),
    description: I18n.t('youCanTakePictureSupplier'),
    checkBoxText: I18n.t('doNotAskAgain'),
    leftButtonText: I18n.t('skip'),
    rightButtonText: I18n.t('snapCard'),
    iconRight: images.businessCard,
  }

  componentDidMount() {
    this.setState({
      check: !settingStore.businessCard,
    })
  }

  open = () => {
    this.setState({
      isVisible: true,
    })
  }

  closed = () => {
    this.setState({
      isVisible: false,
    })
  }

  onPressCheckBox = () => {
    const check = !this.state.check
    this.setState({
      check,
    })

    this.props.onChangeCheck(check)
  }

  renderContain = () => {
    const { title, description, checkBoxText } = this.props
    const { check } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.warpBody}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>

          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          <View style={styles.wrapCheckBox}>
            <CheckBox
              style={styles.checkBox}
              onClick={this.onPressCheckBox}
              isChecked={check}
              rightText={checkBoxText}
              rightTextStyle={styles.checkBoxText}
              uncheckedCheckBoxColor={colors.pale_grey}
            />
          </View>
        </View>

        {this.renderBottom()}
      </View>
    )
  }

  renderBottom = () => {
    const {
      leftButtonText,
      rightButtonText,
      iconRight,
      onPressLeft,
      onPressRight,
    } = this.props

    return (
      <View style={styles.wrapBottom}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onPressLeft}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText]}>{leftButtonText}</Text>
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={onPressRight}
          activeOpacity={0.8}
        >
          <Image
            style={styles.icon}
            resizeMode={'contain'}
            source={iconRight}
          />
          <Text style={[styles.buttonText, styles.buttonTextColor]}>
            {rightButtonText}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { isVisible } = this.state

    return (
      <AModal1
        // @ts-ignore
        modalProps={{
          isVisible,
        }}
        customContainer={styles.customModalContainer}
      >
        {this.renderContain()}
      </AModal1>
    )
  }
}

const styles = StyleSheet.create<any>({
  customModalContainer: {
    height: normalize(216),
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: metrics.keylines_screen_profile_title_margin,
  },
  warpBody: {
    flex: 2.5,
    paddingHorizontal: metrics.keylines_screen_profile_title_margin,
  },
  wrapBottom: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: colors.pale_grey,
    flexDirection: 'row',
  },
  title: {
    fontSize: fonts.size.xxl,
    fontFamily: fonts.family.SSPSemiBold,
    textAlign: 'center',
  },
  description: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
    textAlign: 'center',
    marginTop: metrics.keylines_screen_edge_margin,
  },
  wrapCheckBox: {
    marginTop: metrics.keylines_screen_profile_title_margin,
  },
  checkBox: {
    alignItems: 'center',
  },
  checkBoxText: {
    flex: 0,
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPRegular,
    color: colors.dark_blue_grey,
    marginLeft: metrics.keylines_screen_edge_margin,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 0.5,
    backgroundColor: colors.pale_grey,
  },
  buttonText: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
    color: colors.dark_blue_grey,
  },
  buttonTextColor: {
    marginLeft: metrics.medium_base,
    color: colors.primary_blue,
  },
  icon: {
    height: 24,
    width: 24,
    tintColor: colors.primary_blue,
  },
})
