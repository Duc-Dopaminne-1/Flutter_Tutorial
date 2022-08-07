import isEmpty from 'lodash/isEmpty';
import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from 'react-native';

import {CONSTANTS} from '../assets/constants';
import {SIZES} from '../assets/constants/sizes';
import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {STRINGS} from '../assets/localize/string';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {medium, METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import CustomButton from '../components/Button/CustomButton';
import CustomIconButton from '../components/CustomIconButton';
import LinkTextButton from '../components/LinkTextButton';
import ConfirmDialog from './ConfirmDialog';
import SafeAreaScreenContainer from './SafeAreaScreenContainer';

const styles = StyleSheet.create({
  container: {
    ...HELPERS.fill,
    justifyContent: 'flex-end',
  },
  titleText: {
    ...FONTS.semiBold,
    fontSize: 24,
    flex: 1,
    marginEnd: medium,
  },
  contentContainer: {
    ...METRICS.paddingTop,
    borderRadius: SIZES.BORDER_RADIUS_10,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  scrollView: {
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    ...METRICS.horizontalPadding,
    borderTopColor: COLORS.SEPARATOR_LINE,
    borderTopWidth: 1,
  },
  safeArea: {
    backgroundColor: COLORS.TRANSPARENT,
  },
  closeButton: {
    position: 'absolute',
    end: 0,
    top: 0,
  },
  loadingContainer: {
    ...HELPERS.center,
    backgroundColor: COLORS.BLACK_HALF_OPACITY,
    zIndex: 100,
    position: 'absolute',
    top: 0,
    end: 0,
    bottom: 0,
    left: 0,
  },
  errorContainer: {
    zIndex: 200,
  },
});

const BaseFilterScreen = ({
  onClose,
  onConfirmed,
  onClearFilter,
  children,
  titleStyle,
  error,
  isLoading = false,
  isLeftButtonVisible = true,
  title = translate(STRINGS.FILTER),
  rightButtonText = translate(STRINGS.CONFIRM),
  disabledRightButton = false,
  onDismissError = () => {},
  onRetry = () => {},
  onCancel = () => {},
  closeStyle,
  closeVisible = true,
  contentStyle,
  bottomButtonsStyle,
  customRightButtonStyle = {},
}) => {
  const rightButtonStyle = disabledRightButton
    ? commonStyles.disabledButtonConfirm
    : commonStyles.buttonConfirm;
  return (
    <SafeAreaScreenContainer style={styles.safeArea}>
      {isLoading && isEmpty(error) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.NEUTRAL_WHITE} />
        </View>
      )}
      {!isEmpty(error) && (
        <View style={[styles.loadingContainer, styles.errorContainer]}>
          <ConfirmDialog
            isVisible={true}
            title={translate(STRINGS.DEFAULT_MODAL_TITLE)}
            okText={translate(STRINGS.RETRY)}
            message={error}
            onCancelHandler={onCancel}
            onOkHandler={onRetry}
            onDismiss={onDismissError}
          />
        </View>
      )}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={[styles.contentContainer, contentStyle]}>
            <View style={METRICS.horizontalMargin}>
              <View style={HELPERS.rowCenter}>
                <Text style={[styles.titleText, titleStyle]}>{title}</Text>
                {closeVisible && (
                  <CustomIconButton
                    style={styles.closeButton}
                    onPress={onClose}
                    image={IMAGES.IC_DISMISS}
                    imageStyle={commonStyles.buttonDismiss}
                    hitSlop={CONSTANTS.HIT_SLOP}
                  />
                )}
                {!closeVisible && (
                  <LinkTextButton
                    textStyle={closeStyle}
                    title={translate(STRINGS.CLEAR_FILTER)}
                    onPress={onClearFilter}
                  />
                )}
              </View>
              {children}
            </View>
            <View
              style={[commonStyles.footerContainer, styles.buttonContainer, bottomButtonsStyle]}>
              {isLeftButtonVisible && (
                <CustomButton
                  style={commonStyles.buttonNextConfirm}
                  title={translate(STRINGS.RESET_FILTER)}
                  onPress={onClearFilter}
                  titleColor={COLORS.PRIMARY_A100}
                />
              )}
              <CustomButton
                disabled={disabledRightButton}
                style={[rightButtonStyle, customRightButtonStyle]}
                title={rightButtonText}
                titleStyle={commonStyles.confirmText}
                onPress={onConfirmed}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaScreenContainer>
  );
};

export default BaseFilterScreen;
