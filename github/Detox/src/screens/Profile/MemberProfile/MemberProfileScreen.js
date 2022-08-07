import {useFocusEffect} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';
import {useSelector} from 'react-redux';

import {
  GetUserDetailQuery,
  useGetUserDetailLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {refreshTokenAction} from '../../../api/userApi';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getRefreshToken} from '../../../appData/authState/selectors';
import {getUserId} from '../../../appData/user/selectors';
import {
  FETCH_POLICY,
  PAGE_CHILD_TYPE,
  PAGE_TYPE,
  TOAST_MESSAGE_TYPE,
} from '../../../assets/constants';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {Message} from '../../../assets/localize/message/Message';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {METRICS, tiny} from '../../../assets/theme/metric';
import CustomListItem from '../../../components/CustomListItem';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import ScrollViewHeader from '../../../components/ScrollViewHeader';
import useUpdateAvatarProfile from '../../../hooks/useUpdateAvatarProfile';
import {getImageBySizeFromServer, IMAGE_SIZES} from '../../../utils/ImageUtil';
import {dateToString} from '../../../utils/TimerCommon';
import {getUserFullName} from '../../../utils/UserAgentUtil';
import ScreenIds from '../../ScreenIds';
import {useTPFClient} from '../../TPF/hooks/useTPFClient';
import FooterVersion from '../components/FooterVersion';
import GetAvatarView from '../CreateEditProfile/GetAvatarView';
import profileCommonStyle, {HEADER_IMAGE_HEIGHT} from '../profileCommonStyle';
import ProfileHeader from '../ProfileHeader';
import {ProfileInfoComponent} from '../ProfileInfoComponent';
import SignOutButton from '../SignOutButton';
import {TpfProfileProps} from '../types';

const styles = StyleSheet.create({
  container: {
    marginTop: HEADER_IMAGE_HEIGHT / 2 + 24,
  },
  logoutButton: {
    ...METRICS.horizontalMargin,
    ...METRICS.verticalMargin,
  },
});

const initialModel = {
  username: '',
  lastModifiedDate: '',
  profilePhoto: '',
};

const NavItem = ({title, imageSource, onPress}) => {
  return (
    <CustomListItem
      title={title}
      imageSource={imageSource}
      onPress={onPress}
      imageStyle={{tintColor: COLORS.GREY_C4}}
      backgroundIcon={COLORS.GREY_F0}
      customStyle={[METRICS.resetMargin, METRICS.horizontalPadding]}
    />
  );
};

export type MemberProfileContainerProps = {} & TpfProfileProps;

