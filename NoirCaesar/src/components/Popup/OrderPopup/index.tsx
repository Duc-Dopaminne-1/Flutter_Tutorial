import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Keyboard } from 'react-native';
import { CustomPopup } from '../../CustomPopup';
import translate from '@src/localize';

export interface Props {
  onPressRedButton?: () => void;
  onPressGrayButton?: () => void;
}

const OrderPopup = forwardRef((props: Props, ref) => {
  const { onPressRedButton, onPressGrayButton } = props;
  const [isShowPopup, setShowPopup] = useState(false);

  useImperativeHandle(ref, () => ({
    showPopup() {
      setShowPopup(true);
    },
  }));

  const onPressBackdrop = () => {
    setShowPopup(false);
  };

  const onPressButtonRed = () => {
    Keyboard.dismiss();
    setShowPopup(false);
    setTimeout(() => {
      onPressRedButton && onPressRedButton();
    }, 500);
  };

  const onPressButtonGray = () => {
    Keyboard.dismiss();
    setShowPopup(false);
    setTimeout(() => {
      onPressGrayButton && onPressGrayButton();
    }, 500);
  };

  return (
    <CustomPopup
      text={translate('order.cancel_order')}
      onBackdropPress={onPressBackdrop}
      loading={isShowPopup}
      buttonRedTitle={translate('order.buy_now')}
      buttonGrayTitle={translate('order.add_to_card')}
      onPressRedButton={onPressButtonRed}
      onPressGrayButton={onPressButtonGray}
    />
  );
});

export { OrderPopup };
