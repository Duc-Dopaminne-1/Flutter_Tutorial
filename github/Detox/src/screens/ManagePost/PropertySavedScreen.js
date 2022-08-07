import {useAnalytics} from '@segment/analytics-react-native';
import React, {useState} from 'react';

import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {METRICS} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import CustomTotalCount from '../../components/CustomTotalCount';
import {Category, ClickLocation, TrackingActions} from '../WithSegment';
import PropertyPostByFilter from './PropertyPostByFilter';
import {PostType} from './useNewPost';

const initialState = {
  routeOnView: PostType.sale,
  postCount: 0,
};

const PropertySavedScreen = () => {
  const {track} = useAnalytics();
  const [state, setState] = useState(initialState);

  const onRefetchPosts = totalCount => {
    setState({
      ...state,
      postCount: totalCount,
    });
  };

  const renderScene = ({route}) => {
    const postTypeFilter = route.key === PostType.rent ? {forRent: true} : {forSale: true};
    const filter = {
      where: {
        isPrivate: true,
        ...postTypeFilter,
        propertyPostApprovalStatusId_not: 'e68a9b68-f26a-404d-8b5a-7250b52336e8',
      },
    };

    const trackPost = item => {
      track(TrackingActions.productClicked, {
        category: Category.profile,
        click_location: ClickLocation.savedPost,
        name: item?.title,
      });
    };

    return (
      <PropertyPostByFilter
        filter={filter}
        totalPostsListener={onRefetchPosts}
        forRent={route.key === PostType.rent}
        propertyPostItemProps={{
          isShowStatus: true,
          status: '',
          showPriceDetailForRent: route.key === PostType.rent,
        }}
        modePropertyPostItem="saved-post"
        onPressPost={trackPost}
      />
    );
  };

  return (
    <BaseScreen title={translate(STRINGS.PROPERTY_POST_SAVED)}>
      <CustomTotalCount containerStyle={METRICS.resetMargin} count={state.postCount} />
      {renderScene({route: state.routeOnView})}
    </BaseScreen>
  );
};

export default PropertySavedScreen;
