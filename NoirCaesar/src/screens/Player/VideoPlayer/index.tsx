import styles from './styles';
import { View, Clipboard } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import NavigationActionsService from '@src/navigation/navigation';
import { BACK, PLAY, PREVIOUS, NEXT, MORE, PAUSE } from '@src/constants/icons';
import { MoreModal } from './MoreModal';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import TrackPlayer from 'react-native-track-player';
import VideoPlayer from '@src/components/Scripts/VideoPlayer';
import Share from "react-native-share";
import translate from '@src/localize';
import { IError } from '@src/modules/base';
import { addFavorite } from '@src/modules/library/actions';
import { ObjectTypeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/library';

interface Props {
  url: string;
  isFromChat?: boolean;
  weblink?: string;
  story_id?: string;
}

export interface ModalItem {
  key: string;
  value: string;
}

const modalItems: ModalItem[] = [
  { key: 'add_fav', value: 'Add to favorites' },
  { key: 'clipboard', value: 'Create a copy link' },
  { key: 'share', value: 'Share peer-to-peer' },
];

const VideoMediaPlayer = (props: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const status = useSelector<RootState, string>((state: RootState) => state.appState.currentState);
  const [isPause, setPause] = useState(false);
  const videoRef: any = useRef(null);
  const { isFromChat = false, weblink, story_id } = props;

  useEffect(() => {
    if (status == 'inactive') {
      setPause(true);
    }
  }, [status]);

  useEffect(() => {
    TrackPlayer.stop();
  }, []);

  const onPressMore = () => {
    setLoading(true);
  };

  const onBack = () => {
    if (!isPause) {
      setPause(true);
    }
    NavigationActionsService.dismissModal();
  };

  const onBackdropPress = () => {
    setLoading(false);
  };

  const handleAddFavSuccess = () => {
    NavigationActionsService.showCustomPopup({ text: translate("bookReader.add_favorite_success") })
  }

  const handleAddFavFail = (error?: IError) => {
    NavigationActionsService.showErrorPopup(error);
  }

  const onPressMoreCallBack = (item: ModalItem) => {
    setLoading(false);
    if (item.key === 'share') {
      if (!weblink) {
        NavigationActionsService.showCustomPopup({ text: "Invalid URL" });
        return;
      }
      setTimeout(() => {
        Share.open({
          url: weblink,
          failOnCancel: false
        }).catch((err) => {
          err && console.log("ShareService has error:", err);
        });
      }, 500);
    }
    else if (item.key === 'clipboard') {
      weblink && Clipboard.setString(weblink);
    }
    else if (item.key === 'add_fav') {
      if (story_id) {
        dispatch(addFavorite({
          id: story_id,
          type: ObjectTypeEnum.Story,
          onSuccess: handleAddFavSuccess,
          onFail: handleAddFavFail
        }));
      }
    }
  };

  const renderVideoMediaPlayer = () => {
    return (
      <View style={styles.container}>
        {!isFromChat && (
          <MoreModal
            onCustomPress={onPressMoreCallBack}
            loading={loading}
            onBackdropPress={onBackdropPress}
            items={modalItems}
          />
        )}
        <VideoPlayer
          ref={videoRef}
          style={{ flex: 1 }}
          disableVolume
          source={{ uri: props.url ?? '' }}
          seekColor={'#FF0000'}
          onPressMore={onPressMore}
          onBack={onBack}
          playIcon={PLAY}
          prevIcon={PREVIOUS}
          nextIcon={NEXT}
          moreIcon={MORE}
          backIcon={BACK}
          pauseIcon={PAUSE}
          disableMore={isFromChat}
        />
      </View>
    );
  };

  const renderVideoType = () => {
    return renderVideoMediaPlayer();
  };

  return <View style={styles.container}>{renderVideoType()}</View>;
};

export { VideoMediaPlayer };
