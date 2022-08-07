import {useNavigation} from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import React, {useContext} from 'react';
import {View} from 'react-native';
import {useAnimatedScrollHandler, withSpring} from 'react-native-reanimated';
import {useSelector} from 'react-redux';

import {AppContext} from '../../appData/appContext/useAppContext';
import {isAgent} from '../../appData/user/selectors';
import {TRANSACTION_MODE} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {HELPERS} from '../../assets/theme/helpers';
import {BookingContext} from '../BookingDeposit/useBooking';
import {useCheckBooking} from '../ProjectDetail/hooks/useCheckBooking';
import ScreenIds from '../ScreenIds';
import {EmptyList, FloorViewProps, getSectionsData} from './FloorList';
import SlotSelectionUtil from './SlotSelectionUtil';
import useAnimationSlotSelect from './useAnimationSlotSelect';

export const useFloorList = ({
  saleSeasonId,
  routeKey,
  propertyType,
  propertyPosts,
  consultantInfo,
  projectStatus,
  scrollSelectionList,
  onPressApartment,
  // navigation.
}) => {
  const {setSlotSelection} = useContext(BookingContext);
  const {showAppModal} = useContext(AppContext);
  const sections = getSectionsData(propertyPosts, routeKey);
  const isAgentUser = useSelector(isAgent);
  const navigation = useNavigation();

  const handleScrollAnimated = useAnimatedScrollHandler(event => {
    scrollSelectionList.value = event.contentOffset.y;
  });

  const {POSTION_TOP_LIST} = useAnimationSlotSelect();

  const checkBookingSuccess = propertyPost => {
    setSlotSelection({saleSeasonId, propertyPost});
    navigation.navigate(ScreenIds.ConfirmProperty, {
      propertyPostId: propertyPost.propertyPostId,
      consultantInfo: consultantInfo,
    });
  };
  const {checkBooking} = useCheckBooking({
    onSuccess: ({propertyPost}) => {
      checkBookingSuccess(propertyPost);
    },
    onError: errorMessage => {
      showAppModal({
        isVisible: true,
        title: translate('ERROR'),
        message: errorMessage,
        onOkHandler: () => {
          navigation.navigate(ScreenIds.ProjectDetail);
        },
      });
    },
  });

  const onScrollEndDrag = e => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY >= 40 && offsetY < 80) {
      scrollSelectionList.value = withSpring(80);
    } else if (offsetY >= 0 && offsetY < 40) {
      scrollSelectionList.value = withSpring(5);
    }
  };

  const onPressItem = propertyPost => {
    const {saleTrackingStatusName} = propertyPost;
    const isBookingTransaction = projectStatus === TRANSACTION_MODE.BOOKING;
    const isDepositItem = SlotSelectionUtil.isDepositItem(saleTrackingStatusName);

    onPressApartment && onPressApartment(propertyPost);

    if (!isBookingTransaction || isDepositItem) {
      checkBookingSuccess(propertyPost);
      return;
    }
    checkBooking({saleTrackingStatusName, isBookingTransaction, propertyPost, saleSeasonId});
  };

  if (isEmpty(propertyPosts)) {
    return <View style={[HELPERS.fill, HELPERS.center]}>{EmptyList}</View>;
  }

  const props: FloorViewProps = {
    sections,
    propertyType,
    projectStatus,
    onPressItem,
    isAgentUser,
    onScrollEndDrag,
    handleScrollAnimated,
    scrollSelectionList,
    POSTION_TOP_LIST,
  };

  return props;
};
