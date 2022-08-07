import {useState} from 'react';

import useDeepCompareEffect from '../../../utils/useDeepCompareEffect';

const useToogle = (initValue = false) => {
  const [isEnable, setEnable] = useState(initValue);

  const toogle = () => {
    setEnable(!isEnable);
  };

  return {
    isEnable,
    toogle,
  };
};

export const useFilterFloor = ({blockData}) => {
  const [filteredBlockData, setFilteredBlockData] = useState();
  const [floorData, setFloorData] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const yourItemFilter = useToogle();

  useDeepCompareEffect(() => {
    const propertyPosts = blockData?.propertyPosts;
    if (propertyPosts) {
      const data: [string] = propertyPosts.map(value => value.floor);
      setFloorData(data);
      setSelectedFloors(data.slice(0, 3));
    } else {
      setFloorData([]);
      setSelectedFloors([]);
    }
  }, [blockData]);

  useDeepCompareEffect(() => {
    const blockPropertyPosts = (blockData?.propertyPosts ?? [])
      // .filter(block => {
      //   return selectedFloors.filter(selectedFloor => selectedFloor === block.floor).length > 0;
      // })
      .map(block => ({
        ...block,
        propertyPosts: block.propertyPosts.filter(propertyPost => {
          if (yourItemFilter.isEnable) {
            return propertyPost.assigned === true;
          }
          return true;
        }),
      }));

    const blockData2 = {
      ...blockData,
      totalOfPropertyPosts: blockData?.totalOfPropertyPosts,
      totalOfEmptyPropertyPosts: blockData?.totalOfEmptyPropertyPosts,
      totalOfSoldPropertyPosts: blockData?.totalOfSoldPropertyPosts,
      totalOfBookedPropertyPosts: blockData?.totalOfBookedPropertyPosts,
      propertyPosts: blockPropertyPosts,
    };

    setFilteredBlockData(blockData2);
  }, [selectedFloors, yourItemFilter.isEnable]);

  return {
    shouldShowFilterFloor: false, //isApartment && floorData.length > 0,
    floorData,
    filteredBlockData,
    selectedFloors,
    applyFilterFloor: setSelectedFloors,
    yourItemFilter,
  };
};
