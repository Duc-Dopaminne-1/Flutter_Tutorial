import React, { useEffect, useRef } from 'react';
import { View, BackHandler, Alert } from 'react-native';
import styles from './styles';
import LOGO from '@res/Onboarding/icon-logo.png';
import FastImage from 'react-native-fast-image';
import { CustomText } from '@src/components/CustomText';
import translate from '@src/localize';
import { CustomButton } from '@src/components/CustomButton';
import { useDispatch } from 'react-redux';
import { logout } from '@src/modules/auth/actions';
import NavigationActionsService from '@src/navigation/navigation';
import { NEW_COMPANY } from '@src/constants/screenKeys';
import { getListCountry } from '@src/modules/Config/actions';

interface Props {

}

const Confirmation = (props: Props) => {

  const dispatch = useDispatch();

  const handleBackButtonPress = () => {
    return true;
  };

  const addEventListener = useRef(BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress));

  useEffect(() => {
    fetchListCountry();
    return () => {
      addEventListener.current.remove();
    };
  }, []);


  const fetchListCountry = () => {
    dispatch(getListCountry({
      onSuccess: (data) => {
        console.log("===== Success country data: ", data);
      },
      onFail: error => {
        setTimeout(() => {
          error && Alert.alert(translate('alert.title_error'), error.message);
        }, 700);
      }
    }));
  };

  const onPressCreateCompany = () => {
    NavigationActionsService.push(NEW_COMPANY, { isFromComfirm: true });
  };

  return (
    <View style={styles.containerView}>
      <View style={styles.content} >
        <FastImage resizeMode="contain" source={LOGO} style={[styles.logoReup]} />
        <CustomText text={translate('confirmation.title')} styleContainer={styles.title} style={styles.text} />
        <CustomText text={translate('confirmation.description')} styleContainer={styles.description} style={styles.text} />
        {/* <CustomText text={translate('confirmation.des_logout')} styleContainer={styles.descriptionLogout} style={styles.text} /> */}
        <CustomButton text={translate('confirmation.create_company_button')} style={styles.button} onPress={onPressCreateCompany} />
      </View>
    </View>
  );
};

export default Confirmation;
