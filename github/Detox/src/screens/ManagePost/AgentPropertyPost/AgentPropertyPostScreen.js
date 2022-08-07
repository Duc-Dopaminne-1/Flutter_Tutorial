import React from 'react';

import {useGetCurPropertyPostsByAgentIdForPublicLazyQuery} from '../../../api/graphql/generated/graphql';
import {DEFAULT_PAGE_SIZE, EMPTY_STRING, ITEM_TYPE} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import BaseScreen from '../../../components/BaseScreen';
import LazyList, {PAGING_TYPE} from '../../../components/LazyList';
import PropertyItem, {ItemHeight} from '../../../components/PropertyItem';
import {mapProperty} from '../../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../../Home/useFormatPrice';
import ScreenIds from '../../ScreenIds';
import PropertyPostUtils from '../PropertyPostUtils';

const AgentPropertyPostScreen = ({navigation, route}) => {
  const {agentId} = route?.params || {};
  const {formatPrice} = useFormatPrice();
  const queryParam = {
    agentId: agentId,
    first: DEFAULT_PAGE_SIZE,
    after: EMPTY_STRING,
    where: null,
  };

  const getPropsForRent = item => {
    return {
      showForRentBanner: true,
      showPriceDetailForRent: !item?.forSale,
      isShowStatus: true,
    };
  };

  const onPressProperty = item => {
    navigation.navigate(ScreenIds.ViewPropertyPost, {
      propertyPostId: item?.propertyPostId,
      viewByOtherMode: true,
    });
  };

  return (
    <BaseScreen title={translate(STRINGS.AGENT_PROPERTY_POST)}>
      <LazyList
        renderItem={({item, ...otherProps}) => {
          const data = mapProperty(item, formatPrice);
          const otherPropsForRent = getPropsForRent(item);
          return (
            <PropertyItem
              onPress={onPressProperty}
              {...otherProps}
              itemType={ITEM_TYPE.full}
              showBrokenInfo={false}
              {...data}
              {...otherPropsForRent}
              // style={projectPaddingStyle(otherProps.index, false)}
            />
          );
        }}
        useQuery={useGetCurPropertyPostsByAgentIdForPublicLazyQuery}
        queryOptions={{
          variables: {
            ...queryParam,
          },
        }}
        mapToUiModel={PropertyPostUtils.mapPropertyItem}
        itemHeight={item => ItemHeight({item: item.node, isShowBroker: false})}
        uniqueKey={'propertyPostId'}
        extractArray={response => response?.curPropertyPostsByAgentIdForPublic?.edges ?? []}
        extractTotalCount={response =>
          response?.curPropertyPostsByAgentIdForPublic?.totalCount ?? 0
        }
        pagingType={PAGING_TYPE.CURSOR2}
      />
    </BaseScreen>
  );
};

export default AgentPropertyPostScreen;
