import {useEffect, useState} from 'react';

import {useCheckPropertyPostAvailableForBookingBySeasonIdLazyQuery} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {useCheckLockSlot} from '../useProjectActions';

export const useCheckBooking = ({onSuccess, onError}) => {
  const [state, setState] = useState({});
  const [isAvailable, setAvailable] = useState(false);
  const [isLocked, setLocked] = useState(true);

  const {startApi: checkAvailableSlot, loading: isCheckingAvailable} = useGraphqlApiLazy({
    showSpinner: true,
    graphqlApiLazy: useCheckPropertyPostAvailableForBookingBySeasonIdLazyQuery,
    dataField: 'checkPropertyPostAvailableForBookingBySeasonId',
    queryOptions: {...FETCH_POLICY.NO_CACHE},
    onSuccess: response => {
      setAvailable(response.isAvailable);
    },
  });

  const {checkLockedSlot, loading: isCheckingLocked} = useCheckLockSlot({
    onSuccess: response => {
      setLocked(response.isLocked);
      checkAvailableSlot({
        variables: {
          input: {
            saleSeasonId: state.saleSeasonId,
            propertyPostId: state.propertyPost.propertyPostId,
          },
        },
      });
    },
    onError: errorMessage => {
      onError(errorMessage);
    },
  });

  useEffect(() => {
    if (isAvailable && !isLocked) {
      setAvailable(false);
      setLocked(true);
      onSuccess(state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAvailable, isLocked, isCheckingAvailable, isCheckingLocked]);

  const checkBooking = ({propertyPost, saleSeasonId}) => {
    setState({propertyPost, saleSeasonId});
    checkLockedSlot({saleSeasonId});
  };

  return {checkBooking};
};
