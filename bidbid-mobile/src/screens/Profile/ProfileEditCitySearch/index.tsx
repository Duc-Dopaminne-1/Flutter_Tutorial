import React, { ReactElement, useEffect } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeArea } from '@/components/SafeArea';
import { colors } from '@/vars';
import { ProfileEditInfo } from '@/screens/Profile/component/ProfileEditInfo';
import { ProfileInfo } from '@/screens/Profile/component/ProfileInfo';
import { useDispatch } from 'react-redux';
import { getUser } from '@/redux/user/actions';

export function ProfileEditCitySearchScreen(): ReactElement {
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
    marginTop: 27,
    paddingHorizontal: 24,
  },
  wrapSetting: {
    flex: 1,
    paddingTop: 32,
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: colors.bg_gray_light,
    borderRadius: 30,
  },
});
