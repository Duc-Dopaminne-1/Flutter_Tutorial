import isEmpty from 'lodash/isEmpty';
import {useState} from 'react';

import {
  GetFoProjectsOfInvestorResponse,
  SearchFoInvestorResponse,
  SearchInvestorOrderBy,
  SearchProjectInfoDto,
  useGetFoInvestorByCodeLazyQuery,
  useGetFoProjectsOfInvestorByIdLazyQuery,
  useSearchOtherInvestorsLazyQuery,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {CONSTANTS, FETCH_POLICY} from '../assets/constants';
import {useMount} from '../screens/commonHooks';
import {InvestorDetailTypes} from '../screens/Pages/InvestorInformation/types';
import {extractAddressData} from '../utils/DataProcessUtil';

const mapDataToDetail = (data: InvestorDto) => {
  const investorData = {
    introduction: {
      logo: data?.logo,
      name: data?.investorName,
      address: extractAddressData(data?.address),
      website: data?.website,
      phone: data?.phoneNumber,
      dateOfEstablishment: data?.establishmentDate,
      charterCapital: data?.charterCapital,
      areas: data?.areas,
      introduce: data?.introduce,
      projectCountByStatuses: data?.projectCountByStatuses,
    },
    activityImages: !isEmpty(data?.activityImages) ? JSON.parse(data?.activityImages) : '',
  };

  return investorData;
};

const useGetDetailInvestor = (code, investorId) => {
  const [investorDetail, setDetail] = useState({});
  const [projectOfInvestor, setProjectOfInvestor] = useState({});

  const [execute, {data: otherInvestorData}] = useSearchOtherInvestorsLazyQuery({
    notifyOnNetworkStatusChange: true,
    ...FETCH_POLICY.CACHE_AND_NETWORK,
  });

  const {startApi: getProjectOfInvestor} = useGraphqlApiLazy({
    graphqlApiLazy: useGetFoProjectsOfInvestorByIdLazyQuery,
    dataField: 'getFOProjectsOfInvestorById',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: (res): GetFoProjectsOfInvestorResponse => {
      if (res.errorCode === 0) {
        const data = res?.projectDtos;
        setProjectOfInvestor(data);
      }
    },
  });

  const {startApi: getInvestorDetail} = useGraphqlApiLazy({
    graphqlApiLazy: useGetFoInvestorByCodeLazyQuery,
    dataField: 'getFOInvestorByCode',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    onSuccess: res => {
      if (res.errorCode === 0) {
        const data = mapDataToDetail(res?.investorInfoDto);
        setDetail(data);
      }
    },
  });

  useMount(() => {
    execute({
      variables: {
        input: {
          page: 1,
          pageSize: CONSTANTS.DEFAULT_INVESTOR_PAGE_SIZE,
          orderBy: SearchInvestorOrderBy.Investorlatest,
        },
      },
    });
    getProjectOfInvestor({
      variables: {
        input: {
          foInvestorId: investorId,
          page: 1,
          pageSize: 8,
        },
      },
    });
    getInvestorDetail({
      variables: {
        foInvestorCode: code,
      },
    });
  });

  const data: {
    otherInvestorData: SearchFoInvestorResponse,
    investorDetail: InvestorDetailTypes,
    projectOfInvestor: Array<SearchProjectInfoDto>,
  } = {
    otherInvestorData,
    investorDetail,
    projectOfInvestor,
  };

  return data;
};

export default useGetDetailInvestor;
