/* eslint-disable react-hooks/exhaustive-deps */
import {useFocusEffect} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SpringScrollView} from 'react-native-spring-scrollview';

import {
  GetAgentDetailQuery,
  useGetAgentDetailLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {parseGraphqlError} from '../../../api/graphql/parseGraphqlError';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {
  FETCH_POLICY,
  MAP_RANK,
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
import {commonStyles} from '../../../assets/theme/styles';
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
  logoutButton: {
    ...METRICS.horizontalMargin,
    ...METRICS.verticalMargin,
  },
});

const mapToModel = (response: GetAgentDetailQuery) => {
  const {agentById} = response;
  const username = getUserFullName(agentById);
  const agentRankName = agentById?.agentRankName ?? MAP_RANK.DEFAULT_NAME;
  return {
    username,
    teamName: agentById?.agentGroupDescription,
    agentGroupId: agentById?.agentGroupId,
    rank: agentRankName,
    agentCode: agentById?.agentCode,
    phoneNumber: agentById?.phoneNumber,
    email: agentById?.email,
    isAgentLeader: agentById?.isAgentLeader,
    isVerifyProfilePhoto: agentById?.isVerifyProfilePhoto,
    rating: agentById?.rating,
    gender: agentById?.gender,
    reward: translate(STRINGS.TROPHY_AND_REWARD_DESCRIPTION),
    profilePhoto: getImageBySizeFromServer(agentById?.imageSizes, IMAGE_SIZES.LARGE),
    lastModifiedDate: dateToString(agentById?.updatedDatetime ?? agentById?.createdDatetime),
    initialAccountCode: agentById?.initialAccountCode,
  };
};

const initialModel = {
  username: '',
  teamName: '',
  rank: '',
  rating: 0,
  isAgentLeader: true,
  reward: translate(STRINGS.TROPHY_AND_REWARD_DESCRIPTION),
  profilePhoto: '',
  lastModifiedDate: '',
  initialAccountCode: '',
};

const queryOption = endLoading => {
  return {
    // variables: {agentId},
    onCompleted: endLoading,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  };
};

