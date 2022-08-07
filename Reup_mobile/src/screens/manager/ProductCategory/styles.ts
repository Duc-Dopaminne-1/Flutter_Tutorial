import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  customFlatList: {
    flex: 1,
    backgroundColor: Theme.category.backgroundColorFlatList,
  },
  container: {
    flex: 1,
    marginTop: 7,
    backgroundColor: Theme.product_category.containerFlatlist,
    justifyContent: 'space-around',
    paddingBottom: 8,
  },

  productListContainer: {
    flex: 1
  },
  datePickerContainer: {
    height: 53
  },
  sectionHeader: {
    backgroundColor: 'white'
  },
  containerImageBtn: {
    alignSelf: 'center',
    width: '100%'
  },
  iconImageBtn: {
    tintColor: Theme.product_category.iconImageBtn,
  },
  line: {
    width: '100%',
  },
  lineContainer: {
    flexDirection: 'row'
  },
  imageBtnHeader: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.product_category.imageBtnHeader,
    width: 34,
    height: 30,
  },
  containerFlatlist: {
    flexGrow: 1,
    backgroundColor: Theme.category.backgroundColorContentContainer,
    paddingHorizontal: 15,
  },
  lineTransparent: {
    width: 15
  },
  button: {
    width: '95%',
  },
  buttonBottom: {
    padding: 20,
    marginTop: 10,
    backgroundColor: Theme.staff.contentBackground,
  }

});

export default styles;
