import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {CONSTANTS} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {tiny} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import ScreenIds from '../../ScreenIds';

const styles = StyleSheet.create({
  viewInside: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: SIZES.BORDER_RADIUS_10,
    padding: 16,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  buttonReview: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.NEUTRAL_WHITE,
  },
  buttonText: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.TEXT_DARK_10,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 21,
    alignSelf: 'center',
    textAlign: 'center',
  },
  icon: {alignSelf: 'center'},
  descriptionText: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.PROJECT_DES,
    marginBottom: 15,
    alignSelf: 'center',
    textAlign: 'center',
  },
  closeIcon: {
    width: 15,
    height: 15,
  },
  closeIconContainer: {
    marginLeft: tiny,
    width: 15,
  },
});

const PostSuccessScreen = ({
  viewInside,
  title,
  description,
  onReviewPost,
  onClose,
  buttonNextStyle,
  buttonNextTextStyle,
  containerStyle,
  contentContainerStyle,
  titleStyle,
  iconStyle,
  icon,
  descriptionStyle,
  buttonReviewPostTitle = translate(STRINGS.REVIEW_NEW_POST),
  hideReturnHomeButton = false,
  additionButtons = null,
}) => {
  const navigation = useNavigation();

  const onReturnHome = () => {
    navigation.navigate(ScreenIds.Home);
  };

  const onReviewNewPost = () => {
    navigation.navigate(ScreenIds.Home);
    navigation.navigate(ScreenIds.ManagePost);
    navigation.navigate(ScreenIds.YourPropertyPost, {defaultIndex: 2});
  };

  const onPressClose = () => {
    onClose && onClose();
  };

  if (!title) {
    title = translate(STRINGS.POST_SUCCESSFULLY);
  }

  return (
    <View style={[styles.viewInside, viewInside]} testID={ScreenIds.PostSuccess}>
      {onClose && (
        <TouchableOpacity
          onPress={onPressClose}
          style={styles.closeIconContainer}
          hitSlop={CONSTANTS.HIT_SLOP}>
          <Image source={IMAGES.IC_DISMISS} style={styles.closeIcon} />
        </TouchableOpacity>
      )}
      <View style={[styles.mainContent, containerStyle]}>
        <View style={contentContainerStyle}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          {icon || (
            <MaterialCommunityIcons
              style={[styles.icon, iconStyle]}
              size={128}
              name="check-bold"
              color={COLORS.PRIMARY_A100}
            />
          )}
          <Text style={[styles.descriptionText, descriptionStyle]}>{description}</Text>
        </View>

        <CustomButton
          titleStyle={[styles.buttonReview, buttonNextTextStyle]}
          style={[commonStyles.buttonNext, buttonNextStyle]}
          title={buttonReviewPostTitle}
          onPress={onReviewPost ?? onReviewNewPost}
        />
        {additionButtons}
        {!hideReturnHomeButton && (
          <TouchableOpacity onPress={onReturnHome}>
            <View style={commonStyles.greyBorderContainer}>
              <Text style={styles.buttonText}>{translate(STRINGS.CLOSE)}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PostSuccessScreen;
