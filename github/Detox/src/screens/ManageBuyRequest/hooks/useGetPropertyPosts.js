import {useContext} from 'react';

import {useGetPropertyPostsLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {CONTACT_TRADING_TYPE, FETCH_POLICY} from '../../../assets/constants';
import {ContactTradingContext} from '../useContactTrading';

const useGetPropertyPosts = ({onSuccess = () => {}, contactType = CONTACT_TRADING_TYPE.BUY}) => {
  const {setCreateContactPropertyInfo} = useContext(ContactTradingContext);
  const onSuccessGetPropertyPosts = data => {
    const posts = data?.edges;
    const isSearchForRent = contactType === CONTACT_TRADING_TYPE.RENT;
    const isValidPostForRent =
      isSearchForRent && !posts[0]?.propertyPostForRentDto?.isRented && posts[0]?.forRent;
    const isValidPostForBuy = !isSearchForRent && posts[0]?.forSale && !posts[0]?.isSold;
    if (posts && posts.length > 0 && (isValidPostForBuy || isValidPostForRent)) {
      setCreateContactPropertyInfo(posts[0]);
      onSuccess(posts[0]);
    } else {
      onSuccess(null);
    }
  };
  const {startApi: getPropertyPostById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPropertyPostsLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'propertyPosts',
    onSuccess: onSuccessGetPropertyPosts,
    showSpinner: true,
  });

  const startGetPropertyPosts = query => {
    getPropertyPostById(query);
  };
  return [startGetPropertyPosts];
};

export default useGetPropertyPosts;
