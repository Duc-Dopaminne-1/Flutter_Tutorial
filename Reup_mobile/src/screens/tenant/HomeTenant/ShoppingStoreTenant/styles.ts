import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 7,
    backgroundColor: Theme.shopping_store_tenant.backgroundContent,
  },
  sectionHeader: {
    backgroundColor: Theme.shopping_store_tenant.backgroundContent,
  },
  productListContainer: {
    paddingHorizontal: 15,
    flexGrow: 1,
  },
  datePickerContainer: {
    height: 53,
  },
  deleteButtonContainer: {
    marginRight: 8,
    height: 32,
    width: 40,
  },
  imageBtnHeader: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    backgroundColor: Theme.shopping_store_tenant.backgroundColorImageBtnHeafer,
    width: 40,
    height: 32,
  },
  deleteButton: {
    alignSelf: 'center',
  },
  iconImageBtn: {
    tintColor: Theme.shopping_store_tenant.tintColorIconImageBtn,
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonAddNew: {
    marginRight: 8,
    height: 32,
    width: 40,
    backgroundColor: Theme.shopping_store_tenant.backgroundColorCreateNewBtn,
    borderRadius: 2,
  },
  buttonFilter: {
    width: 32,
    height: 32,
  },
  containerSearchFilterBar: {
    backgroundColor: Theme.shopping_store_tenant.backgroundContent,
    padding: 15,
  },
});

export default styles;
