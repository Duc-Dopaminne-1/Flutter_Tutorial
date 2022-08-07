import { colors, fonts, HEIGHT, WIDTH, WIDTH_RATIO } from '@src/constants/vars';
import { StyleSheet } from 'react-native';
const topPadding = WIDTH === 375 ? HEIGHT * 0.02 : HEIGHT * 0.05;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    flexDirection: 'column',
    paddingStart: 20,
    paddingEnd: 20,
    paddingTop: 20,
  },
  skipContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  contentSkip: {
    fontSize: 12,
    fontFamily: fonts.AvenirLTStdRoman,
    color: '#676877',
  },
  contentUpLoad: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontFamily: fonts.AvenirLTStdRoman,
    color: '#FF0000',
  },
  containerUpload: {
    alignItems: 'center',
    padding: 68,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#22222B',
    borderStyle: 'dashed',
    marginTop: 27,
  },
  image: {
    marginBottom: 20,
  },
  contentUploadBook: {
    fontSize: 14,
    fontFamily: fonts.AvenirLTStdRoman,
    color: '#676877',
  },
  containerItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  imageItem: {
    marginEnd: 10,
  },
  title: {
    marginTop: 20,
  },
  description: {
    height: 110,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  descriptionMore: {
    marginTop: 20,
    height: 110,
  },
  buttonSubmit: {
    marginTop: 30,
  },
  genre: {
    marginTop: 20,
  },
  headerContainer: {
    backgroundColor: 'transparent',
  },
  rightTextHeader: {
    justifyContent: 'center',
  },
  headerUpload: {
    height: HEIGHT * 0.12,
    paddingTop: topPadding,
    paddingHorizontal: 20
  },
  dropDownStyle: {
    marginTop: 20
  },
  choosePhotoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  choosePhotoItem: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    width: (WIDTH - 60) / 2,
    height: 100 * WIDTH_RATIO,
    borderRadius: 8,
    backgroundColor: colors.INPUT_BG
  },
  progress: {
    position: 'absolute',
    width: ((WIDTH - 60) / 2) - 10,
    bottom: 0,
    left: 5
  }
});

export default styles;
