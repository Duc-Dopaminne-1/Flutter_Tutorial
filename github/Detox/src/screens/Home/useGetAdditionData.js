import {find, isEmpty} from 'lodash';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {getUserId} from '../../appData/user/selectors';
import {DEFAULT_PAGE_SIZE, FETCH_POLICY} from '../../assets/constants';
import JsonDataUtils from '../../utils/JsonDataUtils';
import useDeepCompareEffect from '../../utils/useDeepCompareEffect';

const QUERY_OPTIONS = {
  ...FETCH_POLICY.NETWORK_ONLY,
  onCompleted: () => {},
};

const FETCH_TYPE = {
  FETCH_MORE: 'FETCH_MORE',
  REFRESH: 'REFRESH',
};

const extractIdList = (previousIds, currentItems, idKey) => {
  const idMapper = item => item[idKey];
  let ids = [];
  let fetchType = FETCH_TYPE.REFRESH;
  if (currentItems.length <= DEFAULT_PAGE_SIZE) {
    ids = currentItems.map(idMapper);
  } else {
    const notHaveAdditionalDataYet = item => !find(previousIds, {[idKey]: item[idKey]});
    ids = currentItems.filter(notHaveAdditionalDataYet).map(idMapper);
    fetchType = FETCH_TYPE.FETCH_MORE;
  }
  return {ids, fetchType};
};

const useGetAdditionData = ({useLazyQuery, responseDataKey, idKey, idQueryParams, updatedItem}) => {
  const [items, setItems] = useState([]);
  const [additionalData, setAdditionalData] = useState([]);
  const userId = useSelector(getUserId);
  const [currentFetchType, setFetchType] = useState(FETCH_TYPE.REFRESH);
  const [execute, {data}] = useLazyQuery(QUERY_OPTIONS);

  useDeepCompareEffect(() => {
    if (!isEmpty(updatedItem)) {
      const found = additionalData.findIndex(it => updatedItem[idKey] === it[idKey]);
      if (found !== -1) {
        const currentItem = additionalData[found];
        additionalData[found] = {...currentItem, ...updatedItem};
        setAdditionalData([...additionalData]);
      }
    }
  }, [updatedItem]);

  useEffect(() => {
    if (isEmpty(items)) {
      return;
    }
    const {ids, fetchType} = extractIdList(additionalData, items, idKey);
    if (!isEmpty(ids)) {
      setFetchType(fetchType);
      execute({
        variables: {
          input: {
            userId,
            [idQueryParams]: JsonDataUtils.stringifyJSONArray(ids),
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useDeepCompareEffect(() => {
    if (data) {
      const temps = data?.[responseDataKey]?.edges ?? [];
      if (currentFetchType === FETCH_TYPE.REFRESH) {
        setAdditionalData([...temps]);
      } else {
        setAdditionalData([...additionalData, ...temps]);
      }
    }
  }, [data]);

  return [additionalData, setItems];
};

export default useGetAdditionData;
