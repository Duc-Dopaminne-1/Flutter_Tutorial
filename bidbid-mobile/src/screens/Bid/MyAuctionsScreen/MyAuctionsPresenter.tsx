import React, { ReactElement } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MeetAndGreetHistoryContainer from './components/MeetAndGreetHistoryContainer';
import MyAuctionsTopViewContainer from './components/MyAuctionsTopViewContainer';

export default function MyAuctionsPresenter(): ReactElement {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MyAuctionsTopViewContainer />
      <MeetAndGreetHistoryContainer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 20,
    marginBottom: 0,
  },
});
