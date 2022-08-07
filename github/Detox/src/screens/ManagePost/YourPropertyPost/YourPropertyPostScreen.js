import {useAnalytics} from '@segment/analytics-react-native';
import React, {useContext, useRef, useState} from 'react';
import {Keyboard, View} from 'react-native';

import {AppContext} from '../../../appData/appContext/useAppContext';
import {MAX_LENGTH} from '../../../assets/constants';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import BaseScreen from '../../../components/BaseScreen';
import CustomButton from '../../../components/Button/CustomButton';
import CustomTotalCount from '../../../components/CustomTotalCount';
import ModalWithModalize from '../../../components/Modal/ModalWithModalize';
import MeasureUtils from '../../../utils/MeasureUtils';
import {useMount} from '../../commonHooks';
import ScreenIds from '../../ScreenIds';
import SearchHeader from '../../Search/components/SearchHeader';
import {Category, ClickLocation, TrackingActions} from '../../WithSegment';
import GetGuaranteedPackages from '../NewPost/hooks/useGetGuaranteedPackages';
import {NewPostStyles} from '../NewPost/NewPostComponents/NewPostConstant';
import PropertyPostByFilter from '../PropertyPostByFilter';
import {PostType} from '../useNewPost';
import YourPropertyFilter from './YourPropertyFilter';
import YourPropertyFilterUtil, {
  getPropertyTypes,
  mapGuaranteedPackages,
} from './YourPropertyFilterUtil';

const initialState = {
  isRentTab: false,
  filterBuyState: {},
  filterRentalState: {},
  searchBuyWord: '',
  searchRentalWord: '',
  guaranteedPackages: [],
};

const mapState = () => {
  const filterData = YourPropertyFilterUtil.getInitialFilterData();
  return {
    ...initialState,
    filterBuyState: filterData,
    filterRentalState: filterData,
  };
};

const YourPropertyPostScreen = ({navigation}) => {
  const {track} = useAnalytics();
  const {getMasterData} = useContext(AppContext);
  const propertyTypes = getPropertyTypes(getMasterData());
  const approvalStatus = getMasterData()?.propertyPostApprovalStatus?.edges ?? [];
  const [state, setState] = useState(mapState());

  const [postCount, setPostCount] = useState({[PostType.sale]: 0, [PostType.rent]: 0});

  const modalFilterRef = useRef();
  const showFilter = () => {
    modalFilterRef.current?.open();
    Keyboard.dismiss();
  };
  const hideFilter = () => {
    modalFilterRef.current?.close();
  };

  const {getGuaranteedPackagesQuery} = GetGuaranteedPackages({
    onSuccess: response => {
      const guaranteedPackages = mapGuaranteedPackages(response);
      setState({...state, guaranteedPackages});
    },
  });

  const onPressCreatNewPost = () => {
    track(TrackingActions.createPostClicked, {
      click_location: ClickLocation.myPost,
      category: Category.profile,
    });

    navigation.navigate(ScreenIds.GeneralDescription);
  };

  const onChangeTotalPost = (total, routeKey) => {
    setPostCount({...postCount, [routeKey]: total});
  };

  const onKeywordChange = searchKey => {
    const searchState = state.isRentTab
      ? {searchRentalWord: searchKey}
      : {searchBuyWord: searchKey};
    setState({...state, ...searchState});
  };

  const renderScene = ({route}) => {
    const filter = YourPropertyFilterUtil.getFilterByState(
      route.key,
      route.key === PostType.rent ? state.filterRentalState : state.filterBuyState,
      approvalStatus,
      route.key === PostType.rent ? state.searchRentalWord : state.searchBuyWord,
    );

    const trackPost = item => {
      track(TrackingActions.productClicked, {
        category: Category.profile,
        click_location: ClickLocation.myPost,
        name: item?.title,
        address: item?.address,
        price: MeasureUtils.getPriceFromPriceDescription(item?.price),
        commission: item?.commission,
        image_url: item?.images,
        apartment_area: item?.buildingArea,
        direction: item?.direction,
        bedroom_number: item?.numberOfBedrooms,
        bathroom_number: item?.numberOfBathrooms,
      });
    };

    return (
      <View style={HELPERS.fill}>
        <View style={NewPostStyles.viewWithIndex}>
          <SearchHeader
            renderLeft={false}
            placeholder={translate('propertyPost.searchPlaceHolder')}
            customStyle={commonStyles.inputSearch}
            onFilterPress={showFilter}
            onChangeKeyword={onKeywordChange}
            maxLength={MAX_LENGTH.SEARCH_CODE}
            delayTimeout={100}
          />
          <CustomTotalCount containerStyle={METRICS.resetMargin} count={postCount[route.key]} />
        </View>
        <View style={HELPERS.fill}>
          <PropertyPostByFilter
            filter={filter}
            totalPostsListener={total => onChangeTotalPost(total, route.key)}
            forRent={route.key === PostType.rent}
            onPressPost={trackPost}
            modePropertyPostItem="your-post"
          />
        </View>
      </View>
    );
  };

  const onApplyFilter = data => {
    const dataFilter = state.isRentTab ? {filterRentalState: data} : {filterBuyState: data};
    setState({...state, ...dataFilter});
    hideFilter();
  };

  useMount(() => {
    getGuaranteedPackagesQuery();
  });

  return (
    <BaseScreen
      title={translate(STRINGS.YOUR_PROPERTY_POST)}
      modals={
        <ModalWithModalize getModalRef={modalFilterRef} modalTopOffset={16}>
          <YourPropertyFilter
            data={{
              propertyTypes,
              forRent: state.isRentTab,
              guaranteedPackages: state?.guaranteedPackages,
            }}
            filterData={state.isRentTab ? state.filterRentalState : state.filterBuyState}
            onConfirmed={onApplyFilter}
          />
        </ModalWithModalize>
      }>
      {renderScene({route: PostType.sale})}
      <View style={commonStyles.footerContainer}>
        <CustomButton
          style={{...commonStyles.buttonConfirm, backgroundColor: COLORS.PRIMARY_A100}}
          title={translate('newPost.createNewPost')}
          titleStyle={commonStyles.confirmText}
          onPress={onPressCreatNewPost}
        />
      </View>
    </BaseScreen>
  );
};

export default YourPropertyPostScreen;
