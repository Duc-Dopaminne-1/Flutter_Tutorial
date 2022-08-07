/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from 'react';

import {
  PropertyPostsByBlockNameDto,
  SaleSeasonBlockFloorInfo,
  SimpleBlockInfo,
  useGetPropertyPostsBasketLazyQuery,
  useGetSaleSeasonBlocksAndFloorsLazyQuery,
  usePropertyPostsByBlockNameAdvancedLazyQuery,
  usePropertyPostsByBlockNameForTransferAdvancedLazyQuery,
} from '../../api/graphql/generated/graphql';
import {useGraphqlApiLazy} from '../../api/graphql/useGraphqlApiLazy';
import {FETCH_POLICY} from '../../assets/constants';
import useDeepCompareEffect from '../../utils/useDeepCompareEffect';
import {SLOT_SELECTION_TYPE} from './SlotSelectionUtil';

const getPropertyByBlockSetting = (type, notLoggedIn) => {
  let useQuery = usePropertyPostsByBlockNameForTransferAdvancedLazyQuery;
  let dataField = 'propertyPostsByBlockNameForTransferAdvanced';
  if (type === SLOT_SELECTION_TYPE.NORMAL) {
    if (notLoggedIn) {
      useQuery = useGetPropertyPostsBasketLazyQuery;
      dataField = 'propertyPostsBasket';
    } else {
      useQuery = usePropertyPostsByBlockNameAdvancedLazyQuery;
      dataField = 'propertyPostsByBlockNameAdvanced';
    }
  }
  return {
    graphqlApiLazy: useQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField,
  };
};

const initialState = {
  blocks: [],
  blockData: {},
  isLoading: true,
};

const useGetSlotData = ({
  shouldRefresh,
  saleSeasonId,
  currentBlock,
  filterInput,
  propertyTypeId,
  type = SLOT_SELECTION_TYPE.NORMAL,
  previousProps,
  notLoggedIn,
}) => {
  const [state, setState] = useState(initialState);
  const propertyByBlockSetting = getPropertyByBlockSetting(type, notLoggedIn);
  const onGetBlockSuccess = (data: SaleSeasonBlockFloorInfo) => {
    const blocks = data?.blocksInfo ?? [];
    const projectInfo = data?.projectInfo;
    setState({...state, blocks, projectInfo, isLoading: false});
  };

  const getPropertiesSuccess = (data: PropertyPostsByBlockNameDto) => {
    const blocks: SimpleBlockInfo[] = state?.blocks ?? [];
    const blockData: PropertyPostsByBlockNameDto =
      (notLoggedIn ? data?.propertyPostsByBlockNameDto : data) ?? {};
    const floors = blocks.find(block => block.blockName === currentBlock)?.floorsInfo;

    const getFloorPhoto = floorName => {
      if (floorName) {
        return floors.find(floor => floor.floor === floorName)?.photo;
      } else {
        return floors?.[0]?.photo;
      }
    };

    const result: PropertyPostsByBlockNameDto = {
      ...blockData,
      propertyPosts: blockData?.propertyPosts?.map(item => ({
        ...item,
        floorPlanPhoto: getFloorPhoto(item.floor),
      })),
    };

    setState({...state, isLoading: false, blockData: result});
  };

  const {startApi: getBlocks} = useGraphqlApiLazy({
    graphqlApiLazy: useGetSaleSeasonBlocksAndFloorsLazyQuery,
    queryOptions: {...FETCH_POLICY.NETWORK_ONLY},
    dataField: 'getSaleSeasonBlocksAndFloors',
    showSpinner: false,
    onSuccess: onGetBlockSuccess,
  });

  const {startApi: getProperties} = useGraphqlApiLazy({
    ...propertyByBlockSetting,
    showSpinner: false,
    onSuccess: getPropertiesSuccess,
    onError: () => {
      setState({...state, isLoading: false, blockData: {}});
    },
  });

  useEffect(() => {
    setState({...state, isLoading: true});
    getBlocks({variables: {saleSeasonId}});
  }, [saleSeasonId]);

  useEffect(() => {
    getPropertiesForCurrentBlock();
  }, [currentBlock, shouldRefresh]);

  useDeepCompareEffect(() => {
    getPropertiesForCurrentBlock();
  }, [filterInput]);

  function getPropertiesForCurrentBlock() {
    if (!currentBlock) {
      setState({...state, isLoading: false, blockData: {}});
      return;
    }

    setState({...state, isLoading: true, blockData: {}});
    getProperties({
      variables: {
        input: {
          saleSeasonId: saleSeasonId,
          blockName: currentBlock,
          propertyTypeId,
          ...filterInput,
          ...((type === SLOT_SELECTION_TYPE.TRANSFER_DEPOSIT && previousProps) || {}),
        },
      },
    });
  }

  return state;
};

export {useGetSlotData};
