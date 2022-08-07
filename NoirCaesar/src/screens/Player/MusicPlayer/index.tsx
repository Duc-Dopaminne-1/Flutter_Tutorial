import styles from './styles';
import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Platform, Clipboard } from 'react-native';
import { MusicItem } from '@src/components/FlatListItem/MusicItem';
import { BACK, MORE } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import TrackPlayer, { Track } from 'react-native-track-player';
import NavigationActionsService from '@src/navigation/navigation';
import Container from '@src/components/Container';
import { MediaDetails } from '@src/components/Music/MusicPlayerDetails';
import { MediaControllers } from '@src/components/Music/MusicPlayerControllers';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { MoreModal } from '../VideoPlayer/MoreModal';
import Share from 'react-native-share';
import { ModalItem } from '../VideoPlayer';
import { getEpisodeDetail } from '@src/modules/tv/actions';
import { useDispatch } from 'react-redux';
import { IError } from '@src/modules/base';
import translate from '@src/localize';
import { ObjectTypeEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/library';
import { addFavorite } from '@src/modules/library/actions';

interface Props {
  episodeList: IEpisode[];
  storyNameList?: string[];
  storyThumbnailList?: string[];
  selectedIndex: number;
  useStoryNameInstead: boolean;
}

let episodes: IEpisode[] = [];
let tracks: Track[] = [];
let trackIndex = 0;

let playbackEndedListener: TrackPlayer.EmitterSubscription;
let playbackStateListener: TrackPlayer.EmitterSubscription;
let remotePlayListener: TrackPlayer.EmitterSubscription;
let remotePauseListener: TrackPlayer.EmitterSubscription;
let isFirstLoad = true;

const modalItems: ModalItem[] = [
  { key: 'add_fav', value: 'Add to favorites' },
  { key: 'clipboard', value: 'Create a copy link' },
  { key: 'share', value: 'Share peer-to-peer' },
];

const MusicPlayer = (props: Props) => {
  const dispatch = useDispatch();
  const { episodeList, storyNameList, storyThumbnailList, selectedIndex = 0, useStoryNameInstead = false } = props;
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const mediaControllersRef: any = useRef(null);
  const flatListRef: any = useRef(null);

  useEffect(() => {
    NavigationActionsService.showLoading();
    setTimeout(() => {
      NavigationActionsService.hideLoading();
    }, 500);

    setupTrackPlayer();

    return () => {
      episodes = [];
      tracks = [];
      trackIndex = 0;
      isFirstLoad = true;
    };
  }, []);

  const setupTrackPlayer = () => {
    trackIndex = selectedIndex;
    episodes = episodeList.length > 1 ? episodeList : [];
    setCurrentIndex(trackIndex);
    addListToTrack();

    TrackPlayer.reset();

    TrackPlayer.updateOptions({
      stopWithApp: true,
      playIcon: true,
      pauseIcon: true,
      capabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
      compactCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
      notificationCapabilities: [TrackPlayer.CAPABILITY_PLAY, TrackPlayer.CAPABILITY_PAUSE],
    });

    TrackPlayer.setupPlayer().then(async () => {
      await TrackPlayer.add(tracks[trackIndex]);
      getCurrentTrack();
      TrackPlayer.play();
    });

    TrackPlayer.registerPlaybackService(() => require('@services/service.js'));

    playbackEndedListener && playbackEndedListener.remove();
    playbackEndedListener = TrackPlayer.addEventListener('playback-queue-ended', async () => {
      if (Platform.OS === 'ios') {
        handlePlaybackEnded();
      } else {
        if (!isFirstLoad) {
          handlePlaybackEnded();
        } else {
          isFirstLoad = false;
        }
      }
    });

    playbackStateListener && playbackStateListener.remove();
    playbackStateListener = TrackPlayer.addEventListener('playback-state', async data => {
      const { state } = data;
      if (state == 'playing') {
        getCurrentTrack();
      }
    });

    remotePlayListener && remotePlayListener.remove();
    remotePlayListener = TrackPlayer.addEventListener('remote-play', async () => {
      mediaControllersRef.current && mediaControllersRef.current.onPlay();
      TrackPlayer.play().then(() => getCurrentTrack());
    });

    remotePauseListener && remotePauseListener.remove();
    remotePauseListener = TrackPlayer.addEventListener('remote-pause', async () => {
      mediaControllersRef.current && mediaControllersRef.current.onPause();
      TrackPlayer.pause();
    });
  };

  const handlePlaybackEnded = () => {
    if (mediaControllersRef.current.isRepeat()) {
      TrackPlayer.seekTo(0);
      TrackPlayer.play();
    } else {
      onPressNext();
    }
  };

  const validateUrl = (url?: string) => {
    return url && url != '' ? url : 'empty';
  };

  const getEpisodeData = (isTitle: boolean, item: IEpisode, index: number) => {
    if (useStoryNameInstead) {
      if (isTitle) {
        return storyNameList ? storyNameList[index] : '';
      } else {
        return '';
      }
    } else {
      if (isTitle) {
        return item.name;
      } else {
        return storyNameList ? storyNameList[index] : item.story?.name ?? '';
      }
    }
  };

  const addListToTrack = () => {
    tracks = [];
    if (episodeList && episodeList.length > 0) {
      for (let i = 0; i < episodeList.length; i++) {
        tracks.push({
          id: `${i}`,
          url: validateUrl(episodeList[i].file_url),
          title: getEpisodeData(true, episodeList[i], i),
          artist: getEpisodeData(false, episodeList[i], i),
        });
      }
    }
  };

  const getCurrentTrack = async () => {
    const trackId = await TrackPlayer.getCurrentTrack();
    if (currentTrack && currentTrack.id === trackId) return;
    const indexTrack = tracks.find(track => {
      return track.id === trackId;
    });
    setCurrentTrack(indexTrack);
  };

  const randomIndex = () => {
    const arrayNumber = Array.from(Array(tracks.length).keys());
    const availableNumber = arrayNumber.filter(value => value !== trackIndex);
    let random: number;
    random = availableNumber[Math.floor(Math.random() * availableNumber.length)];
    return random;
  };

  const onPressItem = (index: number) => {
    mediaControllersRef.current && mediaControllersRef.current.onPlay();
    flatListRef.current && flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    trackIndex = index;
    setCurrentIndex(trackIndex);
    TrackPlayer.reset();
    TrackPlayer.add(tracks[trackIndex]);
    TrackPlayer.play();
  };

  const onBack = () => {
    NavigationActionsService.pop();
  };

  const onSeek = (value: number) => {
    value = Math.round(value);
    TrackPlayer.seekTo(value);
  };

  const onPressPlay = () => {
    mediaControllersRef.current && mediaControllersRef.current.onPlay();
    TrackPlayer.play().then(() => getCurrentTrack());
  };

  const onPressPause = () => {
    mediaControllersRef.current && mediaControllersRef.current.onPause();
    TrackPlayer.pause();
  };

  const onPressNext = () => {
    if (episodeList.length > 1) {
      mediaControllersRef.current && mediaControllersRef.current.onPlay();
      if (mediaControllersRef.current.isShuffle() && tracks.length > 1) {
        trackIndex = randomIndex();
      } else {
        if (trackIndex == tracks.length - 1) {
          trackIndex = 0;
        } else {
          trackIndex++;
        }
      }
      setCurrentIndex(trackIndex);

      TrackPlayer.reset();
      TrackPlayer.add(tracks[trackIndex]);
      TrackPlayer.play();
    } else {
      TrackPlayer.seekTo(0);
      onPressPause();
    }
  };

  const onPressPrevious = () => {
    if (episodeList.length > 1) {
      mediaControllersRef.current && mediaControllersRef.current.onPlay();
      if (mediaControllersRef.current.isShuffle() && tracks.length > 1) {
        trackIndex = randomIndex();
      } else {
        if (trackIndex == 0) {
          trackIndex = tracks.length - 1;
        } else {
          trackIndex--;
        }
      }
      setCurrentIndex(trackIndex);

      TrackPlayer.reset();
      TrackPlayer.add(tracks[trackIndex]);
      TrackPlayer.play();
    }
  };

  const handleMorePress = () => {
    setShowMoreModal(true);
  }

  const handleAddFavSuccess = () => {
    NavigationActionsService.showCustomPopup({ text: translate("bookReader.add_favorite_success") })
  }

  const handleAddFavFail = (error?: IError) => {
    NavigationActionsService.showErrorPopup(error);
  }

  const renderHeader = () => {
    return <CustomHeader containerStyle={styles.headerContainer} leftImage={BACK} leftAction={onBack} rightImage={MORE} rightAction={handleMorePress} />;
  };

  const renderItem = ({ item, index }: { item: IEpisode; index: number }) => {
    const image = item.image && item.image !== '' ? item.image : storyThumbnailList ? storyThumbnailList[index] : '';
    return <MusicItem url={image} item={item} onPressItem={onPressItem.bind(undefined, index)} />;
  };

  const renderFlatListHeader = () => {
    const imageThumb =
      episodeList[currentIndex].image && episodeList[currentIndex].image !== ''
        ? episodeList[currentIndex].image ?? ''
        : storyThumbnailList
          ? storyThumbnailList[currentIndex]
          : '';
    return (
      <View style={{ width: '100%' }}>
        <MediaDetails
          thumb={imageThumb}
          title={getEpisodeData(true, episodeList[currentIndex], currentIndex)}
          artist={getEpisodeData(false, episodeList[currentIndex], currentIndex)}
          onSeek={onSeek}
        />
        <MediaControllers
          musicLength={episodeList.length}
          ref={mediaControllersRef}
          onPressPlay={onPressPlay}
          onPressPause={onPressPause}
          onPressNext={onPressNext}
          onPressPrevious={onPressPrevious}
        />
      </View>
    );
  };

  const onBackdropPress = () => {
    setShowMoreModal(false);
  };

  const onPressMoreCallBack = (modalItem: ModalItem) => {
    setShowMoreModal(false);
    const episode = episodeList[currentIndex];
    dispatch(getEpisodeDetail({
      episode_id: episode.id,
      onSuccess: (response: IEpisode) => {
        if (response && response.weblink) {
          if (modalItem.key === 'share') {
            setTimeout(() => {
              Share.open({
                url: response.weblink,
                failOnCancel: false
              }).catch((err) => {
                err && console.log("ShareService has error:", err);
              });
            }, 500);
          }
          else if (modalItem.key === 'clipboard') {
            Clipboard.setString(response.weblink);
          }
          else if (modalItem.key === 'add_fav') {
            dispatch(addFavorite({
              id: response.id,
              type: ObjectTypeEnum.Episode,
              onSuccess: handleAddFavSuccess,
              onFail: handleAddFavFail
            }));
          }
        }
        else {
          NavigationActionsService.showCustomPopup({ text: "Invalid URL" });
        }
      },
      onFail: (error?: IError) => {
        NavigationActionsService.showErrorPopup(error);
      }
    }));
  };

  const renderMoreModal = () => {
    return (
      <MoreModal
        onCustomPress={onPressMoreCallBack}
        loading={showMoreModal}
        onBackdropPress={onBackdropPress}
        items={modalItems}
      />
    )
  }

  const keyExtractor = (item: IEpisode, index: number) => {
    return index.toString();
  };

  return (
    <Container>
      <FlatList
        ref={flatListRef}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.flatList}
        data={episodes}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderFlatListHeader()}
        ListHeaderComponentStyle={styles.flatListHeaderStyle}
      />
      {renderHeader()}
      {renderMoreModal()}
    </Container>
  );
};

export { MusicPlayer };
