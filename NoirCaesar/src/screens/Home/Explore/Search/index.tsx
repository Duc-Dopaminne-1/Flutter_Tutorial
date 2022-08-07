import styles from './styles';
import Container from '@src/components/Container';
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, ActivityIndicator, Keyboard, TouchableWithoutFeedback } from 'react-native';
import CustomInput from '@src/components/CustomInput';
import translate from '@src/localize';
import { CustomText } from '@src/components/CustomText';
import NavigationActionsService from '@src/navigation/navigation';
import FastImage from 'react-native-fast-image';
import SEARCH_ICON from '@res/icons/search_no_item.png';
import { useDispatch, useSelector } from 'react-redux';
import { getExploreList, clearExploreList } from '@src/modules/explore/actions';
import { debounce } from 'lodash';
import { colors } from '@src/constants/vars';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IEpisode, IStory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { SearchItem } from '@src/components/FlatListItem/SearchItem';
import { get } from 'lodash';
import { BOOK_INFO_DETAIL, VIDEO_DETAIL, MUSIC_PLAYER } from '@src/constants/screenKeys';
import TrackPlayer from 'react-native-track-player';
import { CustomHeader } from '@src/components/CustomHeader';

const Search = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const listExplore = useSelector<RootState, IPagination<IBook | IEpisode | IStory>>((state: RootState) => state.explore.listExplore);

  const debounceLoadData = useCallback(
    debounce((search: string) => {
      if (listExplore && search === '') {
        dispatch(clearExploreList());
      } else {
        setPage(1);
        getSearchList(search);
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    debounceLoadData(search);
  }, [search]);

  const getSearchList = (name: string) => {
    setLoading(true);
    dispatch(
      getExploreList({
        name: name,
        page: page,
        onSuccess: () => {
          setLoading(false);
        },
        onFail: error => {
          setTimeout(() => {
            setLoading(false);
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        },
      }),
    );
  };

  const onChangeText = (text: string) => {
    setSearch(text);
  };

  const onPressCancel = () => {
    NavigationActionsService.pop();
    dispatch(clearExploreList());
  };

  const renderNoResults = () => (
    <View style={styles.containerNoItem}>
      <View style={styles.containerItemSearch}>
        <FastImage source={SEARCH_ICON} style={styles.iconNoItem}></FastImage>
        <CustomText style={styles.titleNoItem} text={translate('explore.no_results_found')} />
        <CustomText style={styles.desNoItem} text={translate('explore.des_no_item')} />
      </View>
    </View>
  );

  const renderSearch = () => (
    <CustomInput
      onChangeText={onChangeText}
      placeholder={translate('explore.search')}
      returnKeyType="done"
      autoFocus
      moreStyle={styles.search}
      value={search}
    />
  );

  const renderHeader = () => (
    <CustomHeader
      rightText={translate('explore.cancel')}
      rightAction={onPressCancel}
      customComponent={renderSearch()}
      containerStyle={styles.headerContainer}
    />
  );

  const handleLoadMore = () => {
    if (!loading && listExplore.next !== null && listExplore.results.length !== listExplore.count) {
      setPage(page + 1);
      getSearchList(search);
    }
  };

  const renderFooter = () => {
    return loading ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const onPressItem = (item: IBook | IEpisode | IStory) => {
    const type = get(item, ['type_object']);
    const book = item as IBook;
    const story = item as IStory;
    const episode = item as IEpisode;
    Keyboard.dismiss();
    setTimeout(() => {
      switch (type) {
        case 'book':
          NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: book.id }, true);
          break;
        case 'story':
          if (story.type && story.type === 'video') {
            NavigationActionsService.push(VIDEO_DETAIL, { story_id: story.id }, true);
          }
          break;
        case 'episode':
          TrackPlayer.stop();
          if (episode.story?.type && episode.story?.type === 'audio') {
            NavigationActionsService.push(MUSIC_PLAYER, { episodeList: [episode] }, true);
          }
          break;
      }
    }, 300);
  };

  const renderItem = ({ item }: { item: IBook | IEpisode | IStory }) => {
    return (
      <SearchItem
        url={item && item.image_thumb ? item.image_thumb : ''}
        title={item && item.name ? item.name : ''}
        onPressItem={onPressItem.bind(undefined, item)}
      />
    );
  };

  const renderResults = () => (
    <FlatList
      keyboardShouldPersistTaps={'handled'}
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.flatList}
      data={listExplore.results}
      renderItem={renderItem}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={renderFooter}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
    />
  );

  return (
    <Container>
      {renderHeader()}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {listExplore && listExplore.results.length > 0 ? renderResults() : renderNoResults()}

      </TouchableWithoutFeedback>
    </Container>
  );
};

export default Search;
