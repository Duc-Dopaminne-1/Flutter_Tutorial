import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {SIZES} from '../../assets/constants/sizes';
import {IMAGES} from '../../assets/images';
import {COLORS} from '../../assets/theme/colors';
import {FONTS} from '../../assets/theme/fonts';
import {HELPERS} from '../../assets/theme/helpers';
import {METRICS} from '../../assets/theme/metric';
import {commonStyles} from '../../assets/theme/styles';
import {Group} from '../../components/Badge';
import CustomButton from '../../components/Button/CustomButton';
import RatingComponent from '../../components/Rating/RatingComponent';

const styles = StyleSheet.create({
  viewAgentInfomation: {
    ...HELPERS.row,
  },
  infoTitle: {...FONTS.regular, fontSize: 14, color: COLORS.BRAND_GREY},
  // borderLine: {borderRightWidth: 1, borderRightColor: COLORS.SEPARATOR_LINE},
  // textRank: {marginVertical: 5, marginRight: 20, marginLeft: 25},
  buttonUpgrate: {
    ...commonStyles.buttonNext,
    paddingHorizontal: 55,
  },
  viewUser: {
    alignItems: 'center',
    marginVertical: 16,
    borderTopWidth: 1,
    paddingVertical: 12,
    borderColor: COLORS.SELECTED_AREA,
  },
  textUser: {marginBottom: 8, ...FONTS.regular},
  profileCardContainer: {
    ...METRICS.horizontalMargin,
    borderRadius: 16,
    backgroundColor: COLORS.NEUTRAL_WHITE,
    padding: 12,
    height: 102,
  },
  defaultAvatar: {
    marginRight: 16,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: SIZES.BORDER_WIDTH_1,
    borderColor: COLORS.GREY_ED,
  },
});

const ViewUpgrateAgent = ({onPress}) => {
  return (
    <View style={styles.viewUser}>
      <Text style={styles.textUser}>Trở thành Topener để nhận được nhiều ưu đãi</Text>
      <CustomButton
        onPress={onPress}
        style={styles.buttonUpgrate}
        titleStyle={{...FONTS.bold}}
        title={'Tham gia ngay'}
      />
    </View>
  );
};

const AgentInfomation = ({agentCode}) => {
  // const textTitle = isAgentLeader ? translate('AGENT_LEADER') : translate('AGENT_MEMBER');
  return (
    <View style={styles.viewAgentInfomation}>
      <View style={[HELPERS.row]}>
        <Text style={styles.infoTitle}>Mã đối tác: </Text>
        <Text style={{...FONTS.bold}}>{agentCode}</Text>
      </View>
    </View>
  );
};

const ProfileCardView = ({
  userName,
  isAgent,
  rateNumber,
  isAgentLeader,
  teamName,
  agentCode,
  getAvatarView = <Image style={styles.defaultAvatar} source={IMAGES.IC_DEFAULT_AVATAR} />,
}) => {
  return (
    <View style={styles.profileCardContainer}>
      <View style={HELPERS.fillRow}>
        {getAvatarView}
        <View style={[HELPERS.fill, HELPERS.mainCenter]}>
          <Text style={commonStyles.blackTextBold14} numberOfLines={2}>
            {userName}
          </Text>
          <View style={commonStyles.separatorRow8} />
          <View style={HELPERS.rowStartCenter}>
            <Group isAgent={isAgent} />
            <View style={commonStyles.separatorColumn32} />
            {isAgent && <RatingComponent rateNumber={rateNumber} isFullView={false} />}
          </View>
          <View style={commonStyles.separatorRow8} />
          {isAgent && (
            <AgentInfomation
              isAgentLeader={isAgentLeader}
              teamName={teamName}
              agentCode={agentCode}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export const ProfileInfoComponent = ({
  isAgent,
  rateNumber,
  userName,
  onUpgrateToAgent,
  isAgentLeader,
  agentCode,
  teamName,
  getAvatarView,
}) => {
  return (
    <>
      <ProfileCardView
        getAvatarView={getAvatarView}
        userName={userName}
        isAgent={isAgent}
        rateNumber={rateNumber}
        isAgentLeader={isAgentLeader}
        teamName={teamName}
        agentCode={agentCode}
      />
      {isAgent || <ViewUpgrateAgent onPress={onUpgrateToAgent} />}
    </>
  );
};
