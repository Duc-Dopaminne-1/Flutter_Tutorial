import React from 'react';
import { CustomTouchable } from '@src/components/CustomTouchable';
import { CustomText } from '@src/components/CustomText';
import { CustomAvatar } from '@src/components/CustomAvatar';
import { useSelector } from 'react-redux';
import { RootState } from '@src/types/types';
import { IUser } from '@goldfishcode/noir-caesar-api-sdk/libs/api/user/models';
import { get } from 'lodash';
import styles from './styles';
import translate from '@src/localize';

interface Props {
  onTapOnMyProfile: () => void;
}

const MyProfileView = (props: Props) => {
  const { onTapOnMyProfile } = props;
  const me = useSelector<RootState, IUser>((state: RootState) => state.auth.userData!);
  const avatar = get(me, ['avatar'], undefined);

  return (
    <CustomTouchable onPress={onTapOnMyProfile} style={styles.containerProfile}>
      <CustomText text={translate('drawer.my_profile')} style={styles.containerMyProfile} />
      <CustomAvatar style={styles.avatarProfile} uri={avatar} />
    </CustomTouchable>
  );
};

export default MyProfileView;
