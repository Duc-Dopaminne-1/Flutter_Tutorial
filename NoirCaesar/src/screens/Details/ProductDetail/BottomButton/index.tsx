import React from 'react';
import { SafeAreaView } from 'react-native';
import styles from './styles';
import { CustomButton } from '@src/components/CustomButton';
import translate from '@src/localize';

interface Props {
  onAddToCard?: () => void;
  onBuyNow?: () => void;
}

const BottomButton = (props: Props) => {
  const { onAddToCard, onBuyNow } = props;

  const renderAddToCardButton = () => {
    return (
      <CustomButton
        isGray={true}
        style={styles.bottomButtonView}
        textStyle={styles.bottomButtonText}
        text={translate('product.add_to_cart')}
        onPress={onAddToCard}
      />
    );
  };

  const renderBuyNowButton = () => {
    return (
      <CustomButton
        style={styles.bottomButtonView}
        textStyle={styles.bottomButtonText}
        text={translate('product.buy_now')}
        onPress={onBuyNow}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderAddToCardButton()}
      {renderBuyNowButton()}
    </SafeAreaView>
  );
};

export default BottomButton;
