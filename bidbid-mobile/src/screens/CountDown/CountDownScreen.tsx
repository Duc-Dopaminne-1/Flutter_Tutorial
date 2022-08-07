import React, { ReactElement, useEffect, useState } from 'react';
import { StyleSheet, ViewStyle, View, TextStyle, AppState, Vibration } from 'react-native';
import CustomHeader from '@/components/CustomHeader';
import { colors, fonts } from '@/vars';
import { language } from '@/i18n';
import { SafeArea } from '@/components/SafeArea';
import DefaultText from '@/components/CustomText/DefaultText';
import ProgressCircleView from './ProgressCircleView';
import MeetAndGreetEndDialog from './MeetAndGreetEndDialog';
import { GlobalProps } from '@/shared/Interface';
import NavigationActionsService from '@/navigation/navigation';
import { getAuctionDetail } from '@/redux/myBids/actions';
import { alertError } from '@/shared/alert';
import { getReviewRequired } from '@/redux/reviews/actions';
import { REVIEW_SCREEN } from '@/navigation/screenKeys';
import IconBack from '@/components/SVG/BackSvg';
import IconCountdownTimerSVG from '@/components/SVG/IconCountdownTimerSVG';

const ONE_SECOND_IN_MS = 1000;

export default function CountDownScreen(props: GlobalProps): ReactElement {
  const auctionObj = props.route.params ? props.route.params?.auction : { id: '' };

  const [auction, setAuction] = useState(null);
  const [meetAndGreetEndDialogVisible, setMeetAndGreetEndDialogVisible] = useState(false);
  const [displayCountDown, setDisplayCountDown] = useState(true);
  const [countDownSeconds, setCountDownSeconds] = useState(0);
  const timeMeet = auction?.meetingDuration?.value || 0;

  useEffect(() => {
    AppState.addEventListener('change', handleChange);
    return () => {
      AppState.removeEventListener('change', handleChange);
    };
  }, [auction]);

  const handleChange = newState => {
    if (newState === 'active') {
      initCountDownTimer();
    }
  };

  useEffect(() => {
    NavigationActionsService.dispatchAction(
      getAuctionDetail({
        auctionId: auctionObj.id,
        onSuccess: auctionFetched => {
          setAuction(auctionFetched);
        },
        onFail: error => {
          alertError(error, 'ERROR', () => {
            NavigationActionsService.hideLoading();
          });
        },
      }),
    );
  }, []);

  useEffect(() => {
    if (!auction) return;
    initCountDownTimer();
  }, [auction]);

  const initCountDownTimer = () => {
    const timeCountDownInit = auction?.confirmedAt ? (new Date().getTime() - new Date(auction.confirmedAt).getTime()) / 1000 : 0;
    if (timeCountDownInit > timeMeet) {
      Vibration.vibrate(5 * ONE_SECOND_IN_MS);
      setDisplayCountDown(false);
      // setMeetAndGreetEndDialogVisible(true);
    } else {
      setCountDownSeconds(Math.floor(timeMeet - Math.abs(timeCountDownInit)));
    }
  };

  const countDownCompleted = () => {
    Vibration.vibrate(5 * ONE_SECOND_IN_MS);
    setDisplayCountDown(false);
    NavigationActionsService.dispatchAction(
      getReviewRequired({
        callback: {
          onSuccess: reviews => {
            if (reviews && reviews.length > 0) {
              NavigationActionsService.push(REVIEW_SCREEN);
            }
          },
          onFail: _ => {},
        },
      }),
    );
  };

  if (!auction) return null;
  return (
    <View style={styles.root}>
      <SafeArea />
      <View style={styles.wrapperHeader}>
        <CustomHeader leftIcon={<IconBack />} titleStyle={styles.titleText} title={language('counDownScreen.title')} />
      </View>
      <View style={styles.container}>
        <View style={styles.iconCountDownWrapper}>
          <IconCountdownTimerSVG />
        </View>
        <DefaultText {...{ style: styles.textType }}>{language('counDownScreen.desc')}</DefaultText>
        {displayCountDown && (
          <ProgressCircleView timeMeet={timeMeet} countDownSeconds={countDownSeconds} countDownCompleted={countDownCompleted} />
        )}
      </View>

      <MeetAndGreetEndDialog
        isVisible={meetAndGreetEndDialogVisible}
        onBackdropPress={() => {
          setMeetAndGreetEndDialogVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  } as ViewStyle,

  container: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,

  wrapperHeader: {} as ViewStyle,

  titleText: {
    marginVertical: 5,
    textAlign: 'center',
    fontSize: fonts.size.s22,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsBold,
  } as TextStyle,

  textType: {
    marginTop: 30,
    marginHorizontal: 30,
    fontSize: fonts.size.s14,
    color: colors.gray_900,
    fontFamily: fonts.family.PoppinsRegular,
    textAlign: 'center',
  } as TextStyle,

  iconCountDownWrapper: {
    alignItems: 'center',
    marginTop: 30,
  } as ViewStyle,
});
