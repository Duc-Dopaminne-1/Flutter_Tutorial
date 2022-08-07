import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {PAGE_CHILD_TYPE, PAGE_TYPE} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../../components/Button/CustomButton';
import CustomListItem from '../../components/CustomListItem';
import SafeAreaScreenContainer from '../../components/SafeAreaScreenContainer';
import {SizeBox} from '../../components/SizeBox';
import {getConfigs} from '../../configs';
import {useContactInfo} from '../../hooks';
import {useLogin} from '../Auth/useLogin';
import ScreenIds from '../ScreenIds';
import FooterVersion from './components/FooterVersion';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normal,
    paddingTop: 30,
  },
  description: {
    ...FONTS.regular,
    marginVertical: normal,
    fontSize: 15,
    lineHeight: 21,
    flex: 1,
    marginLeft: 28,
  },
  viewButton: {
    ...HELPERS.row,
    marginVertical: 20,
  },
  buttonLogin: {
    ...commonStyles.buttonNext,
    flex: 1,
    paddingTop: 14,
    paddingBottom: 14,
  },
  buttonRegister: {
    ...commonStyles.buttonOutline,
    flex: 1,
    paddingTop: 14,
    paddingBottom: 14,
    marginLeft: 15,
    marginTop: 0,
    borderColor: COLORS.PRIMARY_A100,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  titleButtonLogin: {
    ...FONTS.semiBold,
  },
  titleButtonRegister: {
    ...FONTS.semiBold,
    color: COLORS.PRIMARY_A100,
  },
  listItem: {backgroundColor: COLORS.NEUTRAL_WHITE, marginVertical: 4},
});

export const GuestProfileContainer = ({
  onPressLogin,
  onPressRegister,
  goToBasicProfile,
  goToSaleList,
  goToChangePassword,
  onPressShareApplication,
  onPressHotline,
  onPressTraining,
  gotoMore,
}) => {
  const listMenu = [
    {
      title: translate(STRINGS.UPDATE_INFO),
      imageSource: IMAGES.IC_PERSONAL_INFO,
      onPress: goToBasicProfile,
    },
    {
      title: translate(STRINGS.YOUR_SALES_ITEM),
      imageSource: IMAGES.IC_YOUR_SALES_ITEM,
      onPress: goToSaleList,
    },
    {
      title: translate('profile.menu.training'),
      imageSource: IMAGES.IC_PROFILE_TRAINING,
      onPress: onPressTraining,
    },
    {
      title: translate(STRINGS.SHARE_APPLICATION),
      imageSource: IMAGES.IC_PROFILE_SHARE,
      onPress: onPressShareApplication,
    },
    {
      title: translate('profile.menu.hotlineSupport'),
      imageSource: IMAGES.IC_PROFILE_HOTLINE,
      onPress: onPressHotline,
    },
    {
      title: translate(STRINGS.MORE),
      imageSource: IMAGES.IC_PROFILE_MORE,
      onPress: gotoMore,
    },
    {
      title: translate(STRINGS.CHANGE_PASSWORD),
      imageSource: IMAGES.IC_CHANGE_PASSWORD,
      onPress: goToChangePassword,
    },
  ];

  return (
    <SafeAreaScreenContainer style={{backgroundColor: COLORS.NEUTRAL_BACKGROUND}}>
      <ScrollView>
        <View style={styles.container}>
          <View style={HELPERS.rowCenter}>
            <Image source={IMAGES.GUEST_PROFILE_HEADER} />
            <Text style={styles.description}>{translate('profile.subTitle')}</Text>
          </View>
          <View style={styles.viewButton}>
            <CustomButton
              style={styles.buttonLogin}
              titleStyle={styles.titleButtonLogin}
              title={translate(STRINGS.LOGIN)}
              onPress={onPressLogin}
            />
            <CustomButton
              style={styles.buttonRegister}
              titleStyle={styles.titleButtonRegister}
              title={translate(STRINGS.SIGNUP)}
              onPress={onPressRegister}
            />
          </View>
        </View>
        {listMenu.map(item => {
          return (
            <CustomListItem
              key={item?.title}
              imageStyle={{tintColor: COLORS.TEXT_DARK_40}}
              backgroundIcon={COLORS.NEUTRAL_DIVIDER}
              customStyle={styles.listItem}
              colorIconArrow={COLORS.BLACK_31}
              {...item}
            />
          );
        })}
        <FooterVersion />
        <SizeBox height={20} />
      </ScrollView>
    </SafeAreaScreenContainer>
  );
};

export const GuestProfileScreen = ({navigation}) => {
  const {showLogin} = useLogin();
  const {callPhone} = useContactInfo(getConfigs().stringee.HOTLINE_NUMBER);

  const onPressLogin = () => {
    showLogin(() => {});
  };

  const onPressRegister = () => {
    navigation.navigate(ScreenIds.AuthStack, {screen: ScreenIds.InputMobile});
  };

  const goToBasicProfile = () => {
    showLogin(() => {
      navigation.navigate(ScreenIds.BasicProfileNavigation);
    });
  };

  const goToSaleList = () => {
    showLogin(() => {
      navigation.navigate(ScreenIds.ManagePost);
    });
  };

  const goToChangePassword = () => {
    showLogin(() => {
      navigation.navigate(ScreenIds.ChangePassword);
    });
  };

  const gotoMore = () => {
    navigation.navigate(ScreenIds.More);
  };

  const onPressShareApplication = () => {
    showLogin(() => {
      navigation.navigate(ScreenIds.ShareApplication);
    });
  };

  const onPressHotline = () => {
    callPhone();
  };

  const onPressTraining = () => {
    navigation.navigate(ScreenIds.PageDetailQuery, {
      query: {
        pageType: PAGE_CHILD_TYPE.TRAINING_PAGE,
        objectType: PAGE_TYPE.INTRODUCTION,
      },
      isStatic: false,
      title: translate(STRINGS.TRAINING),
    });
  };

  return (
    <GuestProfileContainer
      onPressLogin={onPressLogin}
      onPressRegister={onPressRegister}
      goToBasicProfile={goToBasicProfile}
      goToSaleList={goToSaleList}
      onPressTraining={onPressTraining}
      goToChangePassword={goToChangePassword}
      onPressShareApplication={onPressShareApplication}
      onPressHotline={onPressHotline}
      gotoMore={gotoMore}
    />
  );
};
