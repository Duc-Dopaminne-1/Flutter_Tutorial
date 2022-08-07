import {useNavigation} from '@react-navigation/native';
import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext} from 'react';

import {
  useSearchPropertyPostsForRentLazyQuery,
  useSearchPropertyPostsLazyQuery,
} from '../../api/graphql/generated/graphql';
import {AppContext} from '../../appData/appContext/useAppContext';
import {APPROVAL_STATUS, ITEM_TYPE, SEARCH_TYPE_INDEX} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import LazyList, {PAGING_TYPE} from '../../components/LazyList';
import PropertyItemGuarantee, {
  getGuaranteedStatusStyle,
  ItemHeight,
} from '../../components/PropertyItem/PropertyItemGuarantee';
import {getPropertyTypeDescriptionById} from '../../utils/GetMasterData';
import MeasureUtils from '../../utils/MeasureUtils';
import {projectPaddingStyle} from '../../utils/RenderUtil';
import SearchDataUtils from '../../utils/SearchDataUtils';
import {mapPropertyC2CGuarantee} from '../Home/TopenerOfMonth/types';
import {useFormatPrice} from '../Home/useFormatPrice';
import ScreenIds from '../ScreenIds';
import {Category, ClickLocation, TrackingActions} from '../WithSegment';

const START_PAGE = 1;

const SearchPropertyPostsComponent = ({state, setState}) => {
  const navigation = useNavigation();
  const {track} = useAnalytics();
  const context = useContext(AppContext);
  const {getMasterData} = context;
  const masterData = getMasterData();
  const searchCriteria = state.searchCriteria;
  const isSearchingTypeRental = state.index === SEARCH_TYPE_INDEX.RENTAL;
  const {formatPrice} = useFormatPrice();
  const selectedStatusId = searchCriteria?.propertyPostStatus;
  const isSoldProperty = selectedStatusId === APPROVAL_STATUS.SOLD;
  const isAll = selectedStatusId === STRINGS.ALL;

  const queryRentalPropertyPostsSetting = {
    queryParams: {
      input: SearchDataUtils.mappingSearchCriteria(
        {
          ...searchCriteria,
        },
        START_PAGE,
        searchCriteria.propertyPostOrderBy,
      ),
    },
    useQuery: useSearchPropertyPostsForRentLazyQuery,
    responseDataKey: 'searchPropertyPostsForRent',
    responseDataArrayKey: 'propertyPostForRentInfoDtos',
  };
  const queryPropertyPostsSetting = {
    queryParams: {
      input: SearchDataUtils.mappingSearchCriteria(
        {
          ...searchCriteria,
          propertyPostApprovalStatusJson: SearchDataUtils.getApprovalIds(
            masterData,
            isSoldProperty,
            isAll,
          ),
        },
        START_PAGE,
        searchCriteria.propertyPostOrderBy,
      ),
    },
    useQuery: useSearchPropertyPostsLazyQuery,
    responseDataKey: 'searchPropertyPosts',
    responseDataArrayKey: 'propertyPostInfoDtos',
  };
  const querySetting = isSearchingTypeRental
    ? queryRentalPropertyPostsSetting
    : queryPropertyPostsSetting;

  const isSmallType = false;
  const mapToUiModel = item => {
    const mappingGuaranteedProperty = {
      ...mapPropertyC2CGuarantee(item, formatPrice, false, isSearchingTypeRental),
      ...getGuaranteedStatusStyle({
        item,
        masterData,
        isStatusText: true,
        isForRent: isSearchingTypeRental,
      }),
    };
    return mappingGuaranteedProperty;
  };

  const onDataChange = ({items, totalCount}) => {
    setState({...state, c2cPostsCount: totalCount ?? 0, items});
  };

  const extractArrayMapper = response => {
    const propertyPosts =
      response?.[querySetting.responseDataKey]?.[querySetting.responseDataArrayKey];
    return propertyPosts ?? [];
  };

  const onPressItem = item => {
    track(TrackingActions.productClicked, {
      category: Category.buy,
      click_location: ClickLocation.home,
      name: item?.title ?? '',
      address: item?.address ?? '',
      price: MeasureUtils.getPriceFromPriceDescription(item?.price) ?? 0,
      commission: item?.commission ?? '',
      image_url: item?.images ?? '',
    });

    navigation.navigate(ScreenIds.ViewPropertyPost, {
      propertyPostId: item?.propertyPostId,
      viewByOtherMode: true,
    });
  };

  const onFollowSuccess = propertyInfo => {
    track(TrackingActions.productFollowClicked, {
      click_location: ClickLocation.productListPage,
      category: Category.buy,
      name: propertyInfo?.title ?? '',
      property_type: getPropertyTypeDescriptionById(masterData, propertyInfo?.propertyTypeId) ?? '',
      investor: '',
    });
  };

  return (
    <LazyList
      shouldRefresh={searchCriteria?.propertyPostStatus}
      renderItem={({item, index, ...otherProps}) => {
        const showStatusIsSold = item?.status === translate('propertyPost.status.sold');
        return (
          <PropertyItemGuarantee
            {...otherProps}
            onPress={() => onPressItem(item)}
            showBrokenInfo={false}
            {...item}
            showForRentBanner={false}
            isShowStatus={showStatusIsSold}
            showPriceDetailForRent={isSearchingTypeRental}
            style={projectPaddingStyle(index, isSmallType)}
            itemType={ITEM_TYPE.full}
            onFollowSuccess={() => onFollowSuccess(item)}
          />
        );
      }}
      useQuery={querySetting.useQuery}
      queryOptions={{
        variables: {
          ...querySetting.queryParams,
        },
      }}
      mapToUiModel={mapToUiModel}
      itemHeight={item => {
        // SearchPropertyPostForRentDto has property post detail nested inside
        // searchPropertyPostInfoDto. So we need to pass the correct details
        // in order to calculate the item's height
        const responseData = isSearchingTypeRental ? item?.searchPropertyPostInfoDto : item;
        return ItemHeight({item: responseData, isShowBroker: false});
      }}
      uniqueKey={'propertyPostId'}
      extractArray={extractArrayMapper}
      extractTotalCount={response => response?.[querySetting.responseDataKey]?.totalCount ?? 0}
      onDataChange={onDataChange}
      pagingType={PAGING_TYPE.OFFSET}
      onQueryCompleted={items => {
        let emptyValue;
        track(TrackingActions.productsListViewed, {
          category: Category.buy,
          products: items?.map(e => ({
            name: e?.title ?? '',
            address: e?.address ?? '',
            price: MeasureUtils.getPriceFromPriceDescription(e?.price) ?? 0,
            commission: e?.commission ?? '',
            direction: e?.direction ?? '',
            images_url: e?.images ?? '',
            apartment_area: e?.buildingArea || emptyValue,
            bedroom_number: e?.numberOfBedrooms || emptyValue,
            bathroom_number: e?.numberOfBedrooms || emptyValue,
          })),
        });
      }}
    />
  );
};

export default SearchPropertyPostsComponent;
