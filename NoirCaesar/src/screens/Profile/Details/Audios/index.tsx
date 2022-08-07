import styles from './styles';
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { AudioItem } from '@src/components/FlatListItem/AudioItem';
import { colors } from '@src/constants/vars';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '@src/hooks/usePrevious';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { getListCollection } from '@src/modules/auth/actions';
import { CategoryCollectionEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user';
import NavigationActionsService from '@src/navigation/navigation';
import { MUSIC_PLAYER } from '@src/constants/screenKeys';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import TrackPlayer from 'react-native-track-player';

interface Props {
  bindFunctionRefreshAudios?: (bindingFunc: () => void) => void;
}

let isFirstLoad = true;
const Audios = (props: Props) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const listAudios = useSelector<RootState, IPagination<IEpisode>>((state: RootState) => state.auth.listUserAudio);

  useEffect(() => {
    setLoading(true);
    props.bindFunctionRefreshAudios && props.bindFunctionRefreshAudios(onRefreshAudios);
  }, []);

  const onRefreshAudios = () => {
    setPage(1);
    setLoading(true);
  };

  useEffect(() => {
    if (loading == true && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
      }
      getListAudio();
    }
  }, [loading]);

  const getListAudio = () => {
    dispatch(
      getListCollection({
        type: CategoryCollectionEnum.Audio,
        limit: 10,
        page: page,
        onSuccess: () => {
          setPage(page + 1);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
        onFail: () => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        },
      }),
    );
  };

  const onPressItem = (index: number) => {
    TrackPlayer.stop();
    NavigationActionsService.push(
      MUSIC_PLAYER,
      {
        episodeList: getEpisodeList(),
        storyNameList: getStoryNameList(),
        selectedIndex: index,
        useStoryNameInstead: true,
      },
      true,
    );
  };

  const getEpisodeList = () => {
    let episodes: IEpisode[] = [];

    for (let i = 0; i < listAudios.results.length; i++) {
      const episode = listAudios.results[i];
      episode && episodes.push(episode);
    }

    return episodes;
  };

  const getStoryNameList = () => {
    let storyName: string[] = [];

    for (let i = 0; i < listAudios.results.length; i++) {
      const name = listAudios.results[i].story?.name;
      name && storyName.push(name);
    }

    return storyName;
  };

  const renderItem = ({ item, index }: { item: IEpisode; index: number }) => {
    return (
      <AudioItem
        content={''}
        url={item.story && item.image ? item.image : ''}
        title={item.story && item.story.name ? item.story.name : ''}
        onPressItem={onPressItem.bind(undefined, index)}
      />
    );
  };

  const keyExtractor = (item: IEpisode, index: number) => {
    return index.toString();
  };

  const renderFooter = () => {
    return loading && listAudios.results.length > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const handleLoadMore = () => {
    if (!loading && listAudios.next !== null && listAudios.results.length !== listAudios.count) {
      setLoading(true);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatList}
        data={listAudios.results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export { Audios };
