import { View, Image, ImageBackground } from 'react-native';
import React from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { BACK, PROFILE, CHECK, PROFILE_SEND_MESSAGE } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { colors } from '@src/constants/vars';
import { Books } from './Details/Books';
import { Videos } from './Details/Videos';
import { Audios } from './Details/Audios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { get } from 'lodash';
import { CustomAvatar } from '@src/components/CustomAvatar';
import { DetailInformation } from '@src/components/DetailInformation';
// @ts-ignore
import { CollapsibleTabs } from 'react-native-collapsible-tabs';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { follow, unfollow } from '@src/modules/user/actions';
import { existOneOne, getChannelDetail } from '@src/modules/chat/channel/actions';
import { MESSAGE } from '@src/constants/screenKeys';
import { ExistChannelResponse } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/channel';
import { IChannel, ChannelType } from '@goldfishcode/noir-caesar-api-sdk/libs/api/chat/models';

const routes = [
  { key: 'books', title: translate('profile.books') },
  { key: 'videos', title: translate('profile.videos') },
  { key: 'audios', title: translate('profile.audios') },
];

let getListBooks: () => void;
let getListVideos: () => void;
let getListAudios: () => void;

interface Props {
  user_id: string
}

const ProfileOthers = (props: Props) => {
  const { user_id } = props
  const dispatch = useDispatch();
  const userProfile = useSelector<RootState, IUser>(state => {
    if (user_id && state.user[user_id]) {
      return state.user[user_id].profileDetail;
    } else {
      return {
        user_id: '',
        username: '',
        email: '',
        avatar: '',
        total_follower: 0,
        total_following: 0,
        is_follow: false,
        subscription: false,
        notifications: false,
      };
    }
  });

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const pushToMessageScreen = (passProps = {}) => {
    NavigationActionsService.push(MESSAGE, passProps, true);
  }

  const onSendMessage = () => {
    dispatch(
      existOneOne({
        userId: user_id,
        onSuccess: (result: ExistChannelResponse) => {
          if (result.channel_id) {
            dispatch(
              getChannelDetail({
                id: result.channel_id,
                onSuccess: (result: IChannel) => {
                  if (result) {
                    pushToMessageScreen({
                      isFromChannel: false,
                      channelId: result.id,
                      displayName: result.display_name,
                    });
                  }
                },
                onFail: error => {
                  error && NavigationActionsService.showErrorPopup(error);
                },
              }),
            );
          } else {
            pushToMessageScreen({
              isFromChannel: false,
              listUserSelected: [userProfile],
              displayName: userProfile.username,
              channelType: ChannelType.ONE_ONE
            });
          }
        },
      }),
    );
  };

  const onFollow = () => {
    if (userProfile.is_follow) {
      NavigationActionsService.showCustomPopup({
        text: `Unfollow ${userProfile.username}?`,
        buttonRedTitle: translate('alert.ok'),
        buttonGrayTitle: translate('alert.cancel'),
        onPressRedButton: () => {
          NavigationActionsService.hideCustomPopup();
          NavigationActionsService.showLoading();
          dispatch(unfollow({
            user_id: userProfile.user_id,
            onSuccess: () => {
              setTimeout(() => {
                NavigationActionsService.hideLoading();
              }, 500);
            },
            onFail: (error) => {
              setTimeout(() => {
                NavigationActionsService.hideLoading();
                NavigationActionsService.showErrorPopup(error);
              }, 500);
            }
          }))
        }
      })
    } else {
      NavigationActionsService.showLoading();
      dispatch(follow({
        user_id: userProfile.user_id,
        onSuccess: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
          }, 500);
        },
        onFail: (error) => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        }
      }))
    }
  }

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.headerContainer}
        leftImage={BACK}
        leftAction={onBack}
        rightComponent={renderRightHeaderComponent()}
        rightActiveOpacity={1}
        useDarkLayout
      />
    );
  };

  const renderRightHeaderComponent = () => (
    <View style={{ flexDirection: 'row' }}>
      <CustomTouchable onPress={onFollow} style={[styles.rightTextHeader, { backgroundColor: userProfile.is_follow ? '#676877' : 'red' }]}>
        <CustomText style={{ fontSize: 12 }} text={userProfile.is_follow ? translate('profile_others.unfollow') : translate('profile_others.follow')} />
      </CustomTouchable>
      <CustomTouchable onPress={onSendMessage}>
        <Image source={PROFILE_SEND_MESSAGE} style={styles.rightButtonHeader} />
      </CustomTouchable>
    </View>
  )

  const renderHeaderView = () => {
    const avatar = get(userProfile, ['avatar'], undefined);
    return (
      <View style={styles.headerContainerDetail}>
        <View>
          <CustomAvatar style={styles.avatar} uri={avatar} />
        </View>
        {renderFollowInfo()}
      </View>
    );
  };

  const renderFollowInfo = () => {
    return (
      <View style={styles.followContainer}>
        <View>
          <CustomText style={styles.followNumber} text={userProfile.total_follower.toString()} />
          <CustomText style={styles.followTitle} text={translate('profile.followers')} />
        </View>
        <View>
          <CustomText style={styles.followNumber} text={userProfile.total_following.toString()} />
          <CustomText style={styles.followTitle} text={translate('profile.following')} />
        </View>
      </View>
    );
  };

  const renderUserInfo = () => {
    const email = get(userProfile, ['email'], '');
    return (
      <View style={styles.userInfoContainer}>
        {renderUserName()}
        <DetailInformation
          firstTitle={translate('profile.email')}
          firstDetail={email}
          secondTitle={translate('profile.favorite')}
          secondDetail={getGenre()}
        />
      </View>
    );
  };

  const renderUserName = () => {
    return (
      <View style={styles.userNameContainer}>
        <CustomText style={styles.userName} text={userProfile && userProfile.username ? userProfile.username : ''} />
        {userProfile.is_verified && <Image source={CHECK} />}
      </View>
    );
  };

  const getGenre = () => {
    let favlist: string[] = [];
    userProfile && userProfile.favorite && userProfile.favorite.forEach(item => {
      favlist.push(get(item, ['name'], ''));
    });
    return favlist.join(', ');
  };

  const bindFunctionRefreshBook = (bindFunc: () => void) => {
    getListBooks = bindFunc;
  };

  const bindFunctionRefreshVideo = (bindFunc: () => void) => {
    getListVideos = bindFunc;
  };

  const bindFunctionRefreshAudios = (bindFunc: () => void) => {
    getListAudios = bindFunc;
  };

  const renderScene = ({ route }: { route: any }) => {
    const { user_id } = userProfile;
    switch (route.key) {
      case 'books':
        return <Books user_id={user_id} bindFunctionRefreshBook={bindFunctionRefreshBook} />;
      case 'videos':
        return <Videos user_id={user_id} bindFunctionRefreshVideo={bindFunctionRefreshVideo} />;
      case 'audios':
        return <Audios user_id={user_id} bindFunctionRefreshAudios={bindFunctionRefreshAudios} />;
      default:
        return null;
    }
  };

  const renderCollapseHeader = () => {
    return (
      <View style={styles.collapseHeader}>
        <ImageBackground style={styles.logo} resizeMode="cover" source={PROFILE}>
          {renderHeaderView()}
        </ImageBackground>
        {renderUserInfo()}
      </View>
    );
  };

  const mapRoutesToTap = () => {
    const result = routes.map(item => {
      return {
        label: item.title,
        component: renderScene({ route: { ...item } }),
      };
    });
    return result;
  };

  return (
    <Container>
      {renderHeader()}
      <CollapsibleTabs
        scrollable
        maxCollapsedHeight={100}
        itemPaddingTop={17}
        itemPaddingBottom={40}
        barColor={colors.SECONDARY}
        activeTextStyle={styles.tabActiveTextStyle}
        indicatorColor="red"
        allowFontScaling={false}
        textStyle={styles.tabInActiveTextStyle}
        uppercase={false}
        collapsibleContent={renderCollapseHeader()}
        tabs={mapRoutesToTap()}
      />
    </Container>
  );
};

export default ProfileOthers;