const renderMenuContainer = (navigation, onPressFollower) => {
  return (
    <>
      <NavItem
        title={translate(STRINGS.YOUR_SALES_ITEM)}
        imageSource={IMAGES.IC_YOUR_SALES_ITEM}
        onPress={() => navigation.navigate(ScreenIds.ManagePost)}
      />
      <View style={commonStyles.separatorRow8} />
      <NavItem
        title={translate(STRINGS.YOUR_PAYMENT_MANAGEMENT)}
        imageSource={IMAGES.IC_YOUR_PAYMENT}
        onPress={() => navigation.navigate(ScreenIds.ManagePayment)}
      />
      <View style={commonStyles.separatorRow8} />
      <NavItem
        title={translate(STRINGS.BUY_REQUEST_LIST)}
        imageSource={IMAGES.IC_YOUR_BUY_REQUEST}
        onPress={() => navigation.navigate(ScreenIds.ManageContactList)}
      />
      <View style={commonStyles.separatorRow8} />
      <NavItem
        title={`${translate('social.list.title')}`}
        imageSource={IMAGES.IC_PROFILE_FOLLOWER}
        onPress={onPressFollower}
      />
      {/* <NavItem
        title={translate(STRINGS.MEMBER_LIST)}
        imageSource={IMAGES.IC_YOUR_TEAM}
        onPress={() =>
          navigation.navigate(ScreenIds.YourTeam, {agentGroupId: screenData.agentGroupId})
        }
      /> */}
      {/* <NavItem
        title={translate(STRINGS.AGENT_RANK)}
        imageSource={IMAGES.IC_TROPHY_AND_REWARD}
        onPress={() => navigation.navigate(ScreenIds.AwardAndTrophy, {name: screenData.username})}
      /> */}
    </>
  );
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

export type AgentProfileContainerProps = {} & TpfProfileProps;

export const AgentProfileContainer = ({
  scrollRef,
  onRefresh,
  screenData,
  onPressCreateUpdateProfile,
  onPressUpdateAgentProfile,
  navigation,
  goToChangePassword,
  onPressShareApplication,
  gotoMore,
  onPressFollower,
  onPressHotline,
  isShowSignOut = true,
  onPressTraining,
  getAvatarView,
  ...props
}: AgentProfileContainerProps) => {
  return (
    <SpringScrollView ref={scrollRef} onRefresh={onRefresh} refreshHeader={ScrollViewHeader}>
      <ProfileHeader title={translate(STRINGS.AGENT_PROFILE)} />
      <View style={{marginTop: (HEADER_IMAGE_HEIGHT / 3) * 2 + 24}}>
        <ProfileInfoComponent
          teamName={screenData.teamName}
          isAgentLeader={screenData.isAgentLeader}
          rateNumber={screenData.rating}
          rank={screenData.rank}
          agentCode={screenData.agentCode}
          userName={screenData.username}
          isAgent={true}
          getAvatarView={getAvatarView}
        />
        <View style={commonStyles.separatorRow12} />
        {
          // ****** Group 1 *******
        }
        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate(STRINGS.UPDATE_INFO)}
            imageSource={IMAGES.IC_PERSONAL_INFO}
            onPress={onPressCreateUpdateProfile}
          />
          <View style={commonStyles.separatorRow8} />
          <NavItem
            title={translate(STRINGS.UPDATE_INFO_AGENT)}
            imageSource={IMAGES.IC_AGENT_INFO}
            onPress={onPressUpdateAgentProfile}
          />
        </View>

        {
          // ****** Group 2 *******
        }
        <View style={profileCommonStyle.profileNavContainer}>
          {renderMenuContainer(navigation, onPressFollower)}
        </View>
        {
          // ****** Group 3 *******
        }
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

        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate(STRINGS.TRAINING)}
            imageSource={IMAGES.IC_PROFILE_TRAINING}
            onPress={onPressTraining}
          />
          <View style={commonStyles.separatorRow8} />
          <NavItem
            title={translate(STRINGS.SHARE_APPLICATION)}
            imageSource={IMAGES.IC_PROFILE_SHARE}
            onPress={onPressShareApplication}
          />
        </View>
        {
          // ****** Group 4 *******
        }
        <View style={profileCommonStyle.profileNavContainer}>
          <NavItem
            title={translate('profile.menu.hotlineSupport')}
            imageSource={IMAGES.IC_PROFILE_HOTLINE}
            onPress={onPressHotline}
          />
          <View style={commonStyles.separatorRow8} />
          <NavItem
            title={translate('profile.menu.serviceInstruction')}
            imageSource={IMAGES.IC_PROFILE_MORE}
            onPress={gotoMore}
          />
          <View style={commonStyles.separatorRow8} />
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

const AgentProfileScreen = ({navigation, agentId}) => {
  const scrollRef = useRef(null);
  const endLoading = () => scrollRef.current?.endRefresh();

  const {showErrorAlert, showAppSpinner, showToastInfo} = useContext(AppContext);
  const [screenData, setScreenData] = useState(initialModel);
  const [firstLoad, setFirstLoad] = useState(true);
  const [getAgentDetail, {called, loading, error, refetch, data: agentDetail}] =
    useGetAgentDetailLazyQuery(queryOption(endLoading));
  const tpfClient = useTPFClient();

  const {updateAvatarProfileHandler} = useUpdateAvatarProfile({
    onSuccess: () => refetch(),
  });

  const onFinishLoading = () => {
    showAppSpinner(false);
    scrollRef.current?.endRefresh(); // NOSONAR due to wrong parsing of sonar scanner for this optional operation
  };

  useFocusEffect(
    React.useCallback(() => {
      getAgentDetail({variables: {agentId}});
    }, [getAgentDetail, agentId]),
  );

  const onPressIsVerifyProfilePhoto = () => {
    showToastInfo({
      messageType: TOAST_MESSAGE_TYPE.warning,
      title: translate('common.waitingForApprove'),
      message: translate('avatar.pendingApproval'),
    });
  };

  useEffect(() => {
    if (called && loading && firstLoad) {
      setFirstLoad(false);
    } else {
      if (error) {
        onFinishLoading();
        const errorMessage = parseGraphqlError(error);
        showErrorAlert(errorMessage);
      } else if (agentDetail) {
        if (!agentDetail?.agentById) {
          //no user data => error
          onFinishLoading();
          showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
          return;
        }
        const uiData = mapToModel(agentDetail);
        setScreenData(uiData);
      }
    }
  }, [called, loading, error, agentDetail]);

  const onRefresh = () => {
    refetch();
  };

  const onPressCreateUpdateProfile = () => {
    navigation.navigate(ScreenIds.CreateUpdateProfile);
  };
  const onPressUpdateAgentProfile = () => {
    navigation.navigate(ScreenIds.UpdateAgentProfile, {
      agentById: agentDetail?.agentById,
      isEditRefCode: isEmpty(agentDetail?.agentById.referralCode),
    });
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

  const onPressFollower = () => {
    navigation.navigate(ScreenIds.FollowerProfile, {id: agentId});
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

  const avatarChangeSuccess = photo => {
    if (!isEmpty(photo?.uri)) {
      updateAvatarProfileHandler({
        id: agentId,
        photo: photo,
      });
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
      onAvatarSourceChange={avatarChangeSuccess}
      containerStyle={{marginTop: tiny, marginLeft: tiny}}
    />
  );

  return (
    <SafeAreaScreenContainer
      style={{backgroundColor: COLORS.BACKGROUND}}
      disableSafeArea={true}
      testID={ScreenIds.Profile}>
      <AgentProfileContainer
        scrollRef={scrollRef}
        onRefresh={onRefresh}
        onPressFollower={onPressFollower}
        screenData={screenData}
        onPressCreateUpdateProfile={onPressCreateUpdateProfile}
        onPressUpdateAgentProfile={onPressUpdateAgentProfile}
        navigation={navigation}
        goToChangePassword={goToChangePassword}
        onPressShareApplication={onPressShareApplication}
        onPressHotline={onPressHotline}
        onPressTraining={onPressTraining}
        onPressTpfProfile={tpfClient.showProfile}
        onPressTpfBalance={tpfClient.showBalance}
        onPressTpfHistories={tpfClient.showHistories}
        onPressTpfRefund={tpfClient.showRefund}
        gotoMore={gotoMore}
        onPressAvatar={onPressCreateUpdateProfile}
        getAvatarView={getAvatarView}
      />
    </SafeAreaScreenContainer>
  );
};

export default AgentProfileScreen;
