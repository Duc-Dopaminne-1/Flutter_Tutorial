import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';

type Props = React.ComponentProps<typeof CustomButton>;

export const PhoneButton = ({...props}: Props) => {
  return <CustomButton {...props} icon={IMAGES.CALL_IC_CALL} title={translate('common.call')} />;
};

export const ChatButton = ({...props}: Props) => {
  return <CustomButton {...props} icon={IMAGES.MESSAGE_FILL} title={translate('common.chat')} />;
};

const CustomButton = ({style, icon = IMAGES.CALL_IC_CALL, title = 'Title', onPress}) => {
  return (
    <TouchableOpacity style={[HELPERS.row, style]} onPress={onPress}>
      <Image style={styles.icon} source={icon} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 21,
    height: 21,
    marginRight: 8,
    tintColor: COLORS.PRIMARY_A100,
  },
  text: {
    ...FONTS.bold,
    fontSize: 12,
    color: COLORS.PRIMARY_A100,
  },
});
