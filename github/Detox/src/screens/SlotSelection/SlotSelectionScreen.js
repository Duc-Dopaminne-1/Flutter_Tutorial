import {useAnalytics} from '@segment/analytics-react-native';
import isEmpty from 'lodash/isEmpty';
import React, {createRef, useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import Animated from 'react-native-reanimated';
import {useSelector} from 'react-redux';

import {useValidateExpireCaptchaForPropertyPostLazyQuery} from '../../api/graphql/generated/graphql';
import {useMutationGraphql} from '../../api/graphql/useGraphqlApiLazy';
import {getUserId} from '../../appData/user/selectors';
import {TRANSACTION_MODE} from '../../assets/constants';
import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {STRINGS} from '../../assets/localize/string';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {medium, normal, small} from '../../assets/theme/metric';
import BaseScreen from '../../components/BaseScreen';
import IconTextButton from '../../components/IconTextButton';
import {EmptyListView} from '../../components/List/EmptyListView';
import {getRandomInt} from '../../utils/getRandomInt';
import {useLogin} from '../Auth/useLogin';
import {BookingContext} from '../BookingDeposit/useBooking';
import {useMount} from '../commonHooks';
import PropertyType from '../ManagePost/PropertyType';
import {Category, TrackingActions} from '../WithSegment';
import BlockList from './BlockList';
import FloorTabViewContainer from './FloorTabViewContainer';
import {useFilterFloor} from './hooks/useFilterFloor';
import {ModalSelectFloor} from './ModalSelectFloor';
import SlotSelectionFilter from './SlotSelectionFilter';
import SlotSelectionUtil, {SLOT_SELECTION_TYPE} from './SlotSelectionUtil';
import useAnimationSlotSelect from './useAnimationSlotSelect';
import {useGetSlotData} from './useGetSlotData';

const styles = StyleSheet.create({
  filterButton: {
    flex: 1,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingHorizontal: normal,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.BLUE_56,
    borderRadius: 5,
  },
  filterButtonActive: {
    backgroundColor: COLORS.BLUE_56,
  },
  filterText: {
    ...FONTS.regular,
    fontWeight: 'normal',
    marginBottom: 0,
    color: COLORS.GRAY_D48,
    fontSize: 15,
  },
  filterTextActive: {
    color: COLORS.NEUTRAL_WHITE,
  },
  viewInfoProject: {
    paddingHorizontal: normal,
    paddingBottom: normal,
    alignItems: 'flex-start',
    marginBottom: normal,
    flexWrap: 'wrap',
    position: 'absolute',
    marginTop: 30,
    width: '100%',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  viewBottom: {
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    flexDirection: 'row',
    paddingBottom: medium,
  },
  investorOwnerView: {
    overflow: 'hidden',
    ...HELPERS.row,
  },
  investorOwnerName: {
    color: COLORS.TEXT_DARK_10,
    ...FONTS.bold,
    flexShrink: 1,
  },
  projectName: {
    position: 'absolute',
    width: '100%',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingBottom: small,
    zIndex: 1,
  },
});

const SlotSelectionScreen = ({navigation, route}) => {
  const userId = useSelector(getUserId);
  const [filterData, setFilterData] = useState(SlotSelectionUtil.getInitialFilterData());
  const {
    projectTypeName,
    projectName,
    projectTypeDescription,
    projectStatusDescription,
    propertyTypeId,
    saleSeasonInfo,
    consultantInfo,
    requestId,
  } = route?.params || {};
  const {track} = useAnalytics();
  const {notLoggedIn} = useLogin();
  const saleSeasonId = saleSeasonInfo?.saleSeasonId ?? '';
  const buyerId = route?.params?.buyerId ?? userId;
  const modalFloorRef = createRef();
  const modalFilter = createRef();
  const feeAmount = route?.params?.feeAmount ?? 0;
  const shouldRefresh = route?.params?.shouldRefresh;
  const {state: bookingState} = useContext(BookingContext);
  const transactionMode = bookingState.project.projectStatus;

  const {startApi: validateCaptcha} = useMutationGraphql({
    graphqlApiLazy: useValidateExpireCaptchaForPropertyPostLazyQuery,
    dataField: 'validateExpireReCaptchaForPropertyPost',
  });

  useMount(() => {
    if (notLoggedIn) {
      validateCaptcha(
        {
          variables: {
            requestId: requestId,
          },
        },
        () => {},
        () => {
          navigation.goBack();
        },
      );
    }
  });

  const {
    scrollSelectionList,
    headerStyle,
    projectSubInfo,
    projectInfoStyle,
    headerStyle2,
    headerStyle1,
    INFO_PROPERTY_HEIGHT,
    resetAnimation,
  } = useAnimationSlotSelect();

  const [currentBlock, setCurrentBlock] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const onChangeBlock = blockName => {
    setCurrentBlock(blockName);
    resetAnimation();
  };
  const {blocks, blockData, projectInfo, isLoading} = useGetSlotData({
    shouldRefresh,
    saleSeasonId,
    currentBlock,
    propertyTypeId,
    filterInput: SlotSelectionUtil.filterToQueryInput(filterData),
    type:
      transactionMode === TRANSACTION_MODE.MOVE_DEPOSIT
        ? SLOT_SELECTION_TYPE.TRANSFER_DEPOSIT
        : SLOT_SELECTION_TYPE.NORMAL,
    previousProps: {
      isBooking: false,
      feeAmount,
      buyerId,
    },
    notLoggedIn,
  });

  const {
    shouldShowFilterFloor,
    filteredBlockData,
    floorData,
    selectedFloors,
    applyFilterFloor,
    yourItemFilter,
  } = useFilterFloor({
    blockData,
    isApartment: projectTypeName === PropertyType.apartment,
    scrollSelectionList,
  });

  useEffect(() => {
    if (!isEmpty(blocks)) {
      const index = getRandomInt(0, blocks.length - 1);
      setCurrentIndex(index);
      setCurrentBlock(blocks[index].blockName);
    }
  }, [blocks]);

  const onApplyFilter = filter => {
    setFilterData(filter);
    modalFilter?.current?.close();
    resetAnimation();
  };

  const trackApartments = () => {
    track(TrackingActions.apartmentsViewed, {
      category: Category.project,
      project_name: projectName,
      project_status: projectStatusDescription,
      project_type: projectTypeDescription,
    });
  };

  useMount(trackApartments);

  const onChooseApartment = propertyPost => {
    track(TrackingActions.apartmentSelected, {
      project_name: projectName,
      project_status: projectStatusDescription,
      property_id: propertyPost?.propertyCode,
      transaction_type: transactionMode === TRANSACTION_MODE.BOOKING ? 'booking' : 'deposit',
    });
  };

  return (
    <>
      <BaseScreen
        animation={scrollSelectionList}
        customStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
        containerStyle={{backgroundColor: COLORS.NEUTRAL_WHITE}}
        title={translate('project.slot.title')}>
        {!isEmpty(blockData) ? (
          <FloorTabViewContainer
            scrollSelectionList={scrollSelectionList}
            openFilterFloor={() => modalFloorRef.current.open()}
            projectStatus={transactionMode}
            saleSeasonId={saleSeasonId}
            isLoading={isLoading}
            data={filteredBlockData}
            propertyType={projectTypeName}
            consultantInfo={consultantInfo}
            shouldShowFilterFloor={shouldShowFilterFloor}
            headerStyle2={headerStyle2}
            headerStyle1={headerStyle1}
            selectedFloors={selectedFloors}
            totalFloor={floorData.length}
            onPressApartment={onChooseApartment}
          />
        ) : (
          <EmptyListView isLoading={isLoading} />
        )}
      </BaseScreen>
      <Animated.View style={headerStyle}>
        <BlockList
          onTabChanged={onChangeBlock}
          items={blocks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </Animated.View>
      <View style={[styles.projectName, {top: INFO_PROPERTY_HEIGHT}]}>
        <Animated.Text
          style={[
            {
              marginBottom: small,
              color: COLORS.TEXT_DARK_10,
              ...FONTS.bold,
            },
            projectInfoStyle,
          ]}>
          {projectName}
        </Animated.Text>
        <Animated.View style={[styles.viewInfoProject, projectSubInfo]}>
          <View style={styles.investorOwnerView}>
            <Text style={{color: COLORS.BRAND_GREY}}>{`${translate('INVESTOR')}`}: </Text>
            <Text numberOfLines={1} style={styles.investorOwnerName}>
              {projectInfo?.investorOwnerName}
            </Text>
          </View>
          <View style={[HELPERS.row, {marginTop: small}]}>
            <Text style={{color: COLORS.BRAND_GREY}}>{`${translate('TYPE')}`}: </Text>
            <Text style={{color: COLORS.TEXT_DARK_10, ...FONTS.bold}}>
              {projectInfo?.propertyTypeDescription}
            </Text>
          </View>
        </Animated.View>
      </View>
      {!isLoading && (
        <View style={styles.viewBottom}>
          <IconTextButton
            title={translate(STRINGS.YOUR_ITEM)}
            image={yourItemFilter.isEnable ? IMAGES.IC_TIE_CIRCLE_ACTIVE : IMAGES.IC_TIE_CIRCLE}
            iconSize={16}
            style={[styles.filterButton, yourItemFilter.isEnable ? styles.filterButtonActive : {}]}
            styleText={[styles.filterText, yourItemFilter.isEnable ? styles.filterTextActive : {}]}
            onPress={yourItemFilter.toogle}
          />
          <View style={{width: normal}} />
          <IconTextButton
            onPress={() => modalFilter?.current?.open()}
            imageName={'funnel-outline'}
            title={translate(STRINGS.FILTER_DATA)}
            iconSize={16}
            color={COLORS.GREY_BERMUDA}
            style={[styles.filterButton, {borderColor: COLORS.GREY_BERMUDA}]}
            styleText={[styles.filterText, {color: COLORS.GREY_BERMUDA}]}
          />
        </View>
      )}
      {shouldShowFilterFloor && (
        <ModalSelectFloor
          ref={modalFloorRef}
          floorData={floorData}
          onApplyFilter={applyFilterFloor}
        />
      )}
      <Modalize
        threshold={300}
        velocity={1000}
        modalStyle={{backgroundColor: COLORS.BACKGROUND}}
        adjustToContentHeight={true}
        ref={modalFilter}>
        <SlotSelectionFilter
          filterData={filterData}
          projectTypeName={projectTypeName}
          projectStatus={transactionMode}
          onConfirmed={onApplyFilter}
        />
      </Modalize>
    </>
  );
};

export default SlotSelectionScreen;
