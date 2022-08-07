import React from 'react';
import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {CONSTANTS} from '../../../../assets/constants';
import {SIZES} from '../../../../assets/constants/sizes';
import {IMAGES} from '../../../../assets/images';
import {translate} from '../../../../assets/localize';
import {COLORS} from '../../../../assets/theme/colors';
import {FONTS} from '../../../../assets/theme/fonts';
import {commonStyles} from '../../../../assets/theme/styles';
import Avatar from '../../../../components/Avatar';
import {ContactWithStringeeView} from '../../../ManagePost/ReviewPropertyPost/AgentInfomation';
import BuyRequestUtil from '../../BuyRequestUtil';

const styles = StyleSheet.create({
  container: {
    width: 276,
    minHeight: 194,
    paddingVertical: 8,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_F0,
    borderRadius: SIZES.BORDER_RADIUS_8,
  },
  infoContainer: {
    alignItems: 'center',
  },
  text: {
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.BLACK_31,
  },
  textHighlight: {
    ...FONTS.bold,
    ...FONTS.fontSize14,
    color: COLORS.BLACK_31,
    paddingHorizontal: 15,
    textAlign: 'center',
  },
  avatar: {
    width: CONSTANTS.AVATAR_SIZE,
    height: CONSTANTS.AVATAR_SIZE,
    borderRadius: 24,
    overflow: 'hidden',
  },
  agentGroup: {
    marginTop: 4,
    ...FONTS.regular,
    ...FONTS.fontSize12,
    color: COLORS.GRAY_A3,
  },
  listContainer: {
    paddingVertical: 12,
  },
  rankIcon: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    width: 20,
    height: 20,
  },
  wrapperAvatar: {alignItems: 'center'},
});

const ContactInfoItem = ({
  item,
  onPressAvatar,
  navigation,
  onPressCallCallback,
  onPressChatCallback,
}) => {
  const onPressProfilePhoto = () => {
    onPressAvatar(item?.userId);
  };
  const {
    avatar,
    fullName,
    phoneNumber,
    email,
    agentGroup,
    contactRole,
    contactable = false,
    visible = false,
    isAgent,
  } = item ?? {};
  const hideView = {opacity: 0};

  const role = BuyRequestUtil.getContactTitle(contactRole);

  return (
    <View key={email + phoneNumber} style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.text}>{role}</Text>
        <View style={commonStyles.separatorRow8} />
        <TouchableOpacity activeOpacity={0.8} onPress={onPressProfilePhoto} disabled={!isAgent}>
          <View style={styles.wrapperAvatar}>
            <View>
              <Avatar
                url={avatar}
                containerStyle={styles.avatar}
                size={CONSTANTS.AVATAR_SIZE}
                onPress={onPressProfilePhoto}
              />
              {isAgent && <Image style={styles.rankIcon} source={IMAGES.LOGO_CIRCLE2} />}
            </View>
          </View>
          <View style={commonStyles.separatorRow8} />
          <Text style={styles.textHighlight}>{fullName}</Text>
        </TouchableOpacity>
        <Text style={[styles.agentGroup, !agentGroup && hideView]}>
          {translate('common.group')}:{' '}
          <Text style={{color: COLORS.BLACK_31}}>{agentGroup ?? 'Chưa tham gia'}</Text>
        </Text>
      </View>
      {visible && (
        <ContactWithStringeeView
          enabled={contactable}
          avatar={avatar}
          fullName={fullName}
          phoneNumber={phoneNumber}
          email={email}
          navigation={navigation}
          onPressCallCallback={() => onPressCallCallback(role)}
          onPressChatCallback={() => onPressChatCallback(role)}
        />
      )}
    </View>
  );
};

const ContactList = ({
  contacts = [],
  containerStyle,
  onPressAvatar,
  navigation,
  onPressCallCallback,
  onPressChatCallback,
}) => {
  return (
    <View style={containerStyle}>
      <FlatList
        style={styles.listContainer}
        data={contacts}
        renderItem={({item}) =>
          ContactInfoItem({
            item,
            onPressAvatar,
            navigation,
            onPressCallCallback,
            onPressChatCallback,
          })
        }
        ItemSeparatorComponent={() => <View style={commonStyles.separatorColumn16} />}
        ListFooterComponent={() => <View style={commonStyles.separatorColumn16} />}
        ListHeaderComponent={() => <View style={commonStyles.separatorColumn16} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default ContactList;
