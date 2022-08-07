import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerProfile: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginBottom: 6,
  },

  containerMyProfile: {
    color: 'white',
    fontSize: 22,
  },

  avatarProfile: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
  },
});

export default styles;
