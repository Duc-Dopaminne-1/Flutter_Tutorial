import {
  useGetCurrentSubscriptionPackageLazyQuery,
  useGetSubscriptionByIdLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../../assets/constants';
import {calculatePackageValidDaysLeft, mapSubscriptionPackageDetailToState} from '../Selectors';

const mapCurrentSubscriptionStatusToState = status => {
  if (!status) {
    return {};
  }
  const {
    subscriptionPackageId: currentPackageId = '',
    isActive: isCurrentPackageActive = false,
    subscriptionPackageStartTime: currentPackageStartTime = 0,
    subscriptionPackageEndTime: currentPackageEndTime = 0,
    agentSubscriptionPackageId = '',
    agentSubscriptionPackageStatus = '',
  } = status;
  const validDaysLeft = calculatePackageValidDaysLeft(currentPackageEndTime, true);
  return {
    isCurrentPackageActive,
    currentPackageStartTime,
    currentPackageEndTime,
    validDaysLeft,
    currentPackageId,
    agentSubscriptionPackageId,
    agentSubscriptionPackageStatus,
  };
};

const useGetAgentCurrentSubscriptionPackage = ({
  onSuccessGetCurrentSubPackage,
  onSuccessGetCurrentSubPackageDetail,
}) => {
  const handleOnGetSubscriptionPackageById = data => {
    const packageDetail = data.subscriptionPackageDto ?? null;
    if (packageDetail) {
      const details = mapSubscriptionPackageDetailToState(packageDetail);
      onSuccessGetCurrentSubPackageDetail && onSuccessGetCurrentSubPackageDetail(details);
    }
  };

  const {startApi: getSubscriptionPackageById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSubscriptionByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getSubscriptionPackageById',
    onSuccess: handleOnGetSubscriptionPackageById,
    showSpinner: false,
  });

  const handleOnGetCurrentSubscriptionPackage = data => {
    const packageStatus = data.agentSubscriptionPackageDto ?? null;
    if (packageStatus) {
      const subscriptionStatus = mapCurrentSubscriptionStatusToState(packageStatus);
      const packageId = packageStatus?.subscriptionPackageId ?? '';
      onSuccessGetCurrentSubPackage && onSuccessGetCurrentSubPackage(subscriptionStatus);
      getSubscriptionPackageById({variables: {packageId}});
    }
  };

  const {startApi: getAgentCurrentSubscriptionPackage} = useGraphqlApiLazy({
    graphqlApiLazy: useGetCurrentSubscriptionPackageLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'getActiveAgentSubscriptionPackageByCurrentUser',
    onSuccess: handleOnGetCurrentSubscriptionPackage,
    showSpinner: false,
  });

  const startGetAgentCurrentSubscriptionPackageDetails = () => {
    getAgentCurrentSubscriptionPackage();
  };

  return [startGetAgentCurrentSubscriptionPackageDetails];
};

export default useGetAgentCurrentSubscriptionPackage;
