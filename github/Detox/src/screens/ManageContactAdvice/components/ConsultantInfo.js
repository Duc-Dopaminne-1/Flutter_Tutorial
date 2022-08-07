import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small, tiny} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import {ChatButton, PhoneButton} from '../../../components/Button/PhoneButton';
import RatingComponent from '../../../components/Rating/RatingComponent';
import {StringeeContext} from '../../Call/StringeeContext';

const AVATAR_SIZE = 66;

const ConsultantInfo = ({fullName, phoneNumber, avatar, groupName, rating, navigation}) => {
  const {callUser, chatUser} = useContext(StringeeContext);

  const onPressCall = () => {
    callUser(phoneNumber, {
      fullName,
      avatar,
    });
  };

  const onPressChat = () => {
    chatUser(phoneNumber, fullName, navigation);
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Avatar containerStyle={styles.avatar} size={AVATAR_SIZE} url={avatar} />
        <View style={[HELPERS.crossStart, HELPERS.fill]}>
          <Text style={styles.name} numberOfLines={1}>
            {fullName}
          </Text>
          <Text style={styles.group}>{`Nhóm: ${groupName}`}</Text>
          <RatingComponent rateNumber={rating} backgroundColor={COLORS.BACKGROUND} imageSize={16} />
        </View>
      </View>
      <View style={styles.buttons}>
        <PhoneButton onPress={onPressCall} />
        <View style={styles.separator} />
        <ChatButton onPress={onPressChat} />
      </View>
    </View>
  );
};

export default ConsultantInfo;

const styles = StyleSheet.create({
  container: {},
  box: {
    flexDirection: 'row',
    marginTop: small,
  },
  avatar: {
    marginRight: normal,
  },
  name: {
    ...FONTS.bold,
    fontSize: 15,
    color: COLORS.BLACK_31,
  },
  group: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.GRAY_A3,
    marginVertical: tiny,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: normal,
  },
  separator: {
    width: 1,
    backgroundColor: COLORS.SEPARATOR_LINE,
  },
});
