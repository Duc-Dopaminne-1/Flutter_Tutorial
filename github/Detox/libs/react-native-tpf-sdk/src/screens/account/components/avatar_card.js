import { useNavigation } from '@react-navigation/native';
import { getProfileHandle, getTopenIDProfileHandle } from '../../../redux/actions/member';
import { default_avatar } from '../../../assets/images';
import { Heading } from '../../../components/';
import { BACKGROUND_COLOR, CUSTOM_COLOR } from '../../../constants/colors';
import { SPACING } from '../../../constants/size';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { scale } from '../../../utils/responsive';

const AvatarCard = props => {
  const { imageLink, name } = useSelector(state => state.member?.topenIdProfile) || {};
  const { memberId } = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getProfileHandle({ memberId: memberId }));
    dispatch(getTopenIDProfileHandle());
    const focusListener = navigation.addListener('focus', () => {
      dispatch(getProfileHandle({ memberId: memberId }));
      dispatch(getTopenIDProfileHandle());
    });
    return () => {
      focusListener();
    };
  }, [dispatch, memberId, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.rowContainer}>
          <View style={styles.avatar}>
            {imageLink ? (
              <FastImage style={styles.avatarImage} source={{ uri: imageLink }} />
            ) : (
              <FastImage style={styles.avatarImage} source={default_avatar} />
            )}
          </View>
          <View style={styles.titleContainer}>
            <Heading style={styles.title} numberOfLines={2}>
              {name}
            </Heading>
          </View>
        </View>
      </View>
    </View>
  );
};

export default React.memo(AvatarCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR.White,
    paddingHorizontal: SPACING.Medium,
    height: scale(92),
    borderBottomColor: CUSTOM_COLOR.Whisper
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.Medium,
    alignItems: 'center'
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarImage: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(60)
  },
  titleContainer: {
    justifyContent: 'flex-start',
    paddingLeft: SPACING.Medium,
    width: '77%'
  },
  title: {
    width: '100%'
  }
});
