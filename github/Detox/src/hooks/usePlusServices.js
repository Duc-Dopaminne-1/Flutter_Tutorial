import {useNavigation} from '@react-navigation/native';
import {Linking} from 'react-native';

import {useGetPlusServicesLazyQuery} from '../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../api/graphql/useGraphqlApiLazy';
import {getStaticPageUrl} from '../api/userApi/staticPagesApi';
import {FETCH_POLICY} from '../assets/constants';
import {
  PLUS_SERVICES_AFTER_BUYING,
  PLUS_SERVICES_BEFORE_BUYING,
  PLUS_SERVICES_WHILE_BUYING,
} from '../configs/Home';
import {PLUS_SERVICES, TPF_PLUS_SERVICES} from '../configs/PlusServices';
import {useMount} from '../screens/commonHooks';
import ScreenIds from '../screens/ScreenIds';
import {useTPFClient} from '../screens/TPF/hooks/useTPFClient';
import {filterShowPlusServices} from '../utils/MapDataUtils';
import useMergeState from './useMergeState';

const initialState = {
  beforeBuying: PLUS_SERVICES_BEFORE_BUYING,
  whileBuying: PLUS_SERVICES_WHILE_BUYING,
  afterBuying: PLUS_SERVICES_AFTER_BUYING,
  all: PLUS_SERVICES,
  default: [],
};

const usePlusServices = () => {
  const navigation = useNavigation();
  const tpfClient = useTPFClient();
  const [state, setState] = useMergeState(initialState);

  const {startApi} = useGraphqlApiLazy({
    graphqlApiLazy: useGetPlusServicesLazyQuery,
    dataField: 'plusServices',
    queryOptions: {...FETCH_POLICY.CACHE_AND_NETWORK},
    showSpinner: false,
    onSuccess: (response: OffsetPagingOfRequestTypeDto) => {
      const listPlusServices = response?.edges;
      const beforeBuying = filterShowPlusServices(initialState.beforeBuying, listPlusServices),
        whileBuying = filterShowPlusServices(initialState.whileBuying, listPlusServices),
        afterBuying = filterShowPlusServices(initialState.afterBuying, listPlusServices),
        all = filterShowPlusServices(initialState.all, listPlusServices);
      setState({
        beforeBuying,
        whileBuying,
        afterBuying,
        all,
        default: listPlusServices,
      });
    },
  });

  const getPlusServices = () => {
    startApi({variables: {orderBy: {sortOrder: 'ASC'}}});
  };

  useMount(getPlusServices);

  const openServiceDetail = item => {
    const url = getStaticPageUrl({
      objectType: 'PlusServices',
      pageType: item.requestTypeId,
    });
    Linking.openURL(url);
  };

  const onLoginPress = () => {
    navigation.navigate(ScreenIds.ManageTPF);
  };

  const getTpfData = item => {
    const data = TPF_PLUS_SERVICES.find(i => i.requestTypeId === item.requestTypeId);
    return data;
  };

  const onPressItem = item => {
    const data = getTpfData(item);
    if (data?.tpf) {
      tpfClient.showProduct(data.tpf);
      return;
    }
    openServiceDetail(data);
  };

  return {onPressItem, onLoginPress, plusServices: state};
};

export default usePlusServices;
