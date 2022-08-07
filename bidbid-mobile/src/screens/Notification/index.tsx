import React, { ReactElement, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/vars';
import { SafeArea } from '@/components/SafeArea';
import NotificationList from '@/screens/Notification/component/NotificationList';
import { NotificationHeader } from '@/screens/Notification/component/NotificationHeader';
import { NotificationContext } from './NotificationContext';
export function NotificationScreen(): ReactElement {
  const [isEmpty, setIsEmpty] = useState(false);

  const onSetStatusData = useCallback((data: boolean) => {
    setIsEmpty(data);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        onSetStatusData,
        isEmpty,
      }}
    >
      <View style={styles.container}>
        <SafeArea />
        <NotificationHeader />
        <NotificationList />
      </View>
    </NotificationContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 0,
  },
});
