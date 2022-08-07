import { StyleSheet } from 'react-native';
import { colors, WIDTH, HEIGHT, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.8,
  },

  tabContainer: {
    backgroundColor: colors.SECONDARY,
    paddingStart: 15,
  },

  tab: {
    padding: 0,
    width: 'auto',
    marginRight: 20,
  },

  indicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'red',
  },

  containerTab: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
  },

  labelContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  content: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },

  bookInfoContainer: {
    paddingTop: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.SECONDARY,
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  name: {
    fontSize: 18,
    marginRight: 6,
  },

  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.PRIMARY,
  },

  addCommentButton: {
    width: '100%',
    justifyContent: 'center',
    height: 52,
    borderRadius: 0,
  },

  collapseHeader: {
    width: '100%',
    marginTop: -(HEIGHT * 0.12),
    zIndex: -1,
  },

  tabInActiveTextStyle: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 2,
  },

  tabActiveTextStyle: {
    fontFamily: fonts.AvenirLTStdRoman,
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 2,
  },
});

export default styles;
