import { ICSuccess } from '../../../assets/icons';
import { Heading, PrimaryButton, SubHead } from '../../../components/';
import FloatFooter from '../../../components/float_footer';
import { BACKGROUND_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { useDispatch } from 'react-redux';
import { scale } from '../../../utils/responsive';
import { toggleSdkState } from '../../../redux/actions/middleware';
import FastImage from 'react-native-fast-image';
import { btn_appstore, btn_chplay, logo } from '../../../assets/images';
import SCREENS_NAME from '../../../constants/screens';
import { t } from 'i18n-js';

const CreateRequestSuccess = ({ navigation }) => {
  const dispatch = useDispatch();
  React.useLayoutEffect(() => {
    navigation.setOptions({ hideLeftHeader: true });
  }, []);
  const onBack = () => {
    navigation.navigate(SCREENS_NAME.MIDDLEWARE);
  };
  const handleOpenStore = os => () => {
    const link =
      os === 'ios'
        ? 'https://htf-prod.onelink.me/HUVD/11660e4'
        : 'https://htf-prod.onelink.me/HUVD/11660e4';
    Linking.canOpenURL(link).then(
      supported => {
        supported && Linking.openURL(link);
      },
      err => {}
    );
  };

  return (
    <View style={styles.successWrapper}>
      <ICSuccess />
      <Heading translate textAlign={'center'} numberOfLines={2} style={styles.successText}>
        {'create_request.create_request_success'}
      </Heading>
      <View style={styles.logoContainer}>
        <FastImage style={styles.logo} source={logo} />
        <Heading translate style={styles.appName} bold color={'#03B495'}>
          TopenFintech
        </Heading>
        <SubHead translate bold={false}>
          {'create_request.create_success_title'}
        </SubHead>
      </View>
      <View style={styles.btnStoreContainer}>
        <TouchableOpacity onPress={handleOpenStore('ios')}>
          <FastImage style={styles.btnStore} source={btn_chplay} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenStore('android')}>
          <FastImage style={styles.btnStore} source={btn_appstore} />
        </TouchableOpacity>
      </View>
      <FloatFooter style={styles.backToHome}>
        <PrimaryButton translate onPress={onBack} title={'common.back_to_main_screen'} />
      </FloatFooter>
    </View>
  );
};

export default CreateRequestSuccess;

const styles = StyleSheet.create({
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: scale(53, false),
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium
  },
  successText: {
    alignSelf: 'center',
    marginTop: SPACING.Medium,
    textAlign: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: scale(30)
  },
  logo: {
    width: scale(68),
    height: scale(68)
  },
  appName: { marginTop: scale(15), marginBottom: 4 },
  btnStoreContainer: { flexDirection: 'row', marginTop: scale(20) },
  btnStore: { width: scale(135), height: scale(44), marginHorizontal: scale(7) }
});
