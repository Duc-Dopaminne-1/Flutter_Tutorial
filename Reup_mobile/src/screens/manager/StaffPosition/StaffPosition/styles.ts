import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, colors, WIDTH } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImageBtn: {
    alignSelf: 'center'
  },
  checkbox: {
    height: 20,
    width: 20,
    marginEnd: 20
  },
  imageBtnHeafer: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.category_details.backgroundColorImageBtnHeafer,
    width: 34,
    height: 30,
  },
  iconImageBtn: {
    tintColor: Theme.category_details.tintColorIconImageBtn,
  },
  searchContainer: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 14
  },
  searchInnerContainer: {
    height: 30,
  },
  iconSearchContainer: {
    marginRight: 8
  },
  iconSearch: {
    width: 18,
    height: 18,
  },
  staffPositionContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 7,
    marginBottom: 7,
  },
  bottomButtonContainer: {
    paddingHorizontal: 22,
    paddingTop: 13,
    backgroundColor: 'white',
    paddingBottom: 13,
  },
  addNewStaffButton: {
    backgroundColor: Theme.staff.staff_add_position
  },
  listContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  itemContainer: {
    flexDirection: 'row',
    height: 45,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  itemText: {
    color: "black",
    alignSelf: 'flex-start',
    fontFamily: fonts.MontserratMedium,
  },
  containerText: {
    flex: 1
  },
  line: {
    height: 1,
    backgroundColor: colors.GRAY300,
    width: WIDTH - 40,
    marginBottom: 0,
    alignSelf: 'center'
  },
});

export default styles;
