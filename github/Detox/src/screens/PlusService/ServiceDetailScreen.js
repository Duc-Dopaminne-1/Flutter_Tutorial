import React, {useContext} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';

import {AppContext} from '../../appData/appContext/useAppContext';
import {HOTLINE_NUMBER} from '../../assets/constants';
import {translate} from '../../assets/localize';
import {Message} from '../../assets/localize/message/Message';
import {STRINGS} from '../../assets/localize/string';
import {FONTS} from '../../assets/theme/fonts';
import {normal, tiny} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import CustomButton from '../../components/Button/CustomButton';
import PageScreen from '../../components/PageScreen';
import CallUtil from '../../utils/CallUtil';
import UrlUtils from '../../utils/UrlUtils';
import ScreenIds from '../ScreenIds';

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    ...FONTS.bold,
    marginTop: normal,
    lineHeight: 23,
  },
  container: {
    flex: 1,
    paddingHorizontal: normal,
  },
  contentContainer: {
    marginTop: tiny,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: normal,
    marginBottom: normal,
  },
  // eslint-disable-next-line react-native/no-color-literals
  buttonHotline: {
    ...commonStyles.buttonNext,
    flex: 1,
    backgroundColor: '#004A71',
    marginRight: normal,
  },
  buttonSubmit: {
    ...commonStyles.buttonNext,
    flex: 1,
  },
  content: {
    ...FONTS.regular,
    marginTop: normal,
  },
  preview: {
    width: '100%',
    height: 110,
  },
});

const ServiceDetailScreen = ({navigation, route}) => {
  const {showErrorAlert} = useContext(AppContext);
  const {detail} = route.params;
  const previewImageUrl = detail ? detail.previewImageUrl : '';

  const onPressHotline = () => {
    const url = CallUtil.callUrl(HOTLINE_NUMBER);
    UrlUtils.openUrl(url, () => {
      showErrorAlert(translate(Message.NTW_UNKNOWN_ERROR));
    });
  };

  const onPressSubmit = () => {
    navigation.navigate(ScreenIds.ContactToAdvice, {
      hideImage: true,
      supportRequestType: detail.id,
    });
  };

  const onPressLoanSubmit = () => {
    navigation.navigate(ScreenIds.LoanService);
  };

  return (
    <PageScreen title={translate(STRINGS.SERVICE_DETAIL)}>
      <ScrollView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image style={styles.preview} source={previewImageUrl} />
          <Text style={styles.name}>{detail.header}</Text>
          {detail.contents.map((content, index) => (
            <Text style={styles.content} key={index.toString()}>
              {content}
            </Text>
          ))}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          style={styles.buttonHotline}
          title={`Hotline: ${HOTLINE_NUMBER}`}
          onPress={onPressHotline}
        />
        {detail.isLoanService ? (
          <CustomButton style={styles.buttonSubmit} title="Vay vốn" onPress={onPressLoanSubmit} />
        ) : (
          <CustomButton
            style={styles.buttonSubmit}
            title="Gửi yêu cầu tư vấn"
            onPress={onPressSubmit}
          />
        )}
      </View>
    </PageScreen>
  );
};

export default ServiceDetailScreen;
