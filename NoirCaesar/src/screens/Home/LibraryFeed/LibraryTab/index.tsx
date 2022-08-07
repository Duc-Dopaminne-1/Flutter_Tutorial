import React, { useEffect, useState } from "react";
import { IPagination } from "@goldfishcode/noir-caesar-api-sdk/libs/type";
import EmptyData from "@src/components/EmptyData";
import { BookItem } from "@src/components/FlatListItem/BookItem";
import { colors } from "@src/constants/vars";
import NavigationActionsService from "@src/navigation/navigation";
import { RootState } from "@src/types/types";
import { ActivityIndicator, FlatList, Image, RefreshControl, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { LibraryTabName } from "../index";
import styles from "./styles";
import { IBook } from '@goldfishcode/noir-caesar-api-sdk/libs/api/book/models';
import { IEpisode, IStory } from '@goldfishcode/noir-caesar-api-sdk/libs/api/tv/models';
import { getListFavorites, getListPurchased } from "@src/modules/library/actions";
import { usePrevious } from "@src/hooks/usePrevious";
import { CustomText } from "@src/components/CustomText";
import translate from "@src/localize";
import { ObjectTypeEnum } from "@goldfishcode/noir-caesar-api-sdk/libs/api/library";
import { BOOK_INFO_DETAIL, MUSIC_PLAYER, VIDEO_DETAIL, VIDEO_MEDIA_PLAYER } from "@src/constants/screenKeys";

interface Props {
  tabName: LibraryTabName;
}

interface IUIState {
  page: number;
  loading: boolean;
  isRefreshing: boolean;
}

const initState: IUIState = {
  page: 1,
  loading: false,
  isRefreshing: false
}

const LibraryTab = (props: Props) => {
  const { tabName } = props;
  const dispatch = useDispatch();
  const [uiState, setUIState] = useState(initState);
  const library = useSelector<RootState, IPagination<IBook | IEpisode | IStory>>((state: RootState) => {
    if (tabName === LibraryTabName.PURCHASE) return state.library.purchased;
    else return state.library.favorites;
  });
  const { page, loading, isRefreshing } = uiState;
  const previousLoading = usePrevious(loading);

  useEffect(() => {
    setUIState({
      ...uiState,
      loading: true
    });
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      if (tabName === LibraryTabName.FAVORITE) {
        dispatch(getListFavorites({
          page: page,
          limit: 18,
          onSuccess: handleLoadListSuccess,
          onFail: handleLoadListFailed
        }));
      }
      else {
        dispatch(getListPurchased({
          page: page,
          limit: 18,
          onSuccess: handleLoadListSuccess,
          onFail: handleLoadListFailed
        }));
      }
    }
  }, [loading]);

  const handleLoadListSuccess = () => {
    setUIState({
      page: page + 1,
      loading: false,
      isRefreshing: false
    });
  }

  const handleLoadListFailed = () => {
    setUIState({
      ...uiState,
      loading: false,
      isRefreshing: false
    });
  }

  const handleNavigateToEpisode = (episode: IEpisode) => {
    if (episode.story) {
      if (episode.story.type === 'video') {
        NavigationActionsService.push(
          VIDEO_DETAIL,
          { story_id: episode.story.id },
          true
        );
      }
      else {
        NavigationActionsService.push(
          MUSIC_PLAYER,
          { episodeList: [episode] },
          true
        );
      }
    }
  }

  const handleOpenStoryDetail = (story: IStory) => {
    if (story.type === 'video') {
      NavigationActionsService.push(
        VIDEO_DETAIL,
        { story_id: story.id },
        true
      );
    }
  }

  const onPressItem = (item: IBook | IEpisode | IStory) => {
    const { type_object } = item;
    if (type_object === ObjectTypeEnum.Book) {
      NavigationActionsService.push(BOOK_INFO_DETAIL, { bookId: item.id }, true)
    }
    else if (type_object === ObjectTypeEnum.Story) {
      const story: IStory = { ...item };
      handleOpenStoryDetail(story);
    }
    else {
      const episode: IEpisode = { ...item };
      handleNavigateToEpisode(episode);
    }
  };

  const handleLoadMore = () => {
    if (!loading && library.next !== null && library.results.length !== library.count) {
      setUIState({
        ...uiState,
        loading: true
      });
    }
  };

  const onRefresh = () => {
    setUIState({
      page: 1,
      isRefreshing: true,
      loading: true
    });
  };

  const keyExtractor = (item: IBook | IEpisode | IStory) => {
    return item.id;
  }

  const renderItem = ({ item }: { item: IBook | IEpisode | IStory }) => {
    return <BookItem url={item.image_thumb ?? ''} title={item.name} onPressItem={onPressItem.bind(undefined, item)} />;
  };

  const renderRefreshControl = () => {
    return <RefreshControl tintColor={colors.WHITE} refreshing={isRefreshing} onRefresh={onRefresh} />;
  };

  const renderFooter = () => {
    return loading && !isRefreshing && library.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  const renderEmptyView = () => {
    const text = tabName === LibraryTabName.PURCHASE ? "Your purchases is empty" : "Your favorites is empty";

    return (
      <View style={[styles.container, styles.emptyView]}>
        <CustomText text={text} />
      </View>
    )
  }

  const renderList = () => {
    return (
      <FlatList
        contentContainerStyle={styles.flatList}
        data={library.results}
        numColumns={3}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={renderRefreshControl()}
        ListEmptyComponent={renderEmptyView()}
      />
    );
  }

  return <View style={styles.container}>{renderList()}</View>;
}

export default LibraryTab;
