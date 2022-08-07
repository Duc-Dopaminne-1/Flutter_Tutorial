import {useApolloClient} from '@apollo/client';
import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import OpenAppSettings from 'react-native-app-settings';
import {useSelector} from 'react-redux';

import {useApiCall} from '../../../api/restful/useApiCall';
import {uploadSingleImage} from '../../../api/userApi/uploadApi';
import {AppContext} from '../../../appData/appContext/useAppContext';
import {getUserId} from '../../../appData/user/selectors';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import RequiredLabel from '../../../components/RequiredLabel';
import UploadAvatarComponent from '../../../components/UploadAvatarComponent';
import {getAvatarSource} from '../../../utils/fileHandler';
import {callAfterInteraction} from '../../commonHooks';

const styles = StyleSheet.create({
  avatarTitle: {
    ...FONTS.regular,
    fontSize: 13,
    paddingTop: 8,
    color: COLORS.TEXT_DARK_10,
  },
  viewTips: {flex: 1, flexDirection: 'column', marginHorizontal: 40},
  tipsTitle: {...FONTS.bold, marginBottom: 5},
  tipsDescription: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    flexWrap: 'wrap',
  },
});

const GetAvatarView = ({
  imageSource,
  gender,
  onPressIsVerifyProfilePhoto,
  isVerifyProfilePhoto,
  onAvatarSourceChange,
  containerStyle,
  showTips = true,
  showTitle = true,
  size,
  isShowBtnAdd,
}) => {
  const {showAppModal, showErrorAlert, showAppSpinner} = useContext(AppContext);
  const userId = useSelector(getUserId);
  const client = useApolloClient();

  const linkToSetting = () => OpenAppSettings.open();
  const onOkHandler = () => linkToSetting();

  const onWrongMime = () => {
    showErrorAlert(translate(STRINGS.WRONG_IMAGE_MIME));
  };

  const onNoPermission = () => {
    showAppModal({
      isVisible: true,
      message: translate(STRINGS.CAMERA_FORBIDDEN),
      cancelText: translate(STRINGS.CANCEL),
      onOkHandler: onOkHandler,
    });
  };

  const onError = () => {
    onNoPermission();
  };

  const onUploadError = error => {
    callAfterInteraction(() => {
      showAppSpinner(false);
    });
    showErrorAlert(error?.message);
  };

  const onUploadSuccess = data => {
    callAfterInteraction(() => {
      showAppSpinner(false);
    });

    //parse uri return and update user info
    const profilePhoto = data?.imageFullPath;
    //update other info
    onAvatarSourceChange({uri: profilePhoto});
  };

  const {startApi: startUpload} = useApiCall({onError: onUploadError, onSuccess: onUploadSuccess});

  const onChooseNewAvatar = newSource => {
    if (!newSource || !newSource.uri) {
      return;
    }
    showAppSpinner(true);
    const avatarSource = getAvatarSource(newSource.uri);
    startUpload(async () => {
      const response = await uploadSingleImage({
        client,
        userId,
        photoSource: avatarSource,
        onProgress: () => {},
      });
      return response;
    });
  };

  const uploadImageTips = () => {
    return (
      <>
        <View style={styles.viewTips}>
          <Text style={styles.tipsTitle}>Quy định hình ảnh:</Text>
          <Text style={styles.tipsDescription}>
            {
              '- Chất lượng ảnh rõ nét, kích thước tối đa 10MB.\n- Không chèn số điện thoại/email/logo vào ảnh.\n- Hình ảnh không mang tính phản động, dung tục.'
            }
          </Text>
        </View>
      </>
    );
  };

  return (
    <>
      {showTitle && <RequiredLabel title={translate(STRINGS.AVATAR)} />}
      <View style={{...HELPERS.row}}>
        <UploadAvatarComponent
          size={size}
          gender={gender}
          isShowBtnAdd={isShowBtnAdd}
          containerStyle={containerStyle}
          onPressIsVerifyProfilePhoto={onPressIsVerifyProfilePhoto}
          isVerifyProfilePhoto={isVerifyProfilePhoto}
          onError={onError}
          onNoPermission={onNoPermission}
          imageSource={imageSource}
          onAvatarSourceChange={onChooseNewAvatar}
          onWrongMime={onWrongMime}
        />
        {showTips && uploadImageTips()}
      </View>
    </>
  );
};

export default GetAvatarView;
