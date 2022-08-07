import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { View, Platform, BackHandler, StyleSheet, Pressable, KeyboardAvoidingView, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, screenHeight } from '@/vars';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { language } from '@/i18n';
import { FilterHeaderView } from '../Commons/FilterHeaderView';
import { FilterLineBreak } from '../Commons/FilterLineBreak';
import { useDispatch, useSelector } from 'react-redux';
import { saveIGUsername } from '@/redux/filters/actions';
import { isAndroid } from '@/shared/devices';
import Modal from 'react-native-modal';
import IGUsernameSearchForm from './components/IGUsernameSearchForm';
import { RootState } from '@/redux/reducers';

const WRAPPER_ACTIVITY_INDICATOR: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: colors.gray_600_alpha,
  justifyContent: 'center',
  alignItems: 'center',
};

interface FilterIGUsernameScreenProps {
  isFromSetting?: boolean;
  onBackdropPress?: () => void;
  isVisible?: boolean;
}

export function FilterIGUsernameScreen(props: FilterIGUsernameScreenProps): ReactElement {
  const { isFromSetting, onBackdropPress, isVisible } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route: any = useRoute();
  const opacityViewHandler = route.params ? route.params.opacityViewHandler : null;
  const instaUsername = useSelector((state: RootState) => state.filters.instaUsername);
  const [searchQuery, setSearchQuery] = useState(instaUsername);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    opacityViewHandler && opacityViewHandler(0);
  }, []);

  const onBackPressed = (): boolean => {
    if (isFromSetting) {
      onBackdropPress && onBackdropPress();
      return false;
    }

    opacityViewHandler && opacityViewHandler(1);
    navigation.canGoBack() && navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onBackPressed);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPressed);
      };
    } else {
      return () => {};
    }
  }, []);

  const resetOnPressed = async () => {
    setSearchQuery('');
  };

  const handleSelect = useCallback((keyword: string) => {
    setIsLoading(true);
    dispatch(saveIGUsername(keyword));
    setIsLoading(false);
    onBackPressed();
  }, []);

  const renderBody = () => {
    return (
      <View style={styles.container}>
        <FilterHeaderView
          leftIcon={isFromSetting ? 'close' : 'back'}
          title={language('filterScreen.searchIGUsername')}
          closeOnPressed={onBackPressed}
          resetOnPressed={resetOnPressed}
        />
        <FilterLineBreak />
        <View style={styles.wrapSearch}>
          <IGUsernameSearchForm value={searchQuery} onChange={setSearchQuery} onSelect={handleSelect} />
        </View>
        {isLoading && (
          <View style={WRAPPER_ACTIVITY_INDICATOR}>
            <ActivityIndicator color={colors.red_600} />
          </View>
        )}
      </View>
    );
  };

  const renderComponent = () => {
    return (
      <View style={isFromSetting ? styles.rootViewSetting : styles.rootView}>
        {isAndroid ? renderBody() : <KeyboardAvoidingView behavior="position">{renderBody()}</KeyboardAvoidingView>}
      </View>
    );
  };

  const onBack = () => {
    onBackdropPress && onBackdropPress();
  };

  if (!isFromSetting) {
    return renderComponent();
  }
  return (
    <Modal onBackdropPress={onBack} onBackButtonPress={onBack} isVisible={isVisible} style={styles.wrapper}>
      <Pressable onPressOut={onBack}>{renderComponent()}</Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  rootView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent,
  },
  rootViewSetting: {
    height: screenHeight,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparent,
  },
  wrapSearch: {
    marginTop: 20,
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
});
