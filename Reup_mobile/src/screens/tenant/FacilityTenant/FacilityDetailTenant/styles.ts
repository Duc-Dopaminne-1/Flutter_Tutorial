import { StyleSheet } from 'react-native';
import { Theme } from '@src/components/Theme';
import { fonts, WIDTH } from '@src/constants/vars';

const paddingHorizontalButton = 20;
const widthButton = WIDTH - paddingHorizontalButton * 2;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  sectionHeader: {
    marginTop: 8,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader,
  },
  bottomButtonView: {
    flexDirection: 'row',
    height: 66,
    paddingHorizontal: paddingHorizontalButton,
    backgroundColor: Theme.tenant_detail.contentBackground,
    marginTop: 7,
  },
  textDeleteButton: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    textAlign: 'left',
    color: Theme.tenant_detail.addItemText,
  },
  widthButton: {
    width: widthButton,
  },
  scrollView: {
    backgroundColor: Theme.building_system.backgroundColorSectionHeader,
  },
  contentView: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 16,
    backgroundColor: Theme.building_system.backgroundColorSectionHeader,
  },
  deleteButton: {
    backgroundColor: Theme.tenant_detail.deleteTenantBgrButton,
  },
  titleContainer: {
    marginTop: 21,
    marginBottom: 15,
  },
  titleContent: {
    fontFamily: fonts.MontserratMedium,
    fontSize: 13,
    textAlign: 'left',
    color: Theme.facility.titleItemContent,
  },
  imageContainer: {
    borderWidth: 0,
    borderRadius: 2,
  },
  descriptionContainer: {
    marginRight: 16,
    marginTop: 20,
  },
  descriptionContent: {
    fontFamily: fonts.MontserratLight,
    fontSize: 13,
    textAlign: 'left',
    color: Theme.facility.titleItemContent,
  },
});
