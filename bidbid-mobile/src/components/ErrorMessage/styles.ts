import { StyleSheet } from 'react-native';
import { colors } from '@/vars';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
  wrapText: {
    alignSelf: 'center',
  },
  errorText: {
    color: colors.red_700,
    fontSize: 12,
    marginBottom: 6,
    marginTop: 4,
  },
});

export default styles;
