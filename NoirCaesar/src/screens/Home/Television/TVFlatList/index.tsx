import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { BookItem } from '@src/components/FlatListItem/BookItem';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { colors } from '@src/constants/vars';
import { usePrevious } from '@src/hooks/usePrevious';
import translate from '@src/localize';
import NavigationActionsService from '@src/navigation/navigation';
import { VIDEO_DETAIL, MUSIC_PLAYER } from '@src/constants/screenKeys';
import { CustomText } from '@src/components/CustomText';
import { IStory, IStorySlider, IEpisode, ICategory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { CustomSwiper } from '@src/components/CustomSwiper';
import { NewsItem } from '@src/components/FlatListItem/NewsItem';
import { MusicItem } from '@src/components/FlatListItem/MusicItem';
import { getSlider, getStories } from '@src/modules/tv/actions';
import { TabName } from '..';
import TrackPlayer from 'react-native-track-player';

export enum Type {
  VIDEO = 'video',
  AUDIO = 'audio',
}

export enum ShowType {
  GRID = 'grid',
  LIST_STORY = 'list_story',
  LIST_EPISODE = 'list_episode',
}

interface Props {
  category: ICategory;
}

let isFirstLoad = true;

const TVFlatList = (props: Props) => {
  const category = props.category;
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const previousLoading = usePrevious(loading);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStoryList = () => {
    switch (category.name) {
      case TabName.ANIMATION:
        return useSelector<RootState, IPagination<IStory> | undefined>((state: RootState) => state.tv.animation?.list);
      case TabName.FILM:
        return useSelector<RootState, IPagination<IStory> | undefined>((state: RootState) => state.tv.film?.list);
      case TabName.REVIEWS:
        return useSelector<RootState, IPagination<IStory> | undefined>((state: RootState) => state.tv.reviews?.list);
      case TabName.NEWS:
        return useSelector<RootState, IPagination<IStory> | undefined>((state: RootState) => state.tv.news);
      case TabName.PODCAST:
        return useSelector<RootState, IPagination<IStory> | undefined>((state: RootState) => state.tv.podcast);
      case TabName.MUSIC:
        return useSelector<RootState, IPagination<IEpisode> | undefined>((state: RootState) => state.tv.music);
      default:
        return null;
    }
  };

  const getSliderList = () => {
    switch (category.name) {
      case TabName.ANIMATION:
        return useSelector<RootState, IStorySlider[]>((state: RootState) => state.tv.animation?.slider ?? []);
      case TabName.FILM:
        return useSelector<RootState, IStorySlider[]>((state: RootState) => state.tv.film?.slider ?? []);
      case TabName.REVIEWS:
        return useSelector<RootState, IStorySlider[]>((state: RootState) => state.tv.reviews?.slider ?? []);
      default:
        return null;
    }
  };

  const stories = getStoryList();
  const sliders = getSliderList();

  useEffect(() => {
    getListStory();
  }, []);

  useEffect(() => {
    if (loading == true && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
        setIsRefreshing(true);
      }

      if (page == 1 && category.show_type == ShowType.GRID) {
        dispatch(
          getSlider({
            type: category.name,
            cate_id: category.id,
          }),
        );
      }

      dispatch(
        getStories({
          type: category.name,
          cate_id: category.id,
          page: page,
          limit: category.show_type == ShowType.GRID ? 18 : 10,
          onSuccess: () => {
            setPage(page + 1);
            setTimeout(() => {
              setIsRefreshing(false);
              setLoading(false);
            }, 500);
          },
          onFail: error => {
            setIsRefreshing(false);
            setTimeout(() => {
              setLoading(false);
              NavigationActionsService.showErrorPopup(error);
            }, 500);
          },
        }),
      );
    }
  }, [loading]);

  const getListStory = () => {
    setLoading(true);
  };

  const onPressItem = (item: IStory | IEpisode) => {
    const story = item as IStory;
    const episode = item as IEpisode;
    switch (category.type) {
      case Type.VIDEO:
        NavigationActionsService.push(VIDEO_DETAIL, { story_id: story.id }, true);
        break;
      case Type.AUDIO:
        toMusicPlayer(episode, story);
        break;
      default:
        break;
    }
  };

  const toMusicPlayer = (episode: IEpisode, story: IStory) => {
    TrackPlayer.stop();
    const selectedIndex =
      category.show_type == ShowType.LIST_EPISODE ? getEpisodeList().indexOf(episode) : getStoryNameList().indexOf(story.name);

    getEpisodeList().length > 0
      ? NavigationActionsService.push(
        MUSIC_PLAYER,
        {
          episodeList: getEpisodeList(),
          storyThumbnailList: getAllowReadStoryThumbnailList(),
          storyNameList: category.show_type == ShowType.LIST_EPISODE ? null : getStoryNameList(),
          selectedIndex: selectedIndex,
        },
        true,
      )
      : NavigationActionsService.showCustomPopup({
        text: translate('alert.no_data_found'),
      });
  };

  const getEpisodeList = () => {
    let episodes: IEpisode[] = [];

    if (category.show_type == ShowType.LIST_EPISODE) {
      let episodeList = stories as IPagination<IEpisode>;
      for (let i = 0; i < episodeList.results.length; i++) {
        const allow_read = episodeList.results[i].allow_read;
        allow_read && episodes.push(episodeList.results[i]);
      }
    } else {
      let storyList = stories as IPagination<IStory>;
      for (let i = 0; i < storyList.results.length; i++) {
        const episode = storyList.results[i].episode;
        const allow_read = episode?.allow_read;
        episode && allow_read && episodes.push(episode);
      }
    }

    return episodes;
  };

  const getStoryThumbnailList = () => {
    let storyThumbnailList: string[] = [];

    let storyList = stories as IPagination<IStory>;
    for (let i = 0; i < storyList.results.length; i++) {
      const url = storyList.results[i].image;
      url && url !== '' && storyThumbnailList.push(url);
    }

    return storyThumbnailList;
  };

  const getAllowReadStoryThumbnailList = () => {
    let storyThumbnailList: string[] = [];

    let storyList = stories as IPagination<IStory>;
    let episodeList = stories as IPagination<IEpisode>;

    for (let i = 0; i < storyList.results.length; i++) {
      let allow_read: boolean | undefined;
      if (category.show_type == ShowType.LIST_EPISODE) {
        allow_read = episodeList.results[i].allow_read;
      } else {
        allow_read = storyList.results[i].episode?.allow_read;
      }
      const url = storyList.results[i].image;
      url && url !== '' && allow_read && storyThumbnailList.push(url);
    }

    return storyThumbnailList;
  };

  const getStoryNameList = () => {
    let storyName: string[] = [];

    let storyList = stories as IPagination<IStory>;
    let episodeList = stories as IPagination<IEpisode>;

    for (let i = 0; i < storyList.results.length; i++) {
      let allow_read: boolean | undefined;
      if (category.show_type == ShowType.LIST_EPISODE) {
        allow_read = episodeList.results[i].allow_read;
      } else {
        allow_read = storyList.results[i].episode?.allow_read;
      }
      const name = storyList.results[i].name;
      name && allow_read && storyName.push(name);
    }

    return storyName;
  };

  const onPressSwiper = (item: IStory) => {
    NavigationActionsService.push(VIDEO_DETAIL, { story_id: item.id }, true);
  };

  const handleLoadMore = () => {
    if (!loading && stories && stories.next !== null && stories.results.length !== stories.count) {
      getListStory();
    }
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setPage(1);
    getListStory();
  };

  const renderHeader = () => {
    if (sliders && sliders.length > 0) {
      return <CustomSwiper items={sliders} onPress={onPressSwiper} />;
    } else if (stories && stories.results.length > 0 && sliders && sliders.length <= 0) {
      return null;
    } else {
      return <CustomText style={styles.noData} text={translate('common.list_empty')} />;
    }
  };

  const renderFooter = () => {
    return loading && stories && stories.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const keyExtractor = (item: IStory | IEpisode, index: number) => {
    return index.toString();
  };

  const renderItem = ({ item, index }: { item: IStory | IEpisode; index: number }) => {
    switch (category.show_type) {
      case ShowType.GRID:
        return <BookItem url={item.image_thumb ?? ''} title={item.name} onPressItem={onPressItem.bind(undefined, item, index)} />;
      case ShowType.LIST_STORY:
        let story = item as IStory;
        return <NewsItem item={story} onPressItem={onPressItem.bind(undefined, story, index)} onRefreshData={onRefresh} />;
      case ShowType.LIST_EPISODE:
        let episode = item as IEpisode;
        const imageThumb = episode.image || getStoryThumbnailList()[index] || '';
        return <MusicItem url={imageThumb} item={episode} onPressItem={onPressItem.bind(undefined, episode, index)} onRefreshData={onRefresh} />;
      default:
        return null;
    }
  };

  const renderFlatList = () => {
    switch (category.show_type) {
      case ShowType.GRID:
        return (
          <FlatList
            contentContainerStyle={styles.flatList}
            data={(stories?.results ?? []) as (IStory | IEpisode)[]}
            numColumns={3}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={renderHeader()}
            ListHeaderComponentStyle={styles.headerFlatList}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={renderRefreshControl()}
          />
        );
      case ShowType.LIST_STORY:
      case ShowType.LIST_EPISODE:
        return (
          <FlatList
            contentContainerStyle={styles.flatList}
            data={stories?.results ?? []}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={renderRefreshControl()}
          />
        );
    }
  };

  return <View style={styles.container}>{renderFlatList()}</View>;
};

export { TVFlatList };
