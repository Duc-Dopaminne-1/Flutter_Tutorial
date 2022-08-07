import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { CustomHeader } from '@src/components/CustomHeader';
import { EXPLORE_SEARCH } from '@src/constants/icons';
import NavigationActionsService from '@src/navigation/navigation';
import { SEARCH, VIDEO_DETAIL, BOOK_INFO_DETAIL, MUSIC_PLAYER } from '@src/constants/screenKeys';
import { ExploreItem } from '../../../components/FlatListItem/ExploreItem';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { useDispatch, useSelector } from 'react-redux';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { clone } from 'lodash';
import { getSuggestExploreList, getExploreSlider } from '@src/modules/explore/actions';
import { IEpisode, IStory, IStorySlider } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { RootState } from '@src/types/types';
import { CustomSwiper } from '@src/components/CustomSwiper';
import { WIDTH } from '@src/constants/vars';
import { CustomText } from '@src/components/CustomText';
import translate from '@src/localize';
import TrackPlayer from 'react-native-track-player';

enum ContentType {
  BOOK = 'book',
  STORY = 'story',
  EPISODE = 'episode'
}

const Explore = () => {
  const dispatch = useDispatch();
  const [listBook, setListBook] = useState<IBook[]>([]);
  const [listStory, setListStory] = useState<IStory[]>([]);
  const [listEpisode, setListEpisode] = useState<IEpisode[]>([]);
  const [listSuggestion, setListSuggestion] = useState<IPagination<IBook | IEpisode | IStory>>({
    count: 0,
    next: '',
    previous: '',
    results: [],
  });
  const sliders = useSelector<RootState, Array<IBook | IStorySlider>>((state: RootState) => state.explore.listSlider);

  useEffect(() => {
    getSlider();
    suggestExploreList();
  }, []);

  useEffect(() => {
    parseArrayData();
  }, [listSuggestion]);

  const getSlider = () => {
    dispatch(
      getExploreSlider({
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  }

  const suggestExploreList = () => {
    dispatch(
      getSuggestExploreList({
        onSuccess: data => {
          setListSuggestion(data);
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const parseArrayData = () => {
    const cloneData: IBook[] | IEpisode[] | IStory[] = clone(listSuggestion.results);

    const cloneBooks = cloneData as IBook[];
    const cloneStories = cloneData as IStory[];
    const cloneEpisodes = cloneData as IEpisode[];

    const books = cloneBooks.filter(item => item.type_object == ContentType.BOOK)
    const stories = cloneStories.filter(item => item.type_object == ContentType.STORY)
    const episodes = cloneEpisodes.filter(item => item.type_object == ContentType.EPISODE)

    setListBook(books);
    setListEpisode(episodes);
    setListStory(stories);
  };

  const onPressSearch = () => {
    NavigationActionsService.push(SEARCH);
  };

  const onPressSwiper = (item: IBook | IEpisode | IStory) => {
    switch (item.type_object) {
      case ContentType.BOOK:
        const book = item as IBook;
        NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: book.id }, true);
        break;
      case ContentType.STORY:
        const story = item as IStory;
        NavigationActionsService.push(VIDEO_DETAIL, { story_id: story.id }, true);
        break;
      case ContentType.EPISODE:
        const episode = item as IEpisode;
        NavigationActionsService.push(MUSIC_PLAYER, { episodeList: [episode] }, true);
        break;
    }
  }

  const onPressItem = (item: IBook | IEpisode | IStory) => {
    switch (item.type_object) {
      case ContentType.BOOK:
        const book = item as IBook;
        NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: book.id }, true);
        break;
      case ContentType.STORY:
        const story = item as IStory;
        NavigationActionsService.push(VIDEO_DETAIL, { story_id: story.id }, true);
        break;
      case ContentType.EPISODE:
        const episode = item as IEpisode;
        toMusicPlayer(episode)
        break;
    }
  }

  const toMusicPlayer = (episode: IEpisode) => {
    TrackPlayer.stop();
    const selectedIndex = getEpisodeList().indexOf(episode);

    getEpisodeList().length > 0
      ? NavigationActionsService.push(
        MUSIC_PLAYER,
        {
          episodeList: getEpisodeList(),
          storyThumbnailList: getAllowReadStoryThumbnailList(),
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
    let episodeList = clone(listEpisode);
    for (let i = 0; i < episodeList.length; i++) {
      episodes.push(episodeList[i]);
    }

    return episodes;
  };

  const getAllowReadStoryThumbnailList = () => {
    let storyThumbnailList: string[] = [];

    let storyList = clone(listStory);

    for (let i = 0; i < storyList.length; i++) {
      const url = storyList[i].image;
      url && url !== '' && storyThumbnailList.push(url);
    }

    return storyThumbnailList;
  };

  const renderHeader = () => (
    <CustomHeader
      containerStyle={styles.headerContainer}
      rightImage={EXPLORE_SEARCH}
      rightImageStyle={{ width: 35, height: 35 }}
      rightAction={onPressSearch} />
  );

  const renderSwiper = () => (
    <View style={{ height: WIDTH * 0.7 }}>
      <CustomSwiper items={sliders} onPress={onPressSwiper} />
    </View>
  )

  const renderItem = ({ item }: { item: IBook | IEpisode | IStory }) => {
    return <ExploreItem title={item.name} url={item.image_thumb} onPressItem={onPressItem.bind(undefined, item)} />;
  };

  const keyExtractor = (item: IBook | IEpisode | IStory, index: number) => {
    return item.id;
  };

  const renderList = (data: IBook[] | IEpisode[] | IStory[], type: ContentType) => {
    const section = `Featured ${type == ContentType.BOOK ? 'Books' : type == ContentType.STORY ? 'Videos' : 'Audios'}`
    return (
      <View style={{ alignItems: 'flex-start', justifyContent: 'center', marginTop: 15 }}>
        <CustomText style={{ marginHorizontal: 15 }} text={section} />
        {renderFlatlist(data, type)}
      </View>
    )
  }

  const renderFlatlist = (data: IBook[] | IEpisode[] | IStory[], type: ContentType) => {
    let listData: any;
    if (type == ContentType.BOOK) {
      listData = data as IBook[];
    } else if (type == ContentType.STORY) {
      listData = data as IStory[];
    } else {
      listData = data as IEpisode[]
    }

    return (
      <View style={{ width: WIDTH, marginTop: 15, marginBottom: 10 }}>
        <FlatList
          horizontal
          contentContainerStyle={styles.flatlist}
          data={listData}
          keyExtractor={keyExtractor}
          renderItem={renderItem} />
      </View >
    )
  };

  return (
    <Container>
      <View style={styles.containerBody}>
        <ScrollView >
          {renderSwiper()}
          {renderList(listBook, ContentType.BOOK)}
          {renderList(listStory, ContentType.STORY)}
          {renderList(listEpisode, ContentType.EPISODE)}
        </ScrollView>
        {renderHeader()}
      </View>
    </Container>
  );
};

export default Explore;
