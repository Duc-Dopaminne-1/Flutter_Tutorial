import {useSelector} from 'react-redux';

import {useGetAvatarLazyQuery} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../appData/user/selectors';
import {FETCH_POLICY} from '../assets/constants';
import {getImageBySizeFromServer, IMAGE_SIZES} from '../utils/ImageUtil';

export const useGetAvatar = onSuccess => {
  const userId = useSelector(getUserId);

  const onSuccessGetAvatar = data => {
    const profilePhoto = getImageBySizeFromServer(data?.userDto?.profilePhotos, IMAGE_SIZES.LARGE);
    if (profilePhoto && onSuccess) {
      onSuccess(profilePhoto);
    }
  };

  const {startApi: getUserAvatar} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAvatarLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'userById',
    onSuccess: onSuccessGetAvatar,
  });

  const getAvatar = () => {
    getUserAvatar({variables: {userId}});
  };

  return {getAvatar};
};
