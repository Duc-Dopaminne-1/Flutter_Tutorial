import { HEIGHT, WIDTH, fonts } from '@constants/vars';
import { Theme } from '@src/components/Theme';
import { StyleSheet, Platform } from 'react-native';
import { isAndroid } from '@src/utils';

const statitsticsHeight = HEIGHT * 0.124;
const topPadding = isAndroid() ? HEIGHT * 0.035 : HEIGHT <= 736 ? HEIGHT * 0.035 : HEIGHT * 0.05;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.building_detail.contact_button_text,
  },
  backButton: {
    position: 'absolute',
    left: 16,
    top: 0,
    marginTop: topPadding,
    width: 40,
    height: 40,
  },
  backImage: {
    height: 16,
    width: 10,
    tintColor: 'white',
  },
  scrollView: {
    flex: 1,
    marginBottom: 7,
    backgroundColor: Theme.building_detail.contact_button_text,
  },
  contentContainerScrollView: {
    padding: 20,
  },
  aliquamText: {
    color: Theme.building_detail.item_info_email,
    fontSize: 13,
    fontFamily: fonts.MontserratMedium,
    alignSelf: 'flex-start',
  },
  statisticsButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  statisticsButton: {
    height: statitsticsHeight,
  },
  infoView: {
    flex: 1,
    marginTop: 26,
    backgroundColor: Theme.building_detail.contact_button_text,
  },
  itemInfoText: {
    flex: 1,
    flexWrap: 'wrap',
    color: Theme.building_detail.item_info_text,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  itemInfoView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  itemInfoImage: {
    height: 15,
    width: 15,
    marginRight: 10,
    resizeMode: 'contain',
  },
  item_info_email: {
    color: Theme.building_detail.item_info_email,
  },
  contactButton: {
    backgroundColor: Theme.building_detail.contact_button,
    width: WIDTH / 2,
    height: 30,
    alignSelf: 'flex-start',
  },
  contactText: {
    color: Theme.building_detail.contact_button_text,
    fontSize: 11,
    fontFamily: fonts.MontserratLight,
  },
  iconContact: {
    width: 8,
    height: 7,
  },
  lineView: {
    height: 7,
    marginTop: 32,
    marginBottom: 13,
    marginHorizontal: -20,
    backgroundColor: Theme.building_detail.line_view,
  },
  buttonLogin: {
    width: '88%',
    marginVertical: 13,
    backgroundColor: Theme.signin.buttonLogin,
  },
  containerDeleteBuildingBtn: {
    backgroundColor: Theme.building_system.backgroundColorContainerAddBuildingBtn,
    height: 80,
  },
  buttonTextLogin: {
    fontSize: 13,
  },
  description: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  nation: {
    color: Theme.building_detail.item_info_text,
    fontSize: 13,
    fontFamily: fonts.MontserratLight,
  },
  containerNameNation: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 10,
  },
});

export default styles;
