import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7,
    backgroundColor: Theme.staff.containerBackground,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  line: {
    width: '100%',
  },
  searchContainer: {
    marginTop: 5,
  },
  filterButtonContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.staff.contentBackground,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 7,
    alignContent: 'center',
  },
  textRemove: {
    color: '#333333',
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  longButton: {
    width: (WIDTH - 30) * 0.72,
  },
  shortButton: {
    width: (WIDTH - 30) * 0.27,
    flex: 1,
    marginLeft: 8,
  },
  textDropDownNative: {
    flex: 1,
    color: Theme.filter_button.textColor,
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    textAlign: 'left',
  },
  buttonContainer: {
    height: 80,
    flexDirection: 'row',
    marginTop: 8,
    padding: 20,
    paddingBottom: 25,
    backgroundColor: Theme.staff.contentBackground,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingLeft: 14,
    borderBottomWidth: 1,
    borderColor: Theme.staff.borderLine,
    backgroundColor: Theme.staff.contentBackground,
  },
  staffImage: {
    height: 17,
    width: 17,
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  contentContainer: {
    justifyContent: 'space-between',
    flex: 1,
    height: 40,
    marginRight: 15,
  },
  imageBtnHeafer: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    height: 30,
  },
  containerImageBtn: {
    height: 32,
    width: 32,
    borderRadius: 2,
    backgroundColor: Theme.category_details.backgroundColorImageBtnHeafer,
  },
  iconImageBtn: {
    tintColor: Theme.category_details.tintColorIconImageBtn,
  },
  staffText: {
    marginLeft: 7,
    color: Theme.staff.button,
  },
  buttonDenied: {
    flex: 1,
    backgroundColor: Theme.status.backgroundDenied,
    marginLeft: 10,
  },
  textDenied: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: 'black',
  },
  buttonApproved: {
    flex: 1,
    backgroundColor: Theme.status.backgroundButtonApprove,
    marginRight: 10,
  },
  textApprove: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    color: 'white',
  },
  styleContainerSearchBar: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  containerScrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 17,
    paddingBottom: 5,
  },
  name: {
    alignSelf: 'flex-start',
    color: '#333333',
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    lineHeight: 18,
  },
  status: {
    alignSelf: 'flex-start',
    color: '#333333',
    fontSize: 12,
    fontFamily: fonts.MontserratMedium,
    lineHeight: 18,
    marginTop: 5,
  },
  created: {
    alignSelf: 'flex-start',
    color: '#707070',
    fontSize: 10,
    fontFamily: fonts.MontserratLight,
    lineHeight: 18,
    marginLeft: 15,
    marginBottom: 5,
  },
  type: {
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    lineHeight: 14,
    color: Theme.status.backgroundButtonApprove,
  },
  title: {
    alignSelf: 'flex-start',
    color: '#1B72BF',
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    paddingHorizontal: 15,
    lineHeight: 18,
    paddingBottom: 10,
  },
  des: {
    alignSelf: 'flex-start',
    color: '#333333',
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
    paddingHorizontal: 15,
    lineHeight: 18,
  },
  avatar: {
    marginRight: 10,
  },
  file_image: {
    backgroundColor: Theme.request_detail.backgroundColor,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  titleImage: {
    fontSize: 15,
    fontFamily: fonts.MontserratSemiBold,
    textAlign: 'left',
    color: 'black',
  },
  titleContainers: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    borderRadius: 3,
  },
});

export default styles;
