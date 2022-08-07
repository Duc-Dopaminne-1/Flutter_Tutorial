import {useState} from 'react';

import {
  GetSummaryByCrawlerTrackingStatusResponse,
  useGetSummaryByCrawlerTrackingStatusLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {useMount} from '../../commonHooks';

const STATUS_ID_AGREE = '643ddae4-f7fa-43bf-a496-005fe3989c3b';
const STATUS_ID_Refuse = 'baafbdf3-caf9-4802-a166-a2794fe441d3';
const STATUS_ID_NO_RESPONSE = 'b2ba8c32-9224-4da6-a12e-54e0c4c9db18';

const initSummary = {
  distributed: 0,
  posted: 0,
  rejected: 0,
  progressing: 0,
};

export const useGetSummary = () => {
  const [summary, setSummary] = useState(initSummary);
  const {startApi} = useGraphqlApiLazy({
    showSpinner: false,
    graphqlApiLazy: useGetSummaryByCrawlerTrackingStatusLazyQuery,
    dataField: 'summaryByCrawlerTrackingStatus',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: (response: GetSummaryByCrawlerTrackingStatusResponse) => {
      const getCountByStatusId = statusId => {
        return (
          response?.status?.find(value => value.crawlerTrackingStatusId === statusId)?.count ?? 0
        );
      };
      setSummary({
        distributed: response?.totalCount ?? 0,
        posted: getCountByStatusId(STATUS_ID_AGREE),
        rejected: getCountByStatusId(STATUS_ID_Refuse),
        progressing: getCountByStatusId(STATUS_ID_NO_RESPONSE),
      });
    },
  });

  useMount(() => {
    getSummary();
  });

  const getSummary = () => {
    startApi();
  };

  return {summary, getSummary};
};
