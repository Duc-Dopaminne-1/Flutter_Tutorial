import React, { ReactElement, useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/vars';
import CustomHeader from '@/components/CustomHeader';
import { language } from '@/i18n';
import { MyAuctionDetailProcess } from '@/screens/MyAuctionDetail/component/MyAuctionDetailProcess';
import { MyAuctionDetailMeeting } from '@/screens/MyAuctionDetail/component/MyAuctionDetailMeeting';
import { MyAuctionDetailThanks } from '@/screens/MyAuctionDetail/component/MyAuctionDetailThanks';
import { MyAuctionDetailButton } from '@/screens/MyAuctionDetail/component/MyAuctionDetailButton';
import { MyAuctionAccessQRCode } from '@/screens/MyAuctionDetail/component/MyAuctionAccessQRCode';
import { SafeArea } from '@/components/SafeArea';
import { Auction, AuctionStatus } from '@/models';
import NavigationActionsService from '@/navigation/navigation';
import { getAuctionDetail, getTokenZoom, setStatusRoom } from '@/redux/myBids/actions';
import { MyAuctionDetailTabView } from '@/screens/MyAuctionDetail/component/MyAuctionDetailTabView';
import CustomButton from '@/components/CustomButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import MyAuctionReviewDialog from './component/MyAuctionReviewDialog';
import { MyAuctionCheckBoxMeetingPlace } from './component/MyAuctionCheckBoxMeetingPlace';
import ConfirmMeetPlaceDialog from './component/ConfirmMeetPlaceDialog';
import ConfirmMeetPlaceErrorDialog from './component/ConfirmMeetPlaceErrorDialog';
import store from '@/redux/store';
import Geolocation from 'react-native-geolocation-service';
import { useDispatch } from 'react-redux';
import { meetArrived } from '@/redux/meet/actions';
import { FeedbackView } from './component/FeedbackView';
import { AUCTION_PLACE_MEET_CONFIRM_ERROR, IS_FIRST_MEET_GREAT_PERSON, IS_FIRST_MEET_GREAT_VIRTUAL } from '@/constants/app';
import ConfirmMeetTimeErrorDialog from './component/ConfirmMeetTimeErrorDialog';
import { capitalizeAllWorks, formatTime, handleRemindTimeInZoom } from '@/shared/processing';
import { CHAT_DETAIL_SCREEN, MODAL_PAYMENT } from '@/navigation/screenKeys';
import { getTransactionsInfo } from '@/redux/payment/actions';
import { MyAuctionDetailContext } from '@/screens/MyAuctionDetail/MyAuctionDetailContext';
import { isIOS } from '@/shared/devices';
import { notificationService } from '@/shared/notification';
import CustomActionSheet from '@/components/CustomActionSheet';
import { getNameMeetGreet } from '@/shared/auction';
import MyAuctionDetailRuleModal from '@/screens/MyAuctionDetail/component/MyAuctionDetailRuleModal';
import { set } from '@/services/storage';
import { getStatusFirstMeetGreatPerson, getStatusFirstMeetGreatVirtual } from '@/redux/app/selector';
import { updateSettingMeetGreatPerson, updateSettingMeetGreatVirtual } from '@/redux/app/actions';
import ZoomUs, { ZoomEmitter } from 'react-native-zoom-us';
import { formatNameUser, getShowReview } from '@/shared/discovery';
import { getUserInfo } from '@/redux/user/selector';
import IconBack from '@/components/SVG/BackSvg';
import Spinner from '@/components/Spinner';

export function MyAuctionDetailScreen(): ReactElement {
  const { item } = useRoute().params as any;
  const [data, setData] = useState(null);
  const [checkBoxSelected, setCheckBoxSelected] = useState(false);
  const [reviewDialogVisible, setReviewDialogVisible] = useState(false);
  const [confirmMeetPlaceDialogVisible, setConfirmMeetPlaceDialogVisible] = useState(false);
  const [confirmMeetPlaceErrorDialogVisible, setConfirmMeetPlaceErrorDialogVisible] = useState(false);
  const [confirmMeetTimeErrorDialogVisible, setConfirmMeetTimeErrorDialogVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [endMeetErrorDialogVisible, setEndMeetErrorDialogVisible] = useState(false);
  const infoZoom = useRef<any>('');
  const [isLoading, setIsLoading] = useState(false);

  const auction = data
    ? data
    : { creator: { firstName: '', id: '', status: '' }, roomId: '', id: '', status: '', cancel: { by: '' }, transactions: [] };
  const { id, status, creator, cancel, roomId, winner } = auction;

  const initMeetPlace = { name: '', address: '', lng: '', lat: '', placeId: '' };
  const meetPlace = auction?.meetPlace || initMeetPlace;
  const isMeetOffline = !!meetPlace.address;
  const timeMeet = auction?.meetingDuration?.value || 0;

  const namePersonMeet = getNameMeetGreet(auction);
  const mapRef = useRef(null);
  const isBiddeeAuctionProcess = store.getState().user.data.id === creator?.id && status === AuctionStatus.WAITING_PAYMENT;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const initData = (data: Auction) => {
    setData(data);
    setTimeout(() => {
      checkPayment(data);
      getFirstMeet(data?.status).then(_r => {});
    }, 300);
  };

  const fetchAuctionData = async (cb: (auction: Auction) => void) => {
    setIsLoading(true);
    const t0 = performance.now();
    NavigationActionsService.dispatchAction(
      getAuctionDetail({
        auctionId: item.id,
        onSuccess: data => {
          const t1 = performance.now();
          if (t1 - t0 < 300) {
            setTimeout(() => {
              setIsLoading(false);
              cb(data);
            }, 200);
            return;
          }
          setIsLoading(false);
          cb(data);
        },
        onFail: () => {
          setIsLoading(false);
        },
      }),
    );
  };

  const checkPayment = (auction: Auction) => {
    if (auction && store.getState().user.data.id !== auction.creator?.id && auction?.status === AuctionStatus.WAITING_PAYMENT) {
      NavigationActionsService.dispatchAction(
        getTransactionsInfo({
          isFromAuctionDetail: true,
          id: auction.id,
          onSuccess: data => checkPaymentIssueSuccess(data, auction),
        }),
      );
    }
  };

  const getFirstMeet = async (status = '') => {
    if (status && status === AuctionStatus.READY_TO_MEET) {
      if (isMeetOffline && getStatusFirstMeetGreatPerson()) {
        onOpenRule();
        await set(IS_FIRST_MEET_GREAT_PERSON, 'false');
        NavigationActionsService.dispatchAction(
          updateSettingMeetGreatPerson({
            data: false,
          }),
        );
      } else if (!isMeetOffline && getStatusFirstMeetGreatVirtual()) {
        onOpenRule();
        await set(IS_FIRST_MEET_GREAT_VIRTUAL, 'false');
        NavigationActionsService.dispatchAction(
          updateSettingMeetGreatVirtual({
            data: false,
          }),
        );
      }
    }
  };

  const checkPaymentIssueSuccess = (result, auction) => {
    const { approveUrl, id, status } = result;
    const { endAt } = auction;
    if (status === 'success') {
      onCbPaymentIssueSuccess();
      return;
    }

    if (status === 'failed') {
      NavigationActionsService.push(MODAL_PAYMENT, {
        endNowBidAt: endAt,
        isFromAuctionDetailCardFail: true,
        onCbPaymentIssue,
        checkPaymentCard: checkPayment,
        timeForPayment: 30,
      });
      return;
    }

    if (approveUrl) {
      NavigationActionsService.push(MODAL_PAYMENT, {
        approveUrl,
        id,
        endNowBidAt: endAt,
        isFromAuctionDetail: true,
        onCbPaymentIssue,
        onCbPaymentIssueSuccess,
        timeForPayment: 30,
      });
    }
  };

  useEffect(() => {
    fetchAuctionData(initData).then(_r => {});
  }, []);

  const handleReview = (auction: Auction) => {
    const {
      confirmedAt,
      meetingDuration: { value },
    } = auction;
    if (confirmedAt && handleRemindTimeInZoom(confirmedAt, value / 60) < 10000) {
      getShowReview();
      return;
    }
  };

  const getAuction = async (isFromZoom = false) => {
    setIsLoading(true);
    const t0 = performance.now();
    NavigationActionsService.dispatchAction(
      getAuctionDetail({
        auctionId: item.id,
        onSuccess: data => {
          const t1 = performance.now();
          if (t1 - t0 < 300) {
            setTimeout(() => {
              setIsLoading(false);
              setData(data);
              isFromZoom && handleReview(data);
            }, 200);
            return;
          }
          setIsLoading(false);
          setData(data);
          isFromZoom && handleReview(data);
        },
        onFail: () => {
          setIsLoading(false);
        },
      }),
    );
  };

  const onCbPaymentIssueSuccess = async () => {
    await getAuction();
  };

  const onCbPaymentIssue = () => {
    NavigationActionsService.goBack();
  };

  const userCancel = () => {
    if (cancel && creator?.id === cancel.by) {
      return capitalizeAllWorks(formatNameUser(creator));
    } else {
      const userName = (winner && formatNameUser(winner)) || '';
      return capitalizeAllWorks(userName);
    }
  };

  const renderProcess = () => {
    return (
      <View style={styles.wrapperProgressBar}>
        <MyAuctionDetailProcess status={status} />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.wrapHeader}>
        <CustomHeader leftIcon={<IconBack />} isShadow={false} title={language('detail')} titleStyle={styles.textTitle} />
      </View>
    );
  };

  const renderTopView = () => {
    if (status === AuctionStatus.COMPLETED) {
      return <FeedbackView />;
    }

    if (status === AuctionStatus.CANCEL) {
      return (
        <View style={styles.wrapCancel}>
          <Text style={styles.textCancelBy}>{`${language('cancelledBy')} ${userCancel()}`}</Text>
          <Text style={styles.textReason}>{`${language('cancellationReason')} ${
            cancel && cancel.note ? cancel.note : language('changedMyMind')
          }`}</Text>
        </View>
      );
    }

    return null;
  };

  const closeOnPressed = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  const renderCloseButton = () => {
    if (status === AuctionStatus.CANCEL || status === AuctionStatus.COMPLETED || status === AuctionStatus.FAILED_PAYMENT) {
      return (
        <CustomButton onPress={closeOnPressed} textStyle={styles.textClose} containerStyle={styles.btnClose} text={language('close')} />
      );
    }
    return null;
  };

  const localCurrentPosition = byPass => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        onConfirm(latitude, longitude, byPass);
      },
      _error => {},
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 10000,
        distanceFilter: 0,
        showLocationDialog: false,
      },
    );
  };

  const onConfirm = (lat, lng, byPass) => {
    dispatch(
      meetArrived({
        auctionId: auction.id,
        lat,
        lng,
        byPass: byPass,
        callback: {
          onSuccess: () => {
            NavigationActionsService.dispatchAction(
              getAuctionDetail({
                auctionId: auction.id,
                onSuccess: data => {
                  setIsLoading(false);
                  setData(data);
                },
              }),
            );
          },
          onFail: error => {
            setIsLoading(false);
            onShowError(error);
          },
        },
      }),
    );
  };

  const confirmMeetPlaceDialogOnPressed = (byPass = false) => {
    setConfirmMeetPlaceDialogVisible(false);
    setTimeout(() => {
      setIsLoading(true);
      localCurrentPosition(byPass);
    }, 500);
  };

  const onShowError = (error: string) => {
    if (error === AUCTION_PLACE_MEET_CONFIRM_ERROR.OUT_OF_PLACE_RANGE) {
      setTimeout(() => {
        setConfirmMeetPlaceErrorDialogVisible(true);
      }, 400);
    } else if (error === AUCTION_PLACE_MEET_CONFIRM_ERROR.END_MEET) {
      setTimeout(() => {
        setEndMeetErrorDialogVisible(true);
      }, 400);
    } else {
      setTimeout(() => {
        setConfirmMeetTimeErrorDialogVisible(true);
      }, 400);
    }
  };

  const onCallZoom = () => {
    NavigationActionsService.dispatchAction(
      getTokenZoom({
        auctionId: data ? data.id : '',
        onSuccess: getZoomTokenSuccess,
        onFail: getZoomTokenFail,
      }),
    );
  };

  const getZoomTokenSuccess = async url => {
    infoZoom.current = url;
    if (url.startedAt && handleRemindTimeInZoom(url.startedAt, timeMeet / 60) < 0) {
      onShowError(AUCTION_PLACE_MEET_CONFIRM_ERROR.END_MEET);
      return;
    }
    await onStartZoom();
  };

  const getZoomTokenFail = error => {
    onShowError(error);
  };

  const onPressPlaceMeet = () => {
    onBackConfirmPlace();
    setTimeout(() => {
      mapRef.current?.show();
    }, 400);
  };

  const onBackConfirmPlace = () => {
    setConfirmMeetPlaceDialogVisible(false);
    setCheckBoxSelected(false);
  };

  const onOpenRule = () => {
    setIsVisible(true);
  };

  const onBackdropPress = () => {
    setIsVisible(false);
  };

  const onPressOke = async () => {
    onBackdropPress();
  };

  const handleEvent = async event => {
    switch (event) {
      case 'endedNoAttendee':
      case 'endedRemovedByHost':
      case 'endedJBHTimeout':
      case 'endedFreeMeetingTimeout':
      case 'endedConnectBroken':
      case 'endedBySelf':
      case 'meetingOver':
        leaveRoom();
        notificationService.setStatusZoom(false);
        break;
      case 'endedByHostForAnotherMeeting':
      case 'endedUnknownReason':
      case 'endedByHost':
        await getAuction(true);
        break;
      default:
        break;
    }
  };

  const leaveRoom = () => {
    NavigationActionsService.dispatchAction(
      setStatusRoom({
        auctionId: infoZoom.current?.id,
      }),
    );
  };

  useEffect(() => {
    let eventListener = null;
    if (ZoomEmitter) {
      const zoomEmitter = new NativeEventEmitter(ZoomEmitter);
      eventListener = zoomEmitter.addListener('MeetingEvent', ({ event }) => {
        handleEvent(event).then(_r => {});
      });
    }

    return () => eventListener && eventListener.remove();
  }, []);

  const onStartZoom = async () => {
    const { startUrl } = infoZoom.current;
    notificationService.setStatusZoom(true);
    const indexZak = startUrl.indexOf('zak=');
    const zakLength = 'zak='.length;
    const accessToken = startUrl.slice(indexZak + zakLength, startUrl.length);
    const meetingNumber = startUrl.slice(startUrl.lastIndexOf('/') + 1, indexZak - 1);
    await ZoomUs.startMeeting({
      userName: capitalizeAllWorks(formatNameUser(getUserInfo())),
      meetingNumber,
      userId: accessToken,
      zoomAccessToken: accessToken,
    });
  };

  const moveToChat = (roomId, name) => {
    NavigationActionsService.push(CHAT_DETAIL_SCREEN, {
      roomId,
      name,
    });
  };

  const initRoomToChat = (auction: Auction) => {
    setData(auction);
    moveToChat(auction.roomId, getNameMeetGreet(auction));
  };

  const onPressChat = () => {
    if (!roomId && namePersonMeet) {
      fetchAuctionData(initRoomToChat).then(_r => {});
    } else {
      moveToChat(roomId, namePersonMeet);
    }
  };

  return (
    <MyAuctionDetailContext.Provider value={{ onCallZoom, onOpenRule }}>
      <Spinner loading={isLoading} />
      <View style={styles.container}>
        <SafeArea />
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.wrapScrollView}
        >
          {renderProcess()}
          {renderTopView()}
          <View style={styles.wrapAuction}>
            <MyAuctionDetailMeeting auction={data} />
            {data && data.meetPlaceId ? (
              <>
                <MyAuctionCheckBoxMeetingPlace
                  namePersonMeet={namePersonMeet}
                  isBiddeeAuctionProcess={isBiddeeAuctionProcess}
                  auction={data}
                  checkBoxSelected={checkBoxSelected}
                  checkBoxCallback={() => {
                    setConfirmMeetPlaceDialogVisible(true);
                  }}
                />
                {data && <MyAuctionAccessQRCode auction={data} />}
              </>
            ) : null}
          </View>

          <MyAuctionDetailTabView
            data={{
              isBiddee: store.getState().user.data.id === creator?.id,
              ...auction,
            }}
          />
          <View style={styles.wrapAuction}>
            <MyAuctionDetailThanks data={data} />
            {renderCloseButton()}
          </View>
        </ScrollView>
        {!(status === AuctionStatus.CANCEL || status === AuctionStatus.COMPLETED || status === AuctionStatus.FAILED_PAYMENT) ? (
          <MyAuctionDetailButton
            nameBidder={namePersonMeet}
            isBiddeeAuctionProcess={isBiddeeAuctionProcess}
            auction={data}
            id={id}
            roomId={roomId}
            onPressChat={onPressChat}
            auctionCreatorId={creator?.id}
          />
        ) : null}

        <MyAuctionReviewDialog
          isVisible={reviewDialogVisible}
          onBackdropPress={() => {
            setReviewDialogVisible(false);
          }}
        />
        <ConfirmMeetPlaceDialog
          auction={data}
          isVisible={confirmMeetPlaceDialogVisible}
          confirmOnPressed={() => confirmMeetPlaceDialogOnPressed(false)}
          onBackdropPress={onBackConfirmPlace}
          onPressPlaceMeet={onPressPlaceMeet}
        />
        <ConfirmMeetPlaceErrorDialog
          auction={data}
          isVisible={confirmMeetPlaceErrorDialogVisible}
          onBackdropPress={() => {
            setConfirmMeetPlaceErrorDialogVisible(false);
          }}
        />

        <ConfirmMeetTimeErrorDialog
          auction={data}
          textError={
            endMeetErrorDialogVisible
              ? language('meetGreetIsInvalid')
              : data && data.meetPlaceId
              ? language('confirmMeetTimeErroDesc')
              : language('meetingTime', { time: formatTime(new Date(data ? data.meetDate : '')) })
          }
          isVisible={confirmMeetTimeErrorDialogVisible || endMeetErrorDialogVisible}
          onBackdropPress={() => {
            setEndMeetErrorDialogVisible(false);
            setConfirmMeetTimeErrorDialogVisible(false);
          }}
        />

        <CustomActionSheet ref={mapRef} meetPlace={data?.meetPlace} />
        <MyAuctionDetailRuleModal
          isMeetOffline={isMeetOffline}
          isVisible={isVisible}
          onBackdropPress={onBackdropPress}
          onPressOke={onPressOke}
        />
      </View>
    </MyAuctionDetailContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray_50,
  },
  textTitle: {
    color: colors.gray_last_time,
  },
  wrapHeader: {
    backgroundColor: colors.white,
  },
  wrapperProgressBar: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 20,
    elevation: 12,
    shadowColor: colors.gray_shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 8,
    shadowRadius: 8,
  },

  wrapScrollView: {
    paddingBottom: 30,
  },
  wrapAuction: {
    paddingHorizontal: 16,
  },
  wrapCancel: {
    marginTop: 30,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: colors.white,
    elevation: 12,
    shadowColor: colors.gray_shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 8,
    shadowRadius: 8,
  },
  textCancelBy: {
    fontFamily: fonts.family.PoppinsRegular,
    fontWeight: isIOS ? '600' : 'bold',
    fontSize: fonts.size.s16,
    color: colors.gray_last_time,
  },
  textReason: {
    fontSize: fonts.size.s14,
    color: colors.gray_600,
    marginTop: 8,
    fontFamily: fonts.family.PoppinsRegular,
  },

  btnClose: {
    width: '98%',
    alignSelf: 'center',
    backgroundColor: colors.red_700,
    marginTop: 20,
  },

  textClose: {
    color: colors.white,
    fontSize: fonts.size.s17,
    fontWeight: '500',
    fontFamily: fonts.family.PoppinsRegular,
  },
});
