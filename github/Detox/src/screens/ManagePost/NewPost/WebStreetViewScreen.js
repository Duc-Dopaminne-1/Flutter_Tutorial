import React from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';

import {USER_AGENT} from '../../../assets/constants';
import {SIZES} from '../../../assets/constants/sizes';
import {translate} from '../../../assets/localize';
import {STRINGS} from '../../../assets/localize/string';
import {COLORS} from '../../../assets/theme/colors';
import {HELPERS} from '../../../assets/theme/helpers';
import {commonStyles} from '../../../assets/theme/styles';
import CustomButton from '../../../components/Button/CustomButton';
import SafeAreaScreenContainer from '../../../components/SafeAreaScreenContainer';

const styles = StyleSheet.create({
  webviewContainer: {
    ...HELPERS.fill,
    borderRadius: SIZES.BORDER_RADIUS_8,
    overflow: 'hidden',
  },
});

const WebStreetViewScreen = ({navigation, route}) => {
  const {embedStreetView} = route.params;

  const onPressConfirm = () => {
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <SafeAreaScreenContainer>
      <WebView
        style={styles.webviewContainer}
        contentContainerStyle={styles.webviewContainer}
        javaScriptEnabled={true}
        scalesPageToFit={false}
        source={{html: embedStreetView}}
        useWebKit={true}
        dataDetectorTypes={'all'}
        decodeEntities={false}
        userAgent={USER_AGENT}
      />
      <View style={commonStyles.footerContainer}>
        <CustomButton
          style={[commonStyles.buttonConfirm, {backgroundColor: COLORS.PRIMARY_A100}]}
          title={translate(STRINGS.CONFIRM)}
          titleStyle={commonStyles.confirmText}
          onPress={onPressConfirm}
        />
      </View>
    </SafeAreaScreenContainer>
  );
};

export default WebStreetViewScreen;
