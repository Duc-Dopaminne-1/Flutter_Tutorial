import {
  useGetAgentLastSubscriptionPackageLazyQuery,
  useGetSubscriptionByIdLazyQuery,
} from '../../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../../api/graphql/useGraphqlApiLazy';
import {
  FETCH_POLICY,
  NAVIGATION_ANIMATION_DURATION,
  SUBSCRIPTION_PACKAGE_ID,
} from '../../../../assets/constants';
import {calculatePackageValidDaysLeft, mapSubscriptionPackageDetailToState} from '../Selectors';

const mapLastSubscriptionToState = detail => {
  if (!detail) {
    return {};
  }
  const {
    subscriptionPackageId: lastSubscritpionPackageId = '',
    isActive: isLastPackageActive = false,
    subscriptionPackageStartTime: lastPackageStartTime = 0,
    subscriptionPackageEndTime: lastPackageEndTime = 0,
    agentSubscriptionPackageId = '',
  } = detail;
  const lastPackageValidDays = calculatePackageValidDaysLeft(
    lastPackageEndTime,
    isLastPackageActive,
  );
  return {
    isLastPackageActive,
    lastPackageStartTime,
    lastPackageEndTime,
    lastPackageValidDays,
    lastSubscritpionPackageId,
    agentSubscriptionPackageId,
  };
};

const useGetAgentLastSubscriptionPackage = ({
  onSuccessGetLastSubPackage,
  onSuccessGetNextSubPackageDetails,
  onSuccessGetLastSubPackageDetail,
}) => {
  const handleOnGetLastSubscriptionPackageById = data => {
    const packageDetail = data.subscriptionPackageDto ?? null;
    if (packageDetail) {
      const details = mapSubscriptionPackageDetailToState(packageDetail);
      onSuccessGetLastSubPackageDetail(details);
    }
  };

  const handleOnGetNextSubscriptionPackageById = data => {
    const packageDetail = data.subscriptionPackageDto ?? null;
    if (packageDetail) {
      const details = mapSubscriptionPackageDetailToState(packageDetail);
      onSuccessGetNextSubPackageDetails(details);
    }
  };

  const {startApi: getLastSubscriptionPackageById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSubscriptionByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getSubscriptionPackageById',
    onSuccess: handleOnGetLastSubscriptionPackageById,
    showSpinner: false,
  });

  const {startApi: getNextSubscriptionPackageById} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSubscriptionByIdLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getSubscriptionPackageById',
    onSuccess: handleOnGetNextSubscriptionPackageById,
    showSpinner: false,
  });

  const handleOnGetAgentLastSubscritpionPackage = data => {
    const packageDetail = data.agentSubscriptionPackageDto ?? null;
    if (packageDetail) {
      const lastSubscritpionDetail = mapLastSubscriptionToState(packageDetail);
      const packageId = packageDetail?.subscriptionPackageId ?? '';
      const isPackageTrial = packageId === SUBSCRIPTION_PACKAGE_ID.TRIAL;
      onSuccessGetLastSubPackage(lastSubscritpionDetail);
      getLastSubscriptionPackageById({variables: {packageId}});
      setTimeout(() => {
        getNextSubscriptionPackageById({
          variables: {packageId: isPackageTrial ? SUBSCRIPTION_PACKAGE_ID.PREMIUM : packageId},
        });
      }, NAVIGATION_ANIMATION_DURATION);
    }
  };

  const {startApi: getAgentLastSubscriptionPackage} = useGraphqlApiLazy({
    graphqlApiLazy: useGetAgentLastSubscriptionPackageLazyQuery,
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    dataField: 'getAgentLastSubscriptionPackageByCurrentUser',
    onSuccess: handleOnGetAgentLastSubscritpionPackage,
    showSpinner: false,
  });

  const startGetAgentLastSubscriptionPackageDetails = () => {
    getAgentLastSubscriptionPackage();
  };

  return [startGetAgentLastSubscriptionPackageDetails];
};

export default useGetAgentLastSubscriptionPackage;
