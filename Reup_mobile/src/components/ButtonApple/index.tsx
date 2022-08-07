import React from "react";
import {
  AppleButton,
} from "@invertase/react-native-apple-authentication";
import styles from './styles';
import { checkInternet } from "@src/utils/internet";
import { HEIGHT } from "@src/constants/vars";
import { throttle } from "lodash";

interface Props {
  isLogin?: boolean,
  onPress?: () => void
};

const ButtonApple = (props: Props) => {
  const { onPress, isLogin = true } = props;
  const onCustomPressThrottle = onPress ? throttle(onPress, 2000, { leading: true, trailing: false }) : undefined;
  return (
    <AppleButton
      style={styles.appleButton}
      cornerRadius={(HEIGHT * 0.124) / 2}
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={isLogin ? AppleButton.Type.SIGN_IN : AppleButton.Type.SIGN_UP}
      onPress={() => checkInternet.processFunction(onCustomPressThrottle)}
    />
  );
};

export default ButtonApple;


