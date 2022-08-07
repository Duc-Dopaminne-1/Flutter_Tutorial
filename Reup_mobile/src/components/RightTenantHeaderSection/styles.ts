import { fonts } from '@constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from "@src/components/Theme";

const styles = StyleSheet.create({

  headerRightView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteItemSectionView: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5
  },
  deleteItemSection: {
    width: 35,
    height: 30,
    marginRight: 11
  },
  addItem: {
    height: 25,
    width: 65,
    backgroundColor: Theme.tenant_detail.addItem
  },
  addItemText: {
    fontSize: 11,
    color: Theme.tenant_detail.addItemText,
    fontFamily: fonts.MontserratLight,
  }
});

export default styles;
