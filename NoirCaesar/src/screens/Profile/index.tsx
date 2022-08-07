import { View, Image, Platform, SafeAreaView, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { BACK, PROFILE, EDIT, CHECK } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import NavigationActionsService from '@src/navigation/navigation';
import { CustomText } from '@src/components/CustomText';
import { colors } from '@src/constants/vars';
import { Books } from './Details/Books';
import { Videos } from './Details/Videos';
import { Audios } from './Details/Audios';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { EDIT_PROFILE as edit_profile, UPLOAD_COLLECTION } from '@src/constants/screenKeys';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { ImagePickerResponse } from 'react-native-image-picker';
import DocumentPickerImage from '@src/components/DocumentPickerImage';
import { get } from 'lodash';
import { uploadCollection, updateProfile, getCurrentUser } from '@src/modules/auth/actions';
import moment from 'moment';
import { CustomAvatar } from '@src/components/CustomAvatar';
import { CustomButton } from '@src/components/CustomButton';
import { DetailInformation } from '@src/components/DetailInformation';
//@ts-ignore
import { CollapsibleTabs } from 'react-native-collapsible-tabs';
import { PreSignedUrlParam } from '@goldfishcode/noir-caesar-api-sdk/libs/api/upload/adapter/adapter';
import { ISubscription } from '@goldfishcode/noir-caesar-api-sdk/libs/api/shop/models';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import FastImage from 'react-native-fast-image';

const routes = [
  { key: 'books', title: translate('profile.books') },
  { key: 'videos', title: translate('profile.videos') },
  { key: 'audios', title: translate('profile.audios') },
];

let getListBooks: () => void;
let getListVideos: () => void;
let getListAudios: () => void;

export enum UploadField {
  AVATAR,
  COVER,
  NONE
}

interface Props {
  isFromSideMenu?: boolean
}

const Profile = (props: Props) => {
  const { isFromSideMenu } = props;
  const dispatch = useDispatch();
  const me = useSelector<RootState, IUser>((state: RootState) => state.auth.userData!);
  const activePlan = useSelector<RootState, ISubscription>((state: RootState) => state.iap.activePlan);
  const documentRef: any = useRef(null);
  const [uploadField, setUploadField] = useState<UploadField>(UploadField.NONE);
  const uploadType = useRef<UploadField>(UploadField.NONE);

  const onBack = () => {
    isFromSideMenu ? NavigationActionsService.toggleDrawer(true) : NavigationActionsService.pop();
  };

  useEffect(() => {
    currentUser();
  }, []);

  useEffect(() => {
    if (uploadField != UploadField.NONE) {
      documentRef.current.show();
      setTimeout(() => {
        setUploadField(UploadField.NONE);
      }, 500);
    }
  }, [uploadField])

  const currentUser = () => {
    dispatch(getCurrentUser({}));
  };

  const onChangeAvatar = () => {
    setUploadField(UploadField.AVATAR);
    uploadType.current = UploadField.AVATAR;
  };

  const onChangeCover = () => {
    setUploadField(UploadField.COVER);
    uploadType.current = UploadField.COVER;
  };

  const onEditProfile = () => {
    NavigationActionsService.push(edit_profile, {}, true);
  };

  const onUpload = () => {
    NavigationActionsService.push(UPLOAD_COLLECTION, { isFromProfile: true, refreshOnBack: refreshProfileData }, true);
  };

  const renderHeader = () => {
    return (
      <CustomHeader
        containerStyle={styles.headerContainer}
        leftImage={BACK}
        leftAction={onBack}
        rightComponent={renderRightHeader()}
        rightAction={onEditProfile}
      />
    );
  };

  const renderRightHeader = () => {
    return (
      <View style={styles.rightTextHeader}>
        <CustomText style={{ fontSize: 12 }} text={translate('profile.edit_profile')} />
      </View>
    );
  };

  const renderPicker = () => (
    <DocumentPickerImage
      ref={documentRef}
      onCompleted={onCompletedPicker}
      titlePopup={uploadField == UploadField.COVER ? 'Upload Cover Photo' : 'Upload Avatar'} />
  )

  const onCompletedPicker = (imageResponse: ImagePickerResponse) => {
    uploadImage(imageResponse);
  };

  const uploadImage = (imageResponse: any) => {
    let file = {};
    let uri = '';
    let typeCollection = '';
    let name = '';
    let size = 0;

    if (imageResponse) {
      if (Platform.OS === 'ios') {
        name =
          moment()
            .valueOf()
            .toString() + '.jpg';
      } else {
        const names = imageResponse.path ? imageResponse.path.split('/') : [];
        name = names && names.length > 0 ? names[names.length - 1] : '';
      }
      uri = imageResponse.path ? imageResponse.path : '';
      size = imageResponse.size ? imageResponse.size : 0;
      typeCollection = imageResponse.mime;
    }

    file = {
      uri,
      type: typeCollection,
      name,
    };

    const presignedPost: PreSignedUrlParam = {
      file_name: name,
      file_type: typeCollection,
      folder_name: 'photos',
      is_public: true,
      file_size: size,
    };

    NavigationActionsService.showLoading();

    dispatch(
      uploadCollection({
        file,
        presignedPost,
        onSuccess: data => {
          NavigationActionsService.hideLoading();
          if (data) {
            switch (uploadType.current) {
              case UploadField.AVATAR:
                updateAvatar(data.file_path);
                break;
              case UploadField.COVER:
                updateCover(data.file_path);
                break;
              default: break;
            }
          }
        },
        onFail: error => {
          NavigationActionsService.hideLoading();
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const updateAvatar = (path: string) => {
    dispatch(
      updateProfile({
        data: {
          username: me && me.username ? me.username : '',
          avatar: path,
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
    uploadType.current = UploadField.NONE;
  };

  const updateCover = (path: string) => {
    dispatch(
      updateProfile({
        data: {
          username: me && me.username ? me.username : '',
          cover: path,
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
    uploadType.current = UploadField.NONE;
  }

  const renderHeaderView = () => {
    const avatar = get(me, ['avatar'], undefined);
    return (
      <CustomTouchable activeOpacity={0.8} style={styles.headerContainerDetail} onPress={onChangeCover}>
        <View>
          <CustomAvatar style={styles.avatar} uri={avatar} />
          <CustomTouchable activeOpacity={0.5} style={styles.editAvatar} onPress={onChangeAvatar}>
            <Image source={EDIT} />
          </CustomTouchable>
        </View>
        {renderFollowInfo()}
        {renderPicker()}
      </CustomTouchable>
    );
  };

  const renderFollowInfo = () => {
    return (
      <View style={styles.followContainer}>
        <View>
          <CustomText style={styles.followNumber} text={me.total_follower.toString()} />
          <CustomText style={styles.followTitle} text={translate('profile.followers')} />
        </View>
        <View>
          <CustomText style={styles.followNumber} text={me.total_following.toString()} />
          <CustomText style={styles.followTitle} text={translate('profile.following')} />
        </View>
      </View>
    );
  };

  const renderUserInfo = () => {
    const isVerified = get(me, ['is_verified'], false);
    const email = get(me, ['email'], '');
    const coinPurchased = get(me, ['coins_purchased'], 0);
    const coinEarned = get(me, ['coins_earned'], 0);
    const coinBalance = get(me, ['coins_balance'], 0);
    const amount = get(activePlan, ['transaction', 'subscription_package', 'amount'], undefined);
    const description = get(activePlan, ['transaction', 'subscription_package', 'description'], undefined);
    const subText = amount && description ? `${amount}$` + description.replace('Subscription for', '') : undefined;

    return (
      <View style={styles.userInfoContainer}>
        {renderUserName()}
        <DetailInformation
          firstTitle={translate('profile.email')}
          firstDetail={email}
          secondTitle={translate('profile.favorite')}
          secondDetail={getGenre()}
          thirdTitle={translate('profile.subscription')}
          thirdDetail={subText}
          isVerified={isVerified}
          coinsPurchased={coinPurchased}
          coinsEarned={coinEarned}
          coinsBalance={coinBalance}
        />
      </View>
    );
  };

  const renderUserName = () => {
    return (
      <View style={styles.userNameContainer}>
        <CustomText style={styles.userName} text={me && me.username ? me.username : ''} />
        {me.is_verified && <Image source={CHECK} />}
      </View>
    );
  };

  const getGenre = () => {
    const favlist: string[] = [];
    me &&
      me.favorite &&
      me.favorite.forEach(item => {
        favlist.push(get(item, ['name'], ''));
      });
    return favlist.join(', ');
  };

  const refreshProfileData = () => {
    if (getListBooks) {
      getListBooks();
    }
    if (getListVideos) {
      getListVideos();
    }
    if (getListAudios) {
      getListAudios();
    }
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
    switch (route.key) {
      case 'books':
        return <Books bindFunctionRefreshBook={bindFunctionRefreshBook} />;
      case 'videos':
        return <Videos bindFunctionRefreshVideo={bindFunctionRefreshVideo} />;
      case 'audios':
        return <Audios bindFunctionRefreshAudios={bindFunctionRefreshAudios} />;
      default:
        return null;
    }
  };

  const renderUploadButton = () => {
    return (
      <SafeAreaView>
        <CustomButton style={styles.uploadButton} text={translate('profile.upload')} onPress={onUpload} />
      </SafeAreaView>
    );
  };

  const renderCollapseHeader = () => {
    const cover = get(me, ['cover'], undefined);
    return (
      <View style={styles.collapseHeader}>
        <FastImage style={[styles.logo, styles.cover]} resizeMode="cover" source={cover ? { uri: cover } : PROFILE} />
        <View style={styles.darkLayout} />
        <View style={styles.logo} >
          {renderHeaderView()}
        </View>
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
      {renderUploadButton()}
    </Container>
  );
};

export default Profile;
