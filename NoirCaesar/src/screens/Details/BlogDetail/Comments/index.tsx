import styles from './styles';
import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '@src/constants/vars';
import { useDispatch, useSelector } from 'react-redux';
import { usePrevious } from '@src/hooks/usePrevious';
import { RootState } from '@src/types/types';
import { IPagination } from '@goldfishcode/noir-caesar-api-sdk/libs/type';
import { IComment } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment/models';
import { getListComment } from '@src/modules/comment/actions';
import { ModelEnum } from '@goldfishcode/noir-caesar-api-sdk/libs/api/comment';
import { CommentItem } from '@src/components/FlatListItem/CommentItem';
import NavigationActionsService from '@src/navigation/navigation';
import { PROFILE, PROFILE_OTHERS } from '@src/constants/screenKeys';
import { getProfileDetail } from '@src/modules/user/actions';

interface Props {
  blog_id: string;
  bindFunctionRefreshComments?: (bindingFunc: () => void) => void;
}

let isFirstLoad = true;

const Comments = (props: Props) => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(false);
  const previousLoading = usePrevious(loading);
  const currentUserId = useSelector<RootState, string>((state: RootState) => state.auth.userData.user_id);
  const listComment = useSelector<RootState, IPagination<IComment>>((state: RootState) => state.comment);

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
          model: ModelEnum.Blog,
          model_id: props.blog_id,
          page: page,
          limit: 10,
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