export const MemberProfileContainer = ({
  scrollRef,
  onRefresh,
  onUpgrateToAgent,
  screenData,
  onPressAvatar,
  goToBasicProfile,
  goToSaleList,
  goToRequestList,
  goToChangePassword,
  onPressShareApplication,
  onPressHotline,
  gotoMore,
  isShowSignOut = true,
  goToManagePayment,
  onPressTraining,
  onPressFollower,
  onPressIsVerifyProfilePhoto,
  onAvatarSourceChange,
  getAvatarView,
  ...props
}: MemberProfileContainerProps) => {
  return (
    <SpringScrollView ref={scrollRef} onRefresh={onRefresh} refreshHeader={ScrollViewHeader}>
      <StatusBar barStyle={'light-content'} />
      <ProfileHeader title={translate(STRINGS.MEMBER_PROFILE)} />
      <View style={styles.container}>
        <ProfileInfoComponent
          isVerifyProfilePhoto={screenData?.isVerifyProfilePhoto}
          isAgent={false}
          onAvatarSourceChange={onAvatarSourceChange}
          screenData={screenData}
          onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
          gender={screenData?.gender}
          onPressAvatar={onPressAvatar}
          onUpgrateToAgent={onUpgrateToAgent}
          userName={screenData.username}
          profilePhoto={screenData.profilePhoto ?? ''}
          rank={screenData.rank}
          getAvatarView={getAvatarView}
        />
        {
          // ********* Group 1 *********
        }
        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate(STRINGS.UPDATE_INFO)}
            imageSource={IMAGES.IC_PERSONAL_INFO}
            onPress={goToBasicProfile}
          />
        </View>
        {
          // ********* Group 2 *********
        }
        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate(STRINGS.YOUR_SALES_ITEM)}
            imageSource={IMAGES.IC_YOUR_SALES_ITEM}
            onPress={goToSaleList}
          />
          <NavItem
            title={translate(STRINGS.YOUR_PAYMENT_MANAGEMENT)}
            imageSource={IMAGES.IC_YOUR_PAYMENT}
            onPress={goToManagePayment}
          />
          <NavItem
            title={translate(STRINGS.BUY_REQUEST_LIST)}
            imageSource={IMAGES.IC_YOUR_BUY_REQUEST}
            onPress={goToRequestList}
          />
          <NavItem
            title={`${translate('social.list.title')}`}
            imageSource={IMAGES.IC_PROFILE_FOLLOWER}
            onPress={onPressFollower}
          />
        </View>

        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate('profile.menu.tpf.profile')}
            imageSource={IMAGES.IC_PROFILE_MANAGER}
            onPress={props.onPressTpfProfile}
          />
          <NavItem
            title={translate('profile.menu.tpf.balance')}
            imageSource={IMAGES.IC_PROFILE_BALANCE}
            onPress={props.onPressTpfBalance}
          />
          <NavItem
            title={translate('profile.menu.tpf.histories')}
            imageSource={IMAGES.IC_PROFILE_HISTORIES}
            onPress={props.onPressTpfHistories}
          />
          <NavItem
            title={translate('profile.menu.tpf.refund')}
            imageSource={IMAGES.IC_PROFILE_REFUND}
            onPress={props.onPressTpfRefund}
          />
        </View>
        {
          // ********* Group 3 *********
        }
        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate(STRINGS.TRAINING)}
            imageSource={IMAGES.IC_PROFILE_TRAINING}
            onPress={onPressTraining}
          />
          <NavItem
            title={translate(STRINGS.SHARE_APPLICATION)}
            imageSource={IMAGES.IC_PROFILE_SHARE}
            onPress={onPressShareApplication}
          />
        </View>
        {
          // ********* Group 4 *********
        }
        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate('profile.menu.hotlineSupport')}
            imageSource={IMAGES.IC_PROFILE_HOTLINE}
            onPress={onPressHotline}
          />
          <NavItem
            title={translate(STRINGS.MORE)}
            imageSource={IMAGES.IC_PROFILE_MORE}
            onPress={gotoMore}
          />
          <NavItem
            title={translate(STRINGS.CHANGE_PASSWORD)}
            imageSource={IMAGES.IC_CHANGE_PASSWORD}
            onPress={goToChangePassword}
          />
        </View>
        {isShowSignOut && <SignOutButton style={styles.logoutButton} />}
        <FooterVersion />
      </View>
    </SpringScrollView>
  );
};

const mapToModel = (response: GetUserDetailQuery) => {
  const {userById} = response;
  const {userDto} = userById ?? {};
  const username = getUserFullName(userDto);
  return {
    username,
    isVerifyProfilePhoto: userDto?.isVerifyProfilePhoto,
    profilePhoto: getImageBySizeFromServer(userDto?.profilePhotos, IMAGE_SIZES.LARGE),
    phoneNumber: userDto?.phoneNumber,
    email: userDto?.email,
    gender: userDto?.gender,
    lastModifiedDate: dateToString(userDto?.updatedDatetime ?? userDto?.createdDatetime),
  };
};

