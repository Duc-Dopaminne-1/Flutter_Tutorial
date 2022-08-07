import { isEmpty } from 'lodash';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { ICClose } from '../../assets/icons';
import { PrimaryButton } from '../../components';
import AppText from '../../components/app_text';
import { FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '../../constants/appFonts';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../constants/colors';
import { DEVICE_HEIGHT, DEVICE_WIDTH, SPACING } from '../../constants/size';
import { logOutHandle } from '../../redux/actions/auth';
import { getClearAlertError } from '../../redux/actions/system';
import { scale } from '../../utils/responsive';
import SecondaryButton from '../secondary_button';

const Modal = props => {
  const dispatch = useDispatch();
  const error = useSelector(state => state?.system?.error);
  const animation = React.useRef(new Animated.Value(0)).current;
  const onClose = () => {
    dispatch(getClearAlertError());
    setTimeout(() => {
      error?.closeAction ? error?.closeAction() : null;
    }, 300);
  };

  const onCancel = useCallback(() => {
    if (!error.closeAfterNavigate) {
      dispatch(getClearAlertError());
    }

    setTimeout(()=>{
      error?.cancelAction?.();
    }, 300)
  }, [dispatch, error]);

  const onLogin = useCallback(() => {
    dispatch(getClearAlertError());
    dispatch(logOutHandle());
  }, [dispatch]);

  const nextBtn = useCallback(() => {

    if (!error.closeAfterNavigate) {
      dispatch(getClearAlertError());
    }
    setTimeout(()=>{
      error?.confirmAction?.();
    }, 300)
  }, [dispatch, error]);

  React.useEffect(() => {
    Animated.timing(animation, {
      duration: 300,
      toValue: 1,
      useNativeDriver: true
    }).start();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0]
  });

  const [imageInfo, setInfo] = useState();
  useLayoutEffect(() => {
    if (error?.promotion) {
      Image.getSize(error?.promotion, (width, height) => {
        setInfo({ ...{ width, height } });
      });
    }
  }, [error?.promotion]);

  const promotionSize = useMemo(() => {
    let width, height;

    if (imageInfo?.width && imageInfo?.height) {
      if (imageInfo.width >= imageInfo.height) {
        // Landscape
        width = DEVICE_WIDTH * 0.8;
        height = (width * imageInfo?.height) / imageInfo?.width;
      } else {
        height = DEVICE_HEIGHT * 0.7;
        width = (height * imageInfo?.width) / imageInfo?.height;
      }
      return [width, height];
    }
  }, [imageInfo]);

  const content = useMemo(() => {
    if (error?.promotion && promotionSize && !isEmpty(promotionSize)) {
      return (
        <FastImage
          source={{ uri: error?.promotion }}
          style={{
            width: scale(promotionSize?.[0]) || DEVICE_WIDTH * 0.8,
            height: scale(promotionSize?.[1]) || DEVICE_WIDTH * 0.8,
            borderRadius: scale(12)
          }}
          resizeMode={'cover'}
        />
      );
    } else {
      return (
        <>
          {error?.imageDefault ? (
            <Image source={error?.imageDefault} style={styles.image} />
          ) : (
            <View style={styles.img}>{error?.image}</View>
          )}

          <AppText
            translate
            bold={true}
            style={error?.type === 'chat' ? styles.textTitleChat : styles.textTitle}>
            {error?.title || ''}
          </AppText>
          <View style={styles.descriptionContainer}>
            <AppText
              translate={!error?.dontTranslateMessage}
              style={error?.type === 'chat' ? styles.textDescriptionChat : styles.textDescription}>
              {error?.message || ''}
            </AppText>
          </View>
          {error?.noButton ? null : error?.type == 'complete' ? null : error?.type == 'noti' ||
            error?.type == 'error' ? (
            <View style={styles.btnContainer2}>
              <PrimaryButton
                translate
                onPress={error?.confirmAction ? nextBtn : onLogin}
                title={error?.btnName}
                width="100%"
              />
            </View>
          ) : error?.type === 'chat' ? (
            <View style={styles.btnContainerChat}>
              <SecondaryButton translate onPress={onCancel} title={error?.btnLeft} width="100%" />
              <PrimaryButton
                translate
                onPress={nextBtn}
                title={error?.btnRight}
                width="100%"
                backgroundColor={error?.btnBlock ? '#E6E9ED' : '#FFFFFF'}
                colorText={error?.btnBlock ? '#313131' : '#EE2624'}
                style={error?.btnBlock ? styles.btnBlockChat : styles.btnRemoveChat}
              />
            </View>
          ) : (
            <View style={styles.btnContainer1}>
              <SecondaryButton translate width={'48%'} onPress={onCancel} title={error?.btnLeft} />
              <PrimaryButton translate width={'48%'} title={error?.btnRight} onPress={nextBtn} />
            </View>
          )}
        </>
      );
    }
  }, [error, nextBtn, onCancel, onLogin, promotionSize]);

  return (
    <View style={[styles.modalWrapper]}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [
              {
                translateY
              }
            ]
          },
          error?.promotion &&
            !isEmpty(imageInfo) && {
              width: imageInfo?.[0],
              height: imageInfo?.[1]
            }
        ]}>
        {!error?.noClose && (
          <TouchableOpacity style={styles.closeContainer} onPress={onClose}>
            <ICClose />
          </TouchableOpacity>
        )}
        {content}
      </Animated.View>
    </View>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalWrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    alignItems: 'center',
    borderRadius: scale(12),
    backgroundColor: BACKGROUND_COLOR.White
  },
  closeContainer: {
    top: scale(16),
    right: scale(16),
    position: 'absolute',
    zIndex: 2
  },

  img: {
    marginTop: scale(24)
  },
  image: {
    marginTop: scale(24)
  },
  textTitle: {
    marginTop: scale(16),
    fontSize: FONT_SIZE.Heading,
    lineHeight: LINE_HEIGHT.Heading,
    textAlign: 'center',
    marginHorizontal: scale(24)
  },
  textTitleChat: {
    fontSize: scale(20),
    lineHeight: scale(28),
    textAlign: 'center',
    marginHorizontal: scale(24)
  },
  textDescription: {
    textAlign: 'center',
    marginTop: scale(12),
    marginBottom: scale(16),
    marginHorizontal: scale(16),
    fontSize: FONT_SIZE.BodyText,
    lineHeight: LINE_HEIGHT.BodyText
  },
  textDescriptionChat: {
    textAlign: 'center',
    marginTop: scale(12),
    marginBottom: scale(16),
    marginHorizontal: scale(16),
    fontSize: scale(14),
    lineHeight: LINE_HEIGHT.BodyText
  },
  btnContainer1: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    paddingHorizontal: scale(16),
    justifyContent: 'space-between'
  },
  btnContainer2: {
    width: '90%',
    marginBottom: scale(15)
  },
  btnContainerChat: {
    width: '100%',
    marginBottom: scale(24),
    paddingHorizontal: scale(16)
  },
  btnRemoveChat: {
    marginTop: SPACING.XNormal,
    borderWidth: scale(1),
    borderColor: '#EE2624'
  },
  btnBlockChat: {
    marginTop: SPACING.XNormal
  }
});
