import { View, Image } from 'react-native';
import React from 'react';
import Container from '@components/Container';
import styles from './styles';
import translate from '@src/localize';
import { BACK, IC_SUCCESS } from '@src/constants/icons';
import { CustomHeader } from '@src/components/CustomHeader';
import { CustomText } from '@src/components/CustomText';
import { CustomButton } from '@src/components/CustomButton';
import NavigationActionsService from '@src/navigation/navigation';
import { LOGIN } from '@src/constants/screenKeys';

interface Props {

}
const ResetPasswordSuccess = (props: Props) => {

  const onBack = () => {
    NavigationActionsService.push(LOGIN);
  };

  return (
    <Container>
      <CustomHeader
        styleHeader={{ backgroundColor: 'white' }}
        leftImage={BACK}
        leftAction={onBack}
        mainText={translate('authentication.title_forgot_password')} />
      <View style={styles.containerBody}>
        <View style={styles.containerImage}>
          <Image style={styles.icon} source={IC_SUCCESS} />
          <CustomText style={styles.textTitle} text={translate('authentication.reset_password_success')} />
        </View>
        <View style={styles.buttonWraper}>
          <CustomButton
            style={styles.button}
            onPress={onBack}
            text={translate('authentication.button_back_to_login')} />
        </View>
      </View>
    </Container>
  );
};

export default ResetPasswordSuccess;

