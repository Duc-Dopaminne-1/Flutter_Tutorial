import React, { useContext } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ICMapSchedule, ICMessage, ICPhone, ICStar } from '../../assets/icons';
import { default_avatar } from '../../assets/images';
import { CheckBox, PrimaryButton } from '../../components';
import { BACKGROUND_COLOR, TEXT_COLOR } from '../../constants/colors';
import themeContext from '../../constants/theme/themeContext';
import { formatDate } from '../../helpers/formatTime';
import AppText from '../app_text';
import styles from './styles';

const TopenerInfo = props => {
  const {
    checked,
    deleteMode,
    isShowBornDate,
    isShowButtonsConfirm,
    item,
    role,
    handleShowDetailTopenerInfo,
    handleProcessMemberRequest,
    groupId,
    leaderId,
    isLeaveRequestScreen,
    onCheckItem
  } = props;
  const theme = useContext(themeContext);
  return (
    <TouchableOpacity
      onPress={() => {
        handleShowDetailTopenerInfo?.(item.id);
      }}>
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={styles.infoNameAndPhone}>
            {item?.imageLink ? (
              <Image source={item?.imageLinkr} style={styles.avatar} />
            ) : (
              <Image source={default_avatar} style={styles.avatar} />
            )}

            <View style={styles.detail}>
              <View style={styles.detailWrapper}>
                <Text
                  style={[
                    styles.detailName,
                    { color: theme?.text?.primary, fontFamily: theme?.fonts?.SEMIBOLD }
                  ]}>
                  {item?.name}
                </Text>
                {item?.role === 1 && role !== 1 ? <ICStar /> : null}
              </View>
              {item?.phone ? (
                <View style={[styles.detailWrapper, styles.marginBottom0, styles.alignItemsCenter]}>
                  <View style={styles.detailPhone}>
                    <ICPhone width={17} height={17} />
                    <Text style={styles.detailPhoneText}>{item?.phone}</Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.detailWrapperRight}>
            {!deleteMode ? (
              <ICMessage width={20} height={20} />
            ) : item?.role !== 1 ? (
              <CheckBox onChange={value => onCheckItem(value, item)} checked={checked} />
            ) : null}
            {item?.dob && isShowBornDate ? (
              <AppText style={styles.bornDateText}>{formatDate(item?.dob)}</AppText>
            ) : null}
          </View>
        </View>
        {item?.address ? (
          <View style={styles.infoAddress}>
            <ICMapSchedule width={15} height={20} />
            <AppText translate={false} style={styles.infoAddressText}>
              {item?.address}
            </AppText>
          </View>
        ) : null}
        {isShowButtonsConfirm ? (
          <View style={styles.buttonsConfirm}>
            <PrimaryButton
              style={[styles.accept, styles.button]}
              backgroundColor={BACKGROUND_COLOR.Orange}
              translate
              title={'group_topener.accept'}
              onPress={() => {
                if (isLeaveRequestScreen) {
                  handleProcessMemberRequest?.({
                    GroupId: groupId,
                    MemberId: item.id,
                    LeaderActionType: 1,
                    LeaderId: leaderId
                  });
                } else {
                  handleProcessMemberRequest?.({
                    GroupId: groupId,
                    MemberId: item.id,
                    LeaderActionType: 2,
                    LeaderId: leaderId
                  });
                }
              }}
            />
            <PrimaryButton
              colorText={TEXT_COLOR.Orange}
              style={[styles.reject, styles.button]}
              backgroundColor={BACKGROUND_COLOR.LightPink}
              translate
              title={'group_topener.reject'}
              onPress={() => {
                if (isLeaveRequestScreen) {
                  handleProcessMemberRequest?.({
                    GroupId: groupId,
                    MemberId: item.id,
                    LeaderActionType: 4,
                    LeaderId: leaderId
                  });
                } else {
                  handleProcessMemberRequest?.({
                    GroupId: groupId,
                    MemberId: item.id,
                    LeaderActionType: 3,
                    LeaderId: leaderId
                  });
                }
              }}
            />
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export default TopenerInfo;
