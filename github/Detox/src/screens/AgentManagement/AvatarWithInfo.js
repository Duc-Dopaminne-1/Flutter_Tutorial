import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {CONSTANTS} from '../../assets/constants';
import {IMAGES} from '../../assets/images';
import {translate} from '../../assets/localize';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {normal, small, smallNormal} from '../../assets/theme/metric';
import Avatar from '../../components/Avatar';
import {Group} from '../../components/Badge';
import CustomButton from '../../components/Button/CustomButton';
import CustomIconButton from '../../components/CustomIconButton';
import RatingComponent from '../../components/Rating/RatingComponent';
import {useContactInfo} from '../../hooks';

const AVATAR_SIZE = 100;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  containerInfo: {
    marginLeft: 30,
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'flex-start',
  },
  nameStyle: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: normal,
    ...FONTS.bold,
  },
  row: {
    flexDirection: 'row',
  },
  iconContactView: {
    width: 40,
    height: 40,
    ...HELPERS.center,
  },
  group: {
    justifyContent: 'center',
    marginBottom: small,
  },
  avatar: {marginBottom: small, alignSelf: 'center'},
});

const AvatarWithInfo = ({agentInfo, isFollow, onPressFollow}) => {
  const {name, image, rateNumber, phoneNumber, email} = agentInfo;
  const {callPhone, sendEmail} = useContactInfo(phoneNumber, email);

  const followStyle = StyleSheet.create({
    btnFollow: {
      backgroundColor: isFollow ? COLORS.GREY_ED : COLORS.PRIMARY_A100,
      flex: 1,
      borderRadius: small,
    },
    followText: {
      ...FONTS.bold,
      fontSize: 14,
      color: isFollow ? COLORS.BLACK_31 : COLORS.NEUTRAL_WHITE,
    },
  });

  return (
    <>
      <Avatar size={AVATAR_SIZE} url={image} containerStyle={styles.avatar} />
      <Group style={styles.group} />
      <RatingComponent
        imageSize={16}
        rateNumber={rateNumber}
        backgroundColor={COLORS.NEUTRAL_WHITE}
      />
      <View style={HELPERS.center}>
        <Text numberOfLines={2} style={styles.nameStyle}>
          {name}
        </Text>
      </View>
      <View style={styles.row}>
        <CustomButton
          onPress={onPressFollow}
          title={isFollow ? translate('social.following') : translate('social.follow')}
          titleStyle={followStyle.followText}
          style={followStyle.btnFollow}
        />
        <CustomIconButton
          iconColor={COLORS.PRIMARY_A100}
          style={[styles.iconContactView, {marginHorizontal: smallNormal}]}
          onPress={callPhone}
          image={IMAGES.IC_CONTACT_PHONE}
          hitSlop={CONSTANTS.HIT_SLOP}
        />
        <CustomIconButton
          iconColor={COLORS.PRIMARY_A100}
          style={styles.iconContactView}
          onPress={sendEmail}
          image={IMAGES.IC_CONTACT_EMAIL}
          hitSlop={CONSTANTS.HIT_SLOP}
        />
      </View>
    </>
  );
};

export default AvatarWithInfo;