const queryOption = onCompleted => {
  return {
    notifyOnNetworkStatusChange: true,
    onCompleted: onCompleted,
    ...FETCH_POLICY.NETWORK_ONLY,
  };
};
const MemberProfileScreen = ({navigation}) => {
  const scrollRef = useRef(null);
  const userId = useSelector(getUserId);
  const refreshToken = useSelector(getRefreshToken);
  const onCompleted = () => scrollRef.current?.endRefresh();
  const tpfClient = useTPFClient();

  const [screenData, setScreenData] = useState(initialModel);
  const [firstLoad, setFirstLoad] = useState(true);
  const {showErrorAlert, showAppSpinner, showToastInfo} = useContext(AppContext);
  const [getUserDetail, {loading, refetch, error, data: userDetail}] = useGetUserDetailLazyQuery(
    queryOption(onCompleted),
  );

  const onFinishLoading = () => {
    showAppSpinner(false);
    scrollRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
  };
  const goToBasicProfile = () => {
    navigation.navigate(ScreenIds.BasicProfileNavigation);
  };
  const onUpgrateToAgent = () => {
    navigation.navigate(ScreenIds.RegisterAgent);
  };
  const goToSaleList = () => {
    navigation.navigate(ScreenIds.ManagePost);
  };
  const goToRequestList = () => {
    navigation.navigate(ScreenIds.ManageContactList);
  };
  const goToChangePassword = () => {
    navigation.navigate(ScreenIds.ChangePassword);
  };
  const gotoMore = () => {
    navigation.navigate(ScreenIds.More);
  };
  const onPressShareApplication = () => {
    navigation.navigate(ScreenIds.ShareApplication);
  };
  const onPressHotline = () => {
    navigation.navigate(ScreenIds.HotlineSupport, {
      phoneNumber: screenData?.phoneNumber,
    });
  };
  const goToManagePayment = () => {
    navigation.navigate(ScreenIds.ManagePayment);
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

  const onPressIsVerifyProfilePhoto = () => {
    showToastInfo({
      messageType: TOAST_MESSAGE_TYPE.warning,
      title: translate('common.waitingForApprove'),
      message: translate('avatar.pendingApproval'),
    });
  };

  const onRefresh = async () => {
    //force refresh token first to handle case user upgrade to agent from other places
    const response = await refreshTokenAction(refreshToken);
    if (!response?.user?.isAgent) {
      refetch(); //only refresh this component when not upgraded to agent
    }
  };

  const {updateAvatarProfileHandler} = useUpdateAvatarProfile({
    onSuccess: () => refetch(),
  });

  useFocusEffect(
    React.useCallback(() => {
      getUserDetail({variables: {userId}});
    }, [getUserDetail, userId]),
  );

  useEffect(() => {
    if (loading && firstLoad) {
      setFirstLoad(false);
    } else {
      onFinishLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (error) {
      onFinishLoading();
      const errorMessage = parseGraphqlError(error);
      showErrorAlert(errorMessage);
    } else if (userDetail) {
      if (!userDetail?.userById?.userDto) {
        //no user data => error
        onFinishLoading();
        showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
        return;
      }
      const uiData = mapToModel(userDetail);
      setScreenData(uiData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, userDetail]);

  const onPressFollower = () => {
    navigation.navigate(ScreenIds.FollowerProfile, {id: userId});
  };

  const onChangeAvartarSuccess = photo => {
    if (!isEmpty(photo?.uri)) {
      updateAvatarProfileHandler({id: userId, photo: photo});
    }
  };

  const getAvatarView = (
    <GetAvatarView
      gender={screenData?.gender}
      size={70}
      isShowBtnAdd
      showTips={false}
      showTitle={false}
      onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
      isVerifyProfilePhoto={screenData?.isVerifyProfilePhoto}
      imageSource={{uri: screenData.profilePhoto}}
      onAvatarSourceChange={onChangeAvartarSuccess}
      containerStyle={{marginTop: tiny, marginLeft: tiny}}
    />
  );

  return (
    <SafeAreaScreenContainer style={{backgroundColor: COLORS.BACKGROUND}} disableSafeArea={true}>
      <MemberProfileContainer
        scrollRef={scrollRef}
        onRefresh={onRefresh}
        onUpgrateToAgent={onUpgrateToAgent}
        screenData={screenData}
        onPressAvatar={goToBasicProfile}
        goToBasicProfile={goToBasicProfile}
        goToSaleList={goToSaleList}
        goToRequestList={goToRequestList}
        goToChangePassword={goToChangePassword}
        onPressShareApplication={onPressShareApplication}
        onPressHotline={onPressHotline}
        gotoMore={gotoMore}
        onPressFollower={onPressFollower}
        onPressTraining={onPressTraining}
        onPressTpfProfile={tpfClient.showProfile}
        onPressTpfBalance={tpfClient.showBalance}
        onPressTpfHistories={tpfClient.showHistories}
        onPressTpfRefund={tpfClient.showRefund}
        goToManagePayment={goToManagePayment}
        getAvatarView={getAvatarView}
      />
    </SafeAreaScreenContainer>
  );
};

export default MemberProfileScreen;
