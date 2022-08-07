import { StyleSheet } from 'react-native';
import { WIDTH, fonts } from '@src/constants/vars';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.staff.containerBackground,
  },
  listContainer: {
    flex: 1,
  },
  sectionIconStyle: {
    tintColor: '#1B72BF',
  },
  lineContainer: {
    flexDirection: 'row',
  },
  imagesList: {
    marginTop: 15,
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
    padding: 20,
    marginTop: 10,
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
    marginTop: 7,
    backgroundColor: Theme.category_details.backgroundColorSectionHeader,
  },
  contentContainer: {
    justifyContent: 'space-around',
    height: 52,
    flex: 1,
  },
  imageBtnHeafer: {
    marginEnd: 10,
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    height: 30,
  },
  containerImageBtn: {
    backgroundColor: Theme.category_details.backgroundColorImageBtnHeafer,
  },
  iconImageBtn: {
    tintColor: Theme.category_details.tintColorIconImageBtn,
  },
  staffText: {
    marginLeft: 7,
    color: Theme.staff.button,
  },
  button: {
    width: '95%',
    backgroundColor: Theme.staff.button,
  },
  styleContainerSearchBar: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  description: {
    height: 75,
  },
  country: {
    marginTop: 10,
  },
  fieldInput: {
    height: 35,
    width: '100%',
  },
  containerScrollView: {
    flex: 1,
    backgroundColor: Theme.staff.contentBackground,
  },
  content: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingTop: 17,
    paddingBottom: 15,
  },
  inputFormSubContainer: {
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 15,
  },
  name: {
    alignSelf: 'flex-start',
    color: '#333333',
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    lineHeight: 18,
  },
  id: {
    alignSelf: 'flex-start',
    color: '#707070',
    fontSize: 10,
    fontFamily: fonts.MontserratLight,
    lineHeight: 18,
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
    height: 52,
    aspectRatio: 1,
  },
  removeIcon: {
    position: 'absolute',
    top: 0,
    right: 3,
    height: 15,
    aspectRatio: 1,
  },
  backgroundModal: {
    flex: 1,
    backgroundColor: 'black',
  },
  notificationType: {
    height: 35,
    width: '100%',
  },
  containerInputAssignee: {
    height: 35,
  },
});

export default styles;
