import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, HEIGHT } from '@src/constants/vars';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerContact: {
    marginTop: 7,
  },
  containerCreditCard: {
    marginTop: 7,
    paddingBottom: 15,
  },
  separator: {
    flex: 1,
    height: 1,
    paddingHorizontal: 15,
    backgroundColor: Theme.myProfile.container,
  },
  containerFamily: {
    marginTop: 7,
    backgroundColor: Theme.myProfile.container,
  },
  headerFamily: {
    backgroundColor: Theme.myProfile.container,
  },
  containerPets: {
    backgroundColor: Theme.myProfile.container,
    marginTop: 7,
    paddingBottom: 15,
  },
  headerPets: {
    backgroundColor: Theme.myProfile.container,
  },
  containerVehicles: {
    backgroundColor: Theme.myProfile.container,
    marginTop: 7,
  },
  headerVehicles: {
    backgroundColor: Theme.myProfile.container,
  },
  rightComponentHeader: {
    flexDirection: 'row',
  },
  deleteBtn: {
    flex: 0,
    width: 34,
    height: 30,
    borderRadius: 2,
    backgroundColor: Theme.myProfile.backgroundDeleteBtn,
    marginRight: 12,
  },
  iconDelete: {
    width: 12,
    height: 15,
  },
  addBtn: {
    width: 65,
    height: 25,
    borderRadius: 2,
    backgroundColor: Theme.myProfile.backgroundColorAddBtn,
  },
  textAddFamily: {
    fontFamily: fonts.MontserratLight,
    fontSize: 11,
    lineHeight: 24,
    color: Theme.myProfile.textAddFamily,
  },
  containerImageBtn: {
    alignSelf: 'center',
    width: 34,
    height: 30,
  },
  iconImageBtn: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.myProfile.imageBtnHeader,
    width: 34,
    height: 30,
    tintColor: Theme.myProfile.iconImageBtn,
  },
  flatListContainer: {
    backgroundColor: Theme.staff.contentBackground,
    height: HEIGHT * 0.3
  },
  lineContainer: {
    flexDirection: 'row',
  },
  line: {
    width: '100%'
  },
  sectionHeader: {
    backgroundColor: Theme.category_details.backgroundColorSectionHeader
  },
});

export default styles;
