import { StyleSheet } from 'react-native';

import { colors } from '@/vars';

export default StyleSheet.create({
  scrollBarWrapper: {
    width: 4,
    backgroundColor: colors.blue_600,
    borderRadius: 2,
    position: 'absolute',
    top: 60,
    right: 6,
  },
  scrollBarIndicator: {
    width: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue_600,
  },
});
