import {
  SearchPropertyPostOrderBy,
  useSearchPropertyPostsForRentLazyQuery,
  useSearchPropertyPostsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';

const START_PAGE = 1;
const PAGE_SIZE = 50;

const useSearchPropertyPosts = ({onSuccess = () => {}}) => {
  const onSuccessGetPropertyPosts = data => {
    const posts = data?.propertyPostInfoDtos;
    const totalCount = data?.totalCount ?? 0;
    onSuccess({posts: posts, totalCount: totalCount});
  };
  const {startApi: searchPropertyPosts} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchPropertyPostsLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'searchPropertyPosts',
    onSuccess: onSuccessGetPropertyPosts,
    showSpinner: true,
  });

  const startSearchPropertyPosts = searchCriteria => {
    const queryParams = {
      input: {
        ...searchCriteria,
        orderBy: SearchPropertyPostOrderBy.Latest,
        pageSize: PAGE_SIZE,
        page: START_PAGE,
      },
    };

    const queryOptions = {
      variables: {
        ...queryParams,
      },
    };
    searchPropertyPosts(queryOptions);
  };
  return {startSearchPropertyPosts};
};

export const useSearchPropertyPostsForRent = ({onSuccess = () => {}}) => {
  const onSuccessGetPropertyPostsForRent = data => {
    const posts = data?.propertyPostForRentInfoDtos;
    const totalCount = data?.totalCount ?? 0;
    onSuccess({posts: posts, totalCount: totalCount});
  };
  const {startApi: searchPropertyPostsForRent} = useGraphqlApiLazy({
    graphqlApiLazy: useSearchPropertyPostsForRentLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'searchPropertyPostsForRent',
    onSuccess: onSuccessGetPropertyPostsForRent,
    showSpinner: true,
  });

  const startSearchPropertyPostsForRent = searchCriteria => {
    const queryParams = {
      input: {
        ...searchCriteria,
        orderBy: SearchPropertyPostOrderBy.Latest,
        pageSize: PAGE_SIZE,
        page: START_PAGE,
      },
    };

    const queryOptions = {
      variables: {
        ...queryParams,
      },
    };
    searchPropertyPostsForRent(queryOptions);
  };
  return {startSearchPropertyPostsForRent};
};

export default useSearchPropertyPosts;
