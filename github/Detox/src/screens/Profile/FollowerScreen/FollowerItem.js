import isEmpty from 'lodash/isEmpty';
import React, {useContext} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {normal, small} from '../../../assets/theme/metric';
import Avatar from '../../../components/Avatar';
import {Group} from '../../../components/Badge';
import CustomButton from '../../../components/Button/CustomButton';
import RatingComponent from '../../../components/Rating/RatingComponent';
import {getImageBySizeFromServer, IMAGE_SIZES} from '../../../utils/ImageUtil';
import {StringeeContext} from '../../Call/StringeeContext';

const ICON_SIZE = 40;

const styles = StyleSheet.create({
  itemIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    paddingVertical: normal,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SEPARATOR_LINE,
  },
  avatar: {justifyContent: 'flex-start'},
  name: {...FONTS.bold, fontSize: 16},
  badgeGroup: {
    marginVertical: 4,
  },
  rating: {alignItems: 'flex-start', marginTop: 4},
  viewFollow: {flexDirection: 'row', zIndex: 1, alignItems: 'center', marginTop: small},
  btnFollowing: {
    backgroundColor: COLORS.PRIMARY_A100,
    flex: 1,
    height: 40,
    borderRadius: 5,
  },
  btnFollower: {
    backgroundColor: COLORS.GREY_ED,
    flex: 1,
    height: 40,
    borderRadius: 5,
  },
  iconOption: {position: 'absolute', padding: 8, right: 0, top: 16},
});

const IconMenu = ({style, name, onPress, backgroundIcon = COLORS.GREEN_80}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.itemIcon, style, {backgroundColor: backgroundIcon}]}>
      <Icon size={20} name={name} color={COLORS.PRIMARY_A100} />
    </TouchableOpacity>
  );
};

const FollowerItem = ({
  item,
  onPressFollow,
  onPressMoreOptions,
  type,
  onPress = () => {},
  navigation,
}) => {
  const btnFollowStyle = item?.isFollow ? styles.btnFollower : styles.btnFollowing;
  const btnText = item?.isFollow ? translate('social.following') : translate('social.follow');
  const {callUser, chatUser} = useContext(StringeeContext);

  const onPressCall = () => {
    callUser(
      item?.phoneNumber,
      {
        fullName: item?.fullName,
        avatar: item?.profilePhoto,
      },
      true,
    );
  };

  const onPressChat = () => {
    chatUser(item?.phoneNumber, item?.fullName, navigation, true);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Avatar
        containerStyle={styles.avatar}
        url={getImageBySizeFromServer(item.profilePhotos, IMAGE_SIZES.LARGE)}
        size={80}
      />
      <View style={{marginLeft: normal, ...HELPERS.fill}}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Group style={styles.badgeGroup} isAgent={!isEmpty(item?.agentGroupName)} />
        <View style={styles.rating}>
          <RatingComponent
            imageSize={15}
            style={{marginVertical: normal}}
            rateNumber={item.agentRating}
          />
        </View>
        <View style={styles.viewFollow}>
          <CustomButton
            onPress={onPressFollow}
            titleColor={item?.isFollow ? COLORS.BLACK_31 : COLORS.NEUTRAL_WHITE}
            style={btnFollowStyle}
            title={btnText}
          />
          <IconMenu
            name={'message-processing'}
            style={{marginHorizontal: normal}}
            onPress={onPressChat}
          />
          <IconMenu onPress={onPressCall} name={'phone'} />
        </View>
      </View>
      {type === 'followers' && (
        <TouchableOpacity onPress={onPressMoreOptions} style={styles.iconOption}>
          <Icon name={'dots-horizontal'} size={25} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(FollowerItem);
