import React, { ReactElement, useState, useRef, useEffect } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { language } from '@/i18n';
import { colors, fonts, images } from '@/vars';
import { useSelector, useDispatch } from 'react-redux';
import { UserInit } from '@/redux/user/reducer';
import { capitalizeAllWorks } from '@/shared/processing';
import { StatusProfile } from '@/constants/app';
import VerifyRequestDialog from './VerifyRequestDialog';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import { MOVE_AND_SCALE_SCREEN, PROFILE_EDIT_GENERAL } from '@/navigation/screenKeys';
import DefaultText from '@/components/CustomText/DefaultText';
import CustomHeader from '@/components/CustomHeader';
import VerifyRequestNoteDialog from './VerifyRequestNoteDialog';
import VerifyPendingRequestDialog from './VerifyPendingRequestDialog';
import { PERMISSIONS } from 'react-native-permissions';
import { showGetVerify } from '@/shared/global';
import { onCheckPermissionIOS } from '@/shared/permission';
import { getUserStatus } from '@/redux/user/selector';
import { checkLivingAuctions } from '@/redux/user/actions';
import ErrorDialog from '@/screens/DeletetAccount/ErrorDialog';
import { formatName } from '@/shared/discovery';
import IconNotVerifySVG from '@/components/SVG/IconNotVerifySVG';
import IconPendingReviewSVG from '@/components/SVG/IconPendingReviewSVG';
import IconVerifiedUserSVG from '@/components/SVG/IconVerifiedUserSVG';

export function ProfileInfo(): ReactElement {
  const navigation = useNavigation();
  const [verifyRequestDialogVisible, setVerifyRequestDialogVisible] = useState(false);
  const [verifyRequestNoteDialogVisible, setVerifyRequestNoteDialogVisible] = useState(false);
  const [verifyPendingRequestDialogVisible, setVerifyPendingRequestDialogVisible] = useState(false);
  const shouldOpenPeaceFingersRef = useRef<boolean>(false);
  const shouldOpenCameraRef = useRef<boolean>(false);
  const dispatch = useDispatch();
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);

  const { firstName, avatar, lastName } = useSelector((state: UserInit) => {
    return state.user.data;
  });

  const renderIconVerifyImg = () => {
    if (getUserStatus() === StatusProfile.VERIFIED) return <IconVerifiedUserSVG />;
    if (getUserStatus() === StatusProfile.PENDING_VERIFY) return <IconPendingReviewSVG />;
    return <IconNotVerifySVG />;
  };

  useEffect(() => {
    const showGetVerifySubscribe = showGetVerify.subscribe(_data => {
      verifyIconOnPressed();
    });

    return () => {
      showGetVerifySubscribe && showGetVerifySubscribe.unsubscribe();
    };
  }, []);

  const verifyIconOnPressed = () => {
    if (getUserStatus() === StatusProfile.COMPLETED || getUserStatus() == StatusProfile.INVALID) {
      setVerifyRequestDialogVisible(true);
    } else if (getUserStatus() === StatusProfile.PENDING_VERIFY) {
      setVerifyPendingRequestDialogVisible(true);
    }
  };

  const onBackdropPressInRequestModal = () => {
    shouldOpenPeaceFingersRef.current = false;
    setVerifyRequestDialogVisible(false);
  };

  const onNextButtonPressInRequestModal = () => {
    shouldOpenPeaceFingersRef.current = true;
    setVerifyRequestDialogVisible(false);
  };

  const onRequestModalHide = () => {
    if (shouldOpenPeaceFingersRef.current) {
      setVerifyRequestNoteDialogVisible(true);
    }
  };

  const onBackButtonPressInNoteModal = () => {
    shouldOpenCameraRef.current = false;
    setVerifyRequestNoteDialogVisible(false);
  };

  const onNextButtonPressInNoteModal = () => {
    shouldOpenCameraRef.current = true;
    setVerifyRequestNoteDialogVisible(false);
  };

  const openCamera = async () => {
    ImagePicker.openCamera({
      width: 1080,
      height: 1920,
      useFrontCamera: true,
      cropperChooseText: language('choose'),
      cropperCancelText: language('cancel'),
    })
      .then(image => {
        navigation.navigate(MOVE_AND_SCALE_SCREEN, { image: image });
      })
      .catch(async _e => {
        await onCheckPermissionIOS(PERMISSIONS.IOS.CAMERA);
      });
  };

  const onNoteModalHide = () => {
    if (shouldOpenCameraRef.current) {
      setTimeout(async () => {
        await openCamera();
      }, 100);
    }
  };

  const onPressAvatar = () => {
    dispatch(
      checkLivingAuctions({
        onSuccess: hasLivingAuctions => {
          if (hasLivingAuctions === 0) {
            navigation.navigate(PROFILE_EDIT_GENERAL);
          } else {
            setErrorDialogVisible(true);
          }
        },
        onFail: () => setErrorDialogVisible(true),
      }),
    );
  };

  return (
    <View>
      <CustomHeader
        isShadow={false}
        containerStyle={styles.wrapHeader}
        titleStyle={styles.textHeader}
        title={language('profileGeneral.profile')}
      />

      <View style={styles.wrapAvatar}>
        {avatar ? (
          <Pressable onPress={onPressAvatar}>
            <Image source={{ uri: avatar.url }} style={styles.avatar} resizeMode={'cover'} />
          </Pressable>
        ) : (
          <Image source={images.missing} style={styles.avatar} resizeMode={'contain'} />
        )}
      </View>
      <View style={styles.wrapName}>
        <DefaultText {...{ style: styles.name, numberOfLines: 2 }}>
          {capitalizeAllWorks(formatName(`${firstName} ${lastName || ''}`))}
        </DefaultText>
        <Pressable style={styles.wrapperVerifyIcon} onPress={verifyIconOnPressed}>
          {renderIconVerifyImg()}
        </Pressable>
      </View>
      <VerifyRequestDialog
        isVisible={verifyRequestDialogVisible}
        onBackdropPress={onBackdropPressInRequestModal}
        nextButtonOnPressed={onNextButtonPressInRequestModal}
        onModalHide={onRequestModalHide}
      />

      <VerifyRequestNoteDialog
        isVisible={verifyRequestNoteDialogVisible}
        onBackButtonPress={onBackButtonPressInNoteModal}
        onNextButtonPress={onNextButtonPressInNoteModal}
        onModalHide={onNoteModalHide}
      />

      <VerifyPendingRequestDialog
        isVisible={verifyPendingRequestDialogVisible}
        onBackdropPress={() => {
          setVerifyPendingRequestDialogVisible(false);
        }}
        nextButtonOnPressed={() => {
          setVerifyPendingRequestDialogVisible(false);
        }}
      />
      <ErrorDialog
        isVisible={errorDialogVisible}
        onBackdropPress={() => setErrorDialogVisible(false)}
        errorMessage={language('editProfileHasLiveAuctionError')}
        confirmOnPressed={() => setErrorDialogVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapHeader: {
    marginTop: 0,
  },
  textHeader: {
    fontSize: fonts.size.s22,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  },
  wrapAvatar: {
    paddingTop: 32,
    alignItems: 'center',
  },
  wrapName: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingBottom: 30,
  },
  avatar: {
    height: 160,
    width: 160,
    borderRadius: 80,
    borderWidth: 0.1,
    borderColor: colors.gray_100,
  },
  name: {
    marginRight: 7,
    fontSize: fonts.size.s20,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsSemiBold,
    textAlign: 'center',
  },
  wrapperVerifyIcon: {
    padding: 5,
  },
});
