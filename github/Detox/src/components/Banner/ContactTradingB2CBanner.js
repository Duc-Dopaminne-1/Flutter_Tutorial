import React, {useContext, useState} from 'react';
import {
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {AppContext} from '../../appData/appContext/useAppContext';
import {CONSTANTS} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {HELPERS} from '../../assets/theme/helpers';
import {normal} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {useApproveContactTrading} from '../../hooks/useContactTradingB2C';
import {BottomButton} from '../Button/BottomButton';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? normal : 30,
    left: normal,
    right: normal,
  },
  contentContainer: {
    ...commonStyles.shadowApp,
    borderRadius: 4,
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  closeImage: {
    width: 16,
    height: 16,
  },
  message: {
    flex: 1,
    marginHorizontal: normal,
    marginTop: 34,
  },
  bottomButton: {
    marginBottom: 12,
  },
});

const paginationStyles = StyleSheet.create({
  containerStyle: {
    paddingTop: 0,
    paddingBottom: 12,
  },
  dotContainerStyle: {
    marginHorizontal: 4,
  },
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  inactiveDotStyle: {
    backgroundColor: COLORS.GREY_C4,
  },
});

const width = Dimensions.get('window').width - 32;

type Props = {
  data: [{id: String, message: String}],
  onPressDecline: (notificationId: String) => {},
  onPressApprove: (notificationId: String) => {},
  onPressClose: () => {},
};

export const ContactTradingB2CBanner = ({
  //format
  data = [],
  onPressDecline,
  onPressApprove,
  onPressClose,
}: Props) => {
  const [activeSlide, setActiveSlide] = useState(0);

  if (data.length === 0) {
    return null;
  }

  const renderItem = ({item}) => {
    const {id, message} = item;
    return (
      <View style={HELPERS.fill}>
        <Text style={styles.message} numberOfLines={3}>
          {message}
        </Text>
        <BottomButton
          style={styles.bottomButton}
          cancelText={translate('common.decline')}
          okText={translate('common.approve')}
          onPressCancel={() => onPressDecline(id)}
          onPressOk={() => onPressApprove(id)}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Carousel
          data={data}
          onSnapToItem={index => setActiveSlide(index)}
          renderItem={renderItem}
          sliderWidth={width}
          itemWidth={width}
        />
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          containerStyle={paginationStyles.containerStyle}
          dotContainerStyle={paginationStyles.dotContainerStyle}
          dotStyle={paginationStyles.dotStyle}
          inactiveDotStyle={paginationStyles.inactiveDotStyle}
          inactiveDotScale={1}
        />
        <TouchableOpacity //format
          style={styles.closeButton}
          onPress={onPressClose}
          hitSlop={CONSTANTS.HIT_SLOP}>
          <Image style={styles.closeImage} source={IMAGES.IC_DISMISS} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export const ContactTradingB2CBannerContainer = () => {
  const {state, readContactTradingB2CNotification} = useContext(AppContext);
  const approveContactTrading = useApproveContactTrading();
  const markRead = notificationId => {
    readContactTradingB2CNotification(notificationId);
  };

  return (
    <ContactTradingB2CBanner
      data={state.contactTradingB2CNotifications}
      onPressDecline={notificationId => {
        approveContactTrading(false, notificationId, () => {
          markRead(notificationId);
        });
      }}
      onPressApprove={notificationId => {
        approveContactTrading(true, notificationId, () => {
          markRead(notificationId);
        });
      }}
      onPressClose={() => readContactTradingB2CNotification(null)}
    />
  );
};
