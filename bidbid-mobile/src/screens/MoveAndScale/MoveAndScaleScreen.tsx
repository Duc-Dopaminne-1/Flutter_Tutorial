import React, { ReactElement, useState } from 'react';
import { ImageStyle, Image, StyleSheet, ViewStyle, View, TextStyle, Text, Pressable } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts, screenWidth } from '@/vars';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import ReactNativeZoomAbleView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import { useNavigation, useRoute } from '@react-navigation/native';
import ThankYouDialog from './ThankYouDialog';
import { useDispatch } from 'react-redux';
import { verifyUserPhoto } from '@/redux/user/actions';
import { createFormData } from '@/models';
import NavigationActionsService from '@/navigation/navigation';
import IconBack from '@/components/SVG/BackSvg';
export default function MoveAndScaleScreen(): ReactElement {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [thankYouDialogVisible, setThankYouDialogVisible] = useState(false);
  const route: any = useRoute();

  const image = route ? route.params.image : '';

  const submitOnPressed = () => {
    const data = createFormData(image, 'verify');
    NavigationActionsService.showLoading();
    dispatch(
      verifyUserPhoto(data, {
        onSuccess: () => {
          setThankYouDialogVisible(true);
        },
        onFail: () => {},
      }),
    );
    //setThankYouDialogVisible(true);
  };

  return (
    <View style={styles.root}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader titleStyle={styles.titleText} title={language('moveAndScaleScreen.title')} leftIcon={<IconBack />} />
      </View>
      <View style={styles.container}>
        <View style={styles.imageContentView}>
          <ReactNativeZoomAbleView
            maxZoom={2}
            minZoom={0.5}
            zoomStep={0.5}
            initialZoom={1}
            bindToBorders={true}
            style={styles.wrapperImage}
          >
            <Image style={styles.imageStyle} source={{ uri: image.path }} resizeMode="cover" />
          </ReactNativeZoomAbleView>
        </View>
        <Pressable style={styles.bottomView} onPress={submitOnPressed}>
          <Text style={styles.submitText}>{language('moveAndScaleScreen.submit')}</Text>
        </Pressable>
      </View>

      <ThankYouDialog
        isVisible={thankYouDialogVisible}
        closeOnPressed={() => {
          setThankYouDialogVisible(false);
          NavigationActionsService.hideLoading();
          navigation.goBack();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  } as ViewStyle,

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.black,
  } as ViewStyle,

  wrapperHeader: {
    marginBottom: 0,
  } as ViewStyle,

  imageContentView: {
    width: '100%',
    height: '60%',
    overflow: 'hidden',
    marginBottom: 100,
  } as ViewStyle,

  wrapperImage: {
    padding: 0,
    paddingTop: 0,
  } as ViewStyle,

  imageStyle: {
    width: screenWidth,
    height: '100%',
  } as ImageStyle,

  bottomView: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 40,
    height: 60,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.red_700,
  } as ViewStyle,

  submitText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: fonts.size.s16,
    color: colors.white,
    fontFamily: fonts.family.SSPRegular,
  } as TextStyle,

  titleText: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: fonts.size.s18,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,
});
