import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import RIGHT_ARROW from '@res/icons/icon_arrow_right.png';
import { CustomText } from '@src/components/CustomText';
import translate from '@src/localize';
import { Theme } from '../Theme';

interface Props {
  leftText: string;
  rightText?: string;
  leftTextStyle?: object;
  rightTextStyle?: object;
  useBottomLine?: boolean;
  bottomLineStyle?: object;
  showRightIcon?: boolean;
}

const CustomInfoRow = (props: Props) => {
  const {
    leftText,
    rightText,
    leftTextStyle = {},
    rightTextStyle = {},
    useBottomLine = true,
    bottomLineStyle = {},
    showRightIcon = false,
  } = props;

  const renderLeftText = () => {
    return (
      <View style={styles.textView}>
        <CustomText style={[styles.leftText, leftTextStyle]} text={leftText} />
      </View>
    );
  };

  const renderRightText = () => {
    if (!rightText) return null;
    return (
      <View style={styles.textView}>
        <CustomText style={[styles.rightText, rightTextStyle, leftText === translate('product_details.status') ? { color: Theme.product_detail.textColorUnPublicButton } : { color: Theme.product_detail.textColorRight }]} text={rightText} />
      </View>
    );
  };

  const renderRightIcon = () => {
    if (!showRightIcon) return null;
    return <Image style={styles.rightIcon} source={RIGHT_ARROW} />;
  };

  const renderText = () => {
    return (
      <View style={styles.textContainer}>
        {renderLeftText()}
        {renderRightText()}
        {renderRightIcon()}
      </View>
    );
  };

  const renderBottomLine = () => {
    if (!useBottomLine) return null;
    return <View style={[styles.bottomLine, bottomLineStyle]} />;
  };

  return (
    <View style={styles.container}>
      {renderText()}
      {renderBottomLine()}
    </View>
  );
};

export default React.memo(CustomInfoRow);
