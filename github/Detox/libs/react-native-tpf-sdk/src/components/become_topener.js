import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector, useDispatch } from 'react-redux';
import { become_topener4 } from '../assets/images';
import { EVENT_TYPE } from '../constants/analyticEnums';
import SCREENS_NAME from '../constants/screens';
import { SPACING } from '../constants/size';
import { MEMBER_TYPE } from '../global/member_type';
import { handleTouch } from '../helpers/handleTouch';
import { scale } from '../utils/responsive';
import { getBecomeTopenerHandle } from '../redux/actions/masterData';

const BecomeTopener = ({ style, ...props }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { role, topenId } = useSelector(state => state.auth);
  const { link, imageUrl } = useSelector(state => state.masterData.becomeTopenerData);

  const gotoTopenSubscriptionScreen = useCallback(() => {
    dispatch(
      getBecomeTopenerHandle(
        _ => {},
        data => Linking.openURL(data.result.updrageTopenerUrl)
      )
    );
  }, [dispatch]);

  return role === MEMBER_TYPE.Member ? (
    <TouchableOpacity style={[styles.container, style]} onPress={gotoTopenSubscriptionScreen}>
      {imageUrl ? (
        <FastImage source={{ uri: imageUrl }} style={styles.image} resizeMode="stretch" />
      ) : (
        <FastImage source={become_topener4} style={styles.image} resizeMode="stretch" />
      )}
    </TouchableOpacity>
  ) : null;
};
export default React.memo(BecomeTopener);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.Medium
  },
  image: {
    height: scale(100),
    width: '100%'
  }
});
