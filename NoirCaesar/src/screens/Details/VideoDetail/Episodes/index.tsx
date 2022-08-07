import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { usePrevious } from '@src/hooks/usePrevious';
import { colors } from '@src/constants/vars';
import { EpisodesItem } from '@src/components/FlatListItem/EpisodesItem';
import { getEpisodeList } from '@src/modules/explore/actions';
import { IEpisode } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import NavigationActionsService from '@src/navigation/navigation';
import { VIDEO_MEDIA_PLAYER } from '@src/constants/screenKeys';
import EmptyData from '@src/components/EmptyData';
import { getEpisodeDetail } from '@src/modules/tv/actions';
import { IError } from '@src/modules/base';

interface Props {
  story_id: string;
  episodeImage?: string;
  bindRefreshFunction?: (cbRefresh: () => void) => void;
}

let isFirstLoad = true;

const Episodes = (props: Props) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const previousLoading = usePrevious(loading);
  const listEpisode = useSelector<RootState, IPagination<IEpisode>>((state: RootState) => state.explore.listEpisode);

  useEffect(() => {
    props.bindRefreshFunction && props.bindRefreshFunction(refreshData);
  }, []);

  useEffect(() => {
    if (props.story_id) {
      getEpisodeListAction();
    }
  }, [props.story_id]);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
      }

      if (props.story_id) {
        dispatch(
          getEpisodeList({
            story_id: props.story_id ?? '',
            limit: 10,
            page: page,
            onSuccess: () => {
              setPage(page + 1);
              setTimeout(() => {
                setLoading(false);
              }, 500);
            },
            onFail: error => {
              setTimeout(() => {
                setLoading(false);
                NavigationActionsService.showErrorPopup(error);
              }, 500);
            },
          }),
        );
      }
    }
  }, [loading]);

  const getEpisodeListAction = () => {
    setLoading(true);
  };

  const refreshData = () => {
    setPage(1);
    getEpisodeListAction();
  }

  const onPressItemEpisodes = (episode: IEpisode) => {
    dispatch(getEpisodeDetail({
      episode_id: episode.id,
      onSuccess: (response: IEpisode) => {
        if (response && response.file_url) {
          NavigationActionsService.showModal(
            VIDEO_MEDIA_PLAYER,
            { url: response.file_url, weblink: response.weblink, story_id: response.story && response.story.id }
          );
        }
        else {
          NavigationActionsService.showCustomPopup({ text: "Invalid URL" });
        }
      },
      onFail: (error?: IError) => {
        NavigationActionsService.showErrorPopup(error);
      }
    }))
  };

  const renderItem = ({ item }: { item: IEpisode }) => {
    return (
      <EpisodesItem
        episodeImage={props.episodeImage}
        item={item}
        onCustomPress={onPressItemEpisodes.bind(undefined, item)}
        onRefreshData={refreshData}
      />
    );
  };

  const keyExtractor = (item: IEpisode, index: number) => {
    return index.toString();
  };

  const handleLoadMore = () => {
    if (!loading && listEpisode.next !== null && listEpisode.results.length !== listEpisode.count) {
      getEpisodeListAction();
    }
  };

  const renderFooter = () => {
    return loading && listEpisode.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderListEpisode = () => (
    <FlatList
      data={listEpisode.results}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      ListEmptyComponent={<EmptyData />}
    />
  );

  return <View style={[styles.container, { paddingStart: 15, paddingEnd: 15 }]}>{renderListEpisode()}</View>;
};

export { Episodes };
