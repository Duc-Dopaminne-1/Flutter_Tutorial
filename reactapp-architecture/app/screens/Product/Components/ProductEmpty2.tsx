import * as React from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import { colors, fonts, images, metrics, normalize } from '@/vars'
import I18n from 'react-native-i18n'
import { AButton } from '@/components/AButton/AButton'
import { navigation } from '@/navigation/navigation'

export class ProductEmpty2 extends React.PureComponent {
  onPressCreate = () => {
    navigation.navigate('CameraScreen', {})
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={images.productPlaceHolder}
          style={styles.iconEmpty}
          resizeMode="contain"
        />
        <Text style={styles.textNoProduct}>{I18n.t('doNotProduct')}</Text>
        <Text style={styles.textShouldTakePicture}>
          {I18n.t('takePictureOfProduct')}
        </Text>

        <AButton
          containerStyle={styles.wrapButton}
          title={I18n.t('createProducts')}
          titleStyle={styles.textCreate}
          leftIcon={images.camera}
          imageStyle={styles.iconCamera}
          onPress={this.onPressCreate}
        />

        <Text style={styles.textMessage}>{I18n.t('easilyCreate')}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal:
      metrics.product_empty_screen_container_padding_horizontal,
  },
  iconEmpty: {
    width: 95,
    height: 114,
    marginBottom: 28,
    marginTop: 10,
  },
  textNoProduct: {
    marginBottom: 7,
    fontSize: fonts.size.xxl,
    color: colors.dark_blue_grey,
    fontWeight: '600',
    fontFamily: fonts.family.SSPSemiBold,
  },
  textShouldTakePicture: {
    marginBottom: 24,
    fontSize: fonts.size.l,
    color: colors.dark_blue_grey,
    fontFamily: fonts.family.SSPRegular,
  },
  textCreate: {
    fontSize: fonts.size.m,
    fontFamily: fonts.family.SSPSemiBold,
  },
  wrapButton: {
    height: 40,
    margin: 0,
    paddingHorizontal:
      metrics.product_empty_screen_wrap_button_padding_horizontal,
    paddingVertical: metrics.product_empty_screen_wrap_button_padding_vertical,
    borderRadius: metrics.product_empty_screen_wrap_button_border_radius,
  },
  iconCamera: {
    width: metrics.product_empty_screen_icon_camera_width,
    height: metrics.product_empty_screen_icon_camera_height,
  },
  wrapTextMessage: {
    height: normalize(68),
  },
  textMessage: {
    marginTop: 24,
    marginBottom: 25,
    color: colors.blue_light_grey,
    fontFamily: fonts.family.SSPRegular,
    fontSize: fonts.size.m,
    textAlign: 'center',
  },
})
