import {useContext} from 'react';
import {useSelector} from 'react-redux';

import {
  useGetC2CPropertyPostsViewedByCurrentUserFoLazyQuery,
  useGetC2CPropertyPostViewedByIdsForFoLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {getVisitedItemsC2C} from '../../../appData/c2c/selector';
import {LastModifiedContext} from '../../../appData/lastModifiedContext/useLastModifiedContext';
import {updateSingleItem} from '../../../components/LazyList';
import useMergeState from '../../../hooks/useMergeState';
import {mapIsFollowedIntoItem} from '../../../utils/MapDataUtils';
import {useLogin} from '../../Auth/useLogin';
import {mapPropertyC2CGuarantee} from '../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../Home/useFormatPrice';
import {useGetUserFollowed} from './useGetUserFollowed';

export const useGetC2CVisitedPosts = ({currentPropertyPostId}) => {
  const {notLoggedIn} = useLogin();
  const {updateProperty} = useContext(LastModifiedContext);

  const {formatPrice} = useFormatPrice();
  const visitedIdItems = useSelector(getVisitedItemsC2C);
  const [state, setState] = useMergeState({
    items: [],
    page: 1,
    pageSize: 5,
  });
  const {getListUserFollowed} = useGetUserFollowed();

  const {startApi: startGetPostsViewedByCurrentUser, loading: loadingCurrentUser} =
    useGraphqlApiLazy({
      graphqlApiLazy: useGetC2CPropertyPostsViewedByCurrentUserFoLazyQuery,
      dataField: 'getC2CPropertyPostsViewedByCurrentUserFO',
      onSuccess: async (data: Array<C2CPropertyPostViewedDto>) => {
        getListUserFollowed(data.edges, listFollowed => {
          const mappedData = data.edges.map(item => mapPropertyC2CGuarantee(item, formatPrice));
          const listFollowIds = listFollowed.map(e => e.propertyPostId);
          const mappedIsFollow = mapIsFollowedIntoItem({
            listFollowIds,
            listItems: mappedData,
            keyId: 'propertyPostId',
          });

          setState({
            items: state.page !== 1 ? [...state.items, ...mappedIsFollow] : mappedIsFollow,
          });
        });
      },
    });

  const {startApi: startGetPostViewedByIds, loading: loadingByIds} = useGraphqlApiLazy({
    graphqlApiLazy: useGetC2CPropertyPostViewedByIdsForFoLazyQuery,
    dataField: 'getC2CPropertyPostViewedByIdsForFO',
    onSuccess: data => {
      const mappedData = data.c2CPropertyPostViewedDtos.map(e =>
        mapPropertyC2CGuarantee(e, formatPrice),
      );
      setState({items: state.page !== 1 ? [...state.items, ...mappedData] : mappedData});
    },
  });

  const getVisitedPosts = (pageSize = 5, page = 1) => {
    if (!notLoggedIn) {
      setState({page, pageSize, loading: loadingCurrentUser});
      startGetPostsViewedByCurrentUser({
        variables: {
          pageSize,
          page,
        },
      });
    } else {
      const propertyPostIds = visitedIdItems.filter(e => e !== currentPropertyPostId).toString();
      if (propertyPostIds) {
        startGetPostViewedByIds({
          variables: {
            getC2CPropertyPostViewedByIdsForFOInput: {
              propertyPostIds,
            },
          },
        });
      }
    }
  };

  const loadMore = () => {
    getVisitedPosts(state.pageSize, state.page + 1);
  };

  const onViewMoreVisitedPosts = () => {};

  const updateItem = updatedItem => {
    updateProperty(updatedItem);
    setState({items: [...updateSingleItem(updatedItem, state.items, 'propertyPostId')]});
  };
  const actionInteractionVisitedItem = {updateItem};

  return {
    loadMore,
    getVisitedPosts,
    items: state.items,
    loading: loadingCurrentUser || loadingByIds,
    isLogin: !notLoggedIn,
    onViewMoreVisitedPosts,
    actionInteractionVisitedItem,
  };
};
