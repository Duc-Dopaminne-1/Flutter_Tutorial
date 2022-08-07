import { StyleSheet } from 'react-native';
import { colors, WIDTH, HEIGHT, fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: WIDTH * 0.8,
    backgroundColor: colors.PRIMARY,
  },

  logoBG: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
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

  videoInfoContainer: {
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

  timeContainer: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#ffffff',
    width: 40,
    paddingVertical: 2.5,
  },
  time: {
    fontSize: 8,
    color: '#ffffff',
  },
  header: {
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  tabview: {
    flex: 1,
    width: '100%',
  },
  tabBar: {
    backgroundColor: 'transparent',
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
