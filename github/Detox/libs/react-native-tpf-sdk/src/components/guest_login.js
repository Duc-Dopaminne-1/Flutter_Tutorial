import { logOutHandle } from '../redux/actions/auth';
import { become_member2 } from '../assets/images';
import { SPACING } from '../constants/size';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { MEMBER_TYPE } from '../global/member_type';
import { scale } from '../utils/responsive';

const GuestLogin = ({ style }) => {
  const role = useSelector(state => state.auth.role);
  const dispatch = useDispatch();
  return role === MEMBER_TYPE.Guest ? (
    <TouchableOpacity style={[styles.container, style]} onPress={() => dispatch(logOutHandle())}>
      <FastImage source={become_member2} style={styles.image} resizeMode="stretch" />
    </TouchableOpacity>
  ) : null;
};
export default React.memo(GuestLogin);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.Medium
  },
  image: {
    height: scale(60),
    width: '100%'
  }
});
