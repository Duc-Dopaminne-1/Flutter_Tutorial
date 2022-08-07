import React from 'react';
import styles from './styles';
import { throttle } from 'lodash';
import { checkInternet } from '@/shared/internet';
import CustomButton from '@/components/CustomButton';
import { IconApple } from '@/vars/imagesSvg';

interface Props {
  isLogin?: boolean;
  onPress?: () => void;
}

const ButtonApple = (props: Props) => {
  const { onPress } = props;
  const onCustomPressThrottle = onPress ? throttle(onPress, 2000, { leading: true, trailing: false }) : undefined;

  return (
    <CustomButton
      onPress={() => checkInternet.processFunction(onCustomPressThrottle)}
      firstIcon={<IconApple />}
      containerStyle={styles.wrapBtnApple}
    />
  );
};

export default ButtonApple;
