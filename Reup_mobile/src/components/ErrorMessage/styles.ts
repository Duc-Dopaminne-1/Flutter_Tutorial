import { StyleSheet } from 'react-native';
import { colors } from '@src/constants/vars';

const styles = StyleSheet.create({
  errorText: {
    color: colors.RED_COLOR,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
    height: 15,
    alignSelf: 'flex-start',
  },
  container: {
    alignSelf: 'flex-start'
  }
});

export default styles;
