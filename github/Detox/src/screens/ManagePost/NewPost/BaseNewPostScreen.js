import PropTypes from 'prop-types';
import React from 'react';
import {StyleSheet, View} from 'react-native';

import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import {FeatureConfig} from '../../../configs/FeatureConfig';
import FooterButtons from './NewPostComponents/FooterButtons';
import {NewPostStyles} from './NewPostComponents/NewPostConstant';

const BaseNewPostScreen = ({
  navigation,
  title,
  onPressSaveDraft = () => {},
  onPressNext = () => {},
  onPressCancel = () => {},
  onPressEdit = () => {},
  onPressRequestSupport = () => {},
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
  modals,
  showRequestSupport,
  disableDraft,
  ...props
}) => {
  const isShowRequestSupport = showRequestSupport && FeatureConfig.enableTopenerService;
  return (
    <BaseScreen
      isBackable={isBackable}
      showHeader={showHeader}
      {...props}
      title={title}
      modals={modals}>
      {showHeaderShadow && (
        <View style={commonStyles.headerBarShadowContainer}>
          <View style={commonStyles.headerBarShadow} />
        </View>
      )}
      {children}
      {(isShowDraft || isShowEdit || showDefaultFooterButtons) && (
        <View style={[commonStyles.footerContainer, NewPostStyles.borderTopWidth]}>
          {isShowDraft && (
            <>
              <CustomButton
                style={[styles.draftButton, draftButtonStyle]}
                title={customDraftText}
                titleStyle={draftTextStyle}
                onPress={onPressSaveDraft}
                titleColor={COLORS.PRIMARY_A100}
                disabled={disableDraft}
              />
              {(isShowEdit || isShowRequestSupport) && (
                <View style={commonStyles.separatorColumn24} />
              )}
            </>
          )}
          {isShowEdit && (
            <>
              <CustomButton
                style={[
                  commonStyles.buttonConfirm,
                  isShowRequestSupport && {backgroundColor: COLORS.GRAY_ED},
                ]}
                title={translate('propertyPost.editInfo')}
                titleStyle={{
                  ...styles.editText,
                  ...(!isShowRequestSupport && {color: COLORS.NEUTRAL_WHITE}),
                }}
                onPress={onPressEdit}
              />
              {isShowRequestSupport && <View style={commonStyles.separatorColumn24} />}
            </>
          )}
          {isShowRequestSupport && (
            <>
              <CustomButton
                style={commonStyles.buttonConfirm}
                title={translate('propertyPost.requestTopenerSupport')}
                titleStyle={{
                  ...styles.editText,
                  ...(isShowRequestSupport && {color: COLORS.NEUTRAL_WHITE}),
                }}
                onPress={onPressRequestSupport}
              />
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
            />
          )}
        </View>
      )}
    </BaseScreen>
  );
};

const styles = StyleSheet.create({
  draftButton: {
    ...commonStyles.buttonNextConfirm,
    marginEnd: 0,
  },
  editText: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
  },
});

BaseNewPostScreen.propTypes = {
  title: PropTypes.string,
  onPressSaveDraft: PropTypes.func,
  onPressNext: PropTypes.func,
  customDraftText: PropTypes.string,
  customNextText: PropTypes.string,
  isShowDraft: PropTypes.bool,
  isDisabledNext: PropTypes.bool,
  isBackable: PropTypes.bool,
  showHeader: PropTypes.bool,
};

BaseNewPostScreen.defaultProps = {
  title: '',
  onPressSaveDraft: () => {},
  onPressNext: () => {},
  customDraftText: translate(STRINGS.SAVE_DRAFT),
  customNextText: translate(STRINGS.NEXT),
  isShowDraft: false,
  isDisabledNext: false,
  isBackable: true,
  showHeader: true,
};

export default BaseNewPostScreen;
