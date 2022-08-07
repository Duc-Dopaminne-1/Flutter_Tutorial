import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import styles from './styles';
import { CHECKBOX_UNSELECT, CHECKBOX_SQUARE, AVATAR_DEFAULT_RECTANGLE } from '@constants/icons';
import { CustomText } from '@src/components/CustomText';
import RoleType from '@src/screens/manager/Tenant/enum';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { getFullName, getUserNameFromMail } from '@src/utils';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';

type Props = {
  role: RoleType;
  selectedIds?: string[];
  item: IUnitMember;
  onPress?: (item: IUnitMember) => void;
  onPressItem?: (item: IUnitMember) => void;
};

const FamilyMemberItem = (props: Props) => {
  const { role, item, selectedIds, onPress, onPressItem } = props;
  const isSelected = selectedIds?.some(id => item.id === id);
  let displayName = getFullName(item.member.first_name ?? '', item.member.last_name ?? '');
  if (!item.member.first_name && !item.member.last_name) {
    displayName = getUserNameFromMail(item.member.email ?? '');
  }

  return (
    <TouchableOpacity onPress={onPressItem?.bind(undefined, item)}>
      <View style={styles.container}>
        {role === RoleType.management ? null : (
          <TouchableOpacity onPress={onPress?.bind(undefined, item)} style={styles.checkBoxView}>
            <Image source={isSelected ? CHECKBOX_SQUARE : CHECKBOX_UNSELECT} style={styles.checkBox} />
          </TouchableOpacity>
        )}
        <RectangleAvatar imageDefault={AVATAR_DEFAULT_RECTANGLE} avatar={item.member.avatar} styleContainer={styles.image} />
        <View style={styles.contentContainer}>
          <CustomText text={displayName} style={styles.name} numberOfLines={1} />
          <CustomText text={item.role} style={styles.description} numberOfLines={1} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(FamilyMemberItem);
