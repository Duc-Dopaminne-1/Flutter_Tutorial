import {useState} from 'react';

import {
  OffsetPagingOfRequestTypeDto,
  RequestTypeDto,
  useGetRequestTypesLazyQuery,
} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {CONSULT_BANKLOAN_SUPPORT_TYPE, FETCH_POLICY, LIST_PLUS_SERVICES} from '../assets/constants';
import {IMAGES} from '../assets/images';

export type PlusServiceProps = {
  id: Required<String>,
  icon: Required<String>,
  name: Required<String>,
  previewImageUrl: String,
  header: Required<String>,
  isLoanService: Boolean,
  typeId: String,
};

export const mapServicesUi = (services: Array<RequestTypeDto>) => {
  const mapServiceById = id => {
    return LIST_PLUS_SERVICES.find(item => item.id === id);
  };
  const displayServices: PlusServiceProps = [];
  services.forEach(service => {
    const serviceMapped = mapServiceById(service.requestTypeId);
    if (serviceMapped) {
      displayServices.push({
        id: service.requestTypeName,
        icon: serviceMapped.icon,
        name: serviceMapped.description,
        previewImageUrl: IMAGES.HCM,
        header: serviceMapped.description,
        isLoanService: service.requestTypeName === CONSULT_BANKLOAN_SUPPORT_TYPE,
        typeId: service.requestTypeId,
      });
    }
  });

  return displayServices;
};

export const useGetRequestTypes = () => {
  const [services, setServices]: [RequestTypeDto, Function] = useState([]);
  const {startApi, loading} = useGraphqlApiLazy({
    graphqlApiLazy: useGetRequestTypesLazyQuery,
    dataField: 'requestTypes',
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    showSpinner: false,
    onSuccess: (response: OffsetPagingOfRequestTypeDto) => {
      setServices(mapServicesUi(response?.edges));
    },
    onError: () => {
      setServices(null);
    },
  });
  return {
    getServices: () => {
      startApi({variables: {orderBy: {sortOrder: 'ASC'}}});
    },
    services,
    loading,
  };
};
