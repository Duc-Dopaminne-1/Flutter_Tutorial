import { StyleSheet } from 'react-native';
import { fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';
const styles = StyleSheet.create({
  containers: {
    flex: 1,
    marginTop: 7,
    paddingVertical: 22,
    paddingHorizontal: 14,
    backgroundColor: Theme.transfer_apartment.contentSd
  },
  titleContainers: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    textAlign: 'left',
    color: Theme.transfer_apartment.buttonSubmit
  },
  description: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    textAlign: 'left',
    color: 'black'
  },
  viewAuthor: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15
  },
  createBy: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    textAlign: 'left',
    color: 'black'
  },
  author: {
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
    textAlign: 'left',
    color: Theme.transfer_apartment.buttonSubmit
  },
  file_image: {
    backgroundColor: Theme.request_detail.backgroundColor,
    paddingTop: 15
  },
  flatListImages: {
    marginVertical: 20,
  },
  images: {
    width: 158,
    height: 104,
    marginRight: 15,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3
  },
  titleImage: {
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
    textAlign: 'left',
    color: 'black'
  },
  downloadFile: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 15
  },
  files: {
    flexDirection: 'row',
    marginBottom: 15
  },
  iconFiles: {
    width: 23,
    height: 30,
    marginRight: 13
  },
  textFiles: {
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    textAlign: 'left',
    color: Theme.transfer_apartment.buttonSubmit
  },
  textFilesContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
});

export default styles;
