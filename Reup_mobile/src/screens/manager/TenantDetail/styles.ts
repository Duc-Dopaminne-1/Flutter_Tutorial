import { WIDTH, fonts } from '@constants/vars';
import { StyleSheet } from 'react-native';
import { Theme } from "@src/components/Theme";

const paddingHorizontalButton = 20;
const paddingBetweenButton = 12;
const widthButton = (WIDTH - (paddingHorizontalButton * 2) - paddingBetweenButton);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.myProfile.container
  },
  sectionHeaderView: {
    marginVertical: 7
  },
  sectionHeader: {
    paddingLeft: 8,
    backgroundColor: Theme.tenant_detail.contentBackground,
  },
  line: {
    width: '100%',
  },
  lineContainer: {
    flexDirection: 'row'
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: paddingHorizontalButton,
    backgroundColor: Theme.tenant_detail.contentBackground,
    marginTop: 7
  },
  widthButton: {
    width: widthButton
  },
  deleteButton: {
    marginRight: paddingBetweenButton,
    backgroundColor: Theme.tenant_detail.deleteTenantBgrButton,
  },
  textDeleteButton: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    textAlign: "left",
    color: Theme.tenant_detail.addItemText
  },
  transferButton: {
    backgroundColor: Theme.tenant_detail.transferBgrButton,
  },
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
