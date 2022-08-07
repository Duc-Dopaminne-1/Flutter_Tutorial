import { WIDTH, colors, fonts, HEIGHT } from '@constants/vars';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    zIndex: 1,
  },

  logo: {
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.8,
  },

  shareIcon: {
    width: 24,
    height: 24,
    marginTop: 15,
    marginRight: 15,
    marginBottom: 7,
  },

  blogInfoContainer: {
    paddingTop: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.SECONDARY,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 18,
    marginRight: 6,
  },

  containerTab: {
    flex: 1,
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: colors.SECONDARY,
    paddingTop: 10,
    marginBottom: 52,
  },

  tabContainer: {
    backgroundColor: 'transparent',
  },

  tab: {
    backgroundColor: 'transparent',
    padding: 0,
    width: 'auto',
    marginHorizontal: 15,
  },

  labelContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  indicator: {
    width: '100%',
    height: 3,
    backgroundColor: 'red',
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
