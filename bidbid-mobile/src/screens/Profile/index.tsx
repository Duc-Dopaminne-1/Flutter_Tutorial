import React, { ReactElement, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { ProfileEditInfo } from '@/screens/Profile/component/ProfileEditInfo';
import { ProfileInfo } from '@/screens/Profile/component/ProfileInfo';
import { useDispatch } from 'react-redux';
import { getUser } from '@/redux/user/actions';

export function ProfileScreen(): ReactElement {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getUser({
        onSuccess: () => undefined,
        onFail: () => undefined,
      }),
    );
  }, []);

  return (
    <View style={styles.container}>
      <SafeArea />
      <ScrollView>
        <View style={styles.wrapAvatar}>
          <ProfileInfo />
        </View>

        <View style={styles.wrapSetting}>
          <ProfileEditInfo />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  wrapAvatar: {
    paddingHorizontal: 24,
  },
  wrapSetting: {
    flex: 1,
    paddingBottom: 8,
    paddingHorizontal: 24,
    marginTop: 20,
  },
});
