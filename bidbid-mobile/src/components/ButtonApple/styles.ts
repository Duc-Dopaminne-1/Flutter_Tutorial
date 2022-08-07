import { StyleSheet } from 'react-native';
import { colors } from '@/vars';

const styles = StyleSheet.create({
  appleButton: {
    borderWidth: 1,
    fontSize: 13,
    height: 44,
    width: '100%',
    borderRadius: 10,
  },
  wrapBtnApple: {
    height: 48,
    marginRight: 34,
    width: 48,
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
