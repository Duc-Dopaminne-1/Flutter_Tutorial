import { StyleSheet, Platform } from 'react-native';
import { SPACING_DEFAULT, colors, WIDTH } from '@src/constants/vars';
import { moderateScale } from 'react-native-size-matters';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.SECONDARY,
    borderRadius: 10,
  },
  deleteImageContainer: {
    position: 'absolute',
    right: -12,
    top: -12,
  },
  deleteImageIcon: {
    height: 24,
    width: 24,
  },
  imageAttach: {
    height: 80,
    width: 80,
    marginLeft: 15,
    borderWidth: 1,
    borderColor: '#676877',
    borderRadius: 8
  },
  iconDetele: {
    height: 38,
    width: 38,
  },
  containerWithoutImage: {
    backgroundColor: colors.WHITE,
    borderRadius: 10,
  },
  wrapperImage: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingRight: 15,
  },
  image: {
    alignItems: 'flex-end',
  },
  chatBar: {
    height: 80,
    backgroundColor: colors.SECONDARY,
    width: WIDTH,
    paddingLeft: SPACING_DEFAULT,
    paddingRight: SPACING_DEFAULT,
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputChatContainer: {
    flex: 1,
    backgroundColor: 'black',
    borderRadius: 45,
    borderWidth: 1,
    flexDirection: 'row',
  },
  inputChat: {
    color: '#B8B8B8',
    fontSize: 14,
  },
  buttonSendContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  moreStyle: {
    flex: 8,
    borderRadius: 0,
    marginTop: Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: 'transparent',
  },
  icon: {
    width: 36,
    height: 36,
  },
  iconSend: {
    width: 20,
    height: 20,
  },
  iconMicro: {
    width: 20,
    height: 20,
  },
  iconCancel: {
    width: 15,
    height: 15,
  },
  text: {
    fontSize: 12,
    color: '#FFF',
  },
  draggable: {
    marginEnd: 15,
    marginTop: 20,
  },
  mainIconRed: {
    maxWidth: moderateScale(150, 2),
    width: 150,
    height: 55,
  },
  mainIconAnimated: {
    maxWidth: moderateScale(150, 2),
    top: 0,
    left: 0,
    position: 'absolute',
    overflow: 'hidden',
  },
  mainIcon: {
    maxWidth: moderateScale(150, 2),
    width: 150,
    height: 55,
  },
  recordContainer: {
    backgroundColor: 'transparent',
    width: WIDTH,
    height: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
  },
  recordRow: {
    height: 55,
    flex: 1,
    marginHorizontal: SPACING_DEFAULT,
    borderRadius: 36,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    paddingEnd: 15,
    paddingStart: 10,
    paddingVertical: 15,
    flexDirection: 'row',
  },
  containerIconAudio: {
    flex: 1,
    marginStart: 10,
  },
  iconProgressAudio: {
    width: 40,
    height: 30,
  },
  time: {
    alignSelf: 'flex-end',
  },
  fakePin: {
    height: 80,
    width: 65,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipetext: {
    fontSize: 10,
    color: '#676877',
  },
});

const options = {
  container: {
    position: 'absolute',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: 'transparent',
  },
};

export { styles, options };
