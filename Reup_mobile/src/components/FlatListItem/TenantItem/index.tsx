import React from 'react';
import { View, Image } from 'react-native';
import styles from './styles';
import { colors } from '@src/constants/vars';
import { CustomText } from '@src/components/CustomText';
import { CustomTouchable } from '@src/components/CustomTouchable';
import RectangleAvatar from '@src/components/RectangleAvatar';
import { AVATAR_DEFAULT_RECTANGLE } from '@src/constants/icons';
import { getFullName, getUserNameFromMail, upperCaseFirstChar, getApartmentName } from '@src/utils';
import { IUnitMember } from '@reup/reup-api-sdk/libs/api/unit/member/models';

type Props = {
  onPress: (item: IUnitMember) => void;
  item: IUnitMember;
};

const TenantItem = (props: Props) => {
  const { item, onPress } = props;
  const tenantInfo = item && item.member;
  const unit = item && item.unit;
  let displayName = getFullName(tenantInfo.first_name ? tenantInfo.first_name : ''
    , tenantInfo.last_name ? tenantInfo.last_name : '');
  if (!tenantInfo.first_name && !tenantInfo.last_name) {
    displayName = getUserNameFromMail(tenantInfo.email ? tenantInfo.email : '');
  }
  const displayStatus = upperCaseFirstChar(item.status ? item.status.valueOf() : '');
  return (
    <CustomTouchable onPress={() => onPress(item)} style={styles.container}>
      <RectangleAvatar
        imageDefault={AVATAR_DEFAULT_RECTANGLE}
        avatar={tenantInfo.avatar ? tenantInfo.avatar : ""}
        styleContainer={styles.image}
      />
      <View style={styles.contentContainer}>
        <CustomText
          text={displayName}
          style={styles.name}
          numberOfLines={1} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <CustomText
            text={unit ? getApartmentName(unit.block, unit.floor, unit.code) : ""}
            style={styles.description}
            numberOfLines={1} />
          <CustomText style={styles.status} text={displayStatus} />
        </View>
      </View>
    </CustomTouchable>
  );
};

export default React.memo(TenantItem);
