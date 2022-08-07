import { StyleSheet } from 'react-native';
import { Theme } from '@components/Theme';
import { fonts } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flex: 1
  },
  headers: {
    height: 47,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 7,
    justifyContent: 'flex-start'
  },
  text: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    lineHeight: 16,
    color: Theme.request_detail.text,
    textAlign: 'right',
  },
  styleContainerTitle: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  titleStatus: {
    marginStart: 8,
    color: Theme.sectionHeader.title,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.MontserratRegular
  },
  thumbnail: {
    width: 26,
    height: 26,
    marginRight: 8
  },
  priority: {
    fontSize: 10,
    fontFamily: fonts.MontserratLight,
    lineHeight: 16,
    paddingVertical: 4,
    paddingHorizontal: 18,
    borderRadius: 2
  },
  file_image: {
    backgroundColor: Theme.request_detail.backgroundColor,
    paddingTop: 15
  },
  flatListImages: {
    marginVertical: 15,
    marginLeft: 30
  },
  images: {
    marginRight: 9,
  },
  flatListFiles: {
    marginLeft: 30
  },
  files: {
    flexDirection: 'row',
    marginBottom: 15
  },
  iconFiles: {
    width: 15,
    height: 15,
    marginRight: 7
  },
  textFiles: {

  },
  textFilesContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  headerComment: {
    flexDirection: 'row',
    backgroundColor: Theme.request_detail.backgroundColor,
    paddingVertical: 15,
    paddingLeft: 15
  },
  textComment: {
    fontSize: 13,
    lineHeight: 24,
    fontFamily: fonts.MontserratLight,
    color: Theme.request_detail.textComment
  },
  totalNumber: {
    color: Theme.request_detail.totalNumber,
    paddingHorizontal: 3
  },
  commentsContainer: {
    width: '100%',
    backgroundColor: Theme.request_detail.backgroundColor,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputContainer: {
    paddingHorizontal: 0,
    paddingLeft: 16
  },
  commentsInnerContainer: {
    height: 35,
  },
  iconCommentsContainer: {
    height: 36,
    width: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.request_detail.totalNumber,
    marginRight: 0,
    borderRadius: 2
  },
  iconComments: {
    width: 16,
    height: 16,
  },
  styleTitle: {
    paddingRight: 14
  },
  itemComments: {
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  dropdownContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowImage: {
    marginTop: 5,
    width: 10,
    height: 10,
    marginLeft: 7
  },
  buttonAssignee: {
    backgroundColor: Theme.request_detail.backgroundColor,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 7
  },
  titleButtonAssignee: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    lineHeight: 24
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Theme.request_detail.line,
  },
  replyTo: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8
  },
  titleReplyTo: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 11,
    color: Theme.request_detail.totalNumber,
    marginRight: 5
  },
  contentReplyTo: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 11,
    color: Theme.request_detail.contentReplyTo,
    marginRight: 8
  },
  btnClose: {
    width: 11,
    height: 11,
    tintColor: Theme.request_detail.btnClose
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  mainContainerSendTo: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    alignItems: 'stretch'
  },
  descriptionStyle: {
    marginBottom: 0
  },
  moreStyleSendTo: {
    borderWidth: 0,
    height: 45,
  },
  styleTouchable: {
    flex: 1
  },
  containerStyleSendTo: {
    paddingHorizontal: 0,
    justifyContent: 'flex-end'
  },
  textStyleSendTo: {
    alignItems: 'flex-end',
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    lineHeight: 16,
    color: Theme.request_detail.text,
    textAlign: 'right',
  }
});

export default styles;
