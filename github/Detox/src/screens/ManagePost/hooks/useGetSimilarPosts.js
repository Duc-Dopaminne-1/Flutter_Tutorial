import {useState} from 'react';

import {
  GetC2CSimilarPostsResponse,
  SearchPropertyPostOrderBy,
  useGetC2CSimilarPostsLazyQuery,
} from '../../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../../assets/constants';
import {mapPropertyC2CGuarantee} from '../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../Home/useFormatPrice';

const initalPage = 1;

export const useGetC2CSimilarPosts = () => {
  const {formatPrice} = useFormatPrice();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: initalPage,
    pageSize: 6,
  });
  const [params, setParams] = useState({});

  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetC2CSimilarPostsLazyQuery,
    dataField: 'getC2CSimilarPosts',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    onSuccess: (data: GetC2CSimilarPostsResponse) => {
      if (data.errorCode === 0 && data?.propertyPostInfoDtos?.length > 0) {
        const mappedData = data.propertyPostInfoDtos.map(e =>
          mapPropertyC2CGuarantee(e, formatPrice),
        );

        if (pagination.page !== initalPage) {
          setItems([...items, ...mappedData]);
        } else {
          setItems(mappedData);
        }
      }
    },
  });

  const getSimilarPosts = ({
    propertyPostId,
    propertyType,
    cityId,
    districtId,
    pageSize = 6,
    page = 1,
  }) => {
    setPagination({page, pageSize});

    const propertyTypeList = [];
    const place = {};

    if (propertyType) {
      propertyTypeList.push({id: propertyType});
    }

    if (cityId) {
      place.CityId = cityId;
    }

    if (districtId) {
      place.DistrictIds = [districtId];
    }

    const input = {
      propertyPostId,
      propertyType,
      cityId,
      districtId,
    };
    setParams(input);

    startApi({
      variables: {
        input: {
          pageSize,
          page,
          orderBy: SearchPropertyPostOrderBy.Latest,
          placeJson: JSON.stringify([place]),
          propertyPostId,
          propertyTypeJson: JSON.stringify(propertyTypeList),
        },
      },
    });
  };

  const loadMore = () => {
    getSimilarPosts({
      propertyPostId: params?.propertyPostId,
      propertyType: params?.propertyType,
      cityId: params?.cityId,
      districtId: params?.districtId,
      pageSize: pagination.pageSize,
      page: pagination.page + 1,
    });
  };

  return {
    getSimilarPosts,
    items,
    loading,
    loadMore,
  };
};
