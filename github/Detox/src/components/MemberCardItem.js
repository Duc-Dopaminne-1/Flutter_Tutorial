import React from 'react';
import {Image, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';

import {IMAGES} from '../assets/images';
import {translate} from '../assets/localize';
import {COLORS} from '../assets/theme/colors';
import {FONTS} from '../assets/theme/fonts';
import {HELPERS} from '../assets/theme/helpers';
import {METRICS} from '../assets/theme/metric';
import {commonStyles} from '../assets/theme/styles';
import Avatar from './Avatar';
import {Group} from './Badge';
import RatingComponent from './RatingComponent';

const styles = StyleSheet.create({
  iconContactView: {
    width: 21,
    height: 21,
    ...HELPERS.center,
  },
  nameStyle: {
    ...FONTS.fontSize14,
    ...FONTS.bold,
    color: COLORS.BLACK_31,
  },
  verticalSeparatorLine: {
    borderLeftWidth: 1,
    height: 32,
    borderColor: COLORS.GREY_F0,
    alignSelf: 'center',
  },
  container: {
    flexDirection: 'row',
  },
  headerTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.BLACK_31,
    marginBottom: 16,
  },
});

const AVATAR_SIZE = 66;

type ContactButtonProps = {
  onPress: Function,
  title: String,
  image: Any,
};

const ContactButton = ({onPress, title, image}: ContactButtonProps) => {
  return (
    <TouchableOpacity style={HELPERS.fillRowCenter} onPress={onPress}>
      <Image source={image} style={styles.iconContactView} />
      <View style={commonStyles.separatorColumn8} />
      <Text style={[FONTS.bold, FONTS.fontSize12, {color: COLORS.PRIMARY_A100}]}>{title}</Text>
    </TouchableOpacity>
  );
};

type MemberCardProps = {
  title: String,
  titleStyle: TextStyle,
  avatar: String,
  agentRating: Number,
  fullName: String,
  isAgent: Boolean,
  onPressAvatar: Function,
  onPressCall: Function,
  onPressSendMessage: Function,
  disablePressAvatar: Boolean,
  showRating: Boolean,
  showContactButtons: Boolean,
  containerStyle: ViewStyle,
};

const MemberCardItem = ({
  title,
  titleStyle,
  avatar,
  agentRating,
  fullName,
  isAgent,
  onPressAvatar,
  onPressCall,
  onPressSendMessage,
  disablePressAvatar,
  showRating,
  showContactButtons,
  containerStyle,
}: MemberCardProps) => {
  return (
    <View style={containerStyle}>
      {!!title && <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>}
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.8} onPress={onPressAvatar} disabled={disablePressAvatar}>
          <Avatar url={avatar} containerStyle={{...METRICS.marginEnd}} size={AVATAR_SIZE} />
        </TouchableOpacity>
        <View style={[HELPERS.crossStart, HELPERS.fill, HELPERS.mainSpaceBetween]}>
          <Text numberOfLines={1} style={styles.nameStyle}>
            {fullName}
          </Text>
          <Group isAgent={isAgent} />
          {showRating && (
            <RatingComponent
              rateNumber={agentRating}
              backgroundColor={COLORS.BACKGROUND}
              imageSize={13}
            />
          )}
        </View>
      </View>
      {showContactButtons && (
        <View style={[HELPERS.fullWidth, HELPERS.row, METRICS.marginTop]}>
          <ContactButton
            onPress={onPressCall}
            image={IMAGES.CALL_FILL}
            title={translate('propertyPost.contactPhone')}
          />
          <View style={styles.verticalSeparatorLine} />
          <ContactButton
            onPress={onPressSendMessage}
            image={IMAGES.MESSAGE_FILL}
            title={translate('propertyPost.sendMessage')}
          />
        </View>
      )}
    </View>
  );
};

MemberCardItem.defaultProps = {
  title: '',
  titleStyle: {},
  avatar: '',
  agentRating: 0,
  fullName: '--',
  isAgent: true,
  onPressAvatar: () => {},
  onPressCall: () => {},
  onPressSendMessage: () => {},
  disablePressAvatar: false,
  showRating: true,
  showContactButtons: true,
  containerStyle: {},
};

export default MemberCardItem;
