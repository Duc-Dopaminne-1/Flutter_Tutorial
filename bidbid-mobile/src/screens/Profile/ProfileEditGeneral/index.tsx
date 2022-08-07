import React, { ReactElement, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { checkLivingAuctions, getUser } from '@/redux/user/actions';
import { colors, screenHeight } from '@/vars';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import HeaderView from './components/header/HeaderView';
import BodyView from './components/body/BodyView';
import { StyleSheet, View } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { isAndroid, isIOS, isIphoneX } from '@/shared/devices';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useEnableHardwareBackButton from '@/shared/useEnableHardwareBackButton';
import NavigationActionsService from '../../../navigation/navigation';
import ErrorDialog from '@/screens/DeletetAccount/ErrorDialog';
import { useNavigation } from '@react-navigation/core';
import IconBack from '@/components/SVG/BackSvg';

const PARALLAX_HEADER_HEIGHT = (screenHeight * 2) / 5;
const PARALLAX_SCROLL_SPEED = 100;

export function ProfileEditGeneralScreen(): ReactElement {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [errorDialogVisible, setErrorDialogVisible] = useState(false);
  const showContent = useRef(false);

  useEnableHardwareBackButton();

  useEffect(() => {
    NavigationActionsService.showLoading();
    dispatch(
      checkLivingAuctions({
        onSuccess: hasLivingAuctions => {
          NavigationActionsService.hideLoading();
          showContent.current = hasLivingAuctions <= 0;
          setIsLoading(false);
          setErrorDialogVisible(!showContent.current);
        },
        onFail: () => {
          NavigationActionsService.hideLoading();
          showContent.current = false;
          setIsLoading(false);
          setErrorDialogVisible(true);
        },
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(
      getUser({
        onSuccess: () => undefined,
        onFail: () => undefined,
      }),
    );
  }, []);

  const [headerVisible, setHeaderVisible] = useState(true);

  const renderFixedHeader = () => {
    if (!headerVisible)
      return (
        <CustomHeader
          leftIcon={<IconBack />}
          containerStyle={styles.wrapHeader}
          title={language('profileGeneral.profile')}
          titleStyle={styles.textTitle}
        />
      );
    return null;
  };

  const onChangeHeaderVisibility = (state: boolean) => {
    if (headerVisible !== state) {
      setHeaderVisible(state);
    }
  };

  const renderForegroundView = () => {
    return <HeaderView />;
  };

  const renderErrorDialog = () => {
    return (
      errorDialogVisible && (
        <ErrorDialog
          isVisible={errorDialogVisible}
          onBackdropPress={() => {
            setErrorDialogVisible(false);
            navigation.canGoBack() && navigation.goBack();
          }}
          errorMessage={language('editProfileHasLiveAuctionError')}
          confirmOnPressed={() => {
            setErrorDialogVisible(false);
            navigation.canGoBack() && navigation.goBack();
          }}
        />
      )
    );
  };

  const renderContentView = () => {
    if (!showContent.current) return null;
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        extraScrollHeight={150}
        keyboardOpeningTime={0}
        extraHeight={isAndroid ? 120 : 70}
        enableOnAndroid={true}
      >
        <ParallaxScrollView
          backgroundColor={colors.transparent}
          parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
          backgroundScrollSpeed={PARALLAX_SCROLL_SPEED}
          onChangeHeaderVisibility={onChangeHeaderVisibility}
          renderForeground={renderForegroundView}
          renderFixedHeader={renderFixedHeader}
        >
          <BodyView />
        </ParallaxScrollView>
      </KeyboardAwareScrollView>
    );
  };

  if (isLoading) return null;

  return (
    <View style={styles.container}>
      {renderContentView()}
      {renderErrorDialog()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  textTitle: {
    color: colors.title_grey,
    fontWeight: isIOS ? '600' : 'bold',
  },
  wrapHeader: {
    paddingTop: isIphoneX() ? 40 : 25,
  },
});
