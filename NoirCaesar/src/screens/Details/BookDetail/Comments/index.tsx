import styles from './styles';
import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { CommentItem } from '@src/components/FlatListItem/CommentItem';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';
import { usePrevious } from '@src/hooks/usePrevious';
import { colors } from '@src/constants/vars';
import NavigationActionsService from '@src/navigation/navigation';
import { getProfileDetail } from '@src/modules/user/actions';
import { PROFILE_OTHERS, PROFILE } from '@src/constants/screenKeys';
import { getListComment } from '@src/modules/books/actions';

interface Props {
  bookId: string;
  bindFunctionRefreshComments?: (bindingFunc: () => void) => void;
}

let isFirstLoad = true;

const Comments = (props: Props) => {
  const { bookId } = props;
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const previousLoading = usePrevious(loading);
  const currentUserId = useSelector<RootState, string>((state: RootState) => state.auth.userData.user_id);
  const [listComment, setListComment] = useState<IPagination<IComment>>({
    count: 0,
    next: '',
    previous: '',
    results: [],
  })

  useEffect(() => {
    getListCommentAction();
    props.bindFunctionRefreshComments && props.bindFunctionRefreshComments(onRefreshComment);
  }, []);

  useEffect(() => {
    if (loading && previousLoading !== loading) {
      if (isFirstLoad) {
        isFirstLoad = false;
      }

      dispatch(
        getListComment({
          model_id: bookId,
          page: page,
          limit: 10,
          onSuccess: (value: IPagination<IComment>) => {
            if (page == 1) {
              setListComment(value)
            } else {
              setListComment({
                count: value.count,
                next: value.next,
                previous: value.previous,
                results: [...listComment.results, ...value.results]
              })
            }
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
  }, [loading]);

  const getListCommentAction = () => {
    setLoading(true);
  };

  const onRefreshComment = () => {
    setPage(1);
    setLoading(true);
  };

  const renderItem = ({ item }: { item: IComment }) => {
    return <CommentItem item={item} onCustomPress={onItemPress.bind(undefined, item)} />;
  };

  const keyExtractor = (item: IComment, index: number) => {
    return index.toString();
  };

  const handleLoadMore = () => {
    if (!loading && listComment.next !== null && listComment.results.length !== listComment.count) {
      getListCommentAction();
    }
  };

  const onItemPress = (item: IComment) => {
    const { user } = item;
    if (user.user_id == currentUserId) {
      NavigationActionsService.push(PROFILE, {}, true);
    } else {
      NavigationActionsService.showLoading();
      dispatch(getProfileDetail({
        user_id: user.user_id,
        onSuccess: () => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.push(PROFILE_OTHERS, { user_id: user.user_id }, true);
          }, 500);
        },
        onFail: error => {
          setTimeout(() => {
            NavigationActionsService.hideLoading();
            NavigationActionsService.showErrorPopup(error);
          }, 500);
        }
      }));
    }
  };

  const renderFooter = () => {
    return loading && listComment.count > 0 ? <ActivityIndicator color={colors.WHITE} /> : null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={listComment.results}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={renderFooter}
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
      />
    </View>
  );
};

export { Comments };
