import React, { ReactElement } from 'react';
import { StyleSheet, View, ViewStyle, Text, TextStyle, Pressable, ImageStyle, ActivityIndicator } from 'react-native';
import { colors, fonts } from '@/vars';
import Modal from 'react-native-modal';
import { language } from '@/i18n';
import IconCloseSVG from '@/components/SVG/IconCloseSVG';

interface CancelMeetConfirmModalProps {
  isVisible: boolean;
  onBackdropPress?: () => void;
  onPressOke?: () => void;
  title?: string;
  children?: ReactElement;
  isButton?: boolean;
  textLinkOne?: string;
  textLinkTwo?: string;
  textLinkThree?: string;
  onPressLink?: () => void;
  icon?: ReactElement;
  iconStyle?: ImageStyle;
  subTitle?: string;
  textLinkStyle?: TextStyle;
  textContentStyle?: TextStyle;
  textButton?: string;
  titleStyle?: TextStyle;
  isFromAuctionDetailCardFail?: boolean;
  isFromAuctionDetail?: boolean;
  isLoading?: boolean;
}

function CustomConfirmModalHaveLink(props: CancelMeetConfirmModalProps): ReactElement {
  const {
    isVisible,
    onBackdropPress,
    title,
    isLoading = false,
    isFromAuctionDetail = false,
    isFromAuctionDetailCardFail = false,
    isButton = false,
    textLinkOne,
    textLinkTwo,
    textLinkThree,
    onPressLink,
    icon,
    subTitle,
    textLinkStyle,
    textContentStyle,
    onPressOke,
    titleStyle,
    textButton = language('ok'),
  } = props;

  const onPress = () => (onPressOke ? onPressOke() : onBackdropPress());

  const onBackPress = () => {
    if (isFromAuctionDetailCardFail || isFromAuctionDetail) {
      return;
    }
    onBackdropPress && onBackdropPress();
  };
  return (
    <Modal isVisible={isVisible} onBackdropPress={onBackPress} onBackButtonPress={onBackPress} style={styles.wrapModal}>
      <View style={[styles.container, isFromAuctionDetailCardFail ? styles.spaceBottom : {}]}>
        {/* Top View */}
        <View style={styles.topView}>
          <Pressable style={styles.wrapperCloseIcon} onPress={onBackdropPress}>
            <IconCloseSVG />
          </Pressable>
        </View>

        {icon ? <View style={styles.iconFeedbackWrapper}>{icon}</View> : null}

        {/* Content View */}
        <View style={styles.contentView}>
          {title ? (
            <Text style={[styles.description, titleStyle]}>{title}</Text>
          ) : (
            <>
              {subTitle && <Text style={styles.textSubTitle}>{subTitle}</Text>}
              <Text style={[styles.description, textContentStyle]}>
                {textLinkOne}{' '}
                <Text onPress={onPressLink} style={[styles.descriptionLink, textLinkStyle]}>
                  {textLinkTwo}
                </Text>{' '}
                {textLinkThree}
              </Text>
            </>
          )}
        </View>

        {isButton ? (
          <View style={styles.submitView}>
            <Pressable style={styles.pauseMyAccountButtonView} onPress={onPress}>
              {isLoading ? (
                <ActivityIndicator color={colors.white} size="small" style={styles.activityIndicatorWrapper} />
              ) : (
                <Text style={styles.submitText}>{textButton}</Text>
              )}
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

export default React.memo(CustomConfirmModalHaveLink);

const styles = StyleSheet.create({
  wrapModal: {
    margin: 0,
    justifyContent: 'center',
  } as ViewStyle,

  pauseMyAccountButtonView: {
    width: '85%',
    height: 50,
    borderRadius: 36,
    alignItems: 'center',
    backgroundColor: colors.red_700,
    justifyContent: 'center',
  } as ViewStyle,

  submitText: {
    textAlign: 'center',
    fontSize: fonts.size.s17,
    color: colors.white,
    fontFamily: fonts.family.PoppinsSemiBold,
  } as TextStyle,

  submitView: {
    padding: 2,
    marginBottom: 20,
    alignItems: 'center',
  } as ViewStyle,

  activityIndicatorWrapper: {
    backgroundColor: colors.transparent,
    height: 40,
    width: 40,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },

  container: {
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.white,
  } as ViewStyle,

  spaceBottom: {
    marginBottom: 150,
  } as ViewStyle,

  topView: {
    alignItems: 'flex-end',
    backgroundColor: colors.white,
  } as ViewStyle,

  wrapperCloseIcon: {
    padding: 5,
  } as ViewStyle,

  contentView: {
    padding: 2,
    marginTop: 6,
    marginBottom: 30,
  } as ViewStyle,

  description: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s15,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
  } as TextStyle,

  textSubTitle: {
    fontFamily: fonts.family.PoppinsBold,
    fontSize: fonts.size.s16,
    color: colors.gray_900,
    textAlign: 'center',
    marginBottom: 10,
  },

  descriptionLink: {
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: fonts.size.s19,
    fontWeight: '500',
    color: colors.blue_700,
    fontFamily: fonts.family.PoppinsMedium,
    textDecorationLine: 'underline',
  } as TextStyle,

  iconFeedbackWrapper: {
    alignItems: 'center',
  } as ViewStyle,
});
