import React, {useContext} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {IMAGES} from '../../../assets/images';
import {translate} from '../../../assets/localize';
import {COLORS} from '../../../assets/theme/colors';
import {FONTS} from '../../../assets/theme/fonts';
import {HELPERS} from '../../../assets/theme/helpers';
import {METRICS} from '../../../assets/theme/metric';
import {commonStyles} from '../../../assets/theme/styles';
import Avatar from '../../../components/Avatar';
import {Group} from '../../../components/Badge';
import RatingComponent from '../../../components/Rating/RatingComponent';
import {StringeeContext} from '../../Call/StringeeContext';
import styles from './styles';

const AVATAR_SIZE = 66;

export const ContactWithStringeeView = ({
  phoneNumber,
  fullName,
  avatar,
  navigation,
  enabled = true,
  onPressCallCallback,
  onPressChatCallback,
}) => {
  const {callUser, chatUser} = useContext(StringeeContext);

  const onPressCall = () => {
    onPressCallCallback && onPressCallCallback();
    callUser(
      phoneNumber,
      {
        fullName,
        avatar,
      },
      true,
    );
  };

  const onPressChat = () => {
    onPressChatCallback && onPressChatCallback();
    chatUser(phoneNumber, fullName, navigation, true);
  };

  const textDisabledStyle = enabled ? null : {color: COLORS.TEXT_DARK_40};
  const imageDisabledStyle = enabled ? null : {tintColor: COLORS.TEXT_DARK_40};

  return (
    <View style={[HELPERS.fullWidth, HELPERS.row, METRICS.marginTop]}>
      <TouchableOpacity disabled={!enabled} style={HELPERS.fillRowCenter} onPress={onPressCall}>
        <Image source={IMAGES.CALL_FILL} style={[styles.iconContactView, imageDisabledStyle]} />
        <View style={commonStyles.separatorColumn8} />
        <Text
          style={[FONTS.bold, FONTS.fontSize12, {color: COLORS.PRIMARY_A100}, textDisabledStyle]}>
          {translate('propertyPost.contactPhone')}
        </Text>
      </TouchableOpacity>
      <View style={styles.verticalSeparatorLine} />
      <TouchableOpacity disabled={!enabled} style={HELPERS.fillRowCenter} onPress={onPressChat}>
        <Image source={IMAGES.MESSAGE_FILL} style={[styles.iconContactView, imageDisabledStyle]} />
        <View style={commonStyles.separatorColumn8} />
        <Text
          style={[FONTS.bold, FONTS.fontSize12, {color: COLORS.PRIMARY_A100}, textDisabledStyle]}>
          {translate('propertyPost.sendMessage')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const AgentInfomation = ({
  state,
  onPressAvatar = () => {},
  onPressName = () => {},
  viewOwner = false,
  showContactButtons = false,
  navigation,
  showUsersGroup = true,
  onCallCallback,
  onChatCallback,
}) => {
  const viewStyle = StyleSheet.create({
    viewContainer: {
      flexDirection: 'row',
    },
    // rankIcon: {position: 'absolute', bottom: 0, left: AVATAR_SIZE - 30, width: 30, height: 30},
    // agentGroupDescription: {...FONTS.regular, color: COLORS.GRAY_A3, fontSize: 12},
  });

  const {
    avatar,
    agentRating,
    fullName,
    isAgent = false,
    phoneNumber,
    // agentRankingName,
    // agentGroupDescription,
  } = state;
  // const rankInfo = !viewOwner && !isEmpty(agentRankingName) && MAP_RANK[agentRankingName];
  // const rankIcon = !viewOwner && rankInfo && IMAGES[rankInfo?.icon];

  return (
    <View>
      <View style={viewStyle.viewContainer}>
        <Avatar
          url={avatar}
          containerStyle={{...METRICS.marginEnd}}
          onPress={onPressAvatar}
          disableOnPress={viewOwner}
          size={AVATAR_SIZE}
        />
        {/* {isAgent && !viewOwner && <Image style={viewStyle.rankIcon} source={rankIcon} />} */}
        <View style={[HELPERS.crossStart, HELPERS.fill, HELPERS.mainCenter]}>
          <Text numberOfLines={1} style={styles.nameStyle} onPress={onPressName}>
            {fullName}
          </Text>
          {showUsersGroup && <Group isAgent={isAgent} style={METRICS.smallMarginBottom} />}
          {(isAgent || viewOwner) && (
            <RatingComponent
              rateNumber={agentRating}
              backgroundColor={COLORS.BACKGROUND}
              imageSize={13}
            />
          )}
        </View>
      </View>
      {showContactButtons && (
        <ContactWithStringeeView
          phoneNumber={phoneNumber}
          avatar={avatar}
          fullName={fullName}
          navigation={navigation}
          onPressCallCallback={onCallCallback}
          onPressChatCallback={onChatCallback}
        />
      )}
    </View>
  );
};

export default AgentInfomation;
