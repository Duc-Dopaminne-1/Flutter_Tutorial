import {useNavigation} from '@react-navigation/native';
import Proptypes from 'prop-types';
import React, {useContext} from 'react';
import {View} from 'react-native';

import {useGetPropertyPostByCurrentUserLazyQuery} from '../../api/graphql/generated/graphql';
import {AppContext} from '../../appData/appContext/useAppContext';
import {EMPTY_TYPE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {METRICS} from '../../assets/theme/metric';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import C2CPropertyItem, {
  ItemC2CPropertyHeight,
  ModeC2CPropertyItem,
} from '../../components/PropertyItem/C2CPropertyItem';
import {getGuaranteedStatusStyle} from '../../components/PropertyItem/PropertyItemGuarantee';
import {getPropertyPostApprovalStatusDescriptionById} from '../../utils/GetMasterData';
import {mapPropertyC2CGuarantee} from '../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../Home/useFormatPrice';
import ScreenIds from '../ScreenIds';

type PropertyPostByFilterTypes = {
  modePropertyPostItem: ModeC2CPropertyItem,
};

const PropertyPostByFilter = ({
  filter,
  totalPostsListener,
  viewByOtherMode = false,
  forRent = false,
  onPressPost,
  modePropertyPostItem,
}: PropertyPostByFilterTypes) => {
  const navigation = useNavigation();
  const {formatPrice} = useFormatPrice();
  const {getMasterData} = useContext(AppContext);

  const getStatusName = item => {
    if (forRent && item?.isRented) {
      return translate('propertyPost.isRented');
    }

    const status = getPropertyPostApprovalStatusDescriptionById(
      getMasterData(),
      item.propertyPostApprovalStatusId,
    );
    return status;
  };

  const renderItem = ({item}) => {
    const mappingItem = {
      ...mapPropertyC2CGuarantee(item, formatPrice, true),
      status: getStatusName(item),
      ...getGuaranteedStatusStyle({
        item: {...item, forRent: forRent},
        masterData: getMasterData(),
      }),
    };

    const onPressItem = () => {
      onPressPost && onPressPost(mappingItem);

      navigation.navigate(ScreenIds.ViewPropertyPost, {
        propertyPostId: mappingItem?.propertyPostId,
        viewByOtherMode: viewByOtherMode,
      });
    };
    return <C2CPropertyItem item={mappingItem} onPress={onPressItem} mode={modePropertyPostItem} />;
  };

  const onDataChange = ({totalCount}) => {
    totalPostsListener && totalPostsListener(totalCount);
  };

  return (
    <>
      <View style={METRICS.marginTop} />
      <LazyList
        renderItem={renderItem}
        useQuery={useGetPropertyPostByCurrentUserLazyQuery}
        queryOptions={{
          variables: filter,
        }}
        itemHeight={item => ItemC2CPropertyHeight(item, modePropertyPostItem)}
        uniqueKey={'propertyPostId'}
        extractArray={response => {
          return response?.propertyPostsByCurrentUser?.edges ?? [];
        }}
        extractTotalCount={response => {
          return response?.propertyPostsByCurrentUser?.totalCount ?? 0;
        }}
        onDataChange={onDataChange}
        pagingType={PAGING_TYPE.OFFSET_VARIABLES}
        emptyType={EMPTY_TYPE.YOUR_PROPERTY}
      />
    </>
  );
};

PropertyPostByFilter.propTypes = {
  filter: Proptypes.object,
};

export default PropertyPostByFilter;
