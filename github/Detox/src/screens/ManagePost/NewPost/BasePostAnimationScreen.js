import PropTypes from 'prop-types';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';
import BaseAnimationScreen from '../../../components/BaseAnimationScreen';
import CustomButton from '../../../components/Button/CustomButton';
import {StringeeContext} from '../../Call/StringeeContext';
import ScreenIds from '../../ScreenIds';
import FooterButtons from './NewPostComponents/FooterButtons';
import {NewPostStyles} from './NewPostComponents/NewPostConstant';

const AnimatedScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

const styles = StyleSheet.create({
  editText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
});

const BasePostAnimationScreen = ({
  navigation,
  title,
  onPressSaveDraft = () => {},
  onPressNext = () => {},
  onPressCancel = () => {},
  onPressEdit = () => {},
  children,
  customDraftText,
  customNextText,
  isShowDraft,
  draftButtonStyle,
  draftTextStyle,
  isDisabledNext,
  isBackable,
  showHeader,
  isShowEdit = false,
  showDefaultFooterButtons = true,
  customCancelText = translate(STRINGS.CANCEL),
  cancelButtonStyle,
  cancelTextStyle,
  showHeaderShadow,
  allowedHeaderAnimation,
  customHeaderComponent,
  headerContainerHeight,
  modals,
  extraComponent,
  showContactButtons,
  bottomFooterComponent,
  pressCallCallback,
  pressMessageCallback,
  ...props
}) => {
  const baseAnimation = useSharedValue(0);
  const {callHotline} = useContext(StringeeContext);

  const onScrollEndDrag = e => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY >= 40 && offsetY < 80) {
      baseAnimation.value = withSpring(80);
    } else if (offsetY >= 0 && offsetY < 40) {
      baseAnimation.value = withSpring(5);
    }
  };

  const onScroll = useAnimatedScrollHandler(event => {
    baseAnimation.value = event.contentOffset.y;
  });

  const onPressMessage = () => {
    pressMessageCallback && pressMessageCallback();
    navigation.navigate(ScreenIds.LiveChatSupport);
  };

  const onPressCall = () => {
    pressCallCallback && pressCallCallback();
    callHotline();
  };

  return (
    <BaseAnimationScreen
      isBackable={isBackable}
      showHeader={showHeader}
      {...props}
      title={title}
      showHeaderShadow
      childAnimation={baseAnimation}
      allowedHeaderAnimation={allowedHeaderAnimation}
      customHeaderComponent={customHeaderComponent}
      headerContainerHeight={headerContainerHeight}
      modals={modals}>
      <View style={HELPERS.fill}>
        <AnimatedScrollView
          nestedScrollEnabled={true}
          scrollEnabled={true}
          contentContainerStyle={[HELPERS.fillGrow, commonStyles.whiteBackground]}
          showsVerticalScrollIndicator={false}
          decelerationRate={'fast'}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          enableOnAndroid={true}
          alwaysBounceVertical={false}
          onScrollEndDrag={onScrollEndDrag}
          onScroll={onScroll}>
          {children}
        </AnimatedScrollView>
        {extraComponent}
      </View>
      {bottomFooterComponent}
      {(isShowDraft || isShowEdit || showDefaultFooterButtons) && (
        <View style={[commonStyles.footerContainer, NewPostStyles.borderTopWidth]}>
          {isShowDraft && (
            <>
              <CustomButton
                style={[commonStyles.buttonNextConfirm, draftButtonStyle]}
                title={customDraftText}
                titleStyle={draftTextStyle}
                onPress={onPressSaveDraft}
                titleColor={COLORS.PRIMARY_A100}
              />
              <View style={commonStyles.separatorColumn8} />
            </>
          )}
          {showDefaultFooterButtons && (
            <FooterButtons
              style={isDisabledNext && {backgroundColor: COLORS.PRIMARY_A20}}
              nextTextStyle={isDisabledNext && {color: COLORS.PRIMARY_A40}}
              nextButtonTitle={customNextText}
              onPressNext={onPressNext}
              disabledNext={isDisabledNext}
              disabledCancel={props?.disabledCancel}
              disabled={isDisabledNext}
              onPressCancel={onPressCancel}
              cancelButtonTitle={customCancelText}
              cancelTextStyle={[{color: COLORS.TEXT_DARK_10}, cancelTextStyle]}
              cancelButtonStyle={[NewPostStyles.backGrayNonBorder, cancelButtonStyle]}
              isShowPreview={props?.isShowPreview}
              disabledPreview={props?.disabledPreview}
              onPressPreview={props?.onPressPreview}
              hiddenCancelButton={showContactButtons}
              showContactButtons={showContactButtons}
              onPressCall={onPressCall}
              onPressMessage={onPressMessage}
            />
          )}
          {isShowEdit && (
            <>
              <CustomButton
                style={[commonStyles.buttonConfirm, {backgroundColor: COLORS.GRAY_ED}]}
                title={translate('propertyPost.editInfo')}
                titleStyle={styles.editText}
                onPress={onPressEdit}
                titleColor={COLORS.NEUTRAL_WHITE}
              />
            </>
          )}
        </View>
      )}
    </BaseAnimationScreen>
  );
};

BasePostAnimationScreen.propTypes = {
  title: PropTypes.string,
  onPressSaveDraft: PropTypes.func,
  onPressNext: PropTypes.func,
  customDraftText: PropTypes.string,
  customNextText: PropTypes.string,
  isShowDraft: PropTypes.bool,
  isDisabledNext: PropTypes.bool,
  isBackable: PropTypes.bool,
  showHeader: PropTypes.bool,
  extraComponent: PropTypes.element,
};

BasePostAnimationScreen.defaultProps = {
  title: '',
  onPressSaveDraft: () => {},
  onPressNext: () => {},
  customDraftText: translate(STRINGS.SAVE_DRAFT),
  customNextText: translate(STRINGS.NEXT),
  isShowDraft: false,
  isDisabledNext: false,
  isBackable: true,
  showHeader: true,
  extraComponent: null,
};

export default BasePostAnimationScreen;
