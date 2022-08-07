import { StyleSheet } from 'react-native';
import { colors, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  errorText: {
    color: colors.RED_COLOR,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
    width: '100%',
    alignContent: 'flex-start',
  },
});

export default styles;
