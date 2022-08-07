import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';

import {isAgent} from '../../../appData/user/selectors';
import {SIZES} from '../../../assets/constants/sizes';
import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small, tiny} from '../../../assets/theme/metric';
import CustomButton from '../../../components/Button/CustomButton';
import KeyboardScrollView from '../../../components/KeyboardScrollView';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';
import {SCREEN_SIZE} from '../../../utils/ImageUtil';
import ScreenIds from '../../ScreenIds';
import Summary from '../Confirm/Components/Summary';

const styles = StyleSheet.create({
  viewInside: {
    backgroundColor: COLORS.BACKGROUND,
    padding: normal,
  },
  webView: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 8,
    marginTop: 30,
  },
  buttonReview: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.NEUTRAL_WHITE,
  },
  buttonText: {
    ...FONTS.semiBold,
    fontSize: 14,
    color: COLORS.PRIMARY_A100,
  },
  title: {
    ...FONTS.semiBold,
    fontSize: 24,
    marginBottom: 16,
    alignSelf: 'center',
    textAlign: 'center',
  },
  consultantView: {
    paddingVertical: small,
    borderRadius: 5,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.NEUTRAL_BORDER,
    alignItems: 'center',
    backgroundColor: COLORS.NEUTRAL_WHITE,
  },
  image: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  info: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    paddingVertical: 11,
    marginTop: small,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.BORDER_LINE,
    borderRadius: tiny,
  },
  infoNameContainer: {
    flex: 1,
  },
  infoName: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.GREY_82,
    textAlign: 'center',
  },
  infoValue: {
    ...FONTS.semiBold,
    fontSize: 15,
    color: COLORS.BLACK_33,
    textAlign: 'center',
  },

  priority: {
    width: 80,
    height: 80,
    borderRadius: 80 / 2,
    position: 'absolute',
    backgroundColor: COLORS.STATE_ERROR,
    borderWidth: SIZES.BORDER_WIDTH_2,
    borderColor: COLORS.NEUTRAL_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    top: 60,
    left: SCREEN_SIZE.WIDTH / 2 - 40 - normal,
  },
  summary: {
    ...FONTS.regular,
    fontSize: 15,
    color: COLORS.BLACK_33,
    paddingBottom: normal,
    textAlign: 'center',
  },

  priorityName: {
    fontSize: 11,
    marginTop: normal,
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.regular,
  },
  priorityValue: {
    fontSize: 30,
    color: COLORS.NEUTRAL_WHITE,
    ...FONTS.semiBold,
  },
  bottomView: {
    flexDirection: 'row',
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: normal,
    alignItems: 'center',
  },
  infoView: {
    backgroundColor: COLORS.NEUTRAL_WHITE,
    borderRadius: 4,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBuyMore: {
    borderRadius: tiny,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.PRIMARY_A100,
    height: 45,
    justifyContent: 'center',
    paddingHorizontal: normal,
  },
  buttonDetailTransaction: {
    flex: 1,
    height: 45,
    marginLeft: normal,
    borderRadius: tiny,
    backgroundColor: COLORS.PRIMARY_A100,
  },
  consultantImage: {width: 48, height: 48, borderRadius: 24},
  textConsultant: {marginVertical: 4, fontSize: 16, ...FONTS.regular},
  consultantName: {...FONTS.bold, fontSize: 16},
});

const InfoContainer = ({projectInfo, consultantInfo, transactionCode, isBooking}) => {
  return (
    <>
      {isBooking ? (
        <View style={styles.infoView}>
          <Text style={{color: COLORS.PRIMARY_B100}}>{translate('transaction.bookingCode')}</Text>
          <Text style={{color: COLORS.PRIMARY_B100, ...FONTS.bold, marginTop: tiny}}>
            {transactionCode}
          </Text>
        </View>
      ) : (
        <View style={styles.consultantView}>
          <Image
            resizeMode="contain"
            source={{
              uri: consultantInfo?.profilePhoto,
            }}
            style={styles.consultantImage}
          />
          <Text style={styles.textConsultant}>Chuyên viên tư vấn</Text>
          <Text style={styles.consultantName}>{consultantInfo?.fullName}</Text>
        </View>
      )}
      <View style={styles.info}>
        <View style={[HELPERS.rowCenter]}>
          <View style={styles.infoNameContainer}>
            <Text style={styles.infoName}>{`${translate(STRINGS.PROJECT_NAME)}:`}</Text>
            <Text style={styles.infoValue}>{projectInfo?.projectName}</Text>
          </View>
        </View>
      </View>
    </>
  );
};

export const SuccessScreenContainer = ({
  title,
  isBooking,
  onPressBuyMore,
  onReviewNewPost,
  transactionDetail,
  transactionCode,
  consultantInfo,
  projectInfo,
}) => {
  return (
    <>
      <SafeAreaScreenContainer>
        <KeyboardScrollView testID={ScreenIds.PostSuccess} contentStyle={styles.viewInside}>
          <View style={styles.webView}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={isBooking ? IMAGES.SUCCESS_BOOKING : IMAGES.IC_SUCCESS_FILL}
            />
            {isBooking && (
              <View style={styles.priority}>
                <Text style={styles.priorityName}>{translate(STRINGS.PRIORITY)}</Text>
                <Text style={styles.priorityValue}>{transactionDetail?.transactionIndex}</Text>
              </View>
            )}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.summary}>
              {translate(isBooking ? STRINGS.SUMMARY_BOOKING : STRINGS.SUMMARY_DEPOSITE)}
            </Text>
            {InfoContainer({
              transactionDetail,
              projectInfo,
              consultantInfo,
              transactionCode,
              isBooking,
            })}
            <Summary propertyPost={transactionDetail?.propertyPostInfo} />
          </View>
        </KeyboardScrollView>
      </SafeAreaScreenContainer>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={onPressBuyMore}>
          <View style={styles.buttonBuyMore}>
            <Text style={styles.buttonText}>{translate('common.buyMore')}</Text>
          </View>
        </TouchableOpacity>
        <CustomButton
          titleStyle={styles.buttonReview}
          style={styles.buttonDetailTransaction}
          title={translate('transaction.title')}
          onPress={onReviewNewPost}
        />
      </View>
    </>
  );
};

const SuccessScreen = ({
  title = translate(STRINGS.POST_SUCCESSFULLY),
  transactionDetail,
  isBooking,
  transactionId,
  consultantInfo,
  projectInfo,
  onPressBuyMore,
  onReviewNewPost,
}) => {
  const navigation = useNavigation();
  const isAgentUser = useSelector(isAgent);
  const [transactionCode, setTransactionCode] = useState('');

  useEffect(() => {
    if (transactionDetail) {
      setTransactionCode(transactionDetail.transactionCode);
    }
  }, [transactionDetail]);

  const onRegisterAgent = () => {
    navigation.navigate(ScreenIds.Profile);
    navigation.navigate(ScreenIds.RegisterAgent, {isBooking, transactionId});
  };

  return (
    <SuccessScreenContainer
      title={title}
      projectInfo={projectInfo}
      isBooking={isBooking}
      isAgentUser={isAgentUser}
      consultantInfo={consultantInfo}
      onRegisterAgent={onRegisterAgent}
      onPressBuyMore={onPressBuyMore}
      onReviewNewPost={onReviewNewPost}
      transactionDetail={transactionDetail}
      transactionCode={transactionCode}
    />
  );
};

export default SuccessScreen;
