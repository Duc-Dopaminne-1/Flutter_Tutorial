import React from 'react';
import { StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '@/vars';

export interface Style {
  activityIndicatorWrapper: ViewStyle;
}

export interface Props {
  loading: boolean;
  isFullScreen?: boolean;
  coverScreen?: boolean;
}

function Spinner(prop: Props) {
  const { loading = false, isFullScreen = true, coverScreen = true } = prop;
  if (!isFullScreen) return <ActivityIndicator color={colors.red_600} size="large" style={styles.center} />;
  return (
    <Modal
      animationInTiming={5}
      backdropTransitionInTiming={5}
      animationOutTiming={5}
      backdropTransitionOutTiming={5}
      isVisible={loading}
      style={styles.wrapLoading}
      coverScreen={coverScreen}
    >
      <ActivityIndicator color={colors.red_600} size="large" style={styles.activityIndicatorWrapper} />
    </Modal>
  );
}

export default React.memo(Spinner);

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    alignSelf: 'center',
  },

  activityIndicatorWrapper: {
    backgroundColor: colors.transparent,
    height: 110,
    width: 110,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  wrapLoading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
