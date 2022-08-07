import React, { ReactElement, useEffect, useLayoutEffect, useState, useMemo, useRef } from 'react';
import { StyleSheet, ViewStyle, View, TextStyle, Pressable, InteractionManager, Platform, AppState } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import DefaultText from '@/components/CustomText/DefaultText';
import { RNCamera as Camera } from 'react-native-camera';
import { GlobalProps } from '@/shared/Interface';
import { alertError } from '@/shared/alert';
import { throttle } from 'lodash';
import { useDispatch } from 'react-redux';
import { meetConfirmation } from '@/redux/meet/actions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import NavigationActionsService from '@/navigation/navigation';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { EnableCameraView } from './EnableCameraView';
import ErrorDialog from '../DeletetAccount/ErrorDialog';
import IconBack from '@/components/SVG/BackSvg';
import IconCircleCloseSVG from '@/components/SVG/IconCircleCloseSVG';

export default function ScanQRCodeScreen(props: GlobalProps): ReactElement {
  const dispatch = useDispatch();

  const [displayDescView, setDisplayDescView] = useState(true);
  const [cameraActive, setcameraActive] = useState(true);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dataQrCodeRef = useRef(null);
  const auction = props.route.params ? props.route.params?.auction : { id: '' };

  const display = displayDescView ? 'flex' : 'none';

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChangeHandler);
    return () => {
      AppState.removeEventListener('change', handleAppStateChangeHandler);
    };
  }, []);

  const handleAppStateChangeHandler = nextAppState => {
    if (nextAppState === 'active') {
      checkAndRequestCameraPermission();
    }
  };

  const checkAndRequestCameraPermission = async () => {
    let requestResult = await request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA);
    if (requestResult == RESULTS.BLOCKED || requestResult === RESULTS.DENIED) {
      setcameraActive(false);
    } else {
      setcameraActive(true);
    }
  };

  useLayoutEffect(() => {
    InteractionManager.runAfterInteractions(async () => {
      await checkAndRequestCameraPermission();
    });
  }, []);

  const onSuccess = () => {
    if (dataQrCodeRef.current?.data !== auction.id) {
      alertError(language('errorMessage.invalidQrCode'), language('alert.notice'));
    } else {
      dispatch(
        meetConfirmation({
          auctionId: auction.id,
          callback: {
            onSuccess: () => {
              NavigationActionsService.hideLoading();
            },
            onFail: error => {
              NavigationActionsService.hideLoading();
              setTimeout(() => {
                setErrorMessage(error);
                setErrorDialogVisible(true);
              }, 400);
            },
          },
        }),
      );
    }
  };

  const onRead = useMemo(() => throttle(onSuccess, 3000, { leading: true, trailing: false }), []);

  const backgroundColor = cameraActive ? colors.gray_600_alpha : colors.white;

  const renderEmptyView = () => {
    return <EnableCameraView />;
  };

  const getResultScan = data => {
    dataQrCodeRef.current = data;
    onRead();
  };

  const renderCameraView = () => {
    return (
      <>
        <View style={styles.qrCodeWrapper}>
          <QRCodeScanner
            onRead={getResultScan}
            cameraType="back"
            reactivate={true}
            vibrate={false}
            cameraProps={{ flashMode: Camera.Constants.FlashMode.auto }}
          />
        </View>

        <View style={[styles.descriptionView, { display: display }]}>
          <View style={styles.textWrapper}>
            <DefaultText {...{ style: styles.textType }}>{language('qrCodeScreen.bideeScanQRCode')}</DefaultText>
          </View>

          <Pressable
            style={styles.iconCircleCloseWrapper}
            onPress={() => {
              setDisplayDescView(false);
            }}
          >
            <IconCircleCloseSVG />
          </Pressable>
        </View>
      </>
    );
  };

  return (
    <View style={styles.root}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader titleStyle={styles.titleText} title={language('qrCodeScreen.scanQRtitle')} leftIcon={<IconBack />} />
      </View>
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>{!cameraActive ? renderEmptyView() : renderCameraView()}</View>
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => setErrorDialogVisible(false)}
        errorMessage={errorMessage}
        confirmOnPressed={() => {
          setErrorDialogVisible(false);
          setTimeout(() => {
            NavigationActionsService.goBack();
          }, 400);
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
    backgroundColor: colors.gray_600_alpha,
  } as ViewStyle,

  wrapperHeader: {} as ViewStyle,

  titleText: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  textType: {
    fontSize: fonts.size.s14,
    color: colors.white,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  qrCodeWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 14,
    marginTop: 50,
    overflow: 'hidden',
  } as ViewStyle,

  // backView: {
  //   flex: 1,
  //   backgroundColor: colors.black,
  // } as ViewStyle,

  descriptionView: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: 300,
    borderRadius: 12,
    backgroundColor: colors.red_400,
    marginTop: 30,
  } as ViewStyle,

  textWrapper: {
    flex: 1,
    marginRight: 15,
  } as ViewStyle,

  iconCircleCloseWrapper: {
    width: 50,
    alignItems: 'center',
  } as ViewStyle,
});
