import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { Staff } from './Models';
import { colors } from '@src/constants/vars';
import { CustomText } from '@src/components/CustomText';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { AVATAR_DEFAULT_RECTANGLE } from '@src/constants/icons';
import { ICompanyUser } from '@reup/reup-api-sdk/libs/api/company/user/models';
import { getFullName, getUserNameFromMail, upperCaseFirstChar } from '@src/utils';

type Props = {
  onPress: (item: ICompanyUser) => void;
  item: ICompanyUser;
};

const StaffItem = (props: Props) => {
  const { item, onPress } = props;

  let displayName = getFullName(item.user.first_name, item.user.last_name);
  if (!item.user.first_name && !item.user.last_name) {
    displayName = getUserNameFromMail(item.user.email);
  }
  const displayAvatar = item.user.avatar ? item.user.avatar : "";
  let displayPosition = item.position && item.position.name ? item.position.name : "";
  if (!displayPosition) {
    displayPosition = item.role.name;
  }
  const displayStatus = upperCaseFirstChar(item.status ? item.status.valueOf() : '');
  return (
    <TouchableOpacity onPress={() => onPress(item)} style={[styles.container]}>
      <RectangleAvatar imageDefault={AVATAR_DEFAULT_RECTANGLE} avatar={displayAvatar} styleContainer={styles.image} />
      <View style={styles.contentContainer}>
        <CustomText style={styles.name} text={displayName} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <CustomText style={styles.id} numberOfLines={1} text={displayPosition} />
          <CustomText style={styles.status} text={displayStatus} />
        </View>

      </View>
    </TouchableOpacity >
  );
};

export default React.memo(StaffItem);
